import { LlmMessage, LlmProvider } from './llm.provider';

/**
 * Provedor determinístico para ambiente acadêmico / sem chave de API.
 * Interpreta o contexto financeiro já calculado pelo backend — não inventa números.
 */
export class MockLlmProvider implements LlmProvider {
  readonly name = 'mock';

  async complete(messages: LlmMessage[]): Promise<string> {
    const system = messages.find((m) => m.role === 'system')?.content ?? '';
    const user = messages.filter((m) => m.role === 'user').at(-1)?.content ?? '';
    const facts = this.extractFactsBlock(system);
    const q = user.toLowerCase();

    if (q.includes('gastei') || q.includes('despesa')) {
      return [
        'Com base nos dados autorizados do seu mês atual:',
        `- Despesas: ${facts.expenseFormatted}`,
        `- Receitas: ${facts.incomeFormatted}`,
        `- Saldo líquido do período: ${facts.netFormatted}`,
        facts.topCategory
          ? `A categoria com maior consumo foi ${facts.topCategory} (${facts.topCategoryFormatted}).`
          : 'Ainda não há despesas categorizadas neste período.',
        'Esses valores foram calculados pelo backend do NOX FINANCE a partir das suas movimentações.',
      ].join('\n');
    }

    if (q.includes('categoria') || q.includes('consumindo')) {
      return facts.topCategory
        ? `A categoria que mais consumiu neste mês foi ${facts.topCategory}, totalizando ${facts.topCategoryFormatted}. Recomendo revisar lançamentos recorrentes nessa categoria e definir um limite de orçamento.`
        : 'Não encontrei despesas categorizadas no período atual para apontar a categoria dominante.';
    }

    if (q.includes('posso gastar') || q.includes('até o final')) {
      return [
        `Considerando o orçamento e o saldo disponível calculados pelo sistema:`,
        `- Saldo total em contas: ${facts.balanceFormatted}`,
        `- Despesas do mês: ${facts.expenseFormatted}`,
        `- Limite de orçamento restante: ${facts.budgetRemainingFormatted}`,
        `Uma estimativa conservadora de quanto ainda pode gastar até o fim do mês é ${facts.spendableFormatted}, sem comprometer o saldo projetado.`,
      ].join('\n');
    }

    if (q.includes('economizar') || q.includes('economiza')) {
      return [
        'Pontos de economia sugeridos a partir dos seus dados:',
        facts.topCategory
          ? `1. Reduza gastos em ${facts.topCategory} (hoje ${facts.topCategoryFormatted}).`
          : '1. Categorize melhor suas despesas para identificar vazamentos.',
        `2. Suas despesas do mês estão em ${facts.expenseFormatted}; compare com a receita de ${facts.incomeFormatted}.`,
        '3. Ative limites por categoria e acompanhe o progresso no módulo de orçamentos.',
      ].join('\n');
    }

    if (q.includes('mudaram') || q.includes('mês anterior') || q.includes('compar')) {
      return [
        'Comparação com o mês anterior (valores do backend):',
        `- Variação de receitas: ${facts.incomeDeltaFormatted}`,
        `- Variação de despesas: ${facts.expenseDeltaFormatted}`,
        Number(facts.expenseDeltaCents) > 0
          ? 'Suas despesas aumentaram em relação ao mês passado. Vale revisar categorias com crescimento.'
          : 'Suas despesas estão iguais ou menores que no mês anterior — bom sinal de controle.',
      ].join('\n');
    }

    if (q.includes('comprar') || q.includes('simula') || q.includes('ficará')) {
      const purchase = this.extractPurchaseCents(user);
      if (purchase != null) {
        const after = Number(facts.spendableCents) - purchase;
        const afterBudget = Number(facts.budgetRemainingCents) - purchase;
        return [
          `Simulação de compra de ${this.brl(purchase)}:`,
          `- Disponível estimado antes: ${facts.spendableFormatted}`,
          `- Disponível estimado depois: ${this.brl(after)}`,
          `- Orçamento restante depois: ${this.brl(afterBudget)}`,
          afterBudget < 0
            ? 'Atenção: essa compra estouraria o orçamento restante do mês.'
            : 'A compra cabe no orçamento restante com base nos dados atuais.',
          'Nenhuma movimentação foi criada. Confirme no app se desejar registrar a despesa.',
        ].join('\n');
      }
    }

    if (q.includes('finança') || q.includes('como estão') || q.includes('resumo')) {
      return [
        'Resumo das suas finanças (dados autorizados):',
        `- Saldo total: ${facts.balanceFormatted}`,
        `- Receitas do mês: ${facts.incomeFormatted}`,
        `- Despesas do mês: ${facts.expenseFormatted}`,
        `- Resultado do mês: ${facts.netFormatted}`,
        Number(facts.netCents) >= 0
          ? 'No geral, o mês está positivo. Continue acompanhando metas e limites.'
          : 'O mês está negativo até aqui. Priorize contenção nas categorias de maior peso.',
      ].join('\n');
    }

    return [
      'Sou a NOX AI. Posso explicar seus números financeiros já calculados pelo sistema.',
      `Saldo atual: ${facts.balanceFormatted}. Receitas do mês: ${facts.incomeFormatted}. Despesas: ${facts.expenseFormatted}.`,
      'Pergunte, por exemplo: “Quanto gastei neste mês?”, “Onde posso economizar?” ou “Se eu comprar um item de R$ 200, como fica meu orçamento?”.',
    ].join('\n');
  }

  private extractFactsBlock(system: string) {
    const pick = (key: string, fallback = '0') => {
      const match = system.match(new RegExp(`${key}=([^\\n]+)`));
      return match?.[1]?.trim() ?? fallback;
    };
    return {
      balanceFormatted: pick('balanceFormatted', 'R$ 0,00'),
      incomeFormatted: pick('incomeFormatted', 'R$ 0,00'),
      expenseFormatted: pick('expenseFormatted', 'R$ 0,00'),
      netFormatted: pick('netFormatted', 'R$ 0,00'),
      netCents: pick('netCents', '0'),
      topCategory: pick('topCategory', '') || null,
      topCategoryFormatted: pick('topCategoryFormatted', 'R$ 0,00'),
      budgetRemainingFormatted: pick('budgetRemainingFormatted', 'R$ 0,00'),
      budgetRemainingCents: pick('budgetRemainingCents', '0'),
      spendableFormatted: pick('spendableFormatted', 'R$ 0,00'),
      spendableCents: pick('spendableCents', '0'),
      incomeDeltaFormatted: pick('incomeDeltaFormatted', 'R$ 0,00'),
      expenseDeltaFormatted: pick('expenseDeltaFormatted', 'R$ 0,00'),
      expenseDeltaCents: pick('expenseDeltaCents', '0'),
    };
  }

  private extractPurchaseCents(text: string): number | null {
    const match = text.match(/(\d+[.,]?\d*)/);
    if (!match) return null;
    const normalized = match[1].replace('.', '').replace(',', '.');
    const value = Number(normalized);
    if (!Number.isFinite(value)) return null;
    // Se o usuário falou em reais (ex.: 200), converter; se já parecer centavos (>100000 sem vírgula), manter
    if (text.toLowerCase().includes('centavo')) return Math.round(value);
    return Math.round(value * 100);
  }

  private brl(cents: number) {
    return (cents / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }
}
