import type { ReactNode } from 'react';
import Reveal from './Reveal';

// Dark full-width band with one bold line, used between sections.
export default function Band({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <section className="bg-band py-16 text-center text-white sm:py-20">
      <Reveal className="wrap">
        <p className="mx-auto max-w-[46rem] font-display text-[1.3rem] font-bold italic leading-snug sm:text-[1.6rem]">{children}</p>
        {action && <div className="mt-7">{action}</div>}
      </Reveal>
    </section>
  );
}
