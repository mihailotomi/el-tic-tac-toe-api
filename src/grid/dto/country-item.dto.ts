import { IsIn, IsString } from "class-validator";
import { CountryItem } from "../entities/grid-item";
import { ApiProperty } from "@nestjs/swagger";

export class CountryItemDto {
  @IsString()
  @ApiProperty()
  country: string;
}
