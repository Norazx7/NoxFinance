import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoryKind } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateCategoryDto) {
    try {
      return await this.prisma.category.create({
        data: {
          userId,
          name: dto.name.trim(),
          kind: dto.kind,
          icon: dto.icon,
          color: dto.color ?? '#6B7280',
        },
      });
    } catch {
      throw new ConflictException('Categoria já existe para este tipo');
    }
  }

  findAll(userId: string, kind?: CategoryKind) {
    return this.prisma.category.findMany({
      where: { userId, ...(kind ? { kind } : {}) },
      orderBy: [{ kind: 'asc' }, { name: 'asc' }],
    });
  }

  async findOne(userId: string, id: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, userId },
    });
    if (!category) throw new NotFoundException('Categoria não encontrada');
    return category;
  }

  async update(userId: string, id: string, dto: UpdateCategoryDto) {
    await this.findOne(userId, id);
    return this.prisma.category.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.icon !== undefined ? { icon: dto.icon } : {}),
        ...(dto.color !== undefined ? { color: dto.color } : {}),
      },
    });
  }

  async remove(userId: string, id: string) {
    const category = await this.findOne(userId, id);
    if (category.isSystem) {
      throw new BadRequestException('Categorias do sistema não podem ser excluídas');
    }
    await this.prisma.category.delete({ where: { id } });
    return { success: true };
  }
}
