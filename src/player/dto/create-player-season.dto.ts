import { CreatePlayerDto } from "./create-player.dto";

export class CreatePlayerSeasonDto {
  player: CreatePlayerDto;

  playerSeason: {
    season: number;
    startDate: string;
    endDate: string;
    clubCode: string;
  };
}
