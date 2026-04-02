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

export default function GalaxyCanvas({
  onSelectProject,
  targetPosition,
  isZooming,
  onZoomComplete,
}: GalaxyCanvasProps) {
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
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <Stars />
      {PROJECTS.slice(0, 5).map((project) => (
        <Planet key={project.id} project={project} onSelect={onSelectProject} />
      ))}
      <CameraController
        targetPosition={targetPosition}
        isZooming={isZooming}
        onZoomComplete={onZoomComplete}
      />
    </Canvas>
  );
}
