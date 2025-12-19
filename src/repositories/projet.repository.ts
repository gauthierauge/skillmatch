import { CreateProjetDto, ProjetWithSkills } from "@/types";
import { ProjetMapper } from "@/mappers/projet.mapper";
import { prisma } from "@/config/orm/prisma";

type ProjetRecord = {
  id: number;
  titre: string;
  description: string;
  skillsRequis: string;
  budgetMaxTjm: number;
  entrepriseId: number;
  freelanceId: number | null;
};

export class ProjetRepository {
  static async create(entrepriseId: number, data: CreateProjetDto): Promise<ProjetWithSkills> {
    const record: ProjetRecord = await prisma.projet.create({
      data: {
        titre: data.titre,
        description: data.description,
        skillsRequis: ProjetMapper.skillsToJson(data.skillsRequis),
        budgetMaxTjm: data.budgetMaxTjm,
        entrepriseId: entrepriseId,
      },
    });

    return ProjetMapper.toDto(record);
  }

  static async findAvailable(): Promise<ProjetWithSkills[]> {
    const records: ProjetRecord[] = await prisma.projet.findMany({
      where: {
        freelanceId: null,
      },
    });

    return ProjetMapper.toDtoList(records);
  }

  static async findByEntrepriseId(entrepriseId: number): Promise<ProjetWithSkills[]> {
    const records: ProjetRecord[] = await prisma.projet.findMany({
      where: {
        entrepriseId: entrepriseId,
      },
    });

    return ProjetMapper.toDtoList(records);
  }

  static async findByIdAndEntreprise(projetId: number, entrepriseId: number): Promise<ProjetWithSkills | null> {
    const record: ProjetRecord | null = await prisma.projet.findFirst({
      where: {
        id: projetId,
        entrepriseId: entrepriseId,
      },
    });

    if (!record) {
      return null;
    }

    return ProjetMapper.toDto(record);
  }

  static async findById(id: number): Promise<ProjetWithSkills | null> {
    const record: ProjetRecord | null = await prisma.projet.findUnique({
      where: { id },
    });

    if (!record) {
      return null;
    }

    return ProjetMapper.toDto(record);
  }

  static async assignFreelance(projetId: number, freelanceId: number): Promise<ProjetWithSkills> {
    const record: ProjetRecord = await prisma.projet.update({
      where: { id: projetId },
      data: {
        freelanceId: freelanceId,
      },
    });

    return ProjetMapper.toDto(record);
  }
}
