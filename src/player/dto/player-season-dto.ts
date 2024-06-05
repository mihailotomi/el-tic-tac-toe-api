export class PlayerSeasonDto {
  id: number;

  player: {
    id: number;
    firstName: string;
    lastName: string;
  };

  season: number;

  startDate: string;

  endDate: string;

  club: {
    id: number;
    name: string;
  };
}
