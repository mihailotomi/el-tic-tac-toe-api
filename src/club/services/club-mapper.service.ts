import { Injectable } from "@nestjs/common";
import { GatewayClubDto } from "../../core/gateway/dto/gateway-club.dto";
import { CreateClubDto } from "../dto/create-club.dto";
import { Club } from "../models/club";
import { ClubDto } from "../dto/club.dto";

@Injectable()
export class ClubMapperService {
  toDto = (club: Club): ClubDto => {
    const clubDto = new ClubDto();
    Object.assign(clubDto, club);

    return clubDto;
  };

  gatewayToCreateDto = (gatewayClub: GatewayClubDto): CreateClubDto => {
    return {
      name: gatewayClub.name,
      code: gatewayClub.code,
      crestUrl: gatewayClub?.images?.crest,
    };
  };
}
