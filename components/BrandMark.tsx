'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * BrandMark — a small, fixed, glassy "CIALLADE" wordmark anchored to the
 * top-left on every page, linking home.
 *
 * On the homepage it stays hidden so it never fights the hero's own top-left
 * headline ("Be Yourself."), revealing only once the visitor scrolls past
 * ~90% of the first viewport. On all other routes it appears right away —
 * those pages carry top padding (e.g. pt-24), so there is no collision.
 *
 * SSR-safe: window is only ever read inside effects.
 */
export default function BrandMark() {
  const pathname = usePathname();
  const shouldReduce = useReducedMotion();
  const isHome = pathname === '/';

  // Non-home routes start visible; the homepage starts hidden and is
  // revealed by the scroll effect below.
  const [visible, setVisible] = useState(!isHome);

  useEffect(() => {
    if (!isHome) {
      setVisible(true);
      return;
    }

    // Homepage: reveal once scrolled past ~90% of the first viewport height.
    const check = () => {
      setVisible(window.scrollY > window.innerHeight * 0.9);
    };

    check(); // handles reloads that restore an already-scrolled position
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, [isHome]);

  const variants = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : -8 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      // Wrapper never intercepts clicks; only the pill itself does.
      className="pointer-events-none fixed left-4 top-4 z-50 md:left-6 md:top-6"
      initial="hidden"
      animate={visible ? 'visible' : 'hidden'}
      variants={variants}
      transition={shouldReduce ? { duration: 0 } : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href="/"
        aria-label="Ciallade — home"
        aria-hidden={!visible}
        tabIndex={visible ? 0 : -1}
        className={`group inline-flex items-center rounded-full border border-nature-brown/30 bg-dark-wood/60 px-4 py-2.5 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.6)] backdrop-blur-md transition-colors duration-300 hover:border-nature-brown/60 hover:bg-dark-wood/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-nature-brown/60 ${
          visible ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <span className="font-display text-[13px] leading-none tracking-[0.22em] text-almond-cream transition-colors duration-300 group-hover:text-nature-brown">
          CIALLADE
        </span>
      </Link>
    </motion.div>
  );
}
