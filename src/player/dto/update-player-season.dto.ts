import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdatePlayerSeasonDto {
  @IsNumber()
  @IsOptional()
  playerId?: number;

  @IsNumber()
  @IsOptional()
  season?: number;

  @IsString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  endDate?: string;

  @IsNumber()
  @IsOptional()
  clubId?: number;
}
