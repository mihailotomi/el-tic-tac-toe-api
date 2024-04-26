import { ConsoleLogger } from "@nestjs/common";
import { CommandRunner, Option, SubCommand } from "nest-commander";
import { PlayerService } from "src/player/services/player.service";

@SubCommand({
  name: "el-api",
  options: { isDefault: true },
})
export class EuroleagueApiSeedCommand extends CommandRunner {
  constructor(
    private playerService: PlayerService,
    private logger: ConsoleLogger,
  ) {
    super();
  }

  async run(_inputs: string[], options: { season: number }): Promise<void> {
    this.logger.log(`[Euroleague API] - Seeding players for season: ${options.season}`);
    await this.playerService.populatePlayersForSeason(options.season);
    this.logger.log(`[Euroleague API] - Successfully seeded players for season: ${options.season}`);
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
