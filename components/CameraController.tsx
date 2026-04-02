"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";
import {
  CAMERA_LERP_FACTOR,
  CAMERA_ZOOM_THRESHOLD,
  CAMERA_MIN_DISTANCE,
  CAMERA_MAX_DISTANCE,
} from "../lib/constants";

interface CameraControllerProps {
  targetPosition: [number, number, number] | null;
  isZooming: boolean;
  onZoomComplete: () => void;
}

export default function CameraController({
  targetPosition,
  isZooming,
  onZoomComplete,
}: CameraControllerProps) {
  const { camera } = useThree();

  useFrame(() => {
    if (!isZooming || !targetPosition) return;
    const target = new Vector3(...targetPosition);
    camera.position.lerp(target, CAMERA_LERP_FACTOR);
    if (camera.position.distanceTo(target) < CAMERA_ZOOM_THRESHOLD) {
      onZoomComplete();
    }
  });

  return (
    <OrbitControls
      enabled={!isZooming}
      minDistance={CAMERA_MIN_DISTANCE}
      maxDistance={CAMERA_MAX_DISTANCE}
    />
  );
}
