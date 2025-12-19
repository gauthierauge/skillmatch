import {
  CreateEntrepriseDto,
  EntrepriseDto,
  CreateProjetForEntrepriseProps,
  GetEntrepriseByIdProps,
  GetProjetsByEntrepriseProps,
  GetCandidatsCompatiblesProps,
  ProjetWithSkills,
  FreelanceWithSkills,
  FilterCompatibleFreelancesProps,
  CompatibilityCheck,
} from "@/types";
import { MatchingService } from "@/services/matching.service";
import { EntrepriseRepository } from "@/repositories/entreprise.repository";
import { ProjetRepository } from "@/repositories/projet.repository";
import { FreelanceRepository } from "@/repositories/freelance.repository";
import { ErrorMessage } from "@/enums";

export class EntreprisesService {
  static async createEntreprise(data: CreateEntrepriseDto): Promise<EntrepriseDto> {
    return EntrepriseRepository.create(data);
  }

  static async getAllEntreprises(): Promise<EntrepriseDto[]> {
    return EntrepriseRepository.findAll();
  }

  static async getEntrepriseById(props: GetEntrepriseByIdProps): Promise<EntrepriseDto | null> {
    const { id } = props;
    return EntrepriseRepository.findById(id);
  }

  static async createProjet(props: CreateProjetForEntrepriseProps): Promise<ProjetWithSkills> {
    const { entrepriseId, data } = props;

    const entreprise: EntrepriseDto | null = await this.getEntrepriseById({ id: entrepriseId });
    if (!entreprise) {
      throw new Error(ErrorMessage.ENTREPRISE_NOT_FOUND);
    }

    return ProjetRepository.create(entrepriseId, data);
  }

  static async getProjetsByEntreprise(props: GetProjetsByEntrepriseProps): Promise<ProjetWithSkills[]> {
    const { entrepriseId } = props;

    const entreprise: EntrepriseDto | null = await this.getEntrepriseById({ id: entrepriseId });
    if (!entreprise) {
      throw new Error(ErrorMessage.ENTREPRISE_NOT_FOUND);
    }

    return ProjetRepository.findByEntrepriseId(entrepriseId);
  }

  static async getCandidatsCompatibles(props: GetCandidatsCompatiblesProps): Promise<FreelanceWithSkills[]> {
    const { entrepriseId, projetId } = props;

    const projet: ProjetWithSkills | null = await ProjetRepository.findByIdAndEntreprise(projetId, entrepriseId);
    if (!projet) {
      throw new Error(ErrorMessage.PROJET_NOT_FOUND_FOR_ENTREPRISE);
    }

    const freelances: FreelanceWithSkills[] = await FreelanceRepository.findAll();

    return this.filterCompatibleFreelances({ freelances, projet });
  }

  static async getProjetsOuverts(): Promise<ProjetWithSkills[]> {
    return ProjetRepository.findAvailable();
  }

  private static filterCompatibleFreelances(props: FilterCompatibleFreelancesProps): FreelanceWithSkills[] {
    const { freelances, projet } = props;

    return freelances.filter((freelance: FreelanceWithSkills): boolean => {
      const check: CompatibilityCheck = MatchingService.checkCompatibility({
        freelanceSkills: freelance.skills,
        freelanceTjm: freelance.tjm,
        skillsRequis: projet.skillsRequis,
        budgetMaxTjm: projet.budgetMaxTjm,
        freelanceIdInProjet: projet.freelanceId,
      });
      return check.compatible;
    });
  }
}
