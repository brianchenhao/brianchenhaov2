import { Section } from './Section'
import { Reveal, Stagger, StaggerItem } from './motion/Reveal'
import { about } from '../data/about'

export function About() {
  return (
    <Section id="about" eyebrow="01" title="About">
      <div className="grid gap-12 md:grid-cols-3">
        <div className="space-y-5 md:col-span-2">
          {about.paragraphs.map((p, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <p className="text-base leading-relaxed text-fg-muted">{p}</p>
            </Reveal>
          ))}
        </div>
        <Stagger
          className="self-start border-l border-border pl-6"
          gap={0.12}
        >
          <dl className="space-y-4">
            {about.facts.map(({ label, value }) => (
              <StaggerItem key={label}>
                <div className="flex flex-col gap-1">
                  <dt className="text-xs uppercase tracking-[0.2em] text-fg-muted">
                    {label}
                  </dt>
                  <dd className="text-sm text-fg">{value}</dd>
                </div>
              </StaggerItem>
            ))}
          </dl>
        </Stagger>
      </div>
    </Section>
  )
}
