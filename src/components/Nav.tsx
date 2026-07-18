import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'

const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'extracurriculars', label: 'Extracurriculars' },
  { id: 'references', label: 'References' },
] as const

export function Nav() {
  const [activeId, setActiveId] = useState<string | null>(null)

  // Page scroll progress, springed so the bar glides instead of jittering.
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })

  useEffect(() => {
    // rootMargin draws an active-band roughly between 30% and 35% from the
    // top of the viewport. A section is "active" while its top edge sits in
    // that band — so the highlight updates well before you reach the end of
    // a long section, which matches how visitors actually scan.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
            return
          }
        }
      },
      { rootMargin: '-30% 0px -65% 0px', threshold: 0 },
    )

    for (const { id } of SECTIONS) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <motion.nav
      initial={{ y: -56, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur"
    >
      {/* Scroll progress bar hugging the nav's bottom edge. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-accent"
        style={{ scaleX: progress }}
      />
      <div className="flex h-14 items-center justify-between px-6">
        <a
          href="#hero"
          className="text-sm font-semibold text-fg transition-colors hover:text-accent"
        >
          brian chen
        </a>
        <ul className="flex items-center gap-5">
          {SECTIONS.map(({ id, label }) => (
            <li key={id} className="relative">
              <a
                href={`#${id}`}
                className={
                  'text-xs uppercase tracking-wider transition-colors ' +
                  (activeId === id
                    ? 'text-accent'
                    : 'text-fg-muted hover:text-fg')
                }
              >
                {label}
              </a>
              {/* Shared-layout underline slides between active items. */}
              {activeId === id && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-px bg-accent"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    </motion.nav>
  )
}
