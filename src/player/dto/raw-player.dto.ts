import { OmitType } from "@nestjs/swagger";
import { Player } from "../models/player";

export class RawPlayerDto extends OmitType(Player, ["fullName"] as const) {}
