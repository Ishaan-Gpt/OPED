import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { LoopOnce } from "three";
import { SkeletonUtils } from "three-stdlib";
import { useLessonStore } from "../../store/useLessonStore";
import { useSeatedPose } from "../../hooks/useSeatedPose";

const TINTS = [0xffd1dc, 0xc9e4ff, 0xd6ffd1, 0xfff3c2, 0xe6d1ff, 0xffdcc2];

const FLOOR_Y = -8;
// Front-center seat [0, FLOOR_Y, -2.5] is omitted so the line of sight from the student desk to the blackboard is completely unobstructed.
export const SEATS: [number, number, number][] = [
  [-13, FLOOR_Y, -2.5], // front row left
  [13, FLOOR_Y, -2.5],  // front row right
  [-13, FLOOR_Y, 9.5],  // back row left
  [13, FLOOR_Y, 9.5],   // back row right
  [-13, FLOOR_Y, 11.5], // outer row left
  [13, FLOOR_Y, 11.5],  // outer row right
];

const KESHAV_SEATS = new Set([1, 3]);

function faceBoardAngle(x: number, z: number, nativeForwardZ: number) {
  const raw = Math.atan2(-0.4 * x, -16 - z);
  return nativeForwardZ < 0 ? raw + Math.PI : raw;
}

function PeasantStudent({ index, name }: { index: number; name: string }) {
  const gltf = useGLTF("/models/peasant/scene.gltf") as any;
  const scene = gltf.scene;
  const animations = gltf.animations;

  const raisedHandStudent = useLessonStore((s) => s.raisedHandStudent);
  const isAsking = raisedHandStudent === index;
  const inner = useRef<THREE.Group>(null);
  const armBone = useRef<THREE.Bone | null>(null);
  const armBase = useRef<THREE.Euler | null>(null);
  const raiseAmount = useRef(0);

  const clone = useMemo(() => {
    const c = SkeletonUtils.clone(scene);
    const tint = new THREE.Color(TINTS[index % TINTS.length]);
    c.traverse((o: THREE.Object3D) => {
      if ((o as THREE.SkinnedMesh).isSkinnedMesh || (o as THREE.Mesh).isMesh) {
        const mesh = o as THREE.Mesh;
        mesh.material = (mesh.material as THREE.MeshStandardMaterial).clone();
        (mesh.material as THREE.MeshStandardMaterial).color.lerp(tint, 0.25);
      }
    });
    return c;
  }, [scene, index]);

  const mixer = useMemo(() => new THREE.AnimationMixer(clone), [clone]);

  useEffect(() => {
    const idleClip = animations.find((a: THREE.AnimationClip) => /idle/i.test(a.name)) ?? animations[0];
    if (idleClip) {
      const idle = mixer.clipAction(idleClip);
      idle.play();
      idle.time = Math.random() * idleClip.duration;
    }
    clone.traverse((o: THREE.Object3D) => {
      if (!armBone.current && (o as THREE.Bone).isBone && /upper_?arm/i.test(o.name) && /l\b|left|\.l|_l/i.test(o.name)) {
        armBone.current = o as THREE.Bone;
        armBase.current = o.rotation.clone();
      }
    });
    return () => {
      mixer.stopAllAction();
    };
  }, [animations, mixer, clone]);

  useFrame((_, delta) => {
    mixer.update(delta);
    raiseAmount.current = THREE.MathUtils.lerp(raiseAmount.current, isAsking ? 1 : 0, delta * 5);
    const arm = armBone.current;
    if (arm && armBase.current) {
      arm.rotation.z = armBase.current.z + raiseAmount.current * -2.2;
    }
  });

  useSeatedPose({
    innerRef: inner,
    clone,
    targetHeight: 8.8 + (index % 3) * 0.3,
    nativeForwardZ: -1,
    hipNames: { L: /^thigh\.?L/, R: /^thigh\.?R/ },
    kneeNames: { L: /^shin\.?L/, R: /^shin\.?R/ },
    thighFraction: 0.465,
  });

  const seatPos: [number, number, number] = SEATS[index % SEATS.length] || [-13, FLOOR_Y, -2.5];
  const [x, y, z] = seatPos;
  const faceBoard = faceBoardAngle(x, z, -1);
  return (
    <group position={[x, y, z]} rotation={[0, faceBoard, 0]} name={`student-${name}`}>
      <group ref={inner}>
        <primitive object={clone} />
      </group>
    </group>
  );
}

