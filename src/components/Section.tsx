import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { Reveal } from './motion/Reveal'

type Props = {
  id: string
  // Short, eyebrow-style label that appears above the heading. Kept tiny and
  // mono-spaced so a scanning recruiter can find sections quickly.
  eyebrow?: string
  title: string
  children: ReactNode
}

export function Section({ id, eyebrow, title, children }: Props) {
  return (
    <section
      id={id}
      className="border-t border-border px-6 py-20 md:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-col gap-2">
          {eyebrow && (
            <Reveal>
              <p className="text-xs uppercase tracking-[0.3em] text-accent">
                {eyebrow}
              </p>
            </Reveal>
          )}
          <Reveal delay={0.08}>
            <h2 className="text-2xl font-semibold text-fg md:text-3xl">
              {title}
            </h2>
          </Reveal>
          {/* Accent rule that draws itself in as the heading lands. */}
          <motion.div
            aria-hidden="true"
            className="mt-2 h-px bg-accent/60"
            initial={{ width: 0 }}
            whileInView={{ width: '4rem' }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          />
        </header>
        {children}
      </div>
    </section>
  )
}
