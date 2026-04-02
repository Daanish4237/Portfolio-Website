"use client";

import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { PROJECTS } from "../data/projects";
import Planet from "./Planet";
import CameraController from "./CameraController";
import type { Project } from "@/types";

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
      camera={{ position: [0, 0, 20], fov: 60 }}
      fallback={
        <div className="flex items-center justify-center w-full h-full text-white bg-black">
          Your browser does not support WebGL. Please try a modern browser.
        </div>
      }
    >
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
