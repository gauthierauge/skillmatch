export interface CreateProjetDto {
  titre: string;
  description: string;
  skillsRequis: string[];
  budgetMaxTjm: number;
}

export interface ProjetDto {
  id: number;
  titre: string;
  description: string;
  skillsRequis: string[];
  budgetMaxTjm: number;
  entrepriseId: number;
  freelanceId: number | null;
}
