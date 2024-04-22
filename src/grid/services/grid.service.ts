import { Injectable } from "@nestjs/common";
import { ClubService } from "src/club/services/club.service";

@Injectable()
export class GridService {
  constructor(private clubService: ClubService) {}

  generateGrid = async () => {
    const x = await this.clubService.getForGridRandom({});
    const y = await this.clubService.getForGridConstraint({ constraintClubs: x });

    return { x, y };
  };
}
