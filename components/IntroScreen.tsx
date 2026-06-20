'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BRAND = 'Ciallade';
const SYM = ['⊙', '✂', '◈', '⊕', '∿', '◎'];

function CyclingLetter({ letter, delay }: { letter: string; delay: number }) {
  const [cur, setCur] = useState('');

  useEffect(() => {
    let iv: ReturnType<typeof setInterval>;
    const t = setTimeout(() => {
      const seq = [SYM[0], SYM[2], SYM[4], letter];
      let i = 0;
      setCur(seq[0]);
      iv = setInterval(() => {
        i++;
        setCur(seq[Math.min(i, seq.length - 1)]);
        if (i >= seq.length - 1) clearInterval(iv);
      }, 115);
    }, delay);
    return () => { clearTimeout(t); clearInterval(iv); };
  }, [letter, delay]);

  return (
    <span
      style={{
        display: 'inline-block',
        width: letter === 'l' || letter === 'i' ? '0.38em' : '0.65em',
        textAlign: 'center',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={cur || '_'}
          initial={{ y: -14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 14, opacity: 0 }}
          transition={{ duration: 0.08 }}
          style={{ display: 'inline-block' }}
          className={cur === letter ? 'text-almond-cream' : 'text-nature-brown/70'}
        >
          {cur || ' '}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function IntroScreen() {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<'in' | 'unzip'>('in');

  useEffect(() => {
    try {
      if (localStorage.getItem('ciallade_intro_seen')) return;
    } catch {}
    setVisible(true);

    // Last letter (i=7): delay = 300 + 7×280 = 2260ms; settles at +3×115 = 2605ms
    // Pause → unzip at 3400ms; unmount at 4850ms
    const t1 = setTimeout(() => setPhase('unzip'), 3400);
    const t2 = setTimeout(() => {
      try { localStorage.setItem('ciallade_intro_seen', '1'); } catch {}
      setVisible(false);
    }, 4850);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden" aria-hidden="true">
      {/* Left panel */}
      <motion.div
        className="absolute left-0 top-0 h-full bg-dark-wood z-10"
        style={{ width: '50.5vw' }}
        animate={phase === 'unzip' ? { x: '-101%' } : { x: 0 }}
        transition={{ duration: 1.35, ease: [0.76, 0, 0.24, 1] }}
      />
      {/* Right panel */}
      <motion.div
        className="absolute right-0 top-0 h-full bg-dark-wood z-10"
        style={{ width: '50.5vw' }}
        animate={phase === 'unzip' ? { x: '101%' } : { x: 0 }}
        transition={{ duration: 1.35, ease: [0.76, 0, 0.24, 1] }}
      />

      {/* Centre seam — zipper reveal line */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-px z-30 w-px"
        style={{
          background:
            'linear-gradient(to bottom, transparent, #CE8400 25%, #CE8400 75%, transparent)',
        }}
        initial={{ height: 0, opacity: 0 }}
        animate={phase === 'unzip' ? { height: '100vh', opacity: [0, 1, 1, 0] } : {}}
        transition={{ duration: 1.1, ease: 'easeOut' }}
      />

      {/* Text */}
      <motion.div
        className="absolute inset-0 z-20 flex flex-col items-center justify-center select-none"
        animate={{ opacity: phase === 'unzip' ? 0 : 1 }}
        transition={{ duration: 0.38 }}
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="label-text text-xs tracking-[0.35em] text-nature-brown mb-3"
        >
          WELCOME TO
        </motion.p>

        <div className="font-display flex" style={{ fontSize: 'clamp(52px, 9vw, 112px)' }}>
          {BRAND.split('').map((letter, i) => (
            <CyclingLetter key={i} letter={letter} delay={300 + i * 280} />
          ))}
        </div>

        {/* Underline shimmer after all letters settle */}
        <motion.div
          className="mt-4 h-px bg-nature-brown/40 origin-center"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 2.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: 'clamp(180px, 28vw, 380px)' }}
        />
      </motion.div>
    </div>
  );
}
