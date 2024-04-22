import { Inject, Injectable } from "@nestjs/common";
import { EUROLEAGUE_GATEWAY } from "src/core/gateway/constants/injection-token";
import { CompetitionApiGatewayProvider } from "src/core/gateway/providers/competition-api-gateway.provider";
import { PlayerRepository } from "../repository/player.repository";
import { PlayerMapperService } from "./player-mapper.service";
import { SearchPlayerDto } from "../dto/search-player.dto";

@Injectable()
export class PlayerService {
  constructor(
    @Inject(EUROLEAGUE_GATEWAY) private euroleagueGateway: CompetitionApiGatewayProvider,
    private playerRepository: PlayerRepository,
    private playerMapper: PlayerMapperService,
  ) {}

  searchAutocomplete = async ({ search }: SearchPlayerDto) => {
    const rawPlayers = await this.playerRepository.nameSearchAutocomplete({ search, limit: 10 });
    return rawPlayers.map(this.playerMapper.fromRaw);
  };

  populatePlayers = async () => {
    const years = Array.from({ length: 24 }, (_, i) => i + 2000);

    return Promise.all(
      years.map(async (year) => {
        const {
          data: { data: playerSeasonListRaw },
        } = await this.euroleagueGateway.getPlayersForSeason(year);

        const playerSeasonPayloads = playerSeasonListRaw.map(this.playerMapper.apiToCreateDto);

        return this.playerRepository.insertSeasonPlayers(playerSeasonPayloads);
      }),
    );
  };
}
