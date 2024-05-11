import { Command, CommandRunner } from "nest-commander";
import { EuroleagueApiSeedCommand } from "./euroleague-api-seed.command";
import { ProballersSeedCommand } from "./proballers-seed.command";

@Command({
  name: "seed-players",
  options: { isDefault: true },
  subCommands: [EuroleagueApiSeedCommand, ProballersSeedCommand],
})
export class SeedPlayersCommand extends CommandRunner {
  async run(_inputs: string[], _options: Record<string, any>): Promise<void> {}
}
