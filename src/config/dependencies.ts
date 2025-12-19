import { AppDependencies } from "@/types/dependencies";
import { FreelancesService } from "@/services/freelances.service";
import { EntreprisesService } from "@/services/entreprises.service";
import { MatchingService } from "@/services/matching.service";
import { FreelanceRepository } from "@/repositories/freelance.repository";
import { EntrepriseRepository } from "@/repositories/entreprise.repository";
import { ProjetRepository } from "@/repositories/projet.repository";

export function createDependencies(): AppDependencies {
  return {
    services: {
      freelancesService: FreelancesService,
      entreprisesService: EntreprisesService,
      matchingService: MatchingService,
    },
    repositories: {
      freelanceRepository: FreelanceRepository,
      entrepriseRepository: EntrepriseRepository,
      projetRepository: ProjetRepository,
    },
  };
}
