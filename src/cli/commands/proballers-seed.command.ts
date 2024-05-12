import { ConsoleLogger } from "@nestjs/common";
import { CommandRunner, SubCommand } from "nest-commander";
import { ProballersGatewayProvider } from "src/core/gateway/providers/proballers-gateway.provider";
import * as fs from "fs";

@SubCommand({
  name: "proballers",
})
export class ProballersSeedCommand extends CommandRunner {
  constructor(
    private proballersGateway: ProballersGatewayProvider,
    private logger: ConsoleLogger,
  ) {
    super();
  }

  async run(_inputs: string[], options: { season: number }): Promise<void> {
    this.logger.log(`[Proballers] - Seeding players`);
    const scrapedContent = await this.proballersGateway.getClubHistoricRoster(565, "partizan-belgrade");
    // this.logger.log(`[Euroleague API] - Successfully seeded players for season: ${options.season}`);
    await fs.promises.writeFile("player_table.json", JSON.stringify(scrapedContent));
  }
}
