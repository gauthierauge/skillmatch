import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EntreprisesService } from '../../src/services/entreprises.service';
import { EntrepriseRepository } from '../../src/repositories/entreprise.repository';
import { ProjetRepository } from '../../src/repositories/projet.repository';
import { FreelanceRepository } from '../../src/repositories/freelance.repository';
import {
  CreateEntrepriseDto,
  EntrepriseDto,
  CreateProjetDto,
  ProjetWithSkills,
  FreelanceWithSkills,
} from '../../src/types';

vi.mock('../../src/repositories/entreprise.repository');
vi.mock('../../src/repositories/projet.repository');
vi.mock('../../src/repositories/freelance.repository');

describe('EntreprisesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createEntreprise', () => {
    it('should create an entreprise successfully', async () => {
      const input: CreateEntrepriseDto = {
        nom: 'TechCorp',
        secteur: 'Technologie',
      };

      const expected: EntrepriseDto = {
        id: 1,
        nom: 'TechCorp',
        secteur: 'Technologie',
      };

      vi.mocked(EntrepriseRepository.create).mockResolvedValue(expected);

      const result = await EntreprisesService.createEntreprise(input);

      expect(result).toEqual(expected);
      expect(EntrepriseRepository.create).toHaveBeenCalledWith(input);
    });
  });

  describe('getAllEntreprises', () => {
    it('should return all entreprises', async () => {
      const expected: EntrepriseDto[] = [
        { id: 1, nom: 'TechCorp', secteur: 'Technologie' },
        { id: 2, nom: 'InnovateCo', secteur: 'Innovation' },
      ];

      vi.mocked(EntrepriseRepository.findAll).mockResolvedValue(expected);

      const result = await EntreprisesService.getAllEntreprises();

      expect(result).toEqual(expected);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no entreprises', async () => {
      vi.mocked(EntrepriseRepository.findAll).mockResolvedValue([]);

      const result = await EntreprisesService.getAllEntreprises();

      expect(result).toHaveLength(0);
    });
  });

  describe('getEntrepriseById', () => {
    it('should return an entreprise when found', async () => {
      const expected: EntrepriseDto = {
        id: 1,
        nom: 'TechCorp',
        secteur: 'Technologie',
      };

      vi.mocked(EntrepriseRepository.findById).mockResolvedValue(expected);

      const result = await EntreprisesService.getEntrepriseById({ id: 1 });

      expect(result).toEqual(expected);
      expect(EntrepriseRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should return null when entreprise not found', async () => {
      vi.mocked(EntrepriseRepository.findById).mockResolvedValue(null);

      const result = await EntreprisesService.getEntrepriseById({ id: 999 });

      expect(result).toBeNull();
    });
  });

  describe('createProjet', () => {
    const mockEntreprise: EntrepriseDto = {
      id: 1,
      nom: 'TechCorp',
      secteur: 'Technologie',
    };

    const projetData: CreateProjetDto = {
      titre: 'Projet React',
      description: 'Application React',
      skillsRequis: ['JavaScript', 'React'],
      budgetMaxTjm: 500,
    };

    it('should create a project successfully', async () => {
      const expected: ProjetWithSkills = {
        id: 1,
        titre: 'Projet React',
        description: 'Application React',
        skillsRequis: ['JavaScript', 'React'],
        budgetMaxTjm: 500,
        entrepriseId: 1,
        freelanceId: null,
      };

      vi.mocked(EntrepriseRepository.findById).mockResolvedValue(mockEntreprise);
      vi.mocked(ProjetRepository.create).mockResolvedValue(expected);

      const result = await EntreprisesService.createProjet({
        entrepriseId: 1,
        data: projetData,
      });

      expect(result).toEqual(expected);
      expect(ProjetRepository.create).toHaveBeenCalledWith(1, projetData);
    });

    it('should throw error when entreprise not found', async () => {
      vi.mocked(EntrepriseRepository.findById).mockResolvedValue(null);

      await expect(
        EntreprisesService.createProjet({ entrepriseId: 999, data: projetData })
      ).rejects.toThrow('Entreprise introuvable');

      expect(ProjetRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('getProjetsByEntreprise', () => {
    const mockEntreprise: EntrepriseDto = {
      id: 1,
      nom: 'TechCorp',
      secteur: 'Technologie',
    };

    const mockProjets: ProjetWithSkills[] = [
      {
        id: 1,
        titre: 'Projet React',
        description: 'App React',
        skillsRequis: ['JavaScript', 'React'],
        budgetMaxTjm: 500,
        entrepriseId: 1,
        freelanceId: null,
      },
      {
        id: 2,
        titre: 'Projet Python',
        description: 'App Python',
        skillsRequis: ['Python', 'Django'],
        budgetMaxTjm: 600,
        entrepriseId: 1,
        freelanceId: 1,
      },
    ];

    it('should return all projects for an entreprise', async () => {
      vi.mocked(EntrepriseRepository.findById).mockResolvedValue(mockEntreprise);
      vi.mocked(ProjetRepository.findByEntrepriseId).mockResolvedValue(mockProjets);

      const result = await EntreprisesService.getProjetsByEntreprise({ entrepriseId: 1 });

      expect(result).toEqual(mockProjets);
      expect(result).toHaveLength(2);
      expect(ProjetRepository.findByEntrepriseId).toHaveBeenCalledWith(1);
    });

    it('should throw error when entreprise not found', async () => {
      vi.mocked(EntrepriseRepository.findById).mockResolvedValue(null);

      await expect(
        EntreprisesService.getProjetsByEntreprise({ entrepriseId: 999 })
      ).rejects.toThrow('Entreprise introuvable');
    });

    it('should return empty array when entreprise has no projects', async () => {
      vi.mocked(EntrepriseRepository.findById).mockResolvedValue(mockEntreprise);
      vi.mocked(ProjetRepository.findByEntrepriseId).mockResolvedValue([]);

      const result = await EntreprisesService.getProjetsByEntreprise({ entrepriseId: 1 });

      expect(result).toHaveLength(0);
    });
  });

  describe('getCandidatsCompatibles', () => {
    const mockProjet: ProjetWithSkills = {
      id: 1,
      titre: 'Projet React',
      description: 'App React',
      skillsRequis: ['JavaScript', 'React'],
      budgetMaxTjm: 500,
      entrepriseId: 1,
      freelanceId: null,
    };

    const mockFreelances: FreelanceWithSkills[] = [
      {
        id: 1,
        nom: 'Alice Dupont',
        email: 'alice@example.com',
        skills: ['JavaScript', 'React', 'Node.js'],
        tjm: 450,
      },
      {
        id: 2,
        nom: 'Bob Martin',
        email: 'bob@example.com',
        skills: ['Python', 'Django'],
        tjm: 500,
      },
      {
        id: 3,
        nom: 'Charlie Bernard',
        email: 'charlie@example.com',
        skills: ['JavaScript', 'React'],
        tjm: 550,
      },
    ];

    it('should return compatible candidates for a project', async () => {
      vi.mocked(ProjetRepository.findByIdAndEntreprise).mockResolvedValue(mockProjet);
      vi.mocked(FreelanceRepository.findAll).mockResolvedValue(mockFreelances);

      const result = await EntreprisesService.getCandidatsCompatibles({
        entrepriseId: 1,
        projetId: 1,
      });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('should throw error when project not found', async () => {
      vi.mocked(ProjetRepository.findByIdAndEntreprise).mockResolvedValue(null);

      await expect(
        EntreprisesService.getCandidatsCompatibles({ entrepriseId: 1, projetId: 999 })
      ).rejects.toThrow('Projet introuvable pour cette entreprise');
    });

    it('should exclude candidates with missing skills', async () => {
      vi.mocked(ProjetRepository.findByIdAndEntreprise).mockResolvedValue(mockProjet);
      vi.mocked(FreelanceRepository.findAll).mockResolvedValue(mockFreelances);

      const result = await EntreprisesService.getCandidatsCompatibles({
        entrepriseId: 1,
        projetId: 1,
      });

      const pythonFreelance = result.find((f) => f.id === 2);
      expect(pythonFreelance).toBeUndefined();
    });

    it('should exclude candidates with TJM too high', async () => {
      vi.mocked(ProjetRepository.findByIdAndEntreprise).mockResolvedValue(mockProjet);
      vi.mocked(FreelanceRepository.findAll).mockResolvedValue(mockFreelances);

      const result = await EntreprisesService.getCandidatsCompatibles({
        entrepriseId: 1,
        projetId: 1,
      });

      const expensiveFreelance = result.find((f) => f.id === 3);
      expect(expensiveFreelance).toBeUndefined();
    });

    it('should return empty array when no compatible candidates', async () => {
      vi.mocked(ProjetRepository.findByIdAndEntreprise).mockResolvedValue(mockProjet);
      vi.mocked(FreelanceRepository.findAll).mockResolvedValue([]);

      const result = await EntreprisesService.getCandidatsCompatibles({
        entrepriseId: 1,
        projetId: 1,
      });

      expect(result).toHaveLength(0);
    });

    it('should exclude candidates when project is already assigned', async () => {
      const assignedProjet = { ...mockProjet, freelanceId: 2 };

      vi.mocked(ProjetRepository.findByIdAndEntreprise).mockResolvedValue(assignedProjet);
      vi.mocked(FreelanceRepository.findAll).mockResolvedValue(mockFreelances);

      const result = await EntreprisesService.getCandidatsCompatibles({
        entrepriseId: 1,
        projetId: 1,
      });

      expect(result).toHaveLength(0);
    });
  });

  describe('getProjetsOuverts', () => {
    it('should return all available projects', async () => {
      const mockProjets: ProjetWithSkills[] = [
        {
          id: 1,
          titre: 'Projet React',
          description: 'App React',
          skillsRequis: ['JavaScript', 'React'],
          budgetMaxTjm: 500,
          entrepriseId: 1,
          freelanceId: null,
        },
        {
          id: 2,
          titre: 'Projet Python',
          description: 'App Python',
          skillsRequis: ['Python', 'Django'],
          budgetMaxTjm: 600,
          entrepriseId: 2,
          freelanceId: null,
        },
      ];

      vi.mocked(ProjetRepository.findAvailable).mockResolvedValue(mockProjets);

      const result = await EntreprisesService.getProjetsOuverts();

      expect(result).toEqual(mockProjets);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no projects available', async () => {
      vi.mocked(ProjetRepository.findAvailable).mockResolvedValue([]);

      const result = await EntreprisesService.getProjetsOuverts();

      expect(result).toHaveLength(0);
    });
  });
});
