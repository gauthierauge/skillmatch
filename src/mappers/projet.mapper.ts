import { ProjetWithSkills } from "@/types";
import { SkillsUtil } from "@/utils";

type ProjetRecord = {
  id: number;
  titre: string;
  description: string;
  skillsRequis: string;
  budgetMaxTjm: number;
  entrepriseId: number;
  freelanceId: number | null;
};

export class ProjetMapper {
  static toDto(record: ProjetRecord): ProjetWithSkills {
    return {
      ...record,
      skillsRequis: SkillsUtil.parseSkills(record.skillsRequis),
    };
  }

  static toDtoList(records: ProjetRecord[]): ProjetWithSkills[] {
    return records.map((record: ProjetRecord): ProjetWithSkills => this.toDto(record));
  }

  static skillsToJson(skills: string[]): string {
    return SkillsUtil.skillsToJson(skills);
  }
}
