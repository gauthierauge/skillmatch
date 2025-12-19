import { CreateProjetDto, ProjetWithSkills } from "@/types";

export interface IProjetRepository {
  create(entrepriseId: number, data: CreateProjetDto): Promise<ProjetWithSkills>;
  findById(id: number): Promise<ProjetWithSkills | null>;
  findByEntrepriseId(entrepriseId: number): Promise<ProjetWithSkills[]>;
  findByIdAndEntreprise(projetId: number, entrepriseId: number): Promise<ProjetWithSkills | null>;
  findAvailable(): Promise<ProjetWithSkills[]>;
  assignFreelance(projetId: number, freelanceId: number): Promise<ProjetWithSkills>;
}
