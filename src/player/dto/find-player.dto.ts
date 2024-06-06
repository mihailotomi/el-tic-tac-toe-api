import { Player } from "../models/player";

type FindPlayerById = {
  kind: "id";
  id: number;
};

type FindPlayerByUniqueConstraint = { kind: "constraint" } & Pick<Player, "firstName" | "lastName" | "birthDate">;

export type FindPlayerDto = FindPlayerById | FindPlayerByUniqueConstraint;

export function isFindPlayerById(dto: FindPlayerDto): dto is FindPlayerById {
  return dto.kind === "id";
}

export function isFindPlayerByUniqueConstraint(dto: FindPlayerDto): dto is FindPlayerByUniqueConstraint {
  return dto.kind === "constraint";
}
