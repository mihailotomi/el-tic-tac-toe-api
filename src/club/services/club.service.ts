import { Inject, Injectable } from "@nestjs/common";
import { ClubRepository } from "../repository/club.repository";
import { ClubMapperService } from "./club-mapper.service";
import { EUROLEAGUE_GATEWAY } from "../../core/gateway/constants/injection-token";
import { CompetitionApiGatewayProvider } from "../../core/gateway/providers/competition-api-gateway.provider";
import { GridDifficulty } from "../../grid/enums/grid-difficulty";

@Injectable()
export class ClubService {
  constructor(
    @Inject(EUROLEAGUE_GATEWAY) private euroleagueGateway: CompetitionApiGatewayProvider,
    private clubRepository: ClubRepository,
    private clubMapper: ClubMapperService,
  ) {}

  private clubDifficultyLimit = (difficulty: GridDifficulty): number => {
    switch (difficulty) {
      case GridDifficulty.EASY:
        return 15;

      case GridDifficulty.MEDIUM:
        return 25;

      case GridDifficulty.HARD:
        return 35;
    }
  };

  getForGridRandom = async ({
    difficulty = GridDifficulty.EASY,
    amount = 3,
  }: {
    difficulty?: GridDifficulty;
    amount?: number;
  }) => {
    const clubs = await this.clubRepository.getRandomGridClubs({
      difficultyLimit: this.clubDifficultyLimit(difficulty),
      amount,
    });
        
    return clubs.map(this.clubMapper.toDto);
  };

  populateClubs = async () => {
    for (let year = 2023; year >= 2000; year--) {
      // NOTE: we don't want to run this in parallel, because we want the latest club names and crests
      const {
        data: { data: seasonClubsRaw },
        // eslint-disable-next-line no-await-in-loop
      } = await this.euroleagueGateway.getClubsForSeason(year);

      const clubPayloads = seasonClubsRaw.map(this.clubMapper.gatewayToCreateDto);
      // eslint-disable-next-line no-await-in-loop
      await this.clubRepository.insertClubs(clubPayloads);
    }
  };
}
