export class RawPlayerSeasonDto {
  person: {
    name: string;
    country: {
      code: string;
      name: string;
    };
    birthDate: string;
  };
  startDate: string;
  endDate: string;
  images: {
    headshot: string;
  };
  club: {
    code: string;
  };
  season: {
    code: string;
  };
}
