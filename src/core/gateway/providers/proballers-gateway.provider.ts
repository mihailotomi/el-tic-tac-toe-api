import { HttpService } from "@nestjs/axios";
import { HttpException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import { ProballersMapperService } from "../mappers/proballers-mapper.service";

@Injectable()
export class ProballersGatewayProvider {
  private baseUrl: string;

  constructor(
    private httpService: HttpService,
    private mapper: ProballersMapperService,
    configService: ConfigService,
  ) {
    this.baseUrl = configService.get("PROBALLERS_URL");
  }

  //   searchClubsByName;

  async getClubHistoricRoster(pbId: number, clubFullName: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get<any>(`${this.baseUrl}team/${pbId}/${clubFullName}/all-time-roster`, {
          headers: { Accept: "text/html" },
        }),
      );
      return this.mapper.playersRawToIntermediate(response.data)
    } catch (error) {
      // TODO: throw custom exception
      throw new HttpException(error?.message || "", 400);
    }
  }
}
