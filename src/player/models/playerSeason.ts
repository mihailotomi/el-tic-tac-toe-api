import { Club } from "src/club/models/club";
import { Player } from "./player";

export class PlayerSeason {
  id: number;

  player: Player;

  season: number;

  startDate: string;

  endDate: string;

  club: Club;
}
