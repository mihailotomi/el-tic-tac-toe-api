import { Injectable } from "@nestjs/common";

/**
 * A map of common nationalities with their respective country codes
 */
const commonNationalityMap: { [nationality: string]: string } = {
  AMERICAN: "USA",
  SERBIAN: "SRB",
  SPANISH: "ESP",
  TURKISH: "TUR",
  FRENCH: "FRA",
  RUSSIAN: "RUS",
  LITHUANIAN: "LTU",
  CROATIAN: "CRO",
  GREEK: "GRE",
  ITALIAN: "ITA",
  GERMAN: "GER",
};

@Injectable()
export class NationalityMapperService {
  /**
   * Map nationality string to country code
   * @param nationality - player nationality string (eg. Serbian, American...)
   * @returns {string | null} - 3 letter country code in ISO 3166 format
   */
  nationalityToCountryISO(nationality: string): string | null {
    const countryCode = commonNationalityMap[nationality.toUpperCase()];
    return countryCode || null;
  }
}
