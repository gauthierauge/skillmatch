import { describe, it, expect } from 'vitest';
import { MatchingService } from '../../src/services/matching.service';
import { CheckCompatibilityProps, CalculateMatchScoreProps } from '../../src/types';

describe('MatchingService', () => {
  describe('checkCompatibility', () => {
    it('should return compatible when all criteria are met', () => {
      const props: CheckCompatibilityProps = {
        freelanceSkills: ['JavaScript', 'React', 'Node.js'],
        freelanceTjm: 400,
        skillsRequis: ['JavaScript', 'React'],
        budgetMaxTjm: 500,
        freelanceIdInProjet: null,
      };

      const result = MatchingService.checkCompatibility(props);

      expect(result.compatible).toBe(true);
      expect(result.raison).toBeUndefined();
    });

    it('should return incompatible when project is already assigned', () => {
      const props: CheckCompatibilityProps = {
        freelanceSkills: ['JavaScript', 'React'],
        freelanceTjm: 400,
        skillsRequis: ['JavaScript', 'React'],
        budgetMaxTjm: 500,
        freelanceIdInProjet: 1,
      };

      const result = MatchingService.checkCompatibility(props);

      expect(result.compatible).toBe(false);
      expect(result.raison).toBe('Le projet est déjà pourvu');
    });

    it('should return incompatible when missing required skills', () => {
      const props: CheckCompatibilityProps = {
        freelanceSkills: ['JavaScript', 'React'],
        freelanceTjm: 400,
        skillsRequis: ['JavaScript', 'React', 'TypeScript'],
        budgetMaxTjm: 500,
        freelanceIdInProjet: null,
      };

      const result = MatchingService.checkCompatibility(props);

      expect(result.compatible).toBe(false);
      expect(result.raison).toBe('Compétences manquantes: typescript');
    });

    it('should return incompatible when TJM is too high', () => {
      const props: CheckCompatibilityProps = {
        freelanceSkills: ['JavaScript', 'React'],
        freelanceTjm: 600,
        skillsRequis: ['JavaScript', 'React'],
        budgetMaxTjm: 500,
        freelanceIdInProjet: null,
      };

      const result = MatchingService.checkCompatibility(props);

      expect(result.compatible).toBe(false);
      expect(result.raison).toBe('TJM trop élevé (600€ > 500€)');
    });

    it('should be case-insensitive for skills comparison', () => {
      const props: CheckCompatibilityProps = {
        freelanceSkills: ['javascript', 'REACT', 'Node.JS'],
        freelanceTjm: 400,
        skillsRequis: ['JavaScript', 'react', 'node.js'],
        budgetMaxTjm: 500,
        freelanceIdInProjet: null,
      };

      const result = MatchingService.checkCompatibility(props);

      expect(result.compatible).toBe(true);
    });

    it('should allow TJM equal to budget', () => {
      const props: CheckCompatibilityProps = {
        freelanceSkills: ['JavaScript', 'React'],
        freelanceTjm: 500,
        skillsRequis: ['JavaScript', 'React'],
        budgetMaxTjm: 500,
        freelanceIdInProjet: null,
      };

      const result = MatchingService.checkCompatibility(props);

      expect(result.compatible).toBe(true);
    });

    it('should return incompatible for multiple missing skills', () => {
      const props: CheckCompatibilityProps = {
        freelanceSkills: ['JavaScript'],
        freelanceTjm: 400,
        skillsRequis: ['JavaScript', 'React', 'TypeScript', 'Node.js'],
        budgetMaxTjm: 500,
        freelanceIdInProjet: null,
      };

      const result = MatchingService.checkCompatibility(props);

      expect(result.compatible).toBe(false);
      expect(result.raison).toContain('react');
      expect(result.raison).toContain('typescript');
      expect(result.raison).toContain('node.js');
    });

    it('should be compatible when freelance has extra skills', () => {
      const props: CheckCompatibilityProps = {
        freelanceSkills: ['JavaScript', 'React', 'TypeScript', 'Node.js', 'Docker', 'AWS'],
        freelanceTjm: 400,
        skillsRequis: ['JavaScript', 'React'],
        budgetMaxTjm: 500,
        freelanceIdInProjet: null,
      };

      const result = MatchingService.checkCompatibility(props);

      expect(result.compatible).toBe(true);
    });
  });

  describe('calculateMatchScore', () => {
    it('should return 100 when all required skills match', () => {
      const props: CalculateMatchScoreProps = {
        freelanceSkills: ['JavaScript', 'React', 'Node.js'],
        skillsRequis: ['JavaScript', 'React'],
      };

      const score = MatchingService.calculateMatchScore(props);

      expect(score).toBe(100);
    });

    it('should return 50 when half of required skills match', () => {
      const props: CalculateMatchScoreProps = {
        freelanceSkills: ['JavaScript', 'Python'],
        skillsRequis: ['JavaScript', 'React'],
      };

      const score = MatchingService.calculateMatchScore(props);

      expect(score).toBe(50);
    });

    it('should return 0 when no skills match', () => {
      const props: CalculateMatchScoreProps = {
        freelanceSkills: ['Python', 'Django'],
        skillsRequis: ['JavaScript', 'React'],
      };

      const score = MatchingService.calculateMatchScore(props);

      expect(score).toBe(0);
    });

    it('should return 100 when no skills required', () => {
      const props: CalculateMatchScoreProps = {
        freelanceSkills: ['JavaScript', 'React'],
        skillsRequis: [],
      };

      const score = MatchingService.calculateMatchScore(props);

      expect(score).toBe(100);
    });

    it('should be case-insensitive for score calculation', () => {
      const props: CalculateMatchScoreProps = {
        freelanceSkills: ['javascript', 'REACT', 'Node.JS'],
        skillsRequis: ['JavaScript', 'react'],
      };

      const score = MatchingService.calculateMatchScore(props);

      expect(score).toBe(100);
    });

    it('should round score to nearest integer', () => {
      const props: CalculateMatchScoreProps = {
        freelanceSkills: ['JavaScript', 'React'],
        skillsRequis: ['JavaScript', 'React', 'TypeScript'],
      };

      const score = MatchingService.calculateMatchScore(props);

      expect(score).toBe(67);
    });

    it('should calculate score correctly with 4 skills (3 matching)', () => {
      const props: CalculateMatchScoreProps = {
        freelanceSkills: ['JavaScript', 'React', 'Node.js', 'Docker'],
        skillsRequis: ['JavaScript', 'React', 'TypeScript', 'Node.js'],
      };

      const score = MatchingService.calculateMatchScore(props);

      expect(score).toBe(75);
    });

    it('should not count extra freelance skills in score', () => {
      const props: CalculateMatchScoreProps = {
        freelanceSkills: ['JavaScript', 'React', 'Node.js', 'Docker', 'AWS', 'Python'],
        skillsRequis: ['JavaScript', 'React'],
      };

      const score = MatchingService.calculateMatchScore(props);

      expect(score).toBe(100);
    });
  });
});
