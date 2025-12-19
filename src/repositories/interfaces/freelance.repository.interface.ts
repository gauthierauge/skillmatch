import { CreateFreelanceDto, FreelanceWithSkills } from "@/types";

export interface IFreelanceRepository {
  create(data: CreateFreelanceDto): Promise<FreelanceWithSkills>;
  findAll(): Promise<FreelanceWithSkills[]>;
  findById(id: number): Promise<FreelanceWithSkills | null>;
}
