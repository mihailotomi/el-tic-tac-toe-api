import { Injectable } from "@nestjs/common";
import { ClubRepository } from "../repository/club.repository";
import { EuroleagueApiGatewayProvider } from "../../core/gateway/providers/euroleague-api-gateway.provider";
import { GridDifficulty } from "../../grid/enums/grid-difficulty";
import { Club } from "../models/club";
import { CreateClubDto } from "../dto/create-club.dto";

@Injectable()
export class ClubService {
  constructor(
    private euroleagueGateway: EuroleagueApiGatewayProvider,
    private clubRepository: ClubRepository,
  ) {}

  private clubDifficultyLimit = (difficulty: GridDifficulty): number => {
    switch (difficulty) {
      case GridDifficulty.EASY:
        return 15;

      case GridDifficulty.MEDIUM:
        return 25;

      case GridDifficulty.HARD:
        return 35;
      default:
        return 15;
    }
  };

  getForGridConstraint = async ({ constraintClubs }: { constraintClubs: Club[] }) => {
    return this.clubRepository.getGridClubsWithConstraint({ constraintClubs });
  };

  getForGridRandom = async ({
    difficulty = GridDifficulty.EASY,
    amount = 3,
  }: {
    difficulty?: GridDifficulty;
    amount?: number;
  }) => {
    return this.clubRepository.getRandomGridClubs({
      difficultyLimit: this.clubDifficultyLimit(difficulty),
      amount,
    });
  };

  insertClubs = async (seasonClubDtoList: CreateClubDto[]) => {
    return this.clubRepository.insertClubs(seasonClubDtoList);
  };
}
