import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async expensesByCategory(userId: string, year: number, month: number) {
    const { start, end } = this.monthRange(year, month);
    const rows = await this.prisma.transaction.findMany({
      where: {
        userId,
        type: 'EXPENSE',
        occurredAt: { gte: start, lte: end },
      },
      include: { category: true },
    });

    const map = new Map<
      string,
      { categoryId: string | null; name: string; color: string; totalCents: number }
    >();

    for (const row of rows) {
      const key = row.categoryId ?? 'uncategorized';
      const current = map.get(key) ?? {
        categoryId: row.categoryId,
        name: row.category?.name ?? 'Sem categoria',
        color: row.category?.color ?? '#6B7280',
        totalCents: 0,
      };
      current.totalCents += row.amountCents;
      map.set(key, current);
    }

    const items = Array.from(map.values()).sort(
      (a, b) => b.totalCents - a.totalCents,
    );
    const totalCents = items.reduce((s, i) => s + i.totalCents, 0);

    return {
      year,
      month,
      totalCents,
      items: items.map((i) => ({
        ...i,
        percent:
          totalCents === 0 ? 0 : Math.round((i.totalCents / totalCents) * 100),
      })),
    };
  }

  async monthlyEvolution(userId: string, months = 6) {
    const now = new Date();
    const series: Array<{
      year: number;
      month: number;
      label: string;
      incomeCents: number;
      expenseCents: number;
      netCents: number;
    }> = [];

    for (let i = months - 1; i >= 0; i -= 1) {
      const ref = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = ref.getFullYear();
      const month = ref.getMonth() + 1;
      const { start, end } = this.monthRange(year, month);

      const [income, expense] = await Promise.all([
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
      ]);

      const incomeCents = income._sum.amountCents ?? 0;
      const expenseCents = expense._sum.amountCents ?? 0;
      series.push({
        year,
        month,
        label: `${String(month).padStart(2, '0')}/${year}`,
        incomeCents,
        expenseCents,
        netCents: incomeCents - expenseCents,
      });
    }

    return { months, series };
  }

  async comparePeriods(
    userId: string,
    yearA: number,
    monthA: number,
    yearB: number,
    monthB: number,
  ) {
    const [a, b] = await Promise.all([
      this.periodTotals(userId, yearA, monthA),
      this.periodTotals(userId, yearB, monthB),
    ]);

    return {
      periodA: { year: yearA, month: monthA, ...a },
      periodB: { year: yearB, month: monthB, ...b },
      deltas: {
        incomeDeltaCents: a.incomeCents - b.incomeCents,
        expenseDeltaCents: a.expenseCents - b.expenseCents,
        netDeltaCents: a.netCents - b.netCents,
      },
    };
  }

  private async periodTotals(userId: string, year: number, month: number) {
    const { start, end } = this.monthRange(year, month);
    const [income, expense] = await Promise.all([
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
    ]);
    const incomeCents = income._sum.amountCents ?? 0;
    const expenseCents = expense._sum.amountCents ?? 0;
    return {
      incomeCents,
      expenseCents,
      netCents: incomeCents - expenseCents,
    };
  }

  private monthRange(year: number, month: number) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);
    return { start, end };
  }
}
