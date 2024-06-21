/**
 * Configuration for a view.
 */
export interface ViewConfig {
  /** Name of the view. */
  Name: string;
  /** Layout type. */
  Layout: 'Table' | 'Board';
  /** Filename, including extension. */
  File: string;
  /**
   * Fields to sort by. A sort rule is a field name plus `asc` or `desc`:
   * ```txt
   * Name asc
   * ```
   * Multiple sorts can be separated by spaces:
   * ```txt
   * Name asc Created desc
   * ```
   */
  Sort?: string;
  /**
   * Fields to filter by. A single filter has the format:
   * ```txt
   * <field> <not?> <condition>
   * ```
   * `condition` can be one of:
   *   - `set`: has any value
   *   - `eq <value>`: equals
   *   - `lt <value>`: less than
   *   - `lte <value>`: less than or equal to
   *   - `gt <value>`: greater than
   *   - `gte <value>`: greater than or equal to
   * Multiple conditions can be joined with `and` or `or`. Operator precedence imitates JavaScript.
   * ```txt
   * Category not eq Dog and Name set
   * ```
   */
  Filter?: string;
  /**
   * Field to group by. Only enums are supported.
   *   - For tables, each value is an individual table
   *   - For boards, each value is a column
   */
  Group?: string;
  /**
   * Fields to display on each item.
   *   - For tables, these map to columns
   *   - For boards, the fields display top-to-bottom
   */
  Fields?: string;
}
