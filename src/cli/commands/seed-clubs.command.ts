import { Command, CommandRunner } from "nest-commander";
import { ClubService } from "src/club/services/club.service";
import { EuroleagueApiGatewayProvider } from "src/core/gateway/providers/euroleague-api-gateway.provider";
import { ConsoleLogger } from "@nestjs/common";

@Command({
  name: "seed-clubs",
  options: { isDefault: false },
})
export class SeedClubsCommand extends CommandRunner {
  constructor(
    private clubService: ClubService,
    private euroleagueGateway: EuroleagueApiGatewayProvider,
    private logger: ConsoleLogger,
  ) {
    super();
  }

  async run(_inputs: string[], _options: {}): Promise<void> {
    for (let year = 2023; year >= 2000; year--) {
      this.logger.log(`[Euroleague API] - Seeding clubs for season: ${year}`);
      // NOTE: we don't want to run this in parallel, because we want the latest club names and crests
      // eslint-disable-next-line no-await-in-loop
      const seasonClubDtoList = await this.euroleagueGateway.getClubsForSeason(year);

      // eslint-disable-next-line no-await-in-loop
      await this.clubService.insertClubs(seasonClubDtoList);

      this.logger.log(`[Euroleague API] - Finished seeding clubs for season: ${year}`);
    }
  }
}
