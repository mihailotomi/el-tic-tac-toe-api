import { Injectable } from "@nestjs/common";
import { ClubService } from "src/club/services/club.service";

@Injectable()
export class GridService {
  constructor(private clubService: ClubService) {}

  generateGrid = () => {
    return this.clubService.getForGridRandom({});
  };
}
