import { Injectable } from "@nestjs/common";
import { ClubRepository } from "../repository/club.repository";
import { GridDifficulty } from "../../grid/enums/grid-difficulty";
import { Club } from "../entities/club";
import { CreateClubDto } from "../dto/create-club.dto";
import { GridItem, isClubItem, isCountryItem } from "src/grid/entities/grid-item";
import { SubqueryWithSelection } from "drizzle-orm/pg-core";

@Injectable()
export class ClubService {
  constructor(private clubRepository: ClubRepository) {}

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

  getForGridConstraint = async ({ constraints }: { constraints: GridItem[] }): Promise<Club[]> => {
    const constraintSqList: SubqueryWithSelection<any & { id: number }, any>[] = constraints.map((c, index) => {
      if (isClubItem(c)) {
        return this.clubRepository.getConstraintSubqueryForClub(c.club, index);
      }
      if (isCountryItem(c)) {
        return this.clubRepository.getConstraintSubqueryForCountry(c.country, index);
      }
    });

    return this.clubRepository.getGridClubsWithConstraint(constraintSqList);
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
