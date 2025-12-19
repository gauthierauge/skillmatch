export class SkillsUtil {
  /**
   * Parse JSON string to skills array
   * @param skillsJson - JSON string representation of skills
   * @returns Array of skill strings
   * @throws Error if skills is not an array
   */
  static parseSkills(skillsJson: string): string[] {
    const parsed: unknown = JSON.parse(skillsJson);
    if (!Array.isArray(parsed)) {
      throw new Error("Skills must be an array");
    }
    return parsed.filter((item): item is string => typeof item === "string");
  }

  /**
   * Convert skills array to JSON string
   * @param skills - Array of skill strings
   * @returns JSON string representation
   */
  static skillsToJson(skills: string[]): string {
    return JSON.stringify(skills);
  }

  /**
   * Normalize skills by converting to lowercase
   * @param skills - Array of skill strings
   * @returns Array of normalized (lowercase) skills
   */
  static normalizeSkills(skills: string[]): string[] {
    return skills.map((skill: string): string => skill.toLowerCase());
  }

  /**
   * Check if a skill matches a filter (case-insensitive)
   * @param skill - Skill to check
   * @param filter - Filter string
   * @returns True if skill matches filter
   */
  static matchesFilter(skill: string, filter: string): boolean {
    return skill.toLowerCase() === filter.toLowerCase();
  }
}
