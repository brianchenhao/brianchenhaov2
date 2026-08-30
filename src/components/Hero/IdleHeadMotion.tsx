import { useRef } from 'react'
import type { RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { Euler, MathUtils, Quaternion } from 'three'
import type { Bone } from 'three'

// Deliberately smaller than HeadTracker's clamps — this plays unprompted, so
// it should read as idle breathing rather than the character looking around.
const YAW_AMPLITUDE = MathUtils.degToRad(16)
const PITCH_AMPLITUDE = MathUtils.degToRad(5)
// Incommensurable periods (seconds) so the combined path never visibly loops.
const YAW_PERIOD = 7.3
const PITCH_PERIOD = 4.1
const SLERP_FACTOR = 0.08

type Props = {
  headBoneRef: RefObject<Bone | null>
  enabled?: boolean
}

// Touch devices have no cursor to follow, so HeadTracker leaves the head
// frozen there. This drives the same bone off the clock instead, keeping the
// rest-relative delta convention so the pose matches HeadTracker's neutral.
export function IdleHeadMotion({ headBoneRef, enabled = true }: Props) {
  const restLocal = useRef<Quaternion | null>(null)
  const delta = useRef(new Quaternion())
  const target = useRef(new Quaternion())
  const euler = useRef(new Euler(0, 0, 0, 'YXZ'))

  useFrame(({ clock }) => {
    const bone = headBoneRef.current
    if (!bone) return

    // Same first-frame capture as HeadTracker: the rig's authored head pose is
    // the origin the sine swings around, not world identity.
    if (!restLocal.current) restLocal.current = bone.quaternion.clone()
    if (!enabled) return

    const t = clock.getElapsedTime()
    euler.current.set(
      Math.sin((t / PITCH_PERIOD) * Math.PI * 2) * PITCH_AMPLITUDE,
      Math.sin((t / YAW_PERIOD) * Math.PI * 2) * YAW_AMPLITUDE,
      0,
    )
    delta.current.setFromEuler(euler.current)
    target.current.copy(restLocal.current).multiply(delta.current)
    bone.quaternion.slerp(target.current, SLERP_FACTOR)
  })

  return null
}
