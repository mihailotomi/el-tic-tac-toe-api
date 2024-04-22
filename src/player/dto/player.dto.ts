import { Player } from "../models/player";
import { Expose } from "class-transformer";

export class PlayerDto extends Player {
  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
