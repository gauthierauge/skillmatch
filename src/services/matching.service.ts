import { CompatibilityCheck, CheckCompatibilityProps, CalculateMatchScoreProps } from '@/types';
import { ErrorMessage } from '@/enums';
import { SkillsUtil } from '@/utils';
import { MatchingConstants } from '@/constants';

export class MatchingService {
    static checkCompatibility(props: CheckCompatibilityProps): CompatibilityCheck {
        const { freelanceSkills, freelanceTjm, skillsRequis, budgetMaxTjm, freelanceIdInProjet } = props;
        if (freelanceIdInProjet !== null) {
        return {
            compatible: false,
            raison: ErrorMessage.PROJECT_ALREADY_ASSIGNED,
        };
        }

        const normalizedFreelanceSkills = SkillsUtil.normalizeSkills(freelanceSkills);
        const normalizedRequiredSkills = SkillsUtil.normalizeSkills(skillsRequis);

        const missingSkills = normalizedRequiredSkills.filter(
            (skill) => !normalizedFreelanceSkills.includes(skill)
        );

        if (missingSkills.length > 0) {
            return {
                compatible: false,
                raison: `${ErrorMessage.MISSING_SKILLS}: ${missingSkills.join(', ')}`,
            };
        }

        if (freelanceTjm > budgetMaxTjm) {
            return {
                compatible: false,
                raison: `${ErrorMessage.RATE_TOO_HIGH} (${freelanceTjm}€ > ${budgetMaxTjm}€)`,
            };
        }

        return {
            compatible: true,
        };
    }

    static calculateMatchScore(props: CalculateMatchScoreProps): number {
        const { freelanceSkills, skillsRequis } = props;

        if (skillsRequis.length === 0) return MatchingConstants.PERFECT_MATCH_SCORE;

        const normalizedFreelanceSkills = SkillsUtil.normalizeSkills(freelanceSkills);
        const normalizedRequiredSkills = SkillsUtil.normalizeSkills(skillsRequis);

        const matchingSkills = normalizedRequiredSkills.filter((skill) =>
            normalizedFreelanceSkills.includes(skill)
        );

        return Math.round((matchingSkills.length / normalizedRequiredSkills.length) * MatchingConstants.PERFECT_MATCH_SCORE);
    }
}
