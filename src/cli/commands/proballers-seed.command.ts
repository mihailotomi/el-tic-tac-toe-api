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
    this.logger.log(`[Proballers] - Seeding players for club`);
    const playersIntermediateDtoList = await this.proballersGateway.getClubHistoricRoster(565, "partizan-belgrade");
    const playerDtoList = await Promise.all(playersIntermediateDtoList.map(this.proballersGateway.getPlayerSeasonDetails))
    await fs.promises.writeFile("player_table.json", JSON.stringify(playerDtoList));
    this.logger.log(`[Proballers] - Finised seeding players for club`);
    
    return
  }
}
