import { CreateEntrepriseDto, EntrepriseDto } from "@/types";
import { EntrepriseMapper } from "@/mappers/entreprise.mapper";
import { prisma } from "@/config/orm/prisma";

type EntrepriseRecord = {
  id: number;
  nom: string;
  secteur: string;
};

export class EntrepriseRepository {
  static async create(data: CreateEntrepriseDto): Promise<EntrepriseDto> {
    const record: EntrepriseRecord = await prisma.entreprise.create({
      data: {
        nom: data.nom,
        secteur: data.secteur,
      },
    });

    return EntrepriseMapper.toDto(record);
  }

  static async findAll(): Promise<EntrepriseDto[]> {
    const records: EntrepriseRecord[] = await prisma.entreprise.findMany();
    return EntrepriseMapper.toDtoList(records);
  }

  static async findById(id: number): Promise<EntrepriseDto | null> {
    const record: EntrepriseRecord | null = await prisma.entreprise.findUnique({
      where: { id },
    });

    if (!record) {
      return null;
    }

    return EntrepriseMapper.toDto(record);
  }
}
