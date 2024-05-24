import { Injectable } from "@nestjs/common";
import { PlayerRepository } from "../repository/player.repository";
import { PlayerMapperService } from "./player-mapper.service";
import { SearchPlayerDto } from "../dto/search-player.dto";
import { CheckPlayerMatchDto } from "../dto/check-player-match.dto";
import { PlayerDto } from "../dto/player.dto";
import { CreatePlayerSeasonDto } from "../dto/create-player-season.dto";

@Injectable()
export class PlayerService {
  constructor(
    private playerRepository: PlayerRepository,
    private playerMapper: PlayerMapperService,
  ) {}

  /**
   * Check if a certain player played for a certain club
   * @param {CheckPlayerMatchDto} dto
   * @returns {Promise<{ isMatch: boolean }>} object with a validation flag
   */
  checkMatch = async ({ clubIds, playerId }: CheckPlayerMatchDto): Promise<{ isMatch: boolean }> => {
    const playedForClubs = await this.playerRepository.validatePlayerClubHistory({ clubIds, playerId });
    return { isMatch: playedForClubs };
  };

  /**
   * Autocomplete search for players
   * @param {SearchPlayerDto} dto
   */
  searchAutocomplete = async ({ search }: SearchPlayerDto): Promise<PlayerDto[]> => {
    const players = await this.playerRepository.nameSearchAutocomplete({ search, limit: 10 });
    return players.map(this.playerMapper.toDto);
  };

  /**
   * Insert or upsert a barch of players and their seasons
   * @param {CreatePlayerSeasonDto[]} playerSeasonPayloads
   */
  populatePlayers = async (playerSeasonPayloads: CreatePlayerSeasonDto[]) => {
    return this.playerRepository.insertSeasonPlayers(playerSeasonPayloads);
  };
}
