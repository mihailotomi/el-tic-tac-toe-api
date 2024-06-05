import { Injectable } from "@nestjs/common";
import { Club } from "src/club/models/club";
import { PlayerRepository } from "../repository/player.repository";
import { PlayerMapperService } from "./player-mapper.service";
import { SearchPlayerDto } from "../dto/search-player.dto";
import { CheckPlayerMatchDto } from "../dto/check-player-match.dto";
import { PlayerDto } from "../dto/player.dto";
import { CreatePlayerSeasonDto } from "../dto/create-player-season.dto";
import { CreatePlayerDto } from "../dto/create-player.dto";
import { PlayerSeason } from "../models/playerSeason";
import { PlayerSeasonDto } from "../dto/player-season-dto";

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

  /** Returns all clubs a player has played for
   * @param {number} playerId
   * @returns {Promise<PlayerSeasonDto[]>}
   */
  getPlayerSeasons = async (playerId: number): Promise<PlayerSeasonDto[]> => {
    const playerSeasons = await this.playerRepository.getPlayerSeasons(playerId);
    return playerSeasons.map(this.playerMapper.playerSeasonToDto);
  };

  /**
   * Autocomplete search for players
   * @param {SearchPlayerDto} dto
   */
  searchAutocomplete = async ({ search }: SearchPlayerDto): Promise<PlayerDto[]> => {
    const players = await this.playerRepository.nameSearchAutocomplete({ search, limit: 10 });
    return players.map(this.playerMapper.playerToDto);
  };

  /**
   * Insert a batch of players if not present
   * @param {CreatePlayerDto[]} playerDtoList
   */
  insertPlayers = async (playerDtoList: CreatePlayerDto[]) => {
    return this.playerRepository.insertPlayers(playerDtoList);
  };

  /**
   * Upsert a batch of players if not present
   * @param {CreatePlayerDto[]} playerDtoList
   */
  upsertPlayers = async (playerDtoList: CreatePlayerDto[]) => {
    return this.playerRepository.upsertPlayers(playerDtoList);
  };

  /**
   * Insert a batch of seasons players have played
   * @param {CreatePlayerSeasonDto[]} playerSeasonDtoList
   */
  upsertPlayerSeasons = async (playerSeasonDtoList: CreatePlayerSeasonDto[]) => {
    return this.playerRepository.insertPlayerSeasons(playerSeasonDtoList);
  };
}
