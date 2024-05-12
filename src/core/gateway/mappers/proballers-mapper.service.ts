import { Injectable } from "@nestjs/common";
import { Player } from "src/player/models/player";
import cheerio from "cheerio";
import { ProballersPlayerIntermediateDto } from "../dto/proballers-player-intermediate.dto";

@Injectable()
export class ProballersMapperService {
  playersRawToIntermediate = (html: string): ProballersPlayerIntermediateDto[] => {
    const $ = cheerio.load(html);
    const playersTable = $("html body").find("div.home-team__content table tbody");
    const intermediateDtoList: ProballersPlayerIntermediateDto[] = [];

    playersTable.children().each((_index, playerRow) => {
      const playerUrl = $(playerRow).find(".list-player-entry").attr("href").trim();

      const seasons: string[] = [];
      $(playerRow)
        .children()
        .last()
        .first()
        .children()
        .each((_index, seasonEl) => {
          seasons.push($(seasonEl).text());
        });
      intermediateDtoList.push({ playerUrl, seasons });
    });

    return intermediateDtoList;
  };
}
