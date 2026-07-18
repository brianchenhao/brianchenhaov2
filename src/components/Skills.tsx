import { motion } from 'motion/react'
import { Section } from './Section'
import { Stagger, StaggerItem } from './motion/Reveal'
import { skillGroups } from '../data/skills'

export function Skills() {
  return (
    <Section id="skills" eyebrow="02" title="Technical skills">
      <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" gap={0.07}>
        {skillGroups.map(({ title, items }) => (
          <StaggerItem key={title} className="h-full">
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="h-full rounded-lg border border-border bg-surface/40 p-5 transition-colors hover:border-accent/40"
            >
              <h3 className="mb-3 text-xs uppercase tracking-[0.2em] text-fg-muted">
                {title}
              </h3>
              <motion.ul
                className="flex flex-wrap gap-2"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.03 } },
                }}
              >
                {items.map((item) => (
                  <motion.li
                    key={item}
                    variants={{
                      hidden: { opacity: 0, scale: 0.8 },
                      show: {
                        opacity: 1,
                        scale: 1,
                        transition: { duration: 0.3 },
                      },
                    }}
                    className="rounded border border-border bg-bg/60 px-2 py-1 text-xs text-fg transition-colors hover:border-accent/60 hover:text-accent"
                  >
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  )
}