const KESHAV_ANIM = {
  idle: "IdleV4.2(maya_head)",
  raise: "greet",
};

function KeshavStudent({ index, name }: { index: number; name: string }) {
  const gltfKeshav = useGLTF("/models/keshav.glb") as any;
  const scene = gltfKeshav.scene;
  const gltfEmilian = useGLTF("/models/emilian-avatar.glb") as any;
  const animations = gltfEmilian.animations;

  const raisedHandStudent = useLessonStore((s) => s.raisedHandStudent);
  const isAsking = raisedHandStudent === index;
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const wasAsking = useRef(false);

  const clone = useMemo(() => {
    const c = SkeletonUtils.clone(scene);
    const tint = new THREE.Color(TINTS[index % TINTS.length]);
    c.traverse((o: THREE.Object3D) => {
      if ((o as THREE.SkinnedMesh).isSkinnedMesh || (o as THREE.Mesh).isMesh) {
        const mesh = o as THREE.Mesh;
        mesh.material = (mesh.material as THREE.MeshStandardMaterial).clone();
        (mesh.material as THREE.MeshStandardMaterial).color.lerp(tint, 0.25);
      }
    });
    return c;
  }, [scene, index]);

  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    actions[KESHAV_ANIM.idle]?.reset().fadeIn(0.3).play();
  }, [actions]);

  useFrame(() => {
    if (isAsking && !wasAsking.current) {
      const idle = actions[KESHAV_ANIM.idle];
      const raise = actions[KESHAV_ANIM.raise];
      idle?.fadeOut(0.4);
      raise?.reset().fadeIn(0.4).play();
      if (raise) {
        raise.clampWhenFinished = true;
        raise.setLoop(LoopOnce, 1);
      }
      wasAsking.current = true;
    } else if (!isAsking && wasAsking.current) {
      actions[KESHAV_ANIM.raise]?.fadeOut(0.4);
      actions[KESHAV_ANIM.idle]?.reset().fadeIn(0.4).play();
      wasAsking.current = false;
    }
  });

  useSeatedPose({
    innerRef: inner,
    clone,
    targetHeight: 8.8 + (index % 3) * 0.3,
    nativeForwardZ: 1,
    hipNames: { L: /^LeftUpLeg$/, R: /^RightUpLeg$/ },
    kneeNames: { L: /^LeftLeg$/, R: /^RightLeg$/ },
    thighFraction: 0.485,
  });

  const seatPos: [number, number, number] = SEATS[index % SEATS.length] || [13, FLOOR_Y, -2.5];
  const [x, y, z] = seatPos;
  const faceBoard = faceBoardAngle(x, z, 1);
  return (
    <group ref={group} position={[x, y, z]} rotation={[0, faceBoard, 0]} name={`student-${name}`}>
      <group ref={inner}>
        <primitive object={clone} />
      </group>
    </group>
  );
}

function Student({ index, name }: { index: number; name: string }) {
  return KESHAV_SEATS.has(index % SEATS.length) ? (
    <KeshavStudent index={index} name={name} />
  ) : (
    <PeasantStudent index={index} name={name} />
  );
}

export function Students() {
  const config = useLessonStore((s) => s.config);
  const names = config?.studentNames ?? ["Aarav", "Priya", "Ananya", "Vikram", "Rohan"];
  return (
    <group>
      {names.map((name: string, i: number) => (
        <Student key={name + i} index={i} name={name} />
      ))}
    </group>
  );
}

useGLTF.preload("/models/peasant/scene.gltf");
useGLTF.preload("/models/keshav.glb");
useGLTF.preload("/models/emilian-avatar.glb");
