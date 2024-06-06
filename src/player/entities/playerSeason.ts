import { Club } from "src/club/entities/club";
import { Player } from "./player";

export class PlayerSeason {
  id: number;

  player: Player;

  season: number;

  startDate: string;

  endDate: string;

  club: Club;
}
