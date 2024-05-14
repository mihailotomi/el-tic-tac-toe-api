import { Injectable } from "@nestjs/common";
import { Player } from "src/player/models/player";
import cheerio from "cheerio";
import { ProballersPlayerIntermediateDto } from "../dto/proballers-player-intermediate.dto";
import { CreatePlayerSeasonDto } from "src/player/dto/create-player-season.dto";

@Injectable()
export class ProballersMapperService {
  playerListRawToIntermediateDto = (html: string): ProballersPlayerIntermediateDto[] => {
    const $ = cheerio.load(html);
    const playerListEl = $("html body").find("div.home-team__content table tbody");

    const intermediateDtoList: ProballersPlayerIntermediateDto[] = [];

    playerListEl.children().each((_index, playerRow) => {
      // URL of the player data
      const playerUrl = $(playerRow).find(".list-player-entry").attr("href").trim();

      // Last column in players table is the link to player profile
      $(playerRow)
        .children()
        .last()
        .first()
        .children()
        .each((_index, seasonEl) => {
          // create an intermediate player season dto for each season
          const season = this.getSeasonStartYear($(seasonEl).text());
          if (season) {
            intermediateDtoList.push({ season, playerUrl });
          }
        });
    });

    return intermediateDtoList;
  };

  playerDataToCreateDto = (html: string, season: number): any => {
    const $ = cheerio.load(html);
    // Player name
    const playerNameContainer = $("html body").find(".identity__name");
    const names: string[] = [];

    playerNameContainer.contents().each((_index, element) => {
      if (element.type === "text") {
        const text = $(element).text().trim();

        if (text) {
          names.push(text);
        }
      }
    });

    // Image URL
    const imageUrl = $("html body").find(".identity__picture--player img").attr("src");

    // Birth date
    const birthDateAndAgeString = $("html body").find(".identity__profil").children().first().text();
    const birthDate = this.parseBirthdate(birthDateAndAgeString);

    // Season start and end date
    const gamesTable = $("html body").find(".table__inner .table tbody");
    const startDateString = gamesTable.children().first().find(".left.switch.hidden").children().first().text();
    const endDateString = gamesTable.children().last().find(".left.switch.hidden").children().first().text();
    const startDate = startDateString ? new Date(startDateString) : null;
    const endDate = endDateString ? new Date(endDateString) : null;

    return {
      firstName: names[0],
      lastName: names[1],
      season,
      imageUrl: imageUrl.includes("head-par-defaut") ? null : imageUrl,
      birthDate,
      startDate,
      endDate,
    };
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

  private parseBirthdate(birthDateAndAgeString: string) {
    const birthdateString =
      birthDateAndAgeString.split(" ")[0] +
      " " +
      birthDateAndAgeString.split(" ")[1] +
      ", " +
      birthDateAndAgeString.split(" ")[2];

    return new Date(birthdateString);
  }
}