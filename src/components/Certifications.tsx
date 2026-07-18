import { motion } from 'motion/react'
import { Section } from './Section'
import { Stagger, StaggerItem } from './motion/Reveal'
import { certifications } from '../data/certifications'

export function Certifications() {
  return (
    <Section id="certifications" eyebrow="05" title="Certifications">
      <Stagger className="grid gap-4 sm:grid-cols-2" gap={0.08}>
        {certifications.map((c) => (
          <StaggerItem key={`${c.name}-${c.year}`} className="h-full">
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="flex h-full items-start justify-between gap-4 rounded-lg border border-border bg-surface/40 p-5 transition-colors hover:border-accent/40"
            >
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-fg">
                  {c.href ? (
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="hover:text-accent hover:underline"
                    >
                      {c.name}
                    </a>
                  ) : (
                    c.name
                  )}
                </p>
                <p className="text-xs text-fg-muted">{c.issuer}</p>
              </div>
              <span className="shrink-0 rounded border border-border px-2 py-1 text-[11px] text-fg-muted">
                {c.year}
              </span>
            </motion.div>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  )
}
