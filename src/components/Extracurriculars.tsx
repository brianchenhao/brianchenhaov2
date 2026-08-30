import { motion } from 'motion/react'
import { Section } from './Section'
import { Stagger, StaggerItem } from './motion/Reveal'
import { extracurriculars } from '../data/extracurriculars'

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]
function fmt(date: string): string {
  if (date === 'present') return 'present'
  const [y, m] = date.split('-')
  // Fall back to the raw string for anything that isn't 'YYYY-MM' — free-text
  // from the portal must never render the literal string "undefined".
  if (!y || !m) return date
  return `${MONTHS[Number(m) - 1] ?? m} ${y}`
}

export function Extracurriculars() {
  return (
    <Section id="extracurriculars" eyebrow="06" title="Extracurriculars">
      <Stagger className="grid gap-5 md:grid-cols-2" gap={0.1}>
        {extracurriculars.map((x) => (
          <StaggerItem key={`${x.org}-${x.start}`} className="h-full">
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="flex h-full flex-col gap-2 rounded-lg border border-border bg-surface/40 p-5 transition-colors hover:border-accent/40"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-fg-muted">
                {fmt(x.start)} — {fmt(x.end)}
              </p>
              <h3 className="text-base font-semibold text-fg">
                {x.role} <span className="text-fg-muted">·</span>{' '}
                <span className="text-fg-muted">{x.org}</span>
              </h3>
              <p className="text-sm leading-relaxed text-fg-muted">{x.summary}</p>
            </motion.div>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  )
}
