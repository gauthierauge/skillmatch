export * from './dtos';

export type { FreelanceDto as FreelanceWithSkills } from './dtos/freelance.dto';
export type { ProjetDto as ProjetWithSkills } from './dtos/projet.dto';

export interface MatchingResult {
  success: boolean;
  message: string;
  projet?: ProjetDto;
}

export interface CompatibilityCheck {
  compatible: boolean;
  raison?: string;
}

import type { ProjetDto, FreelanceDto } from './dtos';

export interface CheckCompatibilityProps {
  freelanceSkills: string[];
  freelanceTjm: number;
  skillsRequis: string[];
  budgetMaxTjm: number;
  freelanceIdInProjet: number | null;
}

export interface CalculateMatchScoreProps {
  freelanceSkills: string[];
  skillsRequis: string[];
}

export interface GetAllFreelancesProps {
  skillFilter?: string;
}

export interface GetFreelanceByIdProps {
  id: number;
}

export interface GetProjetsCompatiblesProps {
  freelanceId: number;
}

export interface PostulerProjetProps {
  freelanceId: number;
  projetId: number;
}

export interface AssignFreelanceProps {
  projetId: number;
  freelanceId: number;
}

export interface FilterBySkillProps {
  freelances: FreelanceDto[];
  skillFilter: string;
}

export interface FilterCompatibleProjetsProps {
  freelance: FreelanceDto;
  projets: ProjetDto[];
}

export interface CheckProjectCompatibilityProps {
  freelance: FreelanceDto;
  projet: ProjetDto;
}

export interface GetEntrepriseByIdProps {
  id: number;
}

export interface CreateProjetForEntrepriseProps {
  entrepriseId: number;
  data: import('./dtos').CreateProjetDto;
}

export interface GetProjetsByEntrepriseProps {
  entrepriseId: number;
}

export interface GetCandidatsCompatiblesProps {
  entrepriseId: number;
  projetId: number;
}

export interface FilterCompatibleFreelancesProps {
  freelances: FreelanceDto[];
  projet: ProjetDto;
}
