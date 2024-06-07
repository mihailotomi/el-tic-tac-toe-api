import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, ValidateNested } from "class-validator";
import { GridItemDto } from "./grid-item.dto";

export class CheckPlayerMatchDto {
  @IsInt()
  @ApiProperty()
  playerId: number;

  @ValidateNested()
  @ApiProperty()
  @Type(() => GridItemDto)
  item1: GridItemDto;

  @ValidateNested()
  @ApiProperty()
  @Type(() => GridItemDto)
  item2: GridItemDto;
}
