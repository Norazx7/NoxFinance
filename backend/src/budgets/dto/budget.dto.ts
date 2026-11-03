import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class BudgetLimitDto {
  @IsString()
  categoryId!: string;

  @IsInt()
  @Min(1)
  limitCents!: number;
}

export class CreateBudgetDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name!: string;

  @IsInt()
  @Min(2000)
  year!: number;

  @IsInt()
  @Min(1)
  @Max(12)
  month!: number;

  @IsInt()
  @Min(1)
  limitCents!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BudgetLimitDto)
  @IsOptional()
  limits?: BudgetLimitDto[];
}

export class UpdateBudgetDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  @IsOptional()
  name?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  limitCents?: number;

  @IsArray()
  @ArrayMinSize(0)
  @ValidateNested({ each: true })
  @Type(() => BudgetLimitDto)
  @IsOptional()
  limits?: BudgetLimitDto[];
}
