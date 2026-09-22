import { useGLTF } from "@react-three/drei";

interface ClassroomProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export function Classroom(props: ClassroomProps) {
  const { scene } = useGLTF("/models/classroom.glb");
  return <primitive object={scene} {...props} />;
}

useGLTF.preload("/models/classroom.glb");
