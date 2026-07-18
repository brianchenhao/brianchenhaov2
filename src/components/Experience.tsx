import { motion } from 'motion/react'
import { Section } from './Section'
import { Reveal } from './motion/Reveal'
import { experience } from '../data/experience'

// 'YYYY-MM' → 'Mon YYYY'. 'present' is passed through. We parse manually so a
// missing locale or weird TZ on the host never shifts the rendered month.
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]
function fmt(date: string): string {
  if (date === 'present') return 'present'
  const [y, m] = date.split('-')
  return `${MONTHS[Number(m) - 1] ?? m} ${y}`
}

export function Experience() {
  return (
    <Section id="experience" eyebrow="04" title="Experience">
      <ol className="relative space-y-10 border-l border-border pl-8">
        {experience.map((e, idx) => (
          <li key={`${e.org}-${e.start}`} className="relative">
            {/* The dot on the timeline. Scales in, then a soft ping ring. */}
            <motion.span
              aria-hidden="true"
              className="absolute -left-[2.15rem] top-2 h-2 w-2 rounded-full bg-accent"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.2 }}
            />
            <motion.span
              aria-hidden="true"
              className="absolute -left-[2.15rem] top-2 h-2 w-2 rounded-full bg-accent/50"
              initial={{ scale: 1, opacity: 0 }}
              whileInView={{ scale: [1, 2.4], opacity: [0.6, 0] }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: 0.45, ease: 'easeOut' }}
            />
            <Reveal fromX={-24} delay={idx * 0.1}>
              <div className="flex flex-col gap-1">
                <p className="text-xs uppercase tracking-[0.2em] text-fg-muted">
                  {fmt(e.start)} — {fmt(e.end)}
                </p>
                <h3 className="text-lg font-semibold text-fg">
                  {e.role} <span className="text-fg-muted">·</span>{' '}
                  <span className="text-fg-muted">{e.org}</span>
                </h3>
              </div>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-fg-muted marker:text-fg-muted">
                {e.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  )
}
