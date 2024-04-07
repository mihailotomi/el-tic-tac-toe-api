import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { RawClubDto } from "../dto/raw-club.dto";
import { ClubRepository } from "../repository/club.repository";

@Injectable()
export class ClubService {
  constructor(private httpService: HttpService, private clubRepository: ClubRepository) {}

  getClubsForSeason(seasonCode: string) {
    return firstValueFrom(
      this.httpService.get<{ data: RawClubDto[]; total: number }>(
        `https://api-live.euroleague.net/v2/competitions/E/players?seasonCode=${seasonCode}`,
      ),
    );
  }

  populateClubs = async () => {
    for (let year = 2023; year >= 2000; year--) {
      const { data: {data: seasonClubsRaw} } = await this.getClubsForSeason(`E${year}`);
      this.clubRepository.insertClubs(seasonClubsRaw)
    }
  };
}
