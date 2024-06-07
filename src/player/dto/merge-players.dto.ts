import { ApiProperty } from "@nestjs/swagger";
import {  IsNumberString } from "class-validator";

export class MergePlayersDto {
  @ApiProperty()
  @IsNumberString()
  player1: string;

  @ApiProperty()
  @IsNumberString()
  player2: string;
}
