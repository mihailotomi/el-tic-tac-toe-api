import { HttpService } from "@nestjs/axios";
import { HttpException, Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { RawClubDto } from "../dto/raw-club.dto";
import { ClubRepository } from "../repository/club.repository";
import { ClubMapperService } from "./club-mapper.service";

@Injectable()
export class ClubService {
  constructor(
    private httpService: HttpService,
    private clubRepository: ClubRepository,
    private clubMapper: ClubMapperService,
  ) {}

  getClubsForSeason(seasonCode: string) {
    try {
      return firstValueFrom(
        this.httpService.get<{ data: RawClubDto[]; total: number }>(
          `https://api-live.euroleague.net/v2/competitions/E/sesons/${seasonCode}/clubs`,
        ),
      );
    } catch (error) {
      throw new HttpException(error.message || "", 400);
    }
  }

  populateClubs = async () => {
    for (let year = 2023; year >= 2000; year--) {
      const {
        data: { data: seasonClubsRaw },
      } = await this.getClubsForSeason(`E${year}`);

      const clubPayloads = seasonClubsRaw.map(this.clubMapper.mapFromRaw);
      await this.clubRepository.insertClubs(clubPayloads);
    }
  };
}
