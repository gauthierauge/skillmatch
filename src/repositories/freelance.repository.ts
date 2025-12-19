import { CreateFreelanceDto, FreelanceWithSkills } from "@/types";
import { FreelanceMapper } from "@/mappers/freelance.mapper";
import { prisma } from "@/config/orm/prisma";

type FreelanceRecord = {
  id: number;
  nom: string;
  email: string;
  skills: string;
  tjm: number;
};

export class FreelanceRepository {
  static async create(data: CreateFreelanceDto): Promise<FreelanceWithSkills> {
    const record: FreelanceRecord = await prisma.freelance.create({
      data: {
        nom: data.nom,
        email: data.email,
        skills: FreelanceMapper.skillsToJson(data.skills),
        tjm: data.tjm,
      },
    });

    return FreelanceMapper.toDto(record);
  }

  static async findAll(): Promise<FreelanceWithSkills[]> {
    const records: FreelanceRecord[] = await prisma.freelance.findMany();
    return FreelanceMapper.toDtoList(records);
  }

  static async findById(id: number): Promise<FreelanceWithSkills | null> {
    const record: FreelanceRecord | null = await prisma.freelance.findUnique({
      where: { id },
    });

    if (!record) {
      return null;
    }

    return FreelanceMapper.toDto(record);
  }
}
