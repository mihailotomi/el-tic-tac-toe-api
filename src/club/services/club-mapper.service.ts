import { Injectable } from "@nestjs/common";
import { RawClubDto } from "../../core/gateway/dto/raw-club.dto";
import { CreateClubDto } from "../dto/create-club.dto";

@Injectable()
export class ClubMapperService {
  mapFromApi = (rawClub: RawClubDto): CreateClubDto => {
    return {
      name: rawClub.name,
      code: rawClub.code,
      crestUrl: rawClub?.images?.crest,
    };
  };
}
