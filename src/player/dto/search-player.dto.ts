import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class SearchPlayerDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.replace(/[^a-z]/g, ""))
  search: string;
}
