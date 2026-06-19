'use client';

import { useState, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { fadeUp, staggerContainer, reducedVariant } from '@/lib/animations';
import BYRAPattern from '@/components/BYRAPattern';

export default function ContactPage() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const shouldReduce = useReducedMotion();

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const containerVariants = shouldReduce ? {} : staggerContainer;
  const itemVariants = shouldReduce ? reducedVariant : fadeUp;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const contactInfo = [
    { label: 'Email', value: 'hello@ciallade.com', href: 'mailto:hello@ciallade.com' },
    { label: 'Instagram', value: '@ciallade', href: '#' },
    { label: 'Location', value: 'Lagos, Nigeria', href: null },
  ];

  return (
    <div className="min-h-screen bg-dark-wood pt-24 relative overflow-hidden">
      <BYRAPattern animated={false} />

      <div ref={ref} className="relative z-10 grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-6rem)]">
        {/* Left: info */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="px-6 md:px-12 lg:px-16 py-20 flex flex-col justify-center"
        >
          <motion.p variants={itemVariants} className="label-text text-xs text-nature-brown mb-6">
            Get in Touch
          </motion.p>

          <motion.h1
            variants={itemVariants}
            className="font-display text-almond-cream leading-none mb-8"
            style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}
          >
            Let&apos;s talk.
          </motion.h1>

          <motion.p variants={itemVariants} className="font-body font-light text-almond-cream/60 text-base leading-relaxed mb-12 max-w-sm">
            Whether you have a question about an order, a press inquiry, or just want to connect — we&apos;re here.
          </motion.p>

          <motion.div variants={containerVariants} className="space-y-6">
            {contactInfo.map((info) => (
              <motion.div key={info.label} variants={itemVariants}>
                <p className="label-text text-[10px] text-almond-cream/30 mb-1">{info.label}</p>
                {info.href ? (
                  <a
                    href={info.href}
                    className="font-body font-light text-almond-cream hover:text-nature-brown transition-colors duration-300 text-lg"
                  >
                    {info.value}
                  </a>
                ) : (
                  <p className="font-body font-light text-almond-cream text-lg">{info.value}</p>
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: form */}
        <div className="px-6 md:px-12 lg:px-16 py-20 flex flex-col justify-center border-l border-almond-cream/10">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <div className="w-12 h-12 border border-nature-brown flex items-center justify-center mx-auto mb-6">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#CE8400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="font-display text-almond-cream text-3xl mb-4">Message sent.</h2>
              <p className="font-body font-light text-almond-cream/60">We&apos;ll be in touch shortly.</p>
            </motion.div>
          ) : (
            <motion.form
              variants={containerVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="label-text text-[10px] text-almond-cream/40 block mb-2">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full bg-transparent border border-almond-cream/20 text-almond-cream font-body font-light text-sm px-4 py-3 focus:outline-none focus:border-nature-brown placeholder:text-almond-cream/20 transition-colors duration-300"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="label-text text-[10px] text-almond-cream/40 block mb-2">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full bg-transparent border border-almond-cream/20 text-almond-cream font-body font-light text-sm px-4 py-3 focus:outline-none focus:border-nature-brown placeholder:text-almond-cream/20 transition-colors duration-300"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="subject" className="label-text text-[10px] text-almond-cream/40 block mb-2">Subject</label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full bg-dark-wood border border-almond-cream/20 text-almond-cream font-body font-light text-sm px-4 py-3 focus:outline-none focus:border-nature-brown transition-colors duration-300"
                >
                  <option value="" className="text-almond-cream/40">Select a subject</option>
                  <option value="order">Order Inquiry</option>
                  <option value="press">Press & Media</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="other">Other</option>
                </select>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="message" className="label-text text-[10px] text-almond-cream/40 block mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Your message…"
                  className="w-full bg-transparent border border-almond-cream/20 text-almond-cream font-body font-light text-sm px-4 py-3 focus:outline-none focus:border-nature-brown placeholder:text-almond-cream/20 transition-colors duration-300 resize-none"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  className="w-full bg-nature-brown text-dark-wood label-text text-xs py-4 hover:bg-ochre-brown transition-colors duration-300"
                >
                  Send Message
                </button>
              </motion.div>
            </motion.form>
          )}
        </div>
      </div>
    </div>
  );
}
