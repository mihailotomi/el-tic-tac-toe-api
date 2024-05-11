import { Inject, Injectable } from "@nestjs/common";
import { EUROLEAGUE_GATEWAY } from "src/core/gateway/constants/injection-token";
import { EuroleagueApiGatewayProvider } from "src/core/gateway/providers/euroleague-api-gateway.provider";
import { PlayerRepository } from "../repository/player.repository";
import { PlayerMapperService } from "./player-mapper.service";
import { SearchPlayerDto } from "../dto/search-player.dto";
import { CheckPlayerMatchDto } from "../dto/check-player-match.dto";
import { PlayerDto } from "../dto/player.dto";

@Injectable()
export class PlayerService {
  constructor(
    @Inject(EUROLEAGUE_GATEWAY) private euroleagueGateway: EuroleagueApiGatewayProvider,
    private playerRepository: PlayerRepository,
    private playerMapper: PlayerMapperService,
  ) {}

  checkMatch = async ({ clubIds, playerId }: CheckPlayerMatchDto): Promise<{ isMatch: boolean }> => {
    const playedForClubs = await this.playerRepository.validatePlayerClubHistory({ clubIds, playerId });
    return { isMatch: playedForClubs };
  };

  searchAutocomplete = async ({ search }: SearchPlayerDto): Promise<PlayerDto[]> => {
    const players = await this.playerRepository.nameSearchAutocomplete({ search, limit: 10 });
    return players.map(this.playerMapper.toDto);
  };

  populatePlayersForSeason = async (season: number) => {
    const {
      data: { data: playerSeasonListRaw },
    } = await this.euroleagueGateway.getPlayersForSeason(season);

    const playerSeasonPayloads = playerSeasonListRaw.map(this.playerMapper.apiToCreateDto);

    return this.playerRepository.insertSeasonPlayers(playerSeasonPayloads);
  };
}
