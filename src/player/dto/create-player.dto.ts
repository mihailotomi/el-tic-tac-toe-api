import { IsNotEmpty, IsString, Matches } from "class-validator";

export class CreatePlayerDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: "birthDate must be in the format YYYY-MM-DD" })
  birthDate: string;

  country: string;

  imageUrl?: string;
}
