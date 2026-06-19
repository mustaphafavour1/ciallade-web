'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import BYRAPattern from './BYRAPattern';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/collections', label: 'Collections' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const socialLinks = [
    { href: '#', label: 'Instagram' },
    { href: '#', label: 'X (Twitter)' },
    { href: '#', label: 'Pinterest' },
    { href: '#', label: 'TikTok' },
  ];

  return (
    <footer className="relative bg-dark-wood overflow-hidden">
      {/* BYRA pattern behind footer */}
      <BYRAPattern opacity={0.04} animated={false} />

      {/* Top rule */}
      <div className="relative z-10 border-t border-nature-brown/20" />

      <div className="relative z-10 px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {/* Column 1: Logo + tagline */}
          <div className="lg:col-span-1">
            <Link href="/" className="block font-display text-nature-brown text-4xl md:text-5xl leading-none mb-4 hover:opacity-80 transition-opacity">
              Ciallade
            </Link>
            <p className="font-body font-light text-almond-cream/50 text-sm leading-relaxed">
              Be Yourself, Reinvent Always.
            </p>
            <p className="mt-3 font-body font-light text-almond-cream/30 text-xs">
              A luxury Nigerian fashion brand.
            </p>
          </div>

          {/* Column 2: Links */}
          <div>
            <p className="label-text text-xs text-nature-brown mb-6">Navigate</p>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body font-light text-almond-cream/60 text-sm hover:text-almond-cream transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Social */}
          <div>
            <p className="label-text text-xs text-nature-brown mb-6">Follow</p>
            <ul className="space-y-3">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    aria-label={`Follow Ciallade on ${link.label}`}
                    className="font-body font-light text-almond-cream/60 text-sm hover:text-almond-cream transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <p className="label-text text-xs text-nature-brown mb-6">Stay Close</p>
            <p className="font-body font-light text-almond-cream/60 text-sm mb-4 leading-relaxed">
              New drops, stories, and exclusive edits — straight to you.
            </p>
            {submitted ? (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-body font-light text-nature-brown text-sm"
              >
                You&apos;re in. Welcome to the circle.
              </motion.p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  aria-label="Email address for newsletter"
                  className="bg-transparent border border-almond-cream/20 text-almond-cream font-body font-light text-sm px-4 py-3 focus:outline-none focus:border-nature-brown placeholder:text-almond-cream/30 transition-colors duration-300"
                />
                <button
                  type="submit"
                  className="label-text text-xs text-dark-wood bg-nature-brown px-6 py-3 hover:bg-ochre-brown transition-colors duration-300 text-left"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-16 pt-6 border-t border-almond-cream/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body font-light text-almond-cream/30 text-xs">
            © {new Date().getFullYear()} Ciallade. All rights reserved.
          </p>
          <p className="font-body font-light text-almond-cream/30 text-xs">
            Lagos, Nigeria
          </p>
        </div>
      </div>
    </footer>
  );
}
