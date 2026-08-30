import { useRef } from 'react'
import type { RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import type { Bone } from 'three'

// Where the camera sits relative to the head once the rig finishes loading.
// +0.05 Y nudges the framing slightly above the head's centerline so the chin
// doesn't crowd the bottom of the canvas. Z is the *base* distance, tuned for
// a roughly 0.8-aspect canvas; DESIGN_ASPECT below scales it from there.
const CAMERA_OFFSET = new Vector3(0, 0.05, 1.5)

// The canvas aspect the 1.5 distance was framed against. Measured, not
// guessed: a half-width column in a 1280x800 window is 507x768 = 0.66, and a
// 1920x1080 window lands in the same place once max-h caps the column. At or
// above this the framing is left exactly as it already looks on desktop.
const DESIGN_ASPECT = 0.66

// A three.js PerspectiveCamera's fov is VERTICAL, so horizontal framing falls
// away as the canvas narrows: hFov = 2·atan(tan(fov/2)·aspect). In a phone's
// "desktop mode" the column ends up around 0.22 aspect, which collapses 28°
// vertical into ~6° horizontal — the head fills the column and crops. Pulling
// the camera back in proportion keeps the horizontal framing constant.
const MAX_DISTANCE = 4.2

// Re-aim only when the aspect actually moves; otherwise the camera stays put
// so head rotation reads as the head turning, not the camera drifting.
const ASPECT_EPSILON = 0.01

type Props = {
  headBoneRef: RefObject<Bone | null>
}

// The character's head ends up around y=1.7 in world space, but Canvas's
// default camera looks at the origin — so without this, the head renders
// above the viewport and any cursor-driven rotation is invisible.
export function AimCameraAtHead({ headBoneRef }: Props) {
  const { camera } = useThree()
  const headPos = useRef(new Vector3())
  const captured = useRef(false)
  const lastAspect = useRef(-1)

  useFrame(({ size }) => {
    const bone = headBoneRef.current
    if (!bone) return

    const aspect = size.height > 0 ? size.width / size.height : DESIGN_ASPECT
    if (
      captured.current &&
      Math.abs(aspect - lastAspect.current) < ASPECT_EPSILON
    ) {
      return
    }

    // World position is stable under head rotation, so capturing it once is
    // enough — later passes only re-derive the distance.
    if (!captured.current) {
      bone.getWorldPosition(headPos.current)
      captured.current = true
    }
    lastAspect.current = aspect

    const distance =
      aspect < DESIGN_ASPECT
        ? Math.min(CAMERA_OFFSET.z * (DESIGN_ASPECT / aspect), MAX_DISTANCE)
        : CAMERA_OFFSET.z

    camera.position.set(
      headPos.current.x + CAMERA_OFFSET.x,
      headPos.current.y + CAMERA_OFFSET.y,
      headPos.current.z + distance,
    )
    camera.lookAt(headPos.current)
  })

  return null
}
