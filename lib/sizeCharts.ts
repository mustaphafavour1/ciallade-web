/**
 * lib/sizeCharts.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * The measurement data behind the size selector. Pure data + helpers, no React,
 * so both the client picker (SizePicker) and the server-rendered pages can import
 * it. Every measurement value is in INCHES.
 *
 * A "size type" decides which UI a piece shows:
 *   standard → the classic S/M/L chip selector (handled in ProductDetail)
 *   top      → the TOP measurement chart
 *   bottom   → the BOTTOM (trousers / shorts) measurement chart
 *   both     → both charts, tabbed
 *   none     → one-size, no size UI at all
 */

export type SizeType = 'standard' | 'top' | 'bottom' | 'both' | 'none';

/** The two measurement charts a piece can drive. */
export type MeasurementKind = 'top' | 'bottom';

export type SizeChartRow = {
  /** Stable key used in the emitted selection, e.g. 'chest'. */
  key: string;
  /** Full label shown in the table + legend, e.g. 'Sleeve Length'. */
  label: string;
  /** Short label used in the compact summary, e.g. 'Sleeve'. Falls back to label. */
  short?: string;
  /** One value per size, aligned with `sizes`. Inches. */
  values: number[];
};

export type SizeChart = {
  sizes: string[];
  rows: SizeChartRow[];
};

/** Both charts share the same size ladder. */
const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

/**
 * TOP chart — taken verbatim from the brand's official garment chart.
 * Do not "round" these; they are the measured spec.
 */
export const TOP_CHART: SizeChart = {
  sizes: SIZES,
  rows: [
    { key: 'chest', label: 'Chest', values: [34, 36, 38, 40, 42, 44, 46] },
    { key: 'length', label: 'Length', values: [24, 25, 26, 27, 28, 29, 30] },
    { key: 'sleeve', label: 'Sleeve Length', short: 'Sleeve', values: [7.5, 8, 8, 8.5, 8.5, 9, 10] },
    { key: 'shoulder', label: 'Shoulder', values: [15.5, 16, 17, 17.5, 18, 19, 20] },
  ],
};

/**
 * BOTTOM chart — trousers / shorts.
 * NOTE FOR ADMIN: these are a sensible standard block, not an official Ciallade
 * spec yet. Tune each row's values to the real trouser pattern once it is
 * finalised — the picker + summary pick them up automatically.
 */
export const BOTTOM_CHART: SizeChart = {
  sizes: SIZES,
  rows: [
    { key: 'waist', label: 'Waist', values: [28, 30, 32, 34, 36, 38, 40] },
    { key: 'hip', label: 'Hip', values: [34, 36, 38, 40, 42, 44, 46] },
    { key: 'length', label: 'Length', values: [38, 39, 40, 40, 41, 41, 42] },
    { key: 'inseam', label: 'Inseam', values: [30, 30, 31, 31, 31, 32, 32] },
    { key: 'thigh', label: 'Thigh', values: [22, 23, 24, 25, 26, 27, 28] },
  ],
};

/** A buyer's chosen value (inches) per row key, split by chart. */
export type MeasurementSelection = {
  top?: Record<string, number>;
  bottom?: Record<string, number>;
};

/** Which charts a size-type drives. Empty for 'standard' / 'none'. */
export function chartsForType(sizeType: SizeType): MeasurementKind[] {
  if (sizeType === 'top') return ['top'];
  if (sizeType === 'bottom') return ['bottom'];
  if (sizeType === 'both') return ['top', 'bottom'];
  return [];
}

export function chartByKind(kind: MeasurementKind): SizeChart {
  return kind === 'top' ? TOP_CHART : BOTTOM_CHART;
}

/** True when the piece uses the measurement picker (not chips or one-size). */
export function isMeasurementType(sizeType: SizeType): boolean {
  return sizeType === 'top' || sizeType === 'bottom' || sizeType === 'both';
}

/** How many rows have been chosen across all active charts. */
export function countChosen(sizeType: SizeType, selection: MeasurementSelection): number {
  let n = 0;
  for (const kind of chartsForType(sizeType)) {
    const chosen = kind === 'top' ? selection.top : selection.bottom;
    if (chosen) n += Object.keys(chosen).length;
  }
  return n;
}

export type SizeSummary = {
  /** Readable line, every row present, unset rows shown as "—". */
  text: string;
  /** True only when every required row (across active charts) is chosen. */
  complete: boolean;
  /** Short labels of the rows still unset (for the "missing: …" flag). */
  missing: string[];
};

/**
 * Build a readable summary of a measurement selection.
 *
 * Default renders the section heading title-cased ("Top — Chest 40 · …") for
 * on-page display. Pass `{ uppercase: true }` for the order record the admin
 * sees ("TOP — Chest 40 · …"). For 'standard' / 'none' the active-chart list is
 * empty, so the text comes back "".
 */
export function summarizeMeasurements(
  sizeType: SizeType,
  selection: MeasurementSelection,
  opts?: { uppercase?: boolean },
): SizeSummary {
  const kinds = chartsForType(sizeType);
  const multiSection = kinds.length > 1;
  const sections: string[] = [];
  const missing: string[] = [];
  let complete = true;

  for (const kind of kinds) {
    const chart = chartByKind(kind);
    const chosen = (kind === 'top' ? selection.top : selection.bottom) ?? {};
    const title = kind === 'top' ? 'Top' : 'Bottom';

    const parts = chart.rows.map((row) => {
      const short = row.short ?? row.label;
      const value = chosen[row.key];
      if (value === undefined) {
        complete = false;
        // Prefix with the section when both charts are in play, so the admin can
        // tell a missing top sleeve from a missing bottom row.
        missing.push(multiSection ? `${title} ${short}` : short);
        return `${short} —`;
      }
      return `${short} ${String(value)}`;
    });

    const heading = opts?.uppercase ? title.toUpperCase() : title;
    sections.push(`${heading} — ${parts.join(' · ')}`);
  }

  return { text: sections.join('  |  '), complete, missing };
}
