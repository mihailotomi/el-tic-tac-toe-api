import { Test, TestingModule } from "@nestjs/testing";
import { createMock, DeepMocked } from "@golevelup/ts-jest";
import { HttpService } from "@nestjs/axios";
import { InfrastructureModule } from "src/core/infrastructure/infrastructure.module";
import { ConfigService } from "@nestjs/config";
import { ProballersGatewayProvider } from "./proballers-gateway.provider";
import { ProballersMapperService } from "../mappers/proballers-mapper.service";
import { NationalityMapperService } from "../mappers/nationality-mapper.service";

describe("ProballersGatewayProvider", () => {
  let proballersGateway: ProballersGatewayProvider;
  let configService: DeepMocked<ConfigService>;

  beforeEach(async () => {
    configService = createMock<ConfigService>();
    configService.get.mockReturnValue("https://proballers.net");

    const module: TestingModule = await Test.createTestingModule({
      imports: [InfrastructureModule.register({ logging: { useFile: false } })],
      providers: [
        ProballersGatewayProvider,
        {
          provide: HttpService,
          useValue: createMock<HttpService>(),
        },
        ProballersMapperService,
        {
          provide: ConfigService,
          useValue: configService,
        },
        NationalityMapperService,
      ],
    }).compile();

    proballersGateway = module.get<ProballersGatewayProvider>(ProballersGatewayProvider);
  });

  describe("getClubHistoricRoster", () => {
    it("should throw an error if club code is not found", async () => {
      await expect(proballersGateway.getClubHistoricRoster("nonexistentCode")).rejects.toThrow(
        "Non existent club code!",
      );
    });

    it("should return player and season DTOs", async () => {
      const mockIntermediateDtoList = [{ playerUrl: "/player1", seasons: ["2020"], clubCode: "ABC" }];
      const mockPlayerSeasonDetails = {
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
        player: {
          birthDate: "2006-02-04",
          country: "GRE",
          firstName: "NEOKLIS",
          imageUrl: undefined,
          lastName: "AVDALAS",
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jest.spyOn(proballersGateway as any, "getIntermediateDtoList").mockResolvedValue(mockIntermediateDtoList);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jest.spyOn(proballersGateway as any, "getPlayerSeasonDetails").mockResolvedValue(mockPlayerSeasonDetails);

      const result = await proballersGateway.getClubHistoricRoster("PAR");
      expect(result).toEqual({
        playerDtoList: [mockPlayerSeasonDetails.player],
        playerSeasonDtoList: mockPlayerSeasonDetails.playerSeasons,
      });
    });
  });
});
