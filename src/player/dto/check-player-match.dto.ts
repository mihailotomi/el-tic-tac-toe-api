import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber } from "class-validator";

export class CheckPlayerMatchDto {
  @ApiProperty()
  @IsNumber()
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  playerId: number;

  @ApiProperty({ type: String, description: "A string representing an array of club ids", example: "1,2,3" })
  @IsNumber({}, { each: true })
  @Transform(({ value }: { value: string }) => value.split(",").map((v) => parseInt(v, 10)))
  clubIds: number[];
}
