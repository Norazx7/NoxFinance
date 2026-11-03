import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { DashboardService } from '../dashboard/dashboard.service';
import { ReportsService } from '../reports/reports.service';
import { formatBRL } from '../common/utils/money';
import { LlmProvider } from './providers/llm.provider';
import { MockLlmProvider } from './providers/mock.provider';
import { OllamaProvider } from './providers/ollama.provider';
import { OpenAiProvider } from './providers/openai.provider';
import { AiAskDto, AiSimulateDto } from './dto/ai.dto';

@Injectable()
export class AiService {
  private readonly provider: LlmProvider;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly dashboard: DashboardService,
    private readonly reports: ReportsService,
  ) {
    this.provider = this.resolveProvider();
  }

  async ask(userId: string, dto: AiAskDto) {
    const facts = await this.buildAuthorizedFacts(userId);
    const system = this.buildSystemPrompt(facts);
    const answer = await this.provider.complete([
      { role: 'system', content: system },
      { role: 'user', content: dto.question },
    ]);

    return {
      question: dto.question,
      answer,
      provider: this.provider.name,
      factsUsed: {
        period: facts.period,
        totalBalanceCents: facts.totalBalanceCents,
        incomeCents: facts.incomeCents,
        expenseCents: facts.expenseCents,
        netCents: facts.netCents,
        topCategory: facts.topCategory,
      },
      disclaimer:
        'Os valores foram calculados pelo backend. A NOX AI apenas interpreta e explica esses dados autorizados.',
    };
  }

  async simulatePurchase(userId: string, dto: AiSimulateDto) {
    const facts = await this.buildAuthorizedFacts(userId);
    const afterSpendable = facts.spendableCents - dto.amountCents;
    const afterBudget = facts.budgetRemainingCents - dto.amountCents;

    const computed = {
      description: dto.description,
      amountCents: dto.amountCents,
      amountFormatted: formatBRL(dto.amountCents),
      spendableBeforeCents: facts.spendableCents,
      spendableAfterCents: afterSpendable,
      budgetRemainingBeforeCents: facts.budgetRemainingCents,
      budgetRemainingAfterCents: afterBudget,
      exceedsBudget: afterBudget < 0,
      exceedsSpendable: afterSpendable < 0,
    };

    const system = this.buildSystemPrompt(facts);
    const question = `Se eu comprar ${dto.description} por ${formatBRL(dto.amountCents)}${dto.categoryName ? ` na categoria ${dto.categoryName}` : ''}, como ficará meu orçamento?`;
    const answer = await this.provider.complete([
      { role: 'system', content: system },
      {
        role: 'user',
        content: `${question}\nResultados calculados pelo backend:\n${JSON.stringify(computed)}`,
      },
    ]);

    return {
      simulation: computed,
      answer,
      provider: this.provider.name,
      confirmationRequired: true,
      message:
        'Simulação apenas. Nenhuma movimentação foi alterada. Confirme no app para registrar a despesa.',
    };
  }

  private resolveProvider(): LlmProvider {
    const kind = (this.config.get<string>('LLM_PROVIDER') || 'mock').toLowerCase();
    if (kind === 'ollama') {
      return new OllamaProvider(
        this.config.get('OLLAMA_BASE_URL', 'http://127.0.0.1:11434'),
        this.config.get('OLLAMA_MODEL', 'llama3.2'),
      );
    }
    if (kind === 'openai') {
      const key = this.config.get<string>('OPENAI_API_KEY');
      if (key) {
        return new OpenAiProvider(
          key,
          this.config.get('OPENAI_MODEL', 'gpt-4o-mini'),
        );
      }
    }
    return new MockLlmProvider();
  }

  private async buildAuthorizedFacts(userId: string) {
    const now = new Date();
    const summary = await this.dashboard.getSummary(userId, now);
    const byCategory = await this.reports.expensesByCategory(
      userId,
      now.getFullYear(),
      now.getMonth() + 1,
    );
    const top = byCategory.items[0];

    const budgets = await this.prisma.budget.findMany({
      where: {
        userId,
        year: now.getFullYear(),
        month: now.getMonth() + 1,
      },
    });

    let budgetLimitCents = 0;
    for (const b of budgets) budgetLimitCents += b.limitCents;
    const budgetRemainingCents =
      budgets.length === 0
        ? Math.max(0, summary.incomeCents - summary.expenseCents)
        : Math.max(0, budgetLimitCents - summary.expenseCents);

    const daysLeft = Math.max(
      1,
      new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() -
        now.getDate() +
        1,
    );
    const spendableCents = Math.max(
      0,
      Math.min(summary.totalBalanceCents, budgetRemainingCents),
    );

    return {
      period: summary.period,
      totalBalanceCents: summary.totalBalanceCents,
      incomeCents: summary.incomeCents,
      expenseCents: summary.expenseCents,
      netCents: summary.netCents,
      incomeDeltaCents: summary.comparison.incomeDeltaCents,
      expenseDeltaCents: summary.comparison.expenseDeltaCents,
      topCategory: top?.name ?? null,
      topCategoryCents: top?.totalCents ?? 0,
      budgetLimitCents,
      budgetRemainingCents,
      spendableCents,
      daysLeft,
    };
  }

  private buildSystemPrompt(facts: Awaited<ReturnType<AiService['buildAuthorizedFacts']>>) {
    return [
      'Você é a NOX AI, assistente financeiro do aplicativo NOX FINANCE.',
      'Regras obrigatórias:',
      '1) Use APENAS os fatos abaixo (calculados pelo backend).',
      '2) Nunca invente valores monetários.',
      '3) Nunca execute SQL nem altere movimentações.',
      '4) Se faltar dado, diga que o dado não está disponível.',
      '5) Responda em português do Brasil, de forma clara e objetiva.',
      '',
      'FATOS_AUTORIZADOS:',
      `balanceFormatted=${formatBRL(facts.totalBalanceCents)}`,
      `balanceCents=${facts.totalBalanceCents}`,
      `incomeFormatted=${formatBRL(facts.incomeCents)}`,
      `incomeCents=${facts.incomeCents}`,
      `expenseFormatted=${formatBRL(facts.expenseCents)}`,
      `expenseCents=${facts.expenseCents}`,
      `netFormatted=${formatBRL(facts.netCents)}`,
      `netCents=${facts.netCents}`,
      `topCategory=${facts.topCategory ?? ''}`,
      `topCategoryFormatted=${formatBRL(facts.topCategoryCents)}`,
      `budgetRemainingFormatted=${formatBRL(facts.budgetRemainingCents)}`,
      `budgetRemainingCents=${facts.budgetRemainingCents}`,
      `spendableFormatted=${formatBRL(facts.spendableCents)}`,
      `spendableCents=${facts.spendableCents}`,
      `incomeDeltaFormatted=${formatBRL(facts.incomeDeltaCents)}`,
      `expenseDeltaFormatted=${formatBRL(facts.expenseDeltaCents)}`,
      `expenseDeltaCents=${facts.expenseDeltaCents}`,
      `daysLeft=${facts.daysLeft}`,
    ].join('\n');
  }
}
