import { Expose } from "class-transformer";
import { Player } from "../models/player";

export class PlayerDto extends Player {
  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
