import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

/* Shared scroll-reveal primitives. Every below-the-fold element enters
 * through one of these so the motion language stays consistent: rise 24px,
 * fade in, slight blur-off. Respects prefers-reduced-motion by collapsing
 * to a plain fade. */

type RevealProps = {
  children: ReactNode
  delay?: number
  className?: string
  /** Horizontal slide instead of vertical rise. */
  fromX?: number
}

export function Reveal({ children, delay = 0, className, fromX }: RevealProps) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        y: reduce || fromX !== undefined ? 0 : 24,
        x: reduce ? 0 : (fromX ?? 0),
        filter: 'blur(4px)',
      }}
      whileInView={{ opacity: 1, y: 0, x: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  )
}

type StaggerProps = {
  children: ReactNode
  className?: string
  /** Seconds between each child's entrance. */
  gap?: number
}

/* Parent/child pair for staggered list entrances. Children must be
 * <StaggerItem>. */
export function Stagger({ children, className, gap = 0.08 }: StaggerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: gap } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      /* min-w-0 first so a caller's className can still override it. Grid and
       * flex children default to min-width:auto, which refuses to shrink below
       * their content — on a narrow phone that pushed cards wider than their
       * track and gave the whole page a horizontal scrollbar. */
      className={`min-w-0 ${className ?? ''}`}
      variants={{
        hidden: { opacity: 0, y: reduce ? 0 : 20, scale: reduce ? 1 : 0.98 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] },
        },
      }}
    >
      {children}
    </motion.div>
  )
}
