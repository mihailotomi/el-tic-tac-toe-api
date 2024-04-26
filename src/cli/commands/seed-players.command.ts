import { Command, CommandRunner } from "nest-commander";
import { EuroleagueApiSeedCommand } from "./euroleague-api-seed.command";

@Command({
  name: "seed-players",
  options: { isDefault: true },
  subCommands: [EuroleagueApiSeedCommand],
})
export class SeedPlayersCommand extends CommandRunner {
  async run(inputs: string[], options: Record<string, any>): Promise<void> {}
}
