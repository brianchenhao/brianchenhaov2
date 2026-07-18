import { useEffect } from 'react'
import type { RefObject } from 'react'
import { useGLTF } from '@react-three/drei'
import type { Bone, Object3D } from 'three'

const MODEL_URL = '/character.glb'
// Mixamo-style rig minus the `mixamorig:` prefix — see Step 5 bone log.
const HEAD_BONE_NAME = 'Head'

type Props = {
  headBoneRef: RefObject<Bone | null>
}

export function Character({ headBoneRef }: Props) {
  const { scene } = useGLTF(MODEL_URL)

  useEffect(() => {
    const bones: string[] = []
    scene.traverse((o: Object3D) => {
      if ((o as Object3D & { isBone?: boolean }).isBone) {
        bones.push(o.name)
        if (o.name === HEAD_BONE_NAME) headBoneRef.current = o as Bone
      }
    })
    console.log('[character] bones:', bones)
    if (!headBoneRef.current) {
      console.warn(
        '[character] head bone not found, expected name:',
        HEAD_BONE_NAME,
      )
    }
  }, [scene, headBoneRef])

  return <primitive object={scene} />
}

useGLTF.preload(MODEL_URL)
