import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContributeGoalDto, CreateGoalDto, UpdateGoalDto } from './dto/goal.dto';

@Injectable()
export class GoalsService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, dto: CreateGoalDto) {
    return this.prisma.goal.create({
      data: {
        userId,
        name: dto.name.trim(),
        description: dto.description?.trim(),
        targetCents: dto.targetCents,
        currentCents: dto.currentCents ?? 0,
        deadline: dto.deadline ? new Date(dto.deadline) : undefined,
        color: dto.color ?? '#10B981',
      },
    });
  }

  async findAll(userId: string) {
    const goals = await this.prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return goals.map((g) => this.withProgress(g));
  }

  async findOne(userId: string, id: string) {
    const goal = await this.prisma.goal.findFirst({ where: { id, userId } });
    if (!goal) throw new NotFoundException('Meta não encontrada');
    return this.withProgress(goal);
  }

  async update(userId: string, id: string, dto: UpdateGoalDto) {
    await this.findOne(userId, id);
    const goal = await this.prisma.goal.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.description !== undefined
          ? { description: dto.description.trim() }
          : {}),
        ...(dto.targetCents !== undefined ? { targetCents: dto.targetCents } : {}),
        ...(dto.currentCents !== undefined
          ? { currentCents: dto.currentCents }
          : {}),
        ...(dto.deadline !== undefined
          ? { deadline: dto.deadline ? new Date(dto.deadline) : null }
          : {}),
        ...(dto.status !== undefined ? { status: dto.status } : {}),
        ...(dto.color !== undefined ? { color: dto.color } : {}),
      },
    });
    return this.withProgress(goal);
  }

  async contribute(userId: string, id: string, dto: ContributeGoalDto) {
    const goal = await this.findOne(userId, id);
    const currentCents = goal.currentCents + dto.amountCents;
    const status =
      currentCents >= goal.targetCents ? 'COMPLETED' : goal.status;

    const updated = await this.prisma.goal.update({
      where: { id },
      data: { currentCents, status },
    });
    return this.withProgress(updated);
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.goal.delete({ where: { id } });
    return { success: true };
  }

  private withProgress<T extends { currentCents: number; targetCents: number }>(
    goal: T,
  ) {
    const progressPercent =
      goal.targetCents === 0
        ? 0
        : Math.min(
            100,
            Math.round((goal.currentCents / goal.targetCents) * 100),
          );
    return {
      ...goal,
      progressPercent,
      remainingCents: Math.max(0, goal.targetCents - goal.currentCents),
    };
  }
}
