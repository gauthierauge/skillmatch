import {
  CreateFreelanceDto,
  FreelanceWithSkills,
  MatchingResult,
  ProjetWithSkills,
  CompatibilityCheck,
  GetAllFreelancesProps,
  GetFreelanceByIdProps,
  GetProjetsCompatiblesProps,
  PostulerProjetProps,
  FilterBySkillProps,
  FilterCompatibleProjetsProps,
  CheckProjectCompatibilityProps
} from "@/types";
import { MatchingService } from "@/services/matching.service";
import { FreelanceRepository } from "@/repositories/freelance.repository";
import { ProjetRepository } from "@/repositories/projet.repository";
import { ErrorMessage } from "@/enums";

export class FreelancesService {
  static async createFreelance(data: CreateFreelanceDto): Promise<FreelanceWithSkills> {
    return FreelanceRepository.create(data);
  }

  static async getAllFreelances(props: GetAllFreelancesProps): Promise<FreelanceWithSkills[]> {
    const { skillFilter } = props;
    const freelances: FreelanceWithSkills[] = await FreelanceRepository.findAll();

    if (!skillFilter) {
      return freelances;
    }

    return this.filterBySkill({ freelances, skillFilter });
  }

  static async getFreelanceById(props: GetFreelanceByIdProps): Promise<FreelanceWithSkills | null> {
    const { id } = props;
    return FreelanceRepository.findById(id);
  }

  static async getProjetsCompatibles(props: GetProjetsCompatiblesProps): Promise<ProjetWithSkills[]> {
    const { freelanceId } = props;
    const freelance: FreelanceWithSkills | null = await this.getFreelanceById({ id: freelanceId });
    if (!freelance) {
      throw new Error(ErrorMessage.FREELANCE_NOT_FOUND);
    }

    const projetsDisponibles: ProjetWithSkills[] = await ProjetRepository.findAvailable();

    return this.filterCompatibleProjets({ freelance, projets: projetsDisponibles });
  }

  static async postulerProjet(props: PostulerProjetProps): Promise<MatchingResult> {
    const { freelanceId, projetId } = props;
    const freelance: FreelanceWithSkills | null = await this.getFreelanceById({ id: freelanceId });
    if (!freelance) {
      return {
        success: false,
        message: ErrorMessage.FREELANCE_NOT_FOUND,
      };
    }

    const projet: ProjetWithSkills | null = await ProjetRepository.findById(projetId);
    if (!projet) {
      return {
        success: false,
        message: ErrorMessage.PROJET_NOT_FOUND,
      };
    }

    const compatibilityCheck: CompatibilityCheck = this.checkProjectCompatibility({ freelance, projet });

    if (!compatibilityCheck.compatible) {
      return {
        success: false,
        message: `${ErrorMessage.APPLICATION_REJECTED}: ${compatibilityCheck.raison}`,
      };
    }

    const updatedProjet: ProjetWithSkills = await ProjetRepository.assignFreelance(projetId, freelanceId);

    return {
      success: true,
      message: ErrorMessage.APPLICATION_ACCEPTED,
      projet: updatedProjet,
    };
  }

  private static filterBySkill(props: FilterBySkillProps): FreelanceWithSkills[] {
    const { freelances, skillFilter } = props;
    const filterLower: string = skillFilter.toLowerCase();
    return freelances.filter((freelance: FreelanceWithSkills): boolean =>
      freelance.skills.some((skill: string): boolean => skill.toLowerCase() === filterLower)
    );
  }

  private static filterCompatibleProjets(props: FilterCompatibleProjetsProps): ProjetWithSkills[] {
    const { freelance, projets } = props;
    return projets.filter((projet: ProjetWithSkills): boolean => {
      const check: CompatibilityCheck = this.checkProjectCompatibility({ freelance, projet });
      return check.compatible;
    });
  }

  private static checkProjectCompatibility(props: CheckProjectCompatibilityProps): CompatibilityCheck {
    const { freelance, projet } = props;
    return MatchingService.checkCompatibility({
      freelanceSkills: freelance.skills,
      freelanceTjm: freelance.tjm,
      skillsRequis: projet.skillsRequis,
      budgetMaxTjm: projet.budgetMaxTjm,
      freelanceIdInProjet: projet.freelanceId
    });
  }
}
