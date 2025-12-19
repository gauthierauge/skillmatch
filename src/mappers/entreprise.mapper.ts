import { EntrepriseDto } from "@/types";

type EntrepriseRecord = {
  id: number;
  nom: string;
  secteur: string;
};

export class EntrepriseMapper {
  static toDto(record: EntrepriseRecord): EntrepriseDto {
    return {
      ...record,
    };
  }

  static toDtoList(records: EntrepriseRecord[]): EntrepriseDto[] {
    return records.map((record: EntrepriseRecord): EntrepriseDto => this.toDto(record));
  }
}
