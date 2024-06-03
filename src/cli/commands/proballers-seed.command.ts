import { ConsoleLogger, Inject, LoggerService } from "@nestjs/common";
import { CommandRunner, Option, SubCommand } from "nest-commander";
import { ProballersGatewayProvider } from "src/core/gateway/providers/proballers-gateway.provider";
import { LOGGER } from "src/core/infrastructure/logging/injection-token";
import { PlayerService } from "src/player/services/player.service";

@SubCommand({
  name: "proballers",
})
export class ProballersSeedCommand extends CommandRunner {
  constructor(
    private playerService: PlayerService,
    private proballersGateway: ProballersGatewayProvider,
    @Inject(LOGGER) private logger: LoggerService,
  ) {
    super();
  }

  async run(_inputs: string[], options: { clubCode: string }): Promise<void> {
    this.logger.log(`[Proballers] - Seeding players for club: ${options.clubCode}`);

    try {
      const { playerDtoList, playerSeasonDtoList } = await this.proballersGateway.getClubHistoricRoster(
        options.clubCode,
      );

      await this.playerService.upsertPlayers(playerDtoList);
      await this.playerService.upsertPlayerSeasons(playerSeasonDtoList);
      this.logger.log(`[Proballers] - Finised seeding players for club: ${options.clubCode}`);
    } catch (error) {
      this.logger.error(`[Proballers] - Error while seeding players for club: ${options.clubCode}`);
      this.logger.error(error);
    }
  }

  @Option({
    flags: "--club-code <club-code>",
    name: "clubCode",
    description: "Club code of the club",
  })
  getClubCodeOption(option: string) {
    return option;
  }
}
