import { Inject, Injectable } from "@nestjs/common";
import { EUROLEAGUE_GATEWAY } from "src/core/gateway/constants/injection-token";
import { CompetitionApiGatewayProvider } from "src/core/gateway/providers/competition-api-gateway.provider";
import { PlayerRepository } from "../repository/player.repository";
import { PlayerMapperService } from "./player-mapper.service";

@Injectable()
export class PlayerService {
  constructor(
    @Inject(EUROLEAGUE_GATEWAY) private euroleagueGateway: CompetitionApiGatewayProvider,
    private playerRepository: PlayerRepository,
    private playerMapper: PlayerMapperService,
  ) {}

  populatePlayers = async () => {
    const years = Array.from({ length: 24 }, (_, i) => i + 2000);

    return Promise.all(
      years.map(async (year) => {
        const {
          data: { data: playerSeasonListRaw },
        } = await this.euroleagueGateway.getPlayersForSeason(year);

        const playerSeasonPayloads = playerSeasonListRaw.map(this.playerMapper.mapFromRaw);

        return await this.playerRepository.insertSeasonPlayers(playerSeasonPayloads);
      }),
    );
  };
}
