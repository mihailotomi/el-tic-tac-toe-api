import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, IsUrl } from "class-validator";

export class ClubDto {
  @IsInt()
  @ApiProperty()
  id: number;

  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  code: string;

  @IsUrl()
  @ApiProperty()
  crestUrl: string;
}
