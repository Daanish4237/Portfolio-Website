"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";

interface CameraControllerProps {
  targetPosition: [number, number, number] | null;
  isZooming: boolean;
  onZoomComplete: () => void;
}

const ZOOM_THRESHOLD = 2;
const LERP_FACTOR = 0.05;

export default function CameraController({
  targetPosition,
  isZooming,
  onZoomComplete,
}: CameraControllerProps) {
  const { camera } = useThree();

  useFrame(() => {
    if (!isZooming || !targetPosition) return;

    const target = new Vector3(...targetPosition);
    camera.position.lerp(target, LERP_FACTOR);

    if (camera.position.distanceTo(target) < ZOOM_THRESHOLD) {
      onZoomComplete();
    }
  });

  return (
    <OrbitControls
      enabled={!isZooming}
      minDistance={5}
      maxDistance={40}
    />
  );
}
