import { TransactionType } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  accountId!: string;

  @IsString()
  @IsOptional()
  cardId?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsEnum(TransactionType)
  type!: TransactionType;

  @IsInt()
  @Min(1)
  amountCents!: number;

  @IsString()
  @MinLength(2)
  @MaxLength(200)
  description!: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  notes?: string;

  @IsDateString()
  occurredAt!: string;
}

export class UpdateTransactionDto {
  @IsString()
  @IsOptional()
  categoryId?: string | null;

  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(200)
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  notes?: string;

  @IsDateString()
  @IsOptional()
  occurredAt?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  amountCents?: number;

  @IsEnum(TransactionType)
  @IsOptional()
  type?: TransactionType;

  @IsString()
  @IsOptional()
  accountId?: string;

  @IsString()
  @IsOptional()
  cardId?: string | null;
}

export class TransactionFilterDto {
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @IsOptional()
  @IsString()
  accountId?: string;
}
