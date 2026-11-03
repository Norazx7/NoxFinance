import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecurringDto, UpdateRecurringDto } from './dto/recurring.dto';

@Injectable()
export class RecurringService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, dto: CreateRecurringDto) {
    return this.prisma.recurringExpense.create({
      data: {
        userId,
        name: dto.name.trim(),
        amountCents: dto.amountCents,
        frequency: dto.frequency ?? 'MONTHLY',
        nextDueDate: new Date(dto.nextDueDate),
        categoryId: dto.categoryId,
      },
      include: { category: true },
    });
  }

  findAll(userId: string) {
    return this.prisma.recurringExpense.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { nextDueDate: 'asc' },
    });
  }

  async findOne(userId: string, id: string) {
    const item = await this.prisma.recurringExpense.findFirst({
      where: { id, userId },
      include: { category: true },
    });
    if (!item) throw new NotFoundException('Despesa recorrente não encontrada');
    return item;
  }

  async update(userId: string, id: string, dto: UpdateRecurringDto) {
    await this.findOne(userId, id);
    return this.prisma.recurringExpense.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.amountCents !== undefined ? { amountCents: dto.amountCents } : {}),
        ...(dto.frequency !== undefined ? { frequency: dto.frequency } : {}),
        ...(dto.nextDueDate !== undefined
          ? { nextDueDate: new Date(dto.nextDueDate) }
          : {}),
        ...(dto.categoryId !== undefined ? { categoryId: dto.categoryId } : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
      },
      include: { category: true },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.recurringExpense.delete({ where: { id } });
    return { success: true };
  }

  /** Previsão simples de fluxo de caixa para os próximos N dias. */
  async cashflowForecast(userId: string, days = 30) {
    const recurring = await this.prisma.recurringExpense.findMany({
      where: { userId, isActive: true },
    });

    const accounts = await this.prisma.account.findMany({ where: { userId } });
    const startingBalanceCents = accounts.reduce(
      (sum, a) => sum + a.balanceCents,
      0,
    );

    const end = new Date();
    end.setDate(end.getDate() + days);

    const projected: Array<{ date: string; amountCents: number; name: string }> =
      [];

    for (const item of recurring) {
      const cursor = new Date(item.nextDueDate);
      while (cursor <= end) {
        if (cursor >= new Date()) {
          projected.push({
            date: cursor.toISOString().slice(0, 10),
            amountCents: item.amountCents,
            name: item.name,
          });
        }
        if (item.frequency === 'WEEKLY') cursor.setDate(cursor.getDate() + 7);
        else if (item.frequency === 'YEARLY')
          cursor.setFullYear(cursor.getFullYear() + 1);
        else cursor.setMonth(cursor.getMonth() + 1);
      }
    }

    projected.sort((a, b) => a.date.localeCompare(b.date));
    const totalProjectedExpenseCents = projected.reduce(
      (s, p) => s + p.amountCents,
      0,
    );

    return {
      days,
      startingBalanceCents,
      totalProjectedExpenseCents,
      projectedEndingBalanceCents:
        startingBalanceCents - totalProjectedExpenseCents,
      items: projected,
    };
  }
}
