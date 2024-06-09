import { Injectable } from "@nestjs/common";
import { ClubService } from "src/club/services/club.service";
import { PlayerService } from "src/player/services/player.service";
import { GridItem, isClubItem, isCountryItem } from "../entities/grid-item";
import { CheckPlayerMatchDto } from "../dto/check-player-match.dto";

@Injectable()
export class GridService {
  constructor(
    private clubService: ClubService,
    private playerService: PlayerService,
  ) {}

  generateGrid = async (): Promise<{ x: GridItem[]; y: GridItem[] }> => {
    const { clubAmount, countryAmount } = this.getGridFieldsAmount();

    const y: GridItem[] = await Promise.all([
      ...(await this.clubService.getForGridRandom({ amount: clubAmount })).map(
        (c) => ({ itemType: "club", club: c }) as GridItem,
      ),
      ...(await this.playerService.getRandomCountriesForGrid({ amount: countryAmount })).map(
        (c) => ({ itemType: "country", country: c }) as GridItem,
      ),
    ]);

    const x = (await this.clubService.getForGridConstraint({ constraints: y })).map(
      (c) => ({ itemType: "club", club: c }) as GridItem,
    );

    return { x, y };
  };

  /**
   * Check if a certain player played for a certain club
   * @param {CheckPlayerMatchDto} dto
   * @returns {Promise<{ isMatch: boolean }>} object with a validation flag
   */
  checkMatch = async ({ playerId, item1, item2 }: CheckPlayerMatchDto): Promise<{ isMatch: boolean }> => {
    const clubIds: number[] = [item1, item2].filter(isClubItem).map((item) => item.club.id);
    const promises = [this.playerService.validatePlayerClubs({ playerId, clubIds })];

    [item1, item2].forEach((item) => {
      if (isCountryItem(item as GridItem)) {
        promises.push(this.playerService.validatePlayerCountry({ playerId, country: item.country }));
      }
    });

    return {
      isMatch: (await Promise.all(promises)).reduce((totalMatch, singleMatch) => totalMatch && singleMatch, true),
    };
  };

  getGridFieldsAmount = (): { clubAmount: number; countryAmount: number } => {
    const random = Math.random();

    if (random < 0.25) {
      return { clubAmount: 1, countryAmount: 2 };
    }
    if (random < 0.5) {
      return { clubAmount: 2, countryAmount: 1 };
    }
    return { clubAmount: 3, countryAmount: 0 };
  };
}
