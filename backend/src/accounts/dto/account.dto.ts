import { AccountType } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name!: string;

  @IsEnum(AccountType)
  @IsOptional()
  type?: AccountType;

  @IsInt()
  @Min(0)
  @IsOptional()
  balanceCents?: number;

  @IsString()
  @IsOptional()
  color?: string;
}

export class UpdateAccountDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  @IsOptional()
  name?: string;

  @IsEnum(AccountType)
  @IsOptional()
  type?: AccountType;

  @IsString()
  @IsOptional()
  color?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
