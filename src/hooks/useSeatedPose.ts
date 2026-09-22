import { useEffect, useRef, RefObject } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { normalizeToHeight } from "../lib/threeUtils";

const UP = new THREE.Vector3(0, 1, 0);
const SEAT_HIP_ANGLE = THREE.MathUtils.degToRad(100);
const SEAT_KNEE_ANGLE = -SEAT_HIP_ANGLE;

function twistBoneWorldAxis(bone: THREE.Bone, axisWorld: THREE.Vector3, angleRad: number) {
  if (!bone.parent) return;
  const parentWorldQuat = new THREE.Quaternion();
  bone.parent.getWorldQuaternion(parentWorldQuat);
  const deltaWorld = new THREE.Quaternion().setFromAxisAngle(axisWorld, angleRad);
  const localDelta = parentWorldQuat.clone().invert().multiply(deltaWorld).multiply(parentWorldQuat);
  bone.quaternion.premultiply(localDelta);
  bone.updateMatrixWorld(true);
}

function findBones(root: THREE.Object3D, names: Record<string, RegExp>) {
  const found: Record<string, THREE.Bone> = {};
  root.traverse((o) => {
    if (!(o as THREE.Bone).isBone) return;
    for (const key of Object.keys(names)) {
      if (found[key]) continue;
      if (names[key]?.test(o.name)) found[key] = o as THREE.Bone;
    }
  });
  return found;
}

interface UseSeatedPoseProps {
  innerRef: RefObject<THREE.Group | null>;
  clone: THREE.Object3D;
  targetHeight: number;
  nativeForwardZ: number;
  hipNames: { L: RegExp; R: RegExp };
  kneeNames: { L: RegExp; R: RegExp };
  thighFraction?: number;
}

export function useSeatedPose({
  innerRef,
  clone,
  targetHeight,
  nativeForwardZ,
  hipNames,
  kneeNames,
  thighFraction = 0.47,
}: UseSeatedPoseProps) {
  const bones = useRef<Record<string, THREE.Bone> | null>(null);
  const normalized = useRef(0);
  const seated = useRef(false);

  useEffect(() => {
    bones.current = findBones(clone, {
      hipL: hipNames.L,
      hipR: hipNames.R,
      kneeL: kneeNames.L,
      kneeR: kneeNames.R,
    });
    normalized.current = 0;
    seated.current = false;
  }, [clone, hipNames.L, hipNames.R, kneeNames.L, kneeNames.R]);

  useFrame(() => {
    const inner = innerRef.current;
    if (!inner) return;

    if (normalized.current >= 0 && ++normalized.current > 4) {
      if (normalizeToHeight(inner, targetHeight)) {
        normalized.current = -1;
        const b = bones.current;
        if (b && b["hipL"]) {
          const hipWorld = new THREE.Vector3();
          b["hipL"].getWorldPosition(hipWorld);
          const innerWorld = new THREE.Vector3();
          inner.getWorldPosition(innerWorld);
          const hipHeight = hipWorld.y - innerWorld.y;
          inner.position.y -= hipHeight * thighFraction;
        }
        seated.current = true;
      }
    }

    const b = bones.current;
    if (seated.current && b && b["hipL"] && b["hipR"] && b["kneeL"] && b["kneeR"]) {
      const forwardWorld = new THREE.Vector3(0, 0, nativeForwardZ).applyQuaternion(
        clone.getWorldQuaternion(new THREE.Quaternion())
      );
      const rightWorld = new THREE.Vector3().crossVectors(forwardWorld, UP).normalize();
      twistBoneWorldAxis(b["hipL"], rightWorld, SEAT_HIP_ANGLE);
      twistBoneWorldAxis(b["kneeL"], rightWorld, SEAT_KNEE_ANGLE);
      twistBoneWorldAxis(b["hipR"], rightWorld, SEAT_HIP_ANGLE);
      twistBoneWorldAxis(b["kneeR"], rightWorld, SEAT_KNEE_ANGLE);
    }
  });
}
