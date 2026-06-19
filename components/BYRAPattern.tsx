'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { lineDrawIn } from '@/lib/animations';

interface BYRAPatternProps {
  color?: string;
  opacity?: number;
  className?: string;
  animated?: boolean;
}

export default function BYRAPattern({
  color = '#CE8400',
  opacity = 0.06,
  className = '',
  animated = true,
}: BYRAPatternProps) {
  const shouldReduce = useReducedMotion();

  const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  const size = 80;
  const cols = 20;
  const rows = 20;

  for (let i = -2; i <= cols + 2; i++) {
    // diagonal down-right
    lines.push({
      x1: i * size,
      y1: 0,
      x2: i * size + rows * size,
      y2: rows * size,
    });
    // diagonal down-left
    lines.push({
      x1: i * size,
      y1: 0,
      x2: i * size - rows * size,
      y2: rows * size,
    });
  }

  const svgProps = {
    xmlns: 'http://www.w3.org/2000/svg',
    className: `absolute inset-0 w-full h-full pointer-events-none ${className}`,
    style: { opacity },
    overflow: 'visible' as const,
  };

  if (animated && !shouldReduce) {
    return (
      <svg {...svgProps}>
        {lines.map((line, i) => (
          <motion.line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={color}
            strokeWidth="0.5"
            initial="hidden"
            animate="visible"
            variants={lineDrawIn}
            transition={{ delay: i * 0.015, duration: 1.8, ease: 'easeInOut' }}
          />
        ))}
      </svg>
    );
  }

  return (
    <svg {...svgProps}>
      {lines.map((line, i) => (
        <line
          key={i}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke={color}
          strokeWidth="0.5"
        />
      ))}
    </svg>
  );
}
