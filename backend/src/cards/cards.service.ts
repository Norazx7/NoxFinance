import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCardDto, UpdateCardDto } from './dto/card.dto';

@Injectable()
export class CardsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateCardDto) {
    if (dto.accountId) {
      const account = await this.prisma.account.findFirst({
        where: { id: dto.accountId, userId },
      });
      if (!account) throw new NotFoundException('Conta vinculada não encontrada');
    }

    return this.prisma.card.create({
      data: {
        userId,
        name: dto.name.trim(),
        type: dto.type ?? 'CREDIT',
        accountId: dto.accountId,
        lastFourDigits: dto.lastFourDigits,
        limitCents: dto.limitCents ?? 0,
        closingDay: dto.closingDay,
        dueDay: dto.dueDay,
        color: dto.color ?? '#34D399',
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.card.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(userId: string, id: string) {
    const card = await this.prisma.card.findFirst({ where: { id, userId } });
    if (!card) throw new NotFoundException('Cartão não encontrado');
    return card;
  }

  async update(userId: string, id: string, dto: UpdateCardDto) {
    await this.findOne(userId, id);
    return this.prisma.card.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.limitCents !== undefined ? { limitCents: dto.limitCents } : {}),
        ...(dto.closingDay !== undefined ? { closingDay: dto.closingDay } : {}),
        ...(dto.dueDay !== undefined ? { dueDay: dto.dueDay } : {}),
        ...(dto.color !== undefined ? { color: dto.color } : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
      },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.card.update({
      where: { id },
      data: { isActive: false },
    });
    return { success: true };
  }
}
