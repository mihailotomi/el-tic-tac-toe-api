import { Expose } from "class-transformer";
import { Player } from "../entities/player";

export class PlayerDto extends Player {
  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
