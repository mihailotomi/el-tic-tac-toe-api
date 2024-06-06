type FindClubById = {
  kind: "id";
  id: number;
};

type FindClubByCode = { kind: "code"; code: string };

export type FindClubDto = FindClubById | FindClubByCode;

export function isFindClubById(dto: FindClubDto): dto is FindClubById {
  return dto.kind === "id";
}

export function isFindClubByCode(dto: FindClubDto): dto is FindClubByCode {
  return dto.kind === "code";
}
