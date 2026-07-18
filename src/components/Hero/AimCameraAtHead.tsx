import { useRef } from 'react'
import type { RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import type { Bone } from 'three'

// Where the camera sits relative to the head once the rig finishes loading.
// Z is in front of the character (the character faces +Z given the scene
// setup); +0.05 Y nudges the framing slightly above the head's centerline so
// the chin doesn't crowd the bottom of the canvas.
const CAMERA_OFFSET = new Vector3(0, 0.05, 1.5)

type Props = {
  headBoneRef: RefObject<Bone | null>
}

// The character's head ends up around y=1.7 in world space, but Canvas's
// default camera looks at the origin — so without this, the head renders
// above the viewport and any cursor-driven rotation is invisible. We snap
// the camera onto the head once on first frame (when the bone is available)
// and leave it there, so the camera stays static while the head rotates.
export function AimCameraAtHead({ headBoneRef }: Props) {
  const { camera } = useThree()
  const aimed = useRef(false)
  const headPos = useRef(new Vector3())

  useFrame(() => {
    if (aimed.current) return
    const bone = headBoneRef.current
    if (!bone) return
    bone.getWorldPosition(headPos.current)
    camera.position.set(
      headPos.current.x + CAMERA_OFFSET.x,
      headPos.current.y + CAMERA_OFFSET.y,
      headPos.current.z + CAMERA_OFFSET.z,
    )
    camera.lookAt(headPos.current)
    aimed.current = true
  })

  return null
}
