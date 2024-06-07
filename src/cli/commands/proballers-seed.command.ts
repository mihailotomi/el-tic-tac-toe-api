import { Inject, LoggerService } from "@nestjs/common";
import { CommandRunner, Option, SubCommand } from "nest-commander";
import { ProballersGatewayProvider } from "src/core/gateway/providers/proballers-gateway.provider";
import { LOGGER } from "src/core/infrastructure/logging/injection-token";
import { PlayerService } from "src/player/services/player.service";

import clubUris from "../../core/gateway/data/club-uris.json";

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

  async run(_inputs: string[], options?: { clubCode?: string }): Promise<void> {
    const clubCodes = options.clubCode ? [options.clubCode] : Object.keys(clubUris);

    for (let clubCode of clubCodes) {
      this.logger.log(`[Proballers] - Seeding players for club: ${clubCode}`);
      try {
        const { playerDtoList, playerSeasonDtoList } = await this.proballersGateway.getClubHistoricRoster(clubCode);

        await this.playerService.upsertPlayers(playerDtoList);
        await this.playerService.insertPlayerSeasons(playerSeasonDtoList);
        this.logger.log(`[Proballers] - Finised seeding players for club: ${clubCode}`);
      } catch (error) {
        this.logger.error(`[Proballers] - Error while seeding players for club: ${clubCode}`);
        this.logger.error(error);
      }
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
