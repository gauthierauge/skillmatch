import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app';
import { EntreprisesService } from '../../src/services/entreprises.service';
import { EntrepriseDto, ProjetWithSkills, FreelanceWithSkills } from '../../src/types';

vi.mock('../../src/services/entreprises.service');

const app = createApp();

describe('EntreprisesController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/entreprises', () => {
    it('should create an entreprise and return 201', async () => {
      const input = {
        nom: 'TechCorp',
        secteur: 'Technologie',
      };

      const mockEntreprise: EntrepriseDto = {
        id: 1,
        ...input,
      };

      vi.mocked(EntreprisesService.createEntreprise).mockResolvedValue(mockEntreprise);

      const response = await request(app).post('/api/v1/entreprises').send(input);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ success: true, data: mockEntreprise });
    });

    it('should return 500 on service error', async () => {
      const input = {
        nom: 'TechCorp',
        secteur: 'Technologie',
      };

      vi.mocked(EntreprisesService.createEntreprise).mockRejectedValue(
        new Error('Database error')
      );

      const response = await request(app).post('/api/v1/entreprises').send(input);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/entreprises', () => {
    it('should return all entreprises', async () => {
      const mockEntreprises: EntrepriseDto[] = [
        { id: 1, nom: 'TechCorp', secteur: 'Technologie' },
        { id: 2, nom: 'InnovateCo', secteur: 'Innovation' },
      ];

      vi.mocked(EntreprisesService.getAllEntreprises).mockResolvedValue(mockEntreprises);

      const response = await request(app).get('/api/v1/entreprises');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true, data: mockEntreprises });
    });

    it('should return 500 on service error', async () => {
      vi.mocked(EntreprisesService.getAllEntreprises).mockRejectedValue(
        new Error('Database error')
      );

      const response = await request(app).get('/api/v1/entreprises');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/entreprises/:id', () => {
    it('should return an entreprise by id', async () => {
      const mockEntreprise: EntrepriseDto = {
        id: 1,
        nom: 'TechCorp',
        secteur: 'Technologie',
      };

      vi.mocked(EntreprisesService.getEntrepriseById).mockResolvedValue(mockEntreprise);

      const response = await request(app).get('/api/v1/entreprises/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true, data: mockEntreprise });
    });

    it('should return 404 when entreprise not found', async () => {
      vi.mocked(EntreprisesService.getEntrepriseById).mockResolvedValue(null);

      const response = await request(app).get('/api/v1/entreprises/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        data: null,
        error: { message: 'Entreprise introuvable', code: 404 }
      });
    });

    it('should return 500 on service error', async () => {
      vi.mocked(EntreprisesService.getEntrepriseById).mockRejectedValue(
        new Error('Database error')
      );

      const response = await request(app).get('/api/v1/entreprises/1');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/entreprises/:id/projets', () => {
    it('should create a project for an entreprise', async () => {
      const input = {
        titre: 'Projet React',
        description: 'Application React',
        skillsRequis: ['JavaScript', 'React'],
        budgetMaxTjm: 500,
      };

      const mockProjet: ProjetWithSkills = {
        id: 1,
        ...input,
        entrepriseId: 1,
        freelanceId: null,
      };

      vi.mocked(EntreprisesService.createProjet).mockResolvedValue(mockProjet);

      const response = await request(app).post('/api/v1/entreprises/1/projets').send(input);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ success: true, data: mockProjet });
    });

    it('should return 500 when entreprise not found', async () => {
      const input = {
        titre: 'Projet React',
        description: 'Application React',
        skillsRequis: ['JavaScript', 'React'],
        budgetMaxTjm: 500,
      };

      vi.mocked(EntreprisesService.createProjet).mockRejectedValue(
        new Error('Entreprise introuvable')
      );

      const response = await request(app).post('/api/v1/entreprises/999/projets').send(input);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/entreprises/:id/projets', () => {
    it('should return all projects for an entreprise', async () => {
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

      vi.mocked(EntreprisesService.getProjetsByEntreprise).mockResolvedValue(mockProjets);

      const response = await request(app).get('/api/v1/entreprises/1/projets');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true, data: mockProjets });
    });

    it('should return 500 when entreprise not found', async () => {
      vi.mocked(EntreprisesService.getProjetsByEntreprise).mockRejectedValue(
        new Error('Entreprise introuvable')
      );

      const response = await request(app).get('/api/v1/entreprises/999/projets');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/entreprises/:id/projets/:projetId/candidats-compatibles', () => {
    it('should return compatible candidates for a project', async () => {
      const mockFreelances: FreelanceWithSkills[] = [
        {
          id: 1,
          nom: 'Alice Dupont',
          email: 'alice@example.com',
          skills: ['JavaScript', 'React'],
          tjm: 450,
        },
      ];

      vi.mocked(EntreprisesService.getCandidatsCompatibles).mockResolvedValue(
        mockFreelances
      );

      const response = await request(app).get(
        '/api/v1/entreprises/1/projets/1/candidats-compatibles'
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true, data: mockFreelances });
    });

    it('should return 500 when project not found', async () => {
      vi.mocked(EntreprisesService.getCandidatsCompatibles).mockRejectedValue(
        new Error('Projet introuvable pour cette entreprise')
      );

      const response = await request(app).get(
        '/api/v1/entreprises/1/projets/999/candidats-compatibles'
      );

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });
});
