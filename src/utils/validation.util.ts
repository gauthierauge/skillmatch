const DECIMAL_RADIX = 10;

export class ValidationUtil {
  /**
   * Parse ID from string to number
   * @param id - String ID to parse
   * @returns Parsed number ID
   * @throws Error if ID is invalid
   */
  static parseId(id: string): number {
    const parsed = parseInt(id, DECIMAL_RADIX);
    if (isNaN(parsed)) {
      throw new Error(`Invalid ID: ${id}`);
    }
    return parsed;
  }

  /**
   * Parse optional ID from string to number or undefined
   * @param id - String ID to parse (optional)
   * @returns Parsed number ID or undefined
   */
  static parseOptionalId(id?: string): number | undefined {
    if (!id) {
      return undefined;
    }
    return this.parseId(id);
  }

  /**
   * Validate that an entity exists, throw if not
   * @param entity - Entity to check
   * @param errorMessage - Error message to throw if entity is null
   * @throws Error if entity is null or undefined
   */
  static requireEntity<T>(entity: T | null | undefined, errorMessage: string): asserts entity is T {
    if (entity === null || entity === undefined) {
      throw new Error(errorMessage);
    }
  }
}
