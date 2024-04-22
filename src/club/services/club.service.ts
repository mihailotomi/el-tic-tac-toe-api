import { Inject, Injectable } from "@nestjs/common";
import { ClubRepository } from "../repository/club.repository";
import { ClubMapperService } from "./club-mapper.service";
import { EUROLEAGUE_GATEWAY } from "../../core/gateway/constants/injection-token";
import { CompetitionApiGatewayProvider } from "../../core/gateway/providers/competition-api-gateway.provider";

@Injectable()
export class ClubService {
  constructor(
    @Inject(EUROLEAGUE_GATEWAY) private euroleagueGateway: CompetitionApiGatewayProvider,
    private clubRepository: ClubRepository,
    private clubMapper: ClubMapperService,
  ) {}

  populateClubs = async () => {
    for (let year = 2023; year >= 2000; year--) {
      // NOTE: we don't want to run this in parallel, because we want the latest club names and crests
      const {
        data: { data: seasonClubsRaw },
        // eslint-disable-next-line no-await-in-loop
      } = await this.euroleagueGateway.getClubsForSeason(year);

      const clubPayloads = seasonClubsRaw.map(this.clubMapper.apiToCreateDto);
      // eslint-disable-next-line no-await-in-loop
      await this.clubRepository.insertClubs(clubPayloads);
    }
  };
}
