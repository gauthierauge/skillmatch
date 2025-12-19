import { FreelanceWithSkills } from "@/types";
import { SkillsUtil } from "@/utils";

type FreelanceRecord = {
  id: number;
  nom: string;
  email: string;
  skills: string;
  tjm: number;
};

export class FreelanceMapper {
  static toDto(record: FreelanceRecord): FreelanceWithSkills {
    return {
      ...record,
      skills: SkillsUtil.parseSkills(record.skills),
    };
  }

  static toDtoList(records: FreelanceRecord[]): FreelanceWithSkills[] {
    return records.map((record: FreelanceRecord): FreelanceWithSkills => this.toDto(record));
  }

  static skillsToJson(skills: string[]): string {
    return SkillsUtil.skillsToJson(skills);
  }
}
