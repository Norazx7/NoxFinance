import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(userId: string, reference = new Date()) {
    const { start, end } = this.monthRange(reference);
    const prevRef = new Date(reference.getFullYear(), reference.getMonth() - 1, 15);
    const prev = this.monthRange(prevRef);

    const [accounts, incomeAgg, expenseAgg, prevIncomeAgg, prevExpenseAgg, recent] =
      await Promise.all([
        this.prisma.account.findMany({ where: { userId, isActive: true } }),
        this.prisma.transaction.aggregate({
          where: {
            userId,
            type: 'INCOME',
            occurredAt: { gte: start, lte: end },
          },
          _sum: { amountCents: true },
        }),
        this.prisma.transaction.aggregate({
          where: {
            userId,
            type: 'EXPENSE',
            occurredAt: { gte: start, lte: end },
          },
          _sum: { amountCents: true },
        }),
        this.prisma.transaction.aggregate({
          where: {
            userId,
            type: 'INCOME',
            occurredAt: { gte: prev.start, lte: prev.end },
          },
          _sum: { amountCents: true },
        }),
        this.prisma.transaction.aggregate({
          where: {
            userId,
            type: 'EXPENSE',
            occurredAt: { gte: prev.start, lte: prev.end },
          },
          _sum: { amountCents: true },
        }),
        this.prisma.transaction.findMany({
          where: { userId },
          include: { category: true, account: true },
          orderBy: [{ occurredAt: 'desc' }, { createdAt: 'desc' }],
          take: 8,
        }),
      ]);

    const totalBalanceCents = accounts.reduce((s, a) => s + a.balanceCents, 0);
    const incomeCents = incomeAgg._sum.amountCents ?? 0;
    const expenseCents = expenseAgg._sum.amountCents ?? 0;
    const prevIncomeCents = prevIncomeAgg._sum.amountCents ?? 0;
    const prevExpenseCents = prevExpenseAgg._sum.amountCents ?? 0;

    const movements = await this.dailyMovements(userId, start, end);

    return {
      totalBalanceCents,
      incomeCents,
      expenseCents,
      netCents: incomeCents - expenseCents,
      comparison: {
        incomeDeltaCents: incomeCents - prevIncomeCents,
        expenseDeltaCents: expenseCents - prevExpenseCents,
        prevIncomeCents,
        prevExpenseCents,
      },
      accounts: accounts.map((a) => ({
        id: a.id,
        name: a.name,
        balanceCents: a.balanceCents,
        color: a.color,
        type: a.type,
      })),
      recentTransactions: recent,
      movementsChart: movements,
      period: {
        year: reference.getFullYear(),
        month: reference.getMonth() + 1,
        start: start.toISOString(),
        end: end.toISOString(),
      },
    };
  }

  private async dailyMovements(userId: string, start: Date, end: Date) {
    const rows = await this.prisma.transaction.findMany({
      where: { userId, occurredAt: { gte: start, lte: end } },
      select: { occurredAt: true, type: true, amountCents: true },
      orderBy: { occurredAt: 'asc' },
    });

    const map = new Map<string, { incomeCents: number; expenseCents: number }>();
    for (const row of rows) {
      const key = row.occurredAt.toISOString().slice(0, 10);
      const current = map.get(key) ?? { incomeCents: 0, expenseCents: 0 };
      if (row.type === 'INCOME') current.incomeCents += row.amountCents;
      if (row.type === 'EXPENSE') current.expenseCents += row.amountCents;
      map.set(key, current);
    }

    return Array.from(map.entries()).map(([date, values]) => ({
      date,
      ...values,
      netCents: values.incomeCents - values.expenseCents,
    }));
  }

  private monthRange(reference: Date) {
    const start = new Date(reference.getFullYear(), reference.getMonth(), 1);
    const end = new Date(
      reference.getFullYear(),
      reference.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );
    return { start, end };
  }
}
