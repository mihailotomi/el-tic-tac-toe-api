export class CreatePlayerSeasonDto {
  player: {
    firstName: string;
    lastName: string;
    birthDate: string;
    country: string;
    imageUrl?: string;
  };

  playerSeason: {
    season: number;
    startDate: Date;
    endDate: Date;
    clubCode: string;
  };
}
