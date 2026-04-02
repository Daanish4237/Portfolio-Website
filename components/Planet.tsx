"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Mesh } from "three";
import type { Project } from "../types";

interface PlanetProps {
  project: Project;
  onSelect: (project: Project) => void;
}

export default function Planet({ project, onSelect }: PlanetProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={project.position}
      scale={hovered ? 1.25 : 1}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => onSelect(project)}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={project.color}
        emissive={project.color}
        emissiveIntensity={hovered ? 0.5 : 0}
      />
      {hovered && (
        <Html>
          <div
            style={{
              color: "white",
              background: "rgba(0,0,0,0.6)",
              padding: "4px 8px",
              borderRadius: "4px",
              whiteSpace: "nowrap",
              fontSize: "14px",
            }}
          >
            {project.name}
          </div>
        </Html>
      )}
    </mesh>
  );
}
