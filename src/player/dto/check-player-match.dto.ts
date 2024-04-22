import { Transform } from "class-transformer";
import { IsArray, IsNumber, IsNumberString } from "class-validator";

export class CheckPlayerMatchDto {
  @IsNumber()
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  playerId: number;

  @IsNumber({},{each: true})
  @Transform(({ value }: { value: string }) => value.split(",").map((v) => parseInt(v, 10)))
  clubIds: number[];
}
