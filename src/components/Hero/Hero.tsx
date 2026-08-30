import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, useReducedMotion } from 'motion/react'
import type { Bone } from 'three'
import { Character } from './Character'
import { ChatBox } from './ChatBox'
import { HeadTracker } from './HeadTracker'
import { IdleHeadMotion } from './IdleHeadMotion'
import { AimCameraAtHead } from './AimCameraAtHead'
import { useIsMobile } from '../../hooks/useIsMobile'
import { about } from '../../data/about'
import { profile } from '../../data/profile'

/* Word-by-word entrance for the headline. Each word rises out of an
 * overflow-clipped span so the reveal reads as a "lift" rather than a fade. */
function AnimatedHeadline({ text }: { text: string }) {
  const reduce = useReducedMotion()
  const words = text.split(' ')
  return (
    <h1 className="text-4xl font-semibold leading-tight text-fg md:text-5xl">
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: reduce ? 0 : '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.55,
              delay: 0.25 + i * 0.09,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </h1>
  )
}

export function Hero() {
  const isMobile = useIsMobile()
  const reduce = useReducedMotion()
  const headBoneRef = useRef<Bone | null>(null)

  // Everything in the intro column enters in a single choreographed sequence.
  const enter = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.55,
      delay,
      ease: [0.21, 0.47, 0.32, 0.98] as const,
    },
  })

  return (
    <section id="hero" className="relative w-full">
      {/* The hero owns the first viewport. Below md the layout stacks so the
       * canvas sits under the intro — phones can't track a cursor anyway and
       * see the PNG fallback instead. */}
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-stretch gap-10 px-6 py-20 md:flex-row md:items-center md:gap-12 md:py-0">
        <div className="flex flex-col justify-center gap-6 md:w-1/2">
          <motion.p
            {...enter(0.1)}
            className="text-xs uppercase tracking-[0.3em] text-fg-muted"
          >
            {profile.role}
          </motion.p>
          <AnimatedHeadline text={profile.name} />
          <motion.p
            {...enter(0.55)}
            className="max-w-xl text-base leading-relaxed text-fg-muted"
          >
            {about.tagline}
          </motion.p>
          <motion.div
            {...enter(0.7)}
            className="flex flex-wrap items-center gap-3 pt-2"
          >
            <motion.a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noreferrer noopener"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-90"
            >
              Connect on LinkedIn
              <span aria-hidden="true">→</span>
            </motion.a>
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-fg transition-colors hover:border-accent hover:text-accent"
            >
              See projects
            </motion.a>
          </motion.div>
          <motion.div {...enter(0.85)}>
            <ChatBox />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
          /* max-h caps the column on very tall viewports — a phone in desktop
           * mode reports ~980x2100, which made this 2016px tall against a
           * 417px width (0.21 aspect) and left the camera framing a sliver. */
          className="relative h-[55vh] max-h-[560px] w-full md:h-screen md:max-h-[860px] md:w-1/2"
        >
          {/* The character renders on every device — only what drives the head
           * changes, since a touch screen has no cursor to follow. dpr is
           * capped so a 3x phone screen doesn't render 9x the pixels. */}
          <Canvas camera={{ position: [0, 1.5, 3], fov: 28 }} dpr={[1, 2]}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={0.9} />
            <Suspense fallback={null}>
              <Character headBoneRef={headBoneRef} />
            </Suspense>
            <AimCameraAtHead headBoneRef={headBoneRef} />
            {isMobile ? (
              <IdleHeadMotion headBoneRef={headBoneRef} enabled={!reduce} />
            ) : (
              <HeadTracker headBoneRef={headBoneRef} />
            )}
          </Canvas>
        </motion.div>
      </div>

      {/* Scroll cue: a slow-bobbing chevron anchored to the hero's bottom. */}
      <motion.a
        href="#about"
        aria-label="scroll to about"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-fg-muted transition-colors hover:text-accent md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
      >
        <motion.span
          className="block text-xl"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          ↓
        </motion.span>
      </motion.a>
    </section>
  )
}
