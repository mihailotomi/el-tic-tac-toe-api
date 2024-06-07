import { Transform, Type } from "class-transformer";
import { IsDefined, IsIn, IsNotEmpty, IsString, ValidateIf, ValidateNested } from "class-validator";
import { CountryItemDto } from "./country-item.dto";
import { ApiProperty } from "@nestjs/swagger";
import { ClubDto } from "src/club/dto/club.dto";

export class GridItemDto {
  @IsIn(["club", "country"])
  @ApiProperty()
  itemType: "club" | "country";

  @ApiProperty({
    description: "Club (should be provided only if 'itemType' is set to 'club')",
    required: false,
    type: () => ClubDto,
  })
  @ValidateIf((o) => o.itemType === "club")
  @ValidateNested()
  @Type(() => ClubDto)
  @IsDefined()
  @IsNotEmpty()
  club?: ClubDto;

  @ValidateIf((o) => o.itemType === "country")
  @IsString()
  @ApiProperty({
    description: "Country (should be provided only if 'itemType' is set to 'country')",
    required: false,
    type: () => String,
  })
  country?: string;
}
