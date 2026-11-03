import { CardType } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateCardDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name!: string;

  @IsEnum(CardType)
  @IsOptional()
  type?: CardType;

  @IsString()
  @IsOptional()
  accountId?: string;

  @IsString()
  @IsOptional()
  @MaxLength(4)
  lastFourDigits?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  limitCents?: number;

  @IsInt()
  @Min(1)
  @Max(31)
  @IsOptional()
  closingDay?: number;

  @IsInt()
  @Min(1)
  @Max(31)
  @IsOptional()
  dueDay?: number;

  @IsString()
  @IsOptional()
  color?: string;
}

export class UpdateCardDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  @IsOptional()
  name?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  limitCents?: number;

  @IsInt()
  @Min(1)
  @Max(31)
  @IsOptional()
  closingDay?: number;

  @IsInt()
  @Min(1)
  @Max(31)
  @IsOptional()
  dueDay?: number;

  @IsString()
  @IsOptional()
  color?: string;

  @IsOptional()
  isActive?: boolean;
}
