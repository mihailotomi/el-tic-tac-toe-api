import { Command, CommandRunner } from "nest-commander";
import { EuroleagueApiSeedCommand } from "./euroleague-api-seed.command";
import { ProballersSeedCommand } from "./proballers-seed.command";

@Command({
  name: "seed-players",
  options: { isDefault: true },
  subCommands: [EuroleagueApiSeedCommand, ProballersSeedCommand],
})
export class SeedPlayersCommand extends CommandRunner {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/require-await
  async run(_inputs: string[], _options: Record<string, any>): Promise<void> {
    console.log("Choose source");
  }
}
