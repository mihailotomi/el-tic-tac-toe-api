import { Injectable } from "@nestjs/common";
import { PlayerRepository } from "../repository/player.repository";
import { PlayerMapperService } from "./player-mapper.service";
import { SearchPlayerDto } from "../dto/search-player.dto";
import { ValidatePlayerClubsDto } from "../dto/validate-player-match.dto";
import { PlayerDto } from "../dto/player.dto";
import { CreatePlayerSeasonDto } from "../dto/create-player-season.dto";
import { CreatePlayerDto } from "../dto/create-player.dto";
import { PlayerSeasonDto } from "../dto/player-season-dto";
import { and, eq } from "drizzle-orm";
import { playerSeasons } from "src/core/database/schema/schema";
import { ClubRepository } from "src/club/repository/club.repository";
import { GridDifficulty } from "src/grid/enums/grid-difficulty";
import { ValidatePlayerCountryDto } from "../dto/validate-player-country.dto";

@Injectable()
export class PlayerService {
  constructor(
    private playerRepository: PlayerRepository,
    private playerMapper: PlayerMapperService,
    private clubRepository: ClubRepository,
  ) {}

  /**
   * Check if a player played for a group of clubs
   * @param {ValidatePlayerClubsDto} dto
   * @returns {Promise< boolean >} validation flag
   */
  validatePlayerClubs = ({ clubIds, playerId }: ValidatePlayerClubsDto): Promise<boolean> => {
    return this.playerRepository.validatePlayerClubs({ clubIds, playerId });
  };

  /**
   * Check if a player is form a country
   * @param {ValidatePlayerCountryDto} dto
   * @returns {Promise< boolean >} validation flag
   */
  validatePlayerCountry = ({ country, playerId }: ValidatePlayerCountryDto): Promise<boolean> => {
    return this.playerRepository.validatePlayerCounty({ country, playerId });
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
  insertPlayerSeasons = (playerSeasonDtoList: CreatePlayerSeasonDto[]): Promise<void> => {
    return this.playerRepository.withTransaction(async (tx) => {
      await Promise.all(
        playerSeasonDtoList.map(async (playerSeason) => {
          const { firstName, lastName, birthDate } = playerSeason.player;
          const { clubCode } = playerSeason.playerSeason;

          const [playerData, clubData] = await Promise.all([
            this.playerRepository.findPlayer({ kind: "constraint", firstName, lastName, birthDate }, tx),
            this.clubRepository.findClub({ kind: "code", code: clubCode }, tx),
          ]);

          if (playerData && clubData) {
            return this.playerRepository.insertPlayerSeason(playerSeason, playerData.id, clubData.id, tx);
          }
        }),
      );
    });
  };

  getRandomCountriesForGrid = async ({
    difficulty = GridDifficulty.EASY,
    amount = 1,
  }: {
    difficulty?: GridDifficulty;
    amount?: number;
  }): Promise<string[]> => {
    return amount
      ? (
          await this.playerRepository.getRandomGridCountries({
            difficultyLimit: this.countryDifficultyLimit(difficulty),
            amount,
          })
        ).map((c) => c.country)
      : [];
  };

  /**
   * Assigns all seasons that player2 has to player1 (if player1 doesn't already have them)
   * When a player occurs twice in the database under different names (from 2 different data sources)
   * Deletes the second player
   * @param {number} correctPlayerId
   * @param {number} duplicatePlayerId
   * @memberof PlayerService
   */
  mergeSeasonsForPlayers = (correctPlayerId: number, duplicatePlayerId: number): Promise<void> => {
    return this.playerRepository.withTransaction(async (tx) => {
      await this.playerRepository.deleteDuplicatePlayerSeasons(correctPlayerId, duplicatePlayerId, tx);

      await this.playerRepository
        .updatePlayerSeasons(tx)
        .set({ playerId: correctPlayerId })
        .where(and(eq(playerSeasons.playerId, duplicatePlayerId)));

      await this.playerRepository.deletePlayer({ kind: "id", id: duplicatePlayerId }, tx);
    });
  };

  private countryDifficultyLimit = (difficulty: GridDifficulty): number => {
    switch (difficulty) {
      case GridDifficulty.EASY:
        return 5;

      case GridDifficulty.MEDIUM:
        return 10;

      case GridDifficulty.HARD:
        return 15;
      default:
        return 5;
    }
  };
}
