import { ConsoleLogger } from "@nestjs/common";
import { CommandRunner, Option, SubCommand } from "nest-commander";
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

  async run(_inputs: string[], options: { clubUri: string; clubCode: string }): Promise<void> {
    this.logger.log(`[Proballers] - Seeding players for club: ${options.clubCode}`);
    const playersIntermediateDtoList = await this.proballersGateway.getClubHistoricRoster(
      options.clubUri,
      options.clubCode,
    );
    const playerDtoList = await Promise.all(
      playersIntermediateDtoList.map(this.proballersGateway.getPlayerSeasonDetails),
    );
    await fs.promises.writeFile("player_table.json", JSON.stringify(playerDtoList));
    this.logger.log(`[Proballers] - Finised seeding players for club: ${options.clubCode}`);
  }

  @Option({
    flags: "--club-uri <club-uri>",
    name: "clubUri",
    description: "Proballers URI of the club",
  })
  getClubUriOption(option: string) {
    return option;
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
