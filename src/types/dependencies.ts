import { FreelancesService } from "@/services/freelances.service";
import { EntreprisesService } from "@/services/entreprises.service";
import { MatchingService } from "@/services/matching.service";
import { FreelanceRepository } from "@/repositories/freelance.repository";
import { ProjetRepository } from "@/repositories/projet.repository";
import { EntrepriseRepository } from "@/repositories/entreprise.repository";

export interface ServiceDependencies {
  freelancesService: typeof FreelancesService;
  entreprisesService: typeof EntreprisesService;
  matchingService: typeof MatchingService;
}

export interface RepositoryDependencies {
  freelanceRepository: typeof FreelanceRepository;
  entrepriseRepository: typeof EntrepriseRepository;
  projetRepository: typeof ProjetRepository;
}

export interface AppDependencies {
  services: ServiceDependencies;
  repositories: RepositoryDependencies;
}
