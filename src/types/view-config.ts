/**
 * Configuration for a view.
 */
export interface ViewConfig {
  /** Name of the view. */
  Name: string;
  /** Layout type. */
  Layout: 'Table' | 'Board' | 'List' | 'Text';
  /** Type of resource to query. Necessary if a recfile has multiple resource types. */
  Type?: string;
  /** Filename, including extension. */
  File: string;
  /**
   * Fields to sort by, separated by a space. The `recsel` command does the sorting under
   * the hood. Ascending order is used by default; append `desc` to the value to reverse
   * the order.
   */
  Sort?: string;
  /**
   * Fields to filter by. This is used as a selection expression with `recsel`.
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
  /**
   * Per-field formatting rules with the format:
   * ```txt
   * <field> <format> <field> <format> ...
   * ```
   * As a visual aid, you can add semicolons to separate each field:
   * ```txt
   * Amount money; Percent percent;
   * ```
   * Supported formats:
   *   - `money`: dollar amount
   *   - `percent`: a value from 0–1 formatted as a %, up to 2 decimal places
   */
  Render?: string;
  /**
   * Add a sum to the bottom of a column in the Table layout. Only works with numeric and
   * formula fields.
   * ```txt
   * Sum: Amount Percent
   * ```
   */
  Sum?: string;
  /** Open records in a full page instead of a popover. */
  Full_Page?: string;
}
