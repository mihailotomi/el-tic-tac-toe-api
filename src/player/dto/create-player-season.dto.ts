export class CreatePlayerSeasonDto {
  player: {
    name: string;
    birthDate: Date;
    country: string;
    imageUrl: string;
  };
  playerSeason: {
    seasonName: string;
    startDate: Date;
    endDate: Date;
    clubCode: string;
  };
}
