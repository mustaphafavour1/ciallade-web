'use client';

import { useReducedMotion, motion, type Variants } from 'framer-motion';

/**
 * The ONE project-wide headline mechanism (landing-page-craft: "headlines never render plain").
 *
 * Treatment, applied everywhere a major headline appears:
 *   1. Each line rises from behind a clip mask on scroll into view (staggered).
 *   2. One deliberate accent word per headline is inked in gold (nature-brown)
 *      with a hairline underline that draws in left-to-right after the rise.
 *
 * Never invent a second headline mechanism elsewhere — import this.
 */

export type Segment = { text: string; accent?: boolean };

type Props = {
  /** Each inner array is one line; segments with accent:true render gold + underline. */
  lines: Segment[][];
  eyebrow?: string;
  as?: 'h1' | 'h2';
  /** Tailwind classes for size + base color, e.g. "text-almond-cream text-5xl". */
  className?: string;
  align?: 'left' | 'center' | 'right';
  /** Draw the gold underline beneath accent words (default true). */
  underlineAccent?: boolean;
  /** Delay before the first line rises. */
  delay?: number;
};

const alignMap = {
  left: 'text-left items-start',
  center: 'text-center items-center',
  right: 'text-right items-end',
} as const;

export default function SectionHeading({
  lines,
  eyebrow,
  as = 'h2',
  className = '',
  align = 'left',
  underlineAccent = true,
  delay = 0,
}: Props) {
  const reduce = useReducedMotion();
  const Tag = as === 'h1' ? motion.h1 : motion.h2;

  const lineVariants: Variants = {
    hidden: { y: reduce ? 0 : '110%' },
    visible: (i: number) => ({
      y: '0%',
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: delay + i * 0.12 },
    }),
  };

  const underlineVariants: Variants = {
    hidden: { scaleX: 0 },
    visible: (i: number) => ({
      scaleX: 1,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: delay + 0.5 + i * 0.12 },
    }),
  };

  return (
    <div className={`flex flex-col ${alignMap[align]}`}>
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
          className="label-text text-[11px] text-nature-brown tracking-[0.25em] mb-5"
        >
          {eyebrow}
        </motion.p>
      )}
      <Tag className={`font-display leading-[0.95] ${className}`}>
        {lines.map((segments, li) => (
          <span key={li} className="block overflow-hidden pb-[0.08em]">
            <motion.span
              className="block"
              custom={li}
              variants={lineVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              {segments.map((seg, si) =>
                seg.accent ? (
                  <span key={si} className="relative inline-block text-nature-brown">
                    {seg.text}
                    {underlineAccent && (
                      <motion.span
                        aria-hidden
                        className="absolute left-0 -bottom-[0.06em] h-[2px] w-full origin-left bg-nature-brown"
                        custom={li}
                        variants={underlineVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                      />
                    )}
                  </span>
                ) : (
                  <span key={si}>{seg.text}</span>
                )
              )}
            </motion.span>
          </span>
        ))}
      </Tag>
    </div>
  );
}

/**
 * Build SectionHeading lines from CMS values.
 * `title` may contain newlines (each becomes its own line); `accent` is appended
 * to the last line as the gold, underlined segment. Falls back to the supplied
 * defaults whenever the CMS values are missing, so sections never render empty.
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

/** Helper: turn "Be *Yourself.*" style input into segments, marking *word* as accent. */
export function parseAccent(line: string): Segment[] {
  const parts = line.split(/(\*[^*]+\*)/g).filter(Boolean);
  return parts.map((p) =>
    p.startsWith('*') && p.endsWith('*')
      ? { text: p.slice(1, -1), accent: true }
      : { text: p }
  );
}
