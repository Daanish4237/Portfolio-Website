"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { Mesh } from "three";
import type { Project } from "../types";

interface PlanetProps {
  project: Project;
  onSelect: (project: Project) => void;
  radius?: number;
}

function createPlanetTexture(type: string, color: string): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const base = new THREE.Color(color);

  if (type === "jupiter") {
    const bands = 14;
    for (let i = 0; i < bands; i++) {
      const y = (i / bands) * size;
      const h = size / bands;
      const l = i % 2 === 0 ? 1.3 : 0.6;
      const c = base.clone().multiplyScalar(l);
      ctx.fillStyle = `rgb(${Math.min(255,c.r*255)},${Math.min(255,c.g*255)},${Math.min(255,c.b*255)})`;
      ctx.fillRect(0, y, size, h + 2);
    }
    for (let i = 0; i < 8; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const g = ctx.createRadialGradient(x, y, 0, x, y, 50);
      g.addColorStop(0, "rgba(255,200,100,0.35)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
    }
  } else if (type === "mars") {
    ctx.fillStyle = `rgb(${Math.min(255,base.r*255)},${Math.min(255,base.g*255)},${Math.min(255,base.b*255)})`;
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 300; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = Math.random() * 22 + 4;
      const dark = Math.random() > 0.5;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, dark ? "rgba(60,10,0,0.5)" : "rgba(255,160,80,0.25)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === "neptune") {
    const g = ctx.createLinearGradient(0, 0, size, size);
    g.addColorStop(0, `rgb(${Math.min(255,base.r*255*0.5)},${Math.min(255,base.g*255)},${Math.min(255,base.b*255)})`);
    g.addColorStop(1, `rgb(${Math.min(255,base.r*255*1.5)},${Math.min(255,base.g*255*0.7)},${Math.min(255,base.b*255*1.3)})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 10; i++) {
      const y = Math.random() * size;
      ctx.strokeStyle = "rgba(255,255,255,0.07)";
      ctx.lineWidth = Math.random() * 8 + 2;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(size/3, y-25, (size*2)/3, y+25, size, y);
      ctx.stroke();
    }
  } else if (type === "lava") {
    ctx.fillStyle = "#1a0000";
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 60; i++) {
      const x1 = Math.random() * size;
      const y1 = Math.random() * size;
      const x2 = x1 + (Math.random() - 0.5) * 120;
      const y2 = y1 + (Math.random() - 0.5) * 120;
      const g = ctx.createLinearGradient(x1, y1, x2, y2);
      g.addColorStop(0, `rgba(${Math.min(255,base.r*255)},${Math.min(255,base.g*100)},0,0.9)`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.strokeStyle = g;
      ctx.lineWidth = Math.random() * 3 + 1;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  } else {
    ctx.fillStyle = `rgb(${Math.min(255,base.r*255)},${Math.min(255,base.g*255)},${Math.min(255,base.b*255)})`;
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 120; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = Math.random() * 35 + 5;
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.12})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  return new THREE.CanvasTexture(canvas);
}

const PLANET_TYPES = ["mars", "jupiter", "neptune", "lava", "neptune"];

export default function Planet({ project, onSelect, radius = 2 }: PlanetProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const type = PLANET_TYPES[Math.abs(project.id.charCodeAt(0)) % PLANET_TYPES.length];
  const texture = useMemo(() => createPlanetTexture(type, project.color), [type, project.color]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += 0.008;
    meshRef.current.rotation.x += 0.001;
    // Smooth scale spring
    const targetScale = clicked ? 1.4 : hovered ? 1.15 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12);
  });

  return (
    <mesh
      ref={meshRef}
      position={project.position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => {
        setClicked(true);
        setTimeout(() => setClicked(false), 300);
        onSelect(project);
      }}
    >
      <sphereGeometry args={[radius, 64, 64]} />
      <meshStandardMaterial
        map={texture}
        emissive={project.color}
        emissiveIntensity={hovered ? 0.4 : 0.08}
        roughness={0.75}
        metalness={0.15}
      />
      {hovered && (
        <Html center distanceFactor={10}>
          <div style={{
            color: "white",
            background: "rgba(0,0,0,0.75)",
            padding: "6px 14px",
            borderRadius: "20px",
            whiteSpace: "nowrap",
            fontSize: "15px",
            fontWeight: 700,
            border: `1px solid ${project.color}`,
            boxShadow: `0 0 12px ${project.color}`,
            letterSpacing: "0.05em",
            transform: "translateY(-20px)",
          }}>
            {project.name}
          </div>
        </Html>
      )}
    </mesh>
  );
}
