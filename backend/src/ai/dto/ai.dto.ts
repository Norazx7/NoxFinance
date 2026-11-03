import { IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class AiAskDto {
  @IsString()
  @MinLength(3)
  @MaxLength(1000)
  question!: string;
}

export class AiSimulateDto {
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  description!: string;

  @IsInt()
  @Min(1)
  amountCents!: number;

  @IsString()
  @IsOptional()
  categoryName?: string;
}
