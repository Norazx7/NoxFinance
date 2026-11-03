import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, TransactionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateTransactionDto,
  TransactionFilterDto,
  UpdateTransactionDto,
} from './dto/transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateTransactionDto) {
    this.assertAmount(dto.amountCents);
    await this.assertOwnership(userId, dto);

    return this.prisma.$transaction(async (tx) => {
      const created = await tx.transaction.create({
        data: {
          userId,
          accountId: dto.accountId,
          cardId: dto.cardId,
          categoryId: dto.categoryId,
          type: dto.type,
          amountCents: dto.amountCents,
          description: dto.description.trim(),
          notes: dto.notes?.trim(),
          occurredAt: new Date(dto.occurredAt),
        },
        include: { category: true, account: true, card: true },
      });

      await this.applyBalanceDelta(tx, {
        accountId: dto.accountId,
        cardId: dto.cardId,
        type: dto.type,
        amountCents: dto.amountCents,
        direction: 1,
      });

      return created;
    });
  }

  async findAll(userId: string, filter: TransactionFilterDto) {
    const where: Prisma.TransactionWhereInput = {
      userId,
      ...(filter.categoryId ? { categoryId: filter.categoryId } : {}),
      ...(filter.type ? { type: filter.type } : {}),
      ...(filter.accountId ? { accountId: filter.accountId } : {}),
      ...(filter.from || filter.to
        ? {
            occurredAt: {
              ...(filter.from ? { gte: new Date(filter.from) } : {}),
              ...(filter.to ? { lte: new Date(filter.to) } : {}),
            },
          }
        : {}),
    };

    return this.prisma.transaction.findMany({
      where,
      include: { category: true, account: true, card: true },
      orderBy: [{ occurredAt: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(userId: string, id: string) {
    const item = await this.prisma.transaction.findFirst({
      where: { id, userId },
      include: { category: true, account: true, card: true },
    });
    if (!item) throw new NotFoundException('Movimentação não encontrada');
    return item;
  }

  async update(userId: string, id: string, dto: UpdateTransactionDto) {
    const existing = await this.findOne(userId, id);

    if (dto.amountCents !== undefined) this.assertAmount(dto.amountCents);

    const next = {
      accountId: dto.accountId ?? existing.accountId,
      cardId: dto.cardId === undefined ? existing.cardId : dto.cardId,
      categoryId:
        dto.categoryId === undefined ? existing.categoryId : dto.categoryId,
      type: dto.type ?? existing.type,
      amountCents: dto.amountCents ?? existing.amountCents,
      description: dto.description?.trim() ?? existing.description,
      notes: dto.notes === undefined ? existing.notes : dto.notes?.trim(),
      occurredAt: dto.occurredAt ? new Date(dto.occurredAt) : existing.occurredAt,
    };

    await this.assertOwnership(userId, {
      accountId: next.accountId,
      cardId: next.cardId ?? undefined,
      categoryId: next.categoryId ?? undefined,
      type: next.type,
    });

    return this.prisma.$transaction(async (tx) => {
      await this.applyBalanceDelta(tx, {
        accountId: existing.accountId,
        cardId: existing.cardId,
        type: existing.type,
        amountCents: existing.amountCents,
        direction: -1,
      });

      const updated = await tx.transaction.update({
        where: { id },
        data: {
          accountId: next.accountId,
          cardId: next.cardId,
          categoryId: next.categoryId,
          type: next.type,
          amountCents: next.amountCents,
          description: next.description,
          notes: next.notes,
          occurredAt: next.occurredAt,
        },
        include: { category: true, account: true, card: true },
      });

      await this.applyBalanceDelta(tx, {
        accountId: next.accountId,
        cardId: next.cardId,
        type: next.type,
        amountCents: next.amountCents,
        direction: 1,
      });

      return updated;
    });
  }

  async remove(userId: string, id: string) {
    const existing = await this.findOne(userId, id);

    await this.prisma.$transaction(async (tx) => {
      await this.applyBalanceDelta(tx, {
        accountId: existing.accountId,
        cardId: existing.cardId,
        type: existing.type,
        amountCents: existing.amountCents,
        direction: -1,
      });
      await tx.transaction.delete({ where: { id } });
    });

    return { success: true };
  }

  private assertAmount(amountCents: number) {
    if (!Number.isInteger(amountCents) || amountCents <= 0) {
      throw new BadRequestException(
        'amountCents deve ser um inteiro positivo (centavos)',
      );
    }
  }

  private async assertOwnership(
    userId: string,
    dto: {
      accountId: string;
      cardId?: string | null;
      categoryId?: string | null;
      type?: TransactionType;
    },
  ) {
    const account = await this.prisma.account.findFirst({
      where: { id: dto.accountId, userId },
    });
    if (!account) throw new NotFoundException('Conta não encontrada');

    if (dto.cardId) {
      const card = await this.prisma.card.findFirst({
        where: { id: dto.cardId, userId },
      });
      if (!card) throw new NotFoundException('Cartão não encontrado');
    }

    if (dto.categoryId) {
      const category = await this.prisma.category.findFirst({
        where: { id: dto.categoryId, userId },
      });
      if (!category) throw new NotFoundException('Categoria não encontrada');
      if (dto.type === 'INCOME' && category.kind !== 'INCOME') {
        throw new BadRequestException('Categoria incompatível com receita');
      }
      if (dto.type === 'EXPENSE' && category.kind !== 'EXPENSE') {
        throw new BadRequestException('Categoria incompatível com despesa');
      }
    }
  }

  private async applyBalanceDelta(
    tx: Prisma.TransactionClient,
    params: {
      accountId: string;
      cardId?: string | null;
      type: TransactionType;
      amountCents: number;
      direction: 1 | -1;
    },
  ) {
    const signed =
      params.type === 'INCOME'
        ? params.amountCents * params.direction
        : params.type === 'EXPENSE'
          ? -params.amountCents * params.direction
          : 0;

    if (params.type === 'TRANSFER') {
      // Transferências simples não alteram saldo agregado neste MVP
      return;
    }

    await tx.account.update({
      where: { id: params.accountId },
      data: { balanceCents: { increment: signed } },
    });

    if (params.cardId && params.type === 'EXPENSE') {
      await tx.card.update({
        where: { id: params.cardId },
        data: {
          usedCents: { increment: params.amountCents * params.direction },
        },
      });
    }
  }
}
