import { Injectable } from "@nestjs/common";
import { ClubService } from "src/club/services/club.service";
import { PlayerService } from "src/player/services/player.service";
import { GridItem } from "../entities/grid-item";

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
