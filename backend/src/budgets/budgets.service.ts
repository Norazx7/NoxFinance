import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBudgetDto, UpdateBudgetDto } from './dto/budget.dto';

@Injectable()
export class BudgetsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateBudgetDto) {
    return this.prisma.budget.create({
      data: {
        userId,
        name: dto.name.trim(),
        year: dto.year,
        month: dto.month,
        limitCents: dto.limitCents,
        limits: dto.limits?.length
          ? {
              create: dto.limits.map((l) => ({
                categoryId: l.categoryId,
                limitCents: l.limitCents,
              })),
            }
          : undefined,
      },
      include: { limits: { include: { category: true } } },
    });
  }

  async findAll(userId: string, year?: number, month?: number) {
    const budgets = await this.prisma.budget.findMany({
      where: {
        userId,
        ...(year ? { year } : {}),
        ...(month ? { month } : {}),
      },
      include: { limits: { include: { category: true } } },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });

    return Promise.all(budgets.map((b) => this.withProgress(userId, b)));
  }

  async findOne(userId: string, id: string) {
    const budget = await this.prisma.budget.findFirst({
      where: { id, userId },
      include: { limits: { include: { category: true } } },
    });
    if (!budget) throw new NotFoundException('Orçamento não encontrado');
    return this.withProgress(userId, budget);
  }

  async update(userId: string, id: string, dto: UpdateBudgetDto) {
    await this.findOne(userId, id);

    if (dto.limits) {
      await this.prisma.budgetCategoryLimit.deleteMany({ where: { budgetId: id } });
    }

    const budget = await this.prisma.budget.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.limitCents !== undefined ? { limitCents: dto.limitCents } : {}),
        ...(dto.limits
          ? {
              limits: {
                create: dto.limits.map((l) => ({
                  categoryId: l.categoryId,
                  limitCents: l.limitCents,
                })),
              },
            }
          : {}),
      },
      include: { limits: { include: { category: true } } },
    });

    return this.withProgress(userId, budget);
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.budget.delete({ where: { id } });
    return { success: true };
  }

  private async withProgress(
    userId: string,
    budget: {
      id: string;
      year: number;
      month: number;
      limitCents: number;
      limits: Array<{ categoryId: string; limitCents: number; category: unknown }>;
      [key: string]: unknown;
    },
  ) {
    const start = new Date(budget.year, budget.month - 1, 1);
    const end = new Date(budget.year, budget.month, 0, 23, 59, 59, 999);

    const spentAgg = await this.prisma.transaction.aggregate({
      where: {
        userId,
        type: 'EXPENSE',
        occurredAt: { gte: start, lte: end },
      },
      _sum: { amountCents: true },
    });

    const spentCents = spentAgg._sum.amountCents ?? 0;

    const limitsWithSpent = await Promise.all(
      budget.limits.map(async (limit) => {
        const catSpent = await this.prisma.transaction.aggregate({
          where: {
            userId,
            type: 'EXPENSE',
            categoryId: limit.categoryId,
            occurredAt: { gte: start, lte: end },
          },
          _sum: { amountCents: true },
        });
        const categorySpentCents = catSpent._sum.amountCents ?? 0;
        return {
          ...limit,
          spentCents: categorySpentCents,
          remainingCents: limit.limitCents - categorySpentCents,
          progressPercent:
            limit.limitCents === 0
              ? 0
              : Math.min(
                  100,
                  Math.round((categorySpentCents / limit.limitCents) * 100),
                ),
        };
      }),
    );

    return {
      ...budget,
      spentCents,
      remainingCents: budget.limitCents - spentCents,
      progressPercent:
        budget.limitCents === 0
          ? 0
          : Math.min(100, Math.round((spentCents / budget.limitCents) * 100)),
      limits: limitsWithSpent,
    };
  }
}
