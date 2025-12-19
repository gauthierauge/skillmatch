import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app';
import { FreelancesService } from '../../src/services/freelances.service';
import { FreelanceWithSkills, ProjetWithSkills, MatchingResult } from '../../src/types';

vi.mock('../../src/services/freelances.service');

const app = createApp();

describe('FreelancesController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/freelances', () => {
    it('should create a freelance and return 201', async () => {
      const input = {
        nom: 'Alice Dupont',
        email: 'alice@example.com',
        skills: ['JavaScript', 'React'],
        tjm: 500,
      };

      const mockFreelance: FreelanceWithSkills = {
        id: 1,
        ...input,
      };

      vi.mocked(FreelancesService.createFreelance).mockResolvedValue(mockFreelance);

      const response = await request(app).post('/api/v1/freelances').send(input);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ success: true, data: mockFreelance });
    });

    it('should return 500 on service error', async () => {
      const input = {
        nom: 'Alice Dupont',
        email: 'alice@example.com',
        skills: ['JavaScript', 'React'],
        tjm: 500,
      };

      vi.mocked(FreelancesService.createFreelance).mockRejectedValue(
        new Error('Database error')
      );

      const response = await request(app).post('/api/v1/freelances').send(input);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/freelances', () => {
    const mockFreelances: FreelanceWithSkills[] = [
      {
        id: 1,
        nom: 'Alice Dupont',
        email: 'alice@example.com',
        skills: ['JavaScript', 'React'],
        tjm: 500,
      },
      {
        id: 2,
        nom: 'Bob Martin',
        email: 'bob@example.com',
        skills: ['Python', 'Django'],
        tjm: 450,
      },
    ];

    it('should return all freelances', async () => {
      vi.mocked(FreelancesService.getAllFreelances).mockResolvedValue(mockFreelances);

      const response = await request(app).get('/api/v1/freelances');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true, data: mockFreelances });
      expect(FreelancesService.getAllFreelances).toHaveBeenCalledWith({});
    });

    it('should filter freelances by skill', async () => {
      const filtered = [mockFreelances[0]];
      vi.mocked(FreelancesService.getAllFreelances).mockResolvedValue(filtered);

      const response = await request(app).get('/api/v1/freelances?skill=React');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true, data: filtered });
      expect(FreelancesService.getAllFreelances).toHaveBeenCalledWith({
        skillFilter: 'React',
      });
    });

    it('should return 500 on service error', async () => {
      vi.mocked(FreelancesService.getAllFreelances).mockRejectedValue(
        new Error('Database error')
      );

      const response = await request(app).get('/api/v1/freelances');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/freelances/:id', () => {
    it('should return a freelance by id', async () => {
      const mockFreelance: FreelanceWithSkills = {
        id: 1,
        nom: 'Alice Dupont',
        email: 'alice@example.com',
        skills: ['JavaScript', 'React'],
        tjm: 500,
      };

      vi.mocked(FreelancesService.getFreelanceById).mockResolvedValue(mockFreelance);

      const response = await request(app).get('/api/v1/freelances/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true, data: mockFreelance });
    });

    it('should return 404 when freelance not found', async () => {
      vi.mocked(FreelancesService.getFreelanceById).mockResolvedValue(null);

      const response = await request(app).get('/api/v1/freelances/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        data: null,
        error: { message: 'Freelance introuvable', code: 404 }
      });
    });

    it('should return 500 on service error', async () => {
      vi.mocked(FreelancesService.getFreelanceById).mockRejectedValue(
        new Error('Database error')
      );

      const response = await request(app).get('/api/v1/freelances/1');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/freelances/:id/projets-compatibles', () => {
    it('should return compatible projects for a freelance', async () => {
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
      ];

      vi.mocked(FreelancesService.getProjetsCompatibles).mockResolvedValue(mockProjets);

      const response = await request(app).get('/api/v1/freelances/1/projets-compatibles');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true, data: mockProjets });
    });

    it('should return 500 when freelance not found', async () => {
      vi.mocked(FreelancesService.getProjetsCompatibles).mockRejectedValue(
        new Error('Freelance introuvable')
      );

      const response = await request(app).get('/api/v1/freelances/999/projets-compatibles');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/freelances/:id/postuler', () => {
    it('should successfully apply to a project', async () => {
      const mockResult: MatchingResult = {
        success: true,
        message: 'Candidature acceptée! Vous avez été assigné au projet.',
        projet: {
          id: 1,
          titre: 'Projet React',
          description: 'App React',
          skillsRequis: ['JavaScript', 'React'],
          budgetMaxTjm: 500,
          entrepriseId: 1,
          freelanceId: 1,
        },
      };

      vi.mocked(FreelancesService.postulerProjet).mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/api/v1/freelances/1/postuler')
        .send({ projetId: 1 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true, data: mockResult });
    });

    it('should return 400 when application is rejected', async () => {
      const mockResult: MatchingResult = {
        success: false,
        message: 'TJM trop élevé',
      };

      vi.mocked(FreelancesService.postulerProjet).mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/api/v1/freelances/1/postuler')
        .send({ projetId: 1 });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        data: null,
        error: { message: 'TJM trop élevé', code: 400 }
      });
    });

    it('should return 500 on service error', async () => {
      vi.mocked(FreelancesService.postulerProjet).mockRejectedValue(
        new Error('Database error')
      );

      const response = await request(app)
        .post('/api/v1/freelances/1/postuler')
        .send({ projetId: 1 });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });
});
