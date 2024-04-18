import { Inject, Injectable } from "@nestjs/common";
import { ClubRepository } from "../repository/club.repository";
import { ClubMapperService } from "./club-mapper.service";
import { EUROLEAGUE_GATEWAY } from "src/core/gateway/constants/injection-token";
import { CompetitionApiGatewayProvider } from "src/core/gateway/providers/competition-api-gateway.provider";

@Injectable()
export class ClubService {
  constructor(
    @Inject(EUROLEAGUE_GATEWAY) private euroleagueGateway: CompetitionApiGatewayProvider,
    private clubRepository: ClubRepository,
    private clubMapper: ClubMapperService,
  ) {}

  populateClubs = async () => {
    for (let year = 2023; year >= 2000; year--) {
      const {
        data: { data: seasonClubsRaw },
      } = await this.euroleagueGateway.getClubsForSeason(year);

      const clubPayloads = seasonClubsRaw.map(this.clubMapper.mapFromRaw);
      await this.clubRepository.insertClubs(clubPayloads);
    }
  };
}
