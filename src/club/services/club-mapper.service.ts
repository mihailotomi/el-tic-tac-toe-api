import { Injectable } from "@nestjs/common";
import { Club } from "../entities/club";
import { ClubDto } from "../dto/club.dto";

@Injectable()
export class ClubMapperService {
  toDto = (club: Club): ClubDto => {
    const clubDto = new ClubDto();
    Object.assign(clubDto, club);

    return clubDto;
  };
}
