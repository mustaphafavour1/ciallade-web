'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X, Ruler, Check, AlertCircle } from 'lucide-react';
import {
  chartByKind,
  chartsForType,
  countChosen,
  summarizeMeasurements,
  type MeasurementKind,
  type MeasurementSelection,
  type SizeType,
} from '@/lib/sizeCharts';

type SizePickerProps = {
  open: boolean;
  onClose: () => void;
  /** Only 'top' | 'bottom' | 'both' actually open the picker. */
  sizeType: SizeType;
  value: MeasurementSelection;
  /** Fired on close (Done / Esc / backdrop / X) with the current selection. */
  onChange: (selection: MeasurementSelection, complete: boolean) => void;
};

const EASE = [0.22, 1, 0.36, 1] as const;

/** Shared grid template so the header + every row line up their columns. */
const gridCols = (count: number) =>
  `minmax(84px, 1.15fr) repeat(${count}, minmax(38px, 1fr))`;

export default function SizePicker({ open, onClose, sizeType, value, onChange }: SizePickerProps) {
  const shouldReduce = useReducedMotion();
  const kinds = chartsForType(sizeType);

  const [draft, setDraft] = useState<MeasurementSelection>(value);
  const [activeKind, setActiveKind] = useState<MeasurementKind>(kinds[0] ?? 'top');

  // Re-sync the working draft + active tab each time the picker is opened.
  useEffect(() => {
    if (!open) return;
    setDraft(value);
    setActiveKind(chartsForType(sizeType)[0] ?? 'top');
  }, [open, value, sizeType]);

  const summary = useMemo(() => summarizeMeasurements(sizeType, draft), [sizeType, draft]);
  const chosenCount = countChosen(sizeType, draft);

  // Keep the latest commit in a ref so the Esc handler never needs to re-subscribe.
  const commitRef = useRef<() => void>(() => {});
  commitRef.current = () => {
    onChange(draft, summary.complete);
    onClose();
  };
  const commitAndClose = useCallback(() => commitRef.current(), []);

  // Scroll-lock + Esc-to-close, matching OrderOverlay.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') commitAndClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, commitAndClose]);

  const selectValue = (kind: MeasurementKind, rowKey: string, next: number) => {
    setDraft((prev) => {
      const current = { ...(prev[kind] ?? {}) };
      // Tap the chosen cell again to clear it.
      if (current[rowKey] === next) delete current[rowKey];
      else current[rowKey] = next;
      return { ...prev, [kind]: current };
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="size-picker"
          className="fixed inset-0 z-[120] flex items-start md:items-center justify-center overflow-y-auto bg-near-black/80 backdrop-blur-sm p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          role="dialog"
          aria-modal="true"
          aria-label="Specify your measurements"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) commitAndClose();
          }}
        >
          <motion.div
            initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="relative my-auto w-full max-w-3xl bg-dark-wood border border-almond-cream/10 wash-dark shadow-2xl"
          >
            <button
              type="button"
              onClick={commitAndClose}
              aria-label="Close size guide"
              className="absolute right-4 top-4 z-20 text-almond-cream/50 hover:text-almond-cream transition-colors"
            >
              <X size={22} strokeWidth={1.5} />
            </button>

            <div className="p-6 md:p-10">
              {/* Header */}
              <div className="mb-6 pr-8">
                <p className="label-text text-[10px] text-nature-brown mb-3 flex items-center gap-2">
                  <Ruler size={13} strokeWidth={1.5} /> Size Guide
                </p>
                <h2 className="font-display text-almond-cream text-2xl md:text-3xl leading-tight">
                  Specify your measurements
                </h2>
                <p className="font-body font-light text-almond-cream/55 text-sm mt-2 max-w-lg">
                  Tap the value that fits you best in each row. You can mix sizes freely — your
                  chest at one size, your sleeve at another. All measurements are in inches.
                </p>
              </div>

              {/* Tabs — only when the piece needs both charts */}
              {kinds.length > 1 && (
                <div className="flex gap-2 mb-6" role="tablist" aria-label="Measurement area">
                  {kinds.map((k) => {
                    const active = activeKind === k;
                    const done = countChosen(k === 'top' ? 'top' : 'bottom', draft) > 0;
                    return (
                      <button
                        key={k}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setActiveKind(k)}
                        className={`flex items-center gap-2 px-5 py-2.5 border label-text text-[11px] transition-all duration-300 ${
                          active
                            ? 'border-nature-brown bg-nature-brown text-dark-wood'
                            : 'border-almond-cream/20 text-almond-cream/60 hover:border-almond-cream/50 hover:text-almond-cream'
                        }`}
                      >
                        {k === 'top' ? 'Top' : 'Bottom'}
                        {done && (
                          <Check size={12} strokeWidth={2.5} className={active ? 'text-dark-wood' : 'text-nature-brown'} />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Legend + measurement table */}
              <MeasurementLegend kind={activeKind} />

              <MeasurementTable
                kind={activeKind}
                chosen={draft[activeKind] ?? {}}
                onSelect={(rowKey, next) => selectValue(activeKind, rowKey, next)}
              />

              {/* Footer — gentle status + Done */}
              <div className="mt-8 pt-6 border-t border-almond-cream/10 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
                {summary.complete && chosenCount > 0 ? (
                  <p className="text-[11px] text-nature-brown font-body flex items-center gap-2">
                    <Check size={13} strokeWidth={2} /> All measurements set.
                  </p>
                ) : (
                  <p className="text-[11px] text-almond-cream/50 font-body flex items-start gap-2 max-w-md">
                    <AlertCircle size={13} strokeWidth={1.5} className="text-nature-brown mt-px shrink-0" />
                    Some measurements aren&apos;t set yet — you can still order and we&apos;ll confirm
                    them with you.
                  </p>
                )}

                <button
                  type="button"
                  onClick={commitAndClose}
                  className="shrink-0 bg-nature-brown text-dark-wood label-text text-xs py-3.5 px-10 hover:bg-ochre-brown transition-colors duration-300"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Measurement table ──────────────────────────────────────────────────────── */

function MeasurementTable({
  kind,
  chosen,
  onSelect,
}: {
  kind: MeasurementKind;
  chosen: Record<string, number>;
  onSelect: (rowKey: string, value: number) => void;
}) {
  const chart = chartByKind(kind);
  const template = gridCols(chart.sizes.length);

  return (
    <div className="mt-6 overflow-x-auto -mx-1 px-1 pb-1">
      <div className="min-w-[440px]">
        {/* Size reference header */}
        <div className="grid items-end gap-1.5 mb-2" style={{ gridTemplateColumns: template }}>
          <span className="label-text text-[9px] text-almond-cream/35">Size →</span>
          {chart.sizes.map((s) => (
            <span key={s} className="label-text text-[10px] text-almond-cream/45 text-center">
              {s}
            </span>
          ))}
        </div>

        {chart.rows.map((row) => (
          <div
            key={row.key}
            className="grid items-center gap-1.5 py-1"
            style={{ gridTemplateColumns: template }}
          >
            <span className="font-body text-almond-cream/70 text-xs pr-2 leading-tight">
              {row.label}
            </span>
            {row.values.map((v, i) => {
              const selected = chosen[row.key] === v;
              return (
                <button
                  key={`${row.key}-${i}`}
                  type="button"
                  onClick={() => onSelect(row.key, v)}
                  aria-pressed={selected}
                  aria-label={`${row.label} ${v} inches — size ${chart.sizes[i]}`}
                  className={`h-9 flex items-center justify-center border font-body text-xs transition-all duration-200 ${
                    selected
                      ? 'border-nature-brown bg-nature-brown text-dark-wood font-medium'
                      : 'border-almond-cream/15 text-almond-cream/60 hover:border-nature-brown/50 hover:text-almond-cream'
                  }`}
                >
                  {v}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Legends — inline SVG diagrams (gold hairlines + almond labels) ──────────── */

function MeasurementLegend({ kind }: { kind: MeasurementKind }) {
  return (
    <div className="border border-almond-cream/10 bg-near-black/30 px-4 py-4 flex justify-center">
      {kind === 'top' ? <TopDiagram /> : <BottomDiagram />}
    </div>
  );
}

const LABEL = {
  fill: '#FFEBCD',
  fillOpacity: 0.8,
  fontSize: 8,
  letterSpacing: '0.12em',
  fontFamily: 'Plus Jakarta Sans, sans-serif',
} as const;

/** T-shirt outline with Shoulder / Chest / Length / Sleeve Length guides. */
function TopDiagram() {
  return (
    <svg
      viewBox="0 0 280 220"
      className="w-full max-w-[340px] h-auto text-nature-brown"
      role="img"
      aria-label="Diagram of a top showing where shoulder, chest, length and sleeve length are measured"
    >
      {/* Shirt outline */}
      <path
        d="M110,60 L74,76 L86,106 L108,96 L108,192 L172,192 L172,96 L194,106 L206,76 L170,60 C158,74 122,74 110,60 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinejoin="round"
        opacity={0.9}
      />

      {/* Shoulder */}
      <line x1={110} y1={53} x2={170} y2={53} stroke="currentColor" strokeWidth={1} strokeDasharray="3 3" opacity={0.75} />
      <circle cx={110} cy={53} r={1.6} fill="currentColor" />
      <circle cx={170} cy={53} r={1.6} fill="currentColor" />
      <text x={140} y={45} textAnchor="middle" {...LABEL}>SHOULDER</text>

      {/* Chest */}
      <line x1={108} y1={118} x2={172} y2={118} stroke="currentColor" strokeWidth={1} strokeDasharray="3 3" opacity={0.75} />
      <circle cx={108} cy={118} r={1.6} fill="currentColor" />
      <circle cx={172} cy={118} r={1.6} fill="currentColor" />
      <text x={140} y={112} textAnchor="middle" {...LABEL}>CHEST</text>

      {/* Length — down the right side */}
      <line x1={188} y1={60} x2={188} y2={192} stroke="currentColor" strokeWidth={1} strokeDasharray="3 3" opacity={0.75} />
      <circle cx={188} cy={60} r={1.6} fill="currentColor" />
      <circle cx={188} cy={192} r={1.6} fill="currentColor" />
      <text x={196} y={130} textAnchor="middle" transform="rotate(-90 196 130)" {...LABEL}>LENGTH</text>

      {/* Sleeve Length — along the left sleeve */}
      <line x1={110} y1={60} x2={80} y2={91} stroke="currentColor" strokeWidth={1} strokeDasharray="3 3" opacity={0.75} />
      <circle cx={110} cy={60} r={1.6} fill="currentColor" />
      <circle cx={80} cy={91} r={1.6} fill="currentColor" />
      <text x={64} y={64} textAnchor="end" {...LABEL}>SLEEVE</text>
      <text x={64} y={74} textAnchor="end" {...LABEL}>LENGTH</text>
    </svg>
  );
}

/** Trousers outline with Waist / Hip / Length / Inseam / Thigh guides. */
function BottomDiagram() {
  return (
    <svg
      viewBox="0 0 280 240"
      className="w-full max-w-[300px] h-auto text-nature-brown"
      role="img"
      aria-label="Diagram of trousers showing where waist, hip, length, inseam and thigh are measured"
    >
      {/* Trousers outline */}
      <path
        d="M104,46 L176,46 L190,212 L162,212 L140,150 L118,212 L90,212 L104,46 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinejoin="round"
        opacity={0.9}
      />
      {/* Waistband */}
      <line x1={104} y1={58} x2={176} y2={58} stroke="currentColor" strokeWidth={1} opacity={0.6} />

      {/* Waist */}
      <line x1={104} y1={49} x2={176} y2={49} stroke="currentColor" strokeWidth={1} strokeDasharray="3 3" opacity={0.75} />
      <circle cx={104} cy={49} r={1.6} fill="currentColor" />
      <circle cx={176} cy={49} r={1.6} fill="currentColor" />
      <text x={140} y={41} textAnchor="middle" {...LABEL}>WAIST</text>

      {/* Hip */}
      <line x1={100} y1={92} x2={180} y2={92} stroke="currentColor" strokeWidth={1} strokeDasharray="3 3" opacity={0.75} />
      <circle cx={100} cy={92} r={1.6} fill="currentColor" />
      <circle cx={180} cy={92} r={1.6} fill="currentColor" />
      <text x={210} y={95} textAnchor="start" {...LABEL}>HIP</text>
      <line x1={182} y1={92} x2={206} y2={92} stroke="currentColor" strokeWidth={0.75} opacity={0.5} />

      {/* Length — full outer left side */}
      <line x1={82} y1={46} x2={82} y2={212} stroke="currentColor" strokeWidth={1} strokeDasharray="3 3" opacity={0.75} />
      <circle cx={82} cy={46} r={1.6} fill="currentColor" />
      <circle cx={82} cy={212} r={1.6} fill="currentColor" />
      <text x={74} y={130} textAnchor="middle" transform="rotate(-90 74 130)" {...LABEL}>LENGTH</text>

      {/* Inseam — crotch down the inner leg */}
      <line x1={134} y1={152} x2={124} y2={210} stroke="currentColor" strokeWidth={1} strokeDasharray="3 3" opacity={0.75} />
      <circle cx={134} cy={152} r={1.6} fill="currentColor" />
      <circle cx={124} cy={210} r={1.6} fill="currentColor" />
      <text x={150} y={188} textAnchor="start" {...LABEL}>INSEAM</text>

      {/* Thigh — across the left leg */}
      <line x1={93} y1={172} x2={132} y2={172} stroke="currentColor" strokeWidth={1} strokeDasharray="3 3" opacity={0.75} />
      <circle cx={93} cy={172} r={1.6} fill="currentColor" />
      <circle cx={132} cy={172} r={1.6} fill="currentColor" />
      <text x={58} y={175} textAnchor="end" {...LABEL}>THIGH</text>
      <line x1={60} y1={172} x2={91} y2={172} stroke="currentColor" strokeWidth={0.75} opacity={0.5} />
    </svg>
  );
}
