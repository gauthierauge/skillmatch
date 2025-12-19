import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FreelancesService } from '../../src/services/freelances.service';
import { FreelanceRepository } from '../../src/repositories/freelance.repository';
import { ProjetRepository } from '../../src/repositories/projet.repository';
import { FreelanceWithSkills, ProjetWithSkills, CreateFreelanceDto } from '../../src/types';

vi.mock('../../src/repositories/freelance.repository');
vi.mock('../../src/repositories/projet.repository');

describe('FreelancesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createFreelance', () => {
    it('should create a freelance successfully', async () => {
      const input: CreateFreelanceDto = {
        nom: 'Alice Dupont',
        email: 'alice@example.com',
        skills: ['JavaScript', 'React'],
        tjm: 500,
      };

      const expected: FreelanceWithSkills = {
        id: 1,
        nom: 'Alice Dupont',
        email: 'alice@example.com',
        skills: ['JavaScript', 'React'],
        tjm: 500,
      };

      vi.mocked(FreelanceRepository.create).mockResolvedValue(expected);

      const result = await FreelancesService.createFreelance(input);

      expect(result).toEqual(expected);
      expect(FreelanceRepository.create).toHaveBeenCalledWith(input);
    });
  });

  describe('getAllFreelances', () => {
    const mockFreelances: FreelanceWithSkills[] = [
      {
        id: 1,
        nom: 'Alice Dupont',
        email: 'alice@example.com',
        skills: ['JavaScript', 'React', 'Node.js'],
        tjm: 500,
      },
      {
        id: 2,
        nom: 'Bob Martin',
        email: 'bob@example.com',
        skills: ['Python', 'Django'],
        tjm: 450,
      },
      {
        id: 3,
        nom: 'Charlie Bernard',
        email: 'charlie@example.com',
        skills: ['JavaScript', 'Vue.js'],
        tjm: 400,
      },
    ];

    it('should return all freelances when no filter is provided', async () => {
      vi.mocked(FreelanceRepository.findAll).mockResolvedValue(mockFreelances);

      const result = await FreelancesService.getAllFreelances({});

      expect(result).toEqual(mockFreelances);
      expect(result).toHaveLength(3);
    });

    it('should filter freelances by skill (case-insensitive)', async () => {
      vi.mocked(FreelanceRepository.findAll).mockResolvedValue(mockFreelances);

      const result = await FreelancesService.getAllFreelances({ skillFilter: 'JavaScript' });

      expect(result).toHaveLength(2);
      expect(result.map((f) => f.id)).toEqual([1, 3]);
    });

    it('should filter freelances with lowercase skill filter', async () => {
      vi.mocked(FreelanceRepository.findAll).mockResolvedValue(mockFreelances);

      const result = await FreelancesService.getAllFreelances({ skillFilter: 'python' });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    it('should return empty array when no freelances match the skill', async () => {
      vi.mocked(FreelanceRepository.findAll).mockResolvedValue(mockFreelances);

      const result = await FreelancesService.getAllFreelances({ skillFilter: 'Rust' });

      expect(result).toHaveLength(0);
    });

    it('should handle empty freelances list', async () => {
      vi.mocked(FreelanceRepository.findAll).mockResolvedValue([]);

      const result = await FreelancesService.getAllFreelances({ skillFilter: 'JavaScript' });

      expect(result).toHaveLength(0);
    });
  });

  describe('getFreelanceById', () => {
    it('should return a freelance when found', async () => {
      const mockFreelance: FreelanceWithSkills = {
        id: 1,
        nom: 'Alice Dupont',
        email: 'alice@example.com',
        skills: ['JavaScript', 'React'],
        tjm: 500,
      };

      vi.mocked(FreelanceRepository.findById).mockResolvedValue(mockFreelance);

      const result = await FreelancesService.getFreelanceById({ id: 1 });

      expect(result).toEqual(mockFreelance);
      expect(FreelanceRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should return null when freelance not found', async () => {
      vi.mocked(FreelanceRepository.findById).mockResolvedValue(null);

      const result = await FreelancesService.getFreelanceById({ id: 999 });

      expect(result).toBeNull();
    });
  });

  describe('getProjetsCompatibles', () => {
    const mockFreelance: FreelanceWithSkills = {
      id: 1,
      nom: 'Alice Dupont',
      email: 'alice@example.com',
      skills: ['JavaScript', 'React', 'Node.js'],
      tjm: 450,
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
        budgetMaxTjm: 500,
        entrepriseId: 1,
        freelanceId: null,
      },
      {
        id: 3,
        titre: 'Projet low budget',
        description: 'Projet avec petit budget',
        skillsRequis: ['JavaScript', 'React'],
        budgetMaxTjm: 400,
        entrepriseId: 1,
        freelanceId: null,
      },
      {
        id: 4,
        titre: 'Projet déjà pourvu',
        description: 'Projet déjà assigné',
        skillsRequis: ['JavaScript', 'React'],
        budgetMaxTjm: 500,
        entrepriseId: 1,
        freelanceId: 2,
      },
    ];

    it('should return compatible projects', async () => {
      vi.mocked(FreelanceRepository.findById).mockResolvedValue(mockFreelance);
      vi.mocked(ProjetRepository.findAvailable).mockResolvedValue(mockProjets);

      const result = await FreelancesService.getProjetsCompatibles({ freelanceId: 1 });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('should throw error when freelance not found', async () => {
      vi.mocked(FreelanceRepository.findById).mockResolvedValue(null);

      await expect(
        FreelancesService.getProjetsCompatibles({ freelanceId: 999 })
      ).rejects.toThrow('Freelance introuvable');
    });

    it('should exclude projects with missing skills', async () => {
      vi.mocked(FreelanceRepository.findById).mockResolvedValue(mockFreelance);
      vi.mocked(ProjetRepository.findAvailable).mockResolvedValue(mockProjets);

      const result = await FreelancesService.getProjetsCompatibles({ freelanceId: 1 });

      const pythonProject = result.find((p) => p.id === 2);
      expect(pythonProject).toBeUndefined();
    });

    it('should exclude projects with insufficient budget', async () => {
      vi.mocked(FreelanceRepository.findById).mockResolvedValue(mockFreelance);
      vi.mocked(ProjetRepository.findAvailable).mockResolvedValue(mockProjets);

      const result = await FreelancesService.getProjetsCompatibles({ freelanceId: 1 });

      const lowBudgetProject = result.find((p) => p.id === 3);
      expect(lowBudgetProject).toBeUndefined();
    });

    it('should return empty array when no compatible projects', async () => {
      vi.mocked(FreelanceRepository.findById).mockResolvedValue(mockFreelance);
      vi.mocked(ProjetRepository.findAvailable).mockResolvedValue([]);

      const result = await FreelancesService.getProjetsCompatibles({ freelanceId: 1 });

      expect(result).toHaveLength(0);
    });
  });

  describe('postulerProjet', () => {
    const mockFreelance: FreelanceWithSkills = {
      id: 1,
      nom: 'Alice Dupont',
      email: 'alice@example.com',
      skills: ['JavaScript', 'React', 'Node.js'],
      tjm: 450,
    };

    const mockProjet: ProjetWithSkills = {
      id: 1,
      titre: 'Projet React',
      description: 'App React',
      skillsRequis: ['JavaScript', 'React'],
      budgetMaxTjm: 500,
      entrepriseId: 1,
      freelanceId: null,
    };

    it('should successfully assign freelance to compatible project', async () => {
      const updatedProjet = { ...mockProjet, freelanceId: 1 };

      vi.mocked(FreelanceRepository.findById).mockResolvedValue(mockFreelance);
      vi.mocked(ProjetRepository.findById).mockResolvedValue(mockProjet);
      vi.mocked(ProjetRepository.assignFreelance).mockResolvedValue(updatedProjet);

      const result = await FreelancesService.postulerProjet({ freelanceId: 1, projetId: 1 });

      expect(result.success).toBe(true);
      expect(result.message).toBe('Candidature acceptée! Vous avez été assigné au projet.');
      expect(result.projet).toEqual(updatedProjet);
      expect(ProjetRepository.assignFreelance).toHaveBeenCalledWith(1, 1);
    });

    it('should reject when freelance not found', async () => {
      vi.mocked(FreelanceRepository.findById).mockResolvedValue(null);

      const result = await FreelancesService.postulerProjet({ freelanceId: 999, projetId: 1 });

      expect(result.success).toBe(false);
      expect(result.message).toBe('Freelance introuvable');
    });

    it('should reject when project not found', async () => {
      vi.mocked(FreelanceRepository.findById).mockResolvedValue(mockFreelance);
      vi.mocked(ProjetRepository.findById).mockResolvedValue(null);

      const result = await FreelancesService.postulerProjet({ freelanceId: 1, projetId: 999 });

      expect(result.success).toBe(false);
      expect(result.message).toBe('Projet introuvable');
    });

    it('should reject when missing required skills', async () => {
      const projetWithMoreSkills = {
        ...mockProjet,
        skillsRequis: ['JavaScript', 'React', 'TypeScript', 'Docker'],
      };

      vi.mocked(FreelanceRepository.findById).mockResolvedValue(mockFreelance);
      vi.mocked(ProjetRepository.findById).mockResolvedValue(projetWithMoreSkills);

      const result = await FreelancesService.postulerProjet({ freelanceId: 1, projetId: 1 });

      expect(result.success).toBe(false);
      expect(result.message).toContain('Candidature refusée');
      expect(result.message).toContain('Compétences manquantes');
    });

    it('should reject when TJM too high', async () => {
      const lowBudgetProjet = { ...mockProjet, budgetMaxTjm: 400 };

      vi.mocked(FreelanceRepository.findById).mockResolvedValue(mockFreelance);
      vi.mocked(ProjetRepository.findById).mockResolvedValue(lowBudgetProjet);

      const result = await FreelancesService.postulerProjet({ freelanceId: 1, projetId: 1 });

      expect(result.success).toBe(false);
      expect(result.message).toContain('Candidature refusée');
      expect(result.message).toContain('TJM trop élevé');
    });

    it('should reject when project already assigned', async () => {
      const assignedProjet = { ...mockProjet, freelanceId: 2 };

      vi.mocked(FreelanceRepository.findById).mockResolvedValue(mockFreelance);
      vi.mocked(ProjetRepository.findById).mockResolvedValue(assignedProjet);

      const result = await FreelancesService.postulerProjet({ freelanceId: 1, projetId: 1 });

      expect(result.success).toBe(false);
      expect(result.message).toContain('Candidature refusée');
      expect(result.message).toContain('Le projet est déjà pourvu');
    });
  });
});
