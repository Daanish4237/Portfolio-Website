"use client";

import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { PROJECTS } from "../data/projects";
import Planet from "./Planet";
import CameraController from "./CameraController";
import type { Project } from "../types";
import { SCENE_BG_COLOR, CAMERA_DEFAULT_POSITION, CAMERA_FOV } from "../lib/constants";

interface GalaxyCanvasProps {
  onSelectProject: (project: Project) => void;
  targetPosition: [number, number, number] | null;
  isZooming: boolean;
  onZoomComplete: () => void;
}

// Auto-size: max radius 2.8, shrinks as more planets are added
function getPlanetRadius(count: number): number {
  return Math.max(1.2, 2.8 - (count - 1) * 0.35);
}

export default function GalaxyCanvas({
  onSelectProject,
  targetPosition,
  isZooming,
  onZoomComplete,
}: GalaxyCanvasProps) {
  const radius = getPlanetRadius(PROJECTS.length);

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: CAMERA_DEFAULT_POSITION, fov: CAMERA_FOV }}
      style={{ background: SCENE_BG_COLOR }}
      fallback={
        <div className="flex items-center justify-center w-full h-full text-white bg-black">
          Your browser does not support WebGL. Please try a modern browser.
        </div>
      }
    >
      <color attach="background" args={[SCENE_BG_COLOR]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[15, 15, 15]} intensity={2} />
      <pointLight position={[-15, -10, -10]} intensity={0.8} />
      <pointLight position={[0, -15, 10]} intensity={0.5} color="#4466ff" />
      <Stars radius={100} depth={50} count={6000} factor={4} fade speed={1} />
      {PROJECTS.slice(0, 5).map((project) => (
        <Planet
          key={project.id}
          project={project}
          onSelect={onSelectProject}
          radius={radius}
        />
      ))}
      <CameraController
        targetPosition={targetPosition}
        isZooming={isZooming}
        onZoomComplete={onZoomComplete}
      />
    </Canvas>
  );
}
