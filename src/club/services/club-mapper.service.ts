import { Injectable } from "@nestjs/common";
import { GatewayClubDto } from "../../core/gateway/dto/gateway-club.dto";
import { CreateClubDto } from "../dto/create-club.dto";

@Injectable()
export class ClubMapperService {
  gatewayToCreateDto = (gatewayClub: GatewayClubDto): CreateClubDto => {
    return {
      name: gatewayClub.name,
      code: gatewayClub.code,
      crestUrl: gatewayClub?.images?.crest,
    };
  };
}
