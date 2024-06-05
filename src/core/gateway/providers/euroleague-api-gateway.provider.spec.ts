import { Test, TestingModule } from "@nestjs/testing";
import { createMock, DeepMocked } from "@golevelup/ts-jest";
import { HttpService } from "@nestjs/axios";
import { InfrastructureModule } from "src/core/infrastructure/infrastructure.module";
import { ConfigService } from "@nestjs/config";
import { LoggerService } from "@nestjs/common";
import { LOGGER } from "src/core/infrastructure/logging/injection-token";
import { EuroleagueApiMapperService } from "../mappers/euroleague-api-mapper.service";
import { EuroleagueApiGatewayProvider } from "./euroleague-api-gateway.provider";

import mockClubData from "../data/mock-clubs.json";
import mockPlayerData from "../data/mock-players.json";

describe("EuroleagueApiGatewayProvider", () => {
  let euroleagueApiGateway: EuroleagueApiGatewayProvider;
  let httpService: DeepMocked<HttpService>;
  let configService: DeepMocked<ConfigService>;
  let logger: LoggerService;

  beforeEach(async () => {
    configService = createMock<ConfigService>();
    configService.get.mockReturnValue("https://api.euroleague.net");

    const module: TestingModule = await Test.createTestingModule({
      imports: [InfrastructureModule.register({ logging: { useFile: false } })],
      providers: [
        EuroleagueApiGatewayProvider,
        {
          provide: HttpService,
          useValue: createMock<HttpService>(),
        },
        EuroleagueApiMapperService,
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    euroleagueApiGateway = module.get<EuroleagueApiGatewayProvider>(EuroleagueApiGatewayProvider);
    logger = module.get<LoggerService>(LOGGER);
    httpService = module.get(HttpService);
  });

  describe("getClubsForSeason", () => {
    it("should return valid club list", async () => {
      httpService.axiosRef.mockResolvedValueOnce({
        data: mockClubData,
        status: 200,
      });

      const getClubsForSeason = await euroleagueApiGateway.getClubsForSeason(2020);

      expect(getClubsForSeason).toEqual([
        {
          name: mockClubData.data[0].name,
          code: mockClubData.data[0].code,
          crestUrl: mockClubData.data[0].images.crest,
        },
        {
          name: mockClubData.data[1].name,
          code: mockClubData.data[1].code,
          crestUrl: mockClubData.data[1].images.crest,
        },
      ]);
    });

    it("should reject and log club errors", async () => {
      httpService.axiosRef.mockRejectedValueOnce(new Error("Testing error"));

      await expect(euroleagueApiGateway.getClubsForSeason(2020)).rejects.toThrow();
    });
  });

  describe("getPlayersForSeason", () => {
    it("should return valid player list", async () => {
      httpService.axiosRef.mockResolvedValueOnce({
        data: mockPlayerData,
        status: 200,
      });

      const getPlayersForSeason = await euroleagueApiGateway.getPlayersForSeason(2020);

      expect(getPlayersForSeason).toEqual({
        playerSeasons: [
          {
            player: {
              birthDate: "2006-02-04",
              country: "GRE",
              firstName: "NEOKLIS",
              imageUrl: undefined,
              lastName: "AVDALAS",
            },
            playerSeason: {
              clubCode: "PAN",
              endDate: "2021-06-30T23:59:59",
              season: 2020,
              startDate: "2021-02-24T00:00:00",
            },
          },
        ],
        players: [
          {
            birthDate: "2006-02-04",
            country: "GRE",
            firstName: "NEOKLIS",
            imageUrl: undefined,
            lastName: "AVDALAS",
          },
        ],
      });
    });

    it("should reject and log player errors", async () => {
      httpService.axiosRef.mockRejectedValueOnce(new Error("Testing error"));

      await expect(euroleagueApiGateway.getPlayersForSeason(2020)).rejects.toThrow();
    });

    it("should ignore and log invalid players", async () => {
      httpService.axiosRef.mockResolvedValueOnce({
        data: {
          ...mockPlayerData,
          data: mockPlayerData.data.map((p) => ({ ...p, person: { ...p.person, birthDate: "" } })),
        },
        status: 200,
      });

      const errorLogMock = jest.spyOn(logger, "error");

      await euroleagueApiGateway.getPlayersForSeason(2020);

      expect(errorLogMock).toHaveBeenCalled();
    });
  });
});
