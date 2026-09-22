import { useEffect, useRef } from "react";
import * as THREE from "three";
import { LoopOnce } from "three";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useLessonStore } from "../../store/useLessonStore";
import { normalizeToHeight } from "../../lib/threeUtils";

const DEFAULT_MODEL_URL = "/models/emilian-avatar.glb";

const ANIM_CONFIG: Record<string, { idle: string; talk: string[] }> = {
  "/models/cop/scene.gltf": {
    idle: "Breathing Idle",
    talk: ["Talking On A Cell Phone"],
  },
};

const DEFAULT_ANIM_CONFIG = {
  idle: "IdleV4.2(maya_head)",
  talk: ["greet", "think", "look_around", "thanks"],
};

export interface TeacherProps {
  height?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  isSpeakingOverride?: boolean;
}

export function Teacher({ height = 12.6, isSpeakingOverride, position, rotation }: TeacherProps) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const storeModelUrl = useLessonStore((s) => s.config?.teacher?.modelUrl);
  const modelUrl = storeModelUrl || DEFAULT_MODEL_URL;
  const anim = ANIM_CONFIG[modelUrl] || DEFAULT_ANIM_CONFIG;
  const gltf = useGLTF(modelUrl) as any;
  const scene = gltf.scene;
  const animations = gltf.animations;
  const { actions } = useAnimations(animations, group);
  const storeSpeaking = useLessonStore((s) => s.speaking);
  const speaking = isSpeakingOverride !== undefined ? isSpeakingOverride : storeSpeaking;

  const headBone = useRef<THREE.Bone | null>(null);
  const baseHeadRot = useRef<THREE.Euler | null>(null);
  const currentGesture = useRef<string | null>(null);
  const gestureTimer = useRef(0);
  const wasSpeaking = useRef(false);

  const normalized = useRef(0);

  useEffect(() => {
    const idle = actions[anim.idle] || Object.values(actions)[0];
    idle?.reset().fadeIn(0.3).play();
    scene.traverse((o: THREE.Object3D) => {
      if (!headBone.current && (o as THREE.Bone).isBone && /head/i.test(o.name)) {
        headBone.current = o as THREE.Bone;
        baseHeadRot.current = o.rotation.clone();
      }
    });
  }, [actions, anim.idle, scene]);

  useFrame(({ clock }, delta) => {
    if (speaking) {
      gestureTimer.current -= delta;
      if (gestureTimer.current <= 0) {
        const idle = actions[anim.idle];
        const next = anim.talk[Math.floor(Math.random() * anim.talk.length)];
        const nextAction = next ? actions[next] : null;
        if (nextAction && next !== currentGesture.current) {
          idle?.fadeOut(0.4);
          if (currentGesture.current && actions[currentGesture.current]) {
            actions[currentGesture.current]?.fadeOut(0.4);
          }
          nextAction.reset().fadeIn(0.4).play();
          nextAction.clampWhenFinished = true;
          nextAction.setLoop(LoopOnce, 1);
          currentGesture.current = next || null;
        }
        gestureTimer.current = 2 + Math.random() * 2;
      }
      wasSpeaking.current = true;
    } else if (wasSpeaking.current) {
      if (currentGesture.current && actions[currentGesture.current]) {
        actions[currentGesture.current]?.fadeOut(0.4);
      }
      actions[anim.idle]?.reset().fadeIn(0.4).play();
      currentGesture.current = null;
      wasSpeaking.current = false;
    }
  });

  useFrame(({ clock }) => {
    if (normalized.current >= 0 && ++normalized.current > 4 && inner.current) {
      if (normalizeToHeight(inner.current, height)) normalized.current = -1;
    }
    const head = headBone.current;
    if (head && speaking) {
      const t = clock.elapsedTime;
      head.rotation.x += Math.sin(t * 2.2) * 0.03;
      head.rotation.y += Math.sin(t * 1.4) * 0.05;
    }
    if (inner.current) {
      const t = clock.elapsedTime;
      inner.current.rotation.y = speaking ? Math.sin(t * 0.9) * 0.08 : 0;
    }
  });

  return (
    <group ref={group} {...(position ? { position } : {})} {...(rotation ? { rotation } : {})}>
      <group ref={inner}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

useGLTF.preload("/models/emilian-avatar.glb");
useGLTF.preload("/models/cop/scene.gltf");
useGLTF.preload("/models/ishaan.glb");
