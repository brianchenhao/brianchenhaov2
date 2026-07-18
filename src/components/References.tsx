import { Section } from './Section'
import { Reveal } from './motion/Reveal'
import { profile } from '../data/profile'

export function References() {
  return (
    <Section id="references" eyebrow="07" title="References">
      <Reveal>
        <p className="max-w-2xl text-base leading-relaxed text-fg-muted">
          References from prior managers and collaborators are available on
          request. Reach out via{' '}
          <a
            href={profile.linkedinUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="text-accent hover:underline"
          >
            LinkedIn
          </a>{' '}
          and I'll be glad to put you in touch.
        </p>
      </Reveal>
    </Section>
  )
}
