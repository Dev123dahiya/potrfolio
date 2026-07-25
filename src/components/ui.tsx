import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Section({
  id, title, kicker, children,
}: { id: string; title: string; kicker?: string; children: ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-5xl px-5 py-20 md:py-24">
      <Reveal>
        <div className="mb-10">
          {kicker && <div className="mb-2 font-mono text-xs uppercase tracking-widest text-accent">{kicker}</div>}
          <h2 className="section-title">{title}</h2>
        </div>
      </Reveal>
      {children}
    </section>
  );
}
