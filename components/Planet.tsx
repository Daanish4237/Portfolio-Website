"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { Mesh } from "three";
import type { Project } from "../types";
import {
  PLANET_HOVER_SCALE,
  PLANET_ROTATION_SPEED,
} from "../lib/constants";

interface PlanetProps {
  project: Project;
  onSelect: (project: Project) => void;
  planetType?: "mars" | "jupiter" | "saturn" | "neptune" | "lava";
}

// Procedural planet texture generator
function createPlanetTexture(type: PlanetProps["planetType"], color: string): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const base = new THREE.Color(color);

  if (type === "jupiter") {
    // Horizontal bands like Jupiter
    const bands = 12;
    for (let i = 0; i < bands; i++) {
      const y = (i / bands) * size;
      const h = size / bands;
      const lightness = i % 2 === 0 ? 1.2 : 0.7;
      const c = base.clone().multiplyScalar(lightness);
      ctx.fillStyle = `rgb(${Math.min(255, c.r * 255)},${Math.min(255, c.g * 255)},${Math.min(255, c.b * 255)})`;
      ctx.fillRect(0, y, size, h + 2);
    }
    // Add swirl
    for (let i = 0; i < 6; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, 40);
      grad.addColorStop(0, `rgba(255,200,100,0.3)`);
      grad.addColorStop(1, `rgba(0,0,0,0)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);
    }
  } else if (type === "mars") {
    // Rocky reddish surface
    ctx.fillStyle = `rgb(${Math.min(255, base.r * 255)},${Math.min(255, base.g * 255)},${Math.min(255, base.b * 255)})`;
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = Math.random() * 20 + 5;
      const dark = Math.random() > 0.5;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, dark ? "rgba(80,20,0,0.4)" : "rgba(255,180,100,0.2)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === "neptune") {
    // Smooth blue gradient with wisps
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, `rgb(${Math.min(255, base.r * 255 * 0.6)},${Math.min(255, base.g * 255)},${Math.min(255, base.b * 255)})`);
    grad.addColorStop(1, `rgb(${Math.min(255, base.r * 255 * 1.4)},${Math.min(255, base.g * 255 * 0.8)},${Math.min(255, base.b * 255 * 1.2)})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 8; i++) {
      const y = Math.random() * size;
      ctx.strokeStyle = `rgba(255,255,255,0.08)`;
      ctx.lineWidth = Math.random() * 6 + 2;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(size / 3, y - 20, (size * 2) / 3, y + 20, size, y);
      ctx.stroke();
    }
  } else if (type === "lava") {
    // Dark with glowing cracks
    ctx.fillStyle = "#1a0000";
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 40; i++) {
      const x1 = Math.random() * size;
      const y1 = Math.random() * size;
      const x2 = x1 + (Math.random() - 0.5) * 100;
      const y2 = y1 + (Math.random() - 0.5) * 100;
      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, `rgba(${Math.min(255, base.r * 255)},${Math.min(255, base.g * 100)},0,0.8)`);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = Math.random() * 3 + 1;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  } else {
    // Default: smooth colored sphere with noise
    ctx.fillStyle = `rgb(${Math.min(255, base.r * 255)},${Math.min(255, base.g * 255)},${Math.min(255, base.b * 255)})`;
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = Math.random() * 30 + 5;
      const alpha = Math.random() * 0.15;
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  return new THREE.CanvasTexture(canvas);
}

const PLANET_TYPES: PlanetProps["planetType"][] = ["mars", "jupiter", "neptune", "lava", "saturn"];

export default function Planet({ project, onSelect, planetType }: PlanetProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Derive planet type from project index if not provided
  const resolvedType = planetType ?? PLANET_TYPES[Math.abs(project.id.charCodeAt(0)) % PLANET_TYPES.length];

  const texture = useMemo(
    () => createPlanetTexture(resolvedType, project.color),
    [resolvedType, project.color]
  );

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += PLANET_ROTATION_SPEED;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={project.position}
      scale={hovered ? PLANET_HOVER_SCALE : 1}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => onSelect(project)}
    >
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        map={texture}
        emissive={project.color}
        emissiveIntensity={hovered ? 0.3 : 0.05}
        roughness={0.8}
        metalness={0.1}
      />
      {hovered && (
        <Html>
          <div
            style={{
              color: "white",
              background: "rgba(0,0,0,0.7)",
              padding: "4px 10px",
              borderRadius: "4px",
              whiteSpace: "nowrap",
              fontSize: "14px",
              fontWeight: 600,
              border: `1px solid ${project.color}`,
              boxShadow: `0 0 8px ${project.color}`,
            }}
          >
            {project.name}
          </div>
        </Html>
      )}
    </mesh>
  );
}
