import { Injectable } from "@nestjs/common";
import { EuroleagueApiGatewayProvider } from "src/core/gateway/providers/euroleague-api-gateway.provider";
import { PlayerRepository } from "../repository/player.repository";
import { PlayerMapperService } from "./player-mapper.service";
import { SearchPlayerDto } from "../dto/search-player.dto";
import { CheckPlayerMatchDto } from "../dto/check-player-match.dto";
import { PlayerDto } from "../dto/player.dto";

@Injectable()
export class PlayerService {
  constructor(
    private euroleagueGateway: EuroleagueApiGatewayProvider,
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
    const playerSeasonPayloads = await this.euroleagueGateway.getPlayersForSeason(season);

    return this.playerRepository.insertSeasonPlayers(playerSeasonPayloads);
  };
}
