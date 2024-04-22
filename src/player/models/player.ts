import { Expose } from "class-transformer";

export class Player {
  id: number;

  firstName: string;

  lastName: string;

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  birthDate: Date;

  country: string;

  imageUrl: string;

  createdAt: Date;

  updatedAt: Date;
}
