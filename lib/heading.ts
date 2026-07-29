/**
 * Pure helpers for the SectionHeading mechanism. Kept OUT of the 'use client'
 * component file so they can be called from BOTH server and client components —
 * a function exported from a 'use client' module becomes a client reference and
 * throws "is not a function" when called during server rendering.
 */

export type Segment = { text: string; accent?: boolean };

/**
 * Build SectionHeading lines from CMS values. `title` may contain newlines
 * (each becomes its own line); `accent` is appended to the last line as the
 * gold, underlined segment. Falls back to the supplied defaults when the CMS
 * values are missing, so sections never render empty.
 */
export function toLines(
  title: string | undefined,
  accent: string | undefined,
  fallbackTitle: string,
  fallbackAccent?: string
): Segment[][] {
  const t = title?.trim() || fallbackTitle;
  const a = accent?.trim() ?? fallbackAccent;
  const rawLines = t.split('\n').map((l) => l.trim()).filter(Boolean);
  const lines = rawLines.length ? rawLines : [t];

  return lines.map((line, i) => {
    if (i !== lines.length - 1 || !a) return [{ text: line }];
    return line ? [{ text: `${line} ` }, { text: a, accent: true }] : [{ text: a, accent: true }];
  });
}

/** Turn "Be *Yourself.*" style input into segments, marking *word* as accent. */
export function parseAccent(line: string): Segment[] {
  const parts = line.split(/(\*[^*]+\*)/g).filter(Boolean);
  return parts.map((p) =>
    p.startsWith('*') && p.endsWith('*') ? { text: p.slice(1, -1), accent: true } : { text: p }
  );
}
