import { CategoryKind } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MinLength(2)
  @MaxLength(60)
  name!: string;

  @IsEnum(CategoryKind)
  kind!: CategoryKind;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  color?: string;
}

export class UpdateCategoryDto {
  @IsString()
  @MinLength(2)
  @MaxLength(60)
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  color?: string;
}
