import { Inject, LoggerService } from "@nestjs/common";
import { CommandRunner, Option, SubCommand } from "nest-commander";
import { EuroleagueApiGatewayProvider } from "src/core/gateway/providers/euroleague-api-gateway.provider";
import { PlayerService } from "src/player/services/player.service";
import { LOGGER } from "src/core/infrastructure/logging/injection-token";

@SubCommand({
  name: "el-api",
})
export class EuroleagueApiSeedCommand extends CommandRunner {
  constructor(
    private playerService: PlayerService,
    private euroleagueApiGateway: EuroleagueApiGatewayProvider,
    @Inject(LOGGER) private logger: LoggerService,
  ) {
    super();
  }

  async run(_inputs: string[], options: { season: number }): Promise<void> {
    const seasons = options.season ? [options.season] : Array.from({ length: 2023 - 2000 + 1 }, (_v, i) => 2023 - i);
    for (const season of seasons) {
      try {
        this.logger.log(`[Euroleague API] - Seeding players for season: ${season}`);
        const { players: createPlayerDtoList, playerSeasons: createPsDtoList } =
          // eslint-disable-next-line no-await-in-loop
          await this.euroleagueApiGateway.getPlayersForSeason(season);

        // eslint-disable-next-line no-await-in-loop
        await this.playerService.insertPlayers(createPlayerDtoList);
        // eslint-disable-next-line no-await-in-loop
        await this.playerService.insertPlayerSeasons(createPsDtoList);
        this.logger.log(`[Euroleague API] - Successfully seeded players for season: ${season}`);
      } catch (error) {
        this.logger.error(`[Euroleague API] - Error while seeding players for season: ${season}`);
        this.logger.error(error);
      }
    }
  }

  @Option({
    flags: "-s, --season <season>",
    name: "season",
    description: "Chose a season for which you want to seed players",
  })
  parseSeasonOption(option: string) {
    return parseInt(option, 10);
  }
}
