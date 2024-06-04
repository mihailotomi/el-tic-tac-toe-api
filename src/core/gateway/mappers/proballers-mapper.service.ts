import { Injectable } from "@nestjs/common";
import cheerio from "cheerio";
import { CreatePlayerSeasonDto } from "src/player/dto/create-player-season.dto";
import { ProballersPlayerIntermediateDto } from "../dto/proballers-player-intermediate.dto";
import { NationalityMapperService } from "./nationality-mapper.service";
import { CreatePlayerDto } from "src/player/dto/create-player.dto";
import { playerSeasons } from "src/core/database/schema/schema";

@Injectable()
export class ProballersMapperService {
  constructor(private nationalityMapper: NationalityMapperService) {}

  /**
   * Parse club players list into list of seasons paired with player page urls
   * @param {string} html - HTML page containing list of club players
   * @param {string} clubCode - code of the club
   * @returns {ProballersPlayerIntermediateDto[]} - array of intermediate dtos for parsing
   */
  playerListRawToIntermediateDto = (html: string, clubCode: string): ProballersPlayerIntermediateDto[] => {
    const $ = cheerio.load(html);
    const playerListEl = $("html body").find("div.home-team__content table tbody");

    const intermediateDtoList: ProballersPlayerIntermediateDto[] = [];

    playerListEl.children().each((_index, playerRow) => {
      // URL of the player data
      const playerUrl = $(playerRow).find(".list-player-entry").attr("href").trim();

      const seasonList: number[] = [];
      // Last column in players table is the link to player profile
      $(playerRow)
        .children()
        .last()
        .first()
        .children()
        .each((_i, seasonEl) => {
          const season = this.getSeasonStartYear($(seasonEl).text());
          if (season) {
            seasonList.push(season);
          }
        });

      intermediateDtoList.push({ seasons: seasonList, playerUrl, clubCode });
    });

    return intermediateDtoList;
  };

  /**
   * Parse player profile page into player seasons
   * @param {string} html - HTML page containing player data with all of his seasons
   * @param {number[]} seasons
   * @param {string} clubCode - code of the club
   * @returns {CreatePlayerSeasonDto[]} - entrypoint dto list for storing player seasons
   */
  playerDataToCreateDto = (
    html: string,
    seasons: number[],
    clubCode: string,
  ): { player: CreatePlayerDto; playerSeasons: CreatePlayerSeasonDto[] } => {
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
    const birthDateAndAgeEl = $("html body").find(".identity__profil").children().first();
    const birthDate = this.parseBirthdate(birthDateAndAgeEl.text());

    // Country
    birthDateAndAgeEl.remove();
    const nationality = $("html body").find(".identity__profil").children().first().text();
    const country = this.nationalityMapper.nationalityToCountryISO(nationality);

    const player = {
      firstName: names[0].toUpperCase(),
      lastName: names[1].toUpperCase(),
      imageUrl: imageUrl.includes("head-par-defaut") ? null : imageUrl,
      birthDate,
      country,
    };

    return {
      player,
      playerSeasons:
        seasons &&
        seasons.map((season) => ({
          player: {
            firstName: names[0],
            lastName: names[1],
            imageUrl: imageUrl.includes("head-par-defaut") ? null : imageUrl,
            birthDate,
            country,
          },
          playerSeason: {
            season: 2023,
            startDate: this.assumeSeasonStart(season),
            endDate: this.assumeSeasonEnd(season),
            clubCode,
          },
        })),
    };
  };

  /**
   * get season number for storing from season string (eg. 2022/2023)
   * @param {string} seasonString - season string with start and end year
   * @returns {number | null} - nullable season number
   */
  private getSeasonStartYear = (seasonString: string): number | null => {
    const parts = seasonString.split("-");

    if (parts.length === 2) {
      const startYear = parseInt(parts[0], 10);

      if (!Number.isNaN(startYear)) {
        return startYear;
      }
    }

    return null;
  };

  /**
   * parse player birthdate from Proballers age string (eg. APR 22, 1991 (33 YEARS OLD))
   * @param {string} birthDateAndAgeString - string containing the birth date and the age
   * @returns {string} - birth date
   */
  private parseBirthdate(birthDateAndAgeString: string): string {
    const unformatedDate = `${birthDateAndAgeString.split(" ")[0]} ${birthDateAndAgeString.split(" ")[1]}, ${
      birthDateAndAgeString.split(" ")[2]
    }`;

    const months: { [key: string]: number } = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };

    const parts = unformatedDate.split(" ");

    const day = parseInt(parts[1].replace(",", ""), 10);
    const month = months[parts[0]];
    const year = parseInt(parts[2], 10);

    const date = new Date(year, month, day);

    const formattedDate = `${date.getFullYear()}-${this.padZero(date.getMonth() + 1)}-${this.padZero(date.getDate())}`;

    return formattedDate;
  }

  /**
   * Get the assumed start date for a season (Sep 30)
   * @param season
   */
  private assumeSeasonStart(season: number): string {
    return `09/30/${season}`;
  }

  /**
   * Get the assumed end date for a season (June 30)
   * @param season
   */
  private assumeSeasonEnd(season: number): string {
    return `06/30/${season + 1}`;
  }

  private padZero(num: number): string {
    return num < 10 ? "0" + num : num.toString();
  }
}
