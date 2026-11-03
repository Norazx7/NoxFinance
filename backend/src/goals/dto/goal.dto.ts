import { GoalStatus } from '@prisma/client';
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

export class CreateGoalDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsString()
  @IsOptional()
  @MaxLength(300)
  description?: string;

  @IsInt()
  @Min(1)
  targetCents!: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  currentCents?: number;

  @IsDateString()
  @IsOptional()
  deadline?: string;

  @IsString()
  @IsOptional()
  color?: string;
}

export class UpdateGoalDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(300)
  description?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  targetCents?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  currentCents?: number;

  @IsDateString()
  @IsOptional()
  deadline?: string;

  @IsEnum(GoalStatus)
  @IsOptional()
  status?: GoalStatus;

  @IsString()
  @IsOptional()
  color?: string;
}

export class ContributeGoalDto {
  @IsInt()
  @Min(1)
  amountCents!: number;
}
