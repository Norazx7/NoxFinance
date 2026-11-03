import { RecurringFrequency } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateRecurringDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsInt()
  @Min(1)
  amountCents!: number;

  @IsEnum(RecurringFrequency)
  @IsOptional()
  frequency?: RecurringFrequency;

  @IsDateString()
  nextDueDate!: string;

  @IsString()
  @IsOptional()
  categoryId?: string;
}

export class UpdateRecurringDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @IsOptional()
  name?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  amountCents?: number;

  @IsEnum(RecurringFrequency)
  @IsOptional()
  frequency?: RecurringFrequency;

  @IsDateString()
  @IsOptional()
  nextDueDate?: string;

  @IsString()
  @IsOptional()
  categoryId?: string | null;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
