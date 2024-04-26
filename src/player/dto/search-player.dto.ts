import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class SearchPlayerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: { value: string }) => value.toLowerCase().replace(/[^a-z ]/g, ""))
  search: string;
}
