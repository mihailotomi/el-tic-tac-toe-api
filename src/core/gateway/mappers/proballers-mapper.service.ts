import { Injectable } from "@nestjs/common";
import { Player } from "src/player/models/player";
import cheerio from "cheerio";
import { ProballersPlayerIntermediateDto } from "../dto/proballers-player-intermediate.dto";
import { CreatePlayerSeasonDto } from "src/player/dto/create-player-season.dto";

@Injectable()
export class ProballersMapperService {
  playerListRawToIntermediateDto = (html: string): ProballersPlayerIntermediateDto[] => {
    const $ = cheerio.load(html);
    // Find list of players in the DOM
    const playerList = $("html body").find("div.home-team__content table tbody");
    const intermediateDtoList: ProballersPlayerIntermediateDto[] = [];

    playerList.children().each((_index, playerRow) => {
      // URL of the player data
      const playerUrl = $(playerRow).find(".list-player-entry").attr("href").trim();

      // Last column in players table is the link to player profile
      $(playerRow)
        .children()
        .last()
        .first()
        .children()
        .each((_index, seasonEl) => {
          const season = this.getSeasonStartYear($(seasonEl).text());
          if (season) {
            intermediateDtoList.push({ season, playerUrl });
          }
        });
    });

    return intermediateDtoList;
  };

  playerDataToCreateDto = (html: string): any => {
    const $ = cheerio.load(html);
    const playerNameContainer = $("html body").find(".identity__name");
    const playerProfileContainer = $("html body").find(".identity__profil");
  };

  private getSeasonStartYear = (seasonString: string): number | null => {
    const parts = seasonString.split("-");

    if (parts.length === 2) {
      const startYear = parseInt(parts[0], 10);

      if (!isNaN(startYear)) {
        return startYear;
      }
    }

    return null;
  };
}
