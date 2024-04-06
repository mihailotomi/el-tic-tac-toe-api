import { Column, Model, Unique } from 'sequelize-typescript';

export class Player extends Model {
  @Column
  name: string;

  @Column
  birthDate: Date;

  @Column
  country: string;

  @Column
  @Unique
  externalId: number;
}
