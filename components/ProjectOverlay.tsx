"use client";

import { motion } from "framer-motion";
import { Project } from "../types";
import { fadeIn, fadeInUp } from "../lib/animations";
import NeonButton from "./ui/NeonButton";

interface ProjectOverlayProps {
  project: Project;
  onBack: () => void;
}

export default function ProjectOverlay({ project, onBack }: ProjectOverlayProps) {
  return (
    <motion.div
      className="fixed inset-0 z-10 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
      {...fadeIn}
    >
      <motion.div
        className="relative w-full max-w-lg bg-gray-950 border border-purple-800 rounded-2xl p-8 shadow-[0_0_40px_rgba(139,92,246,0.3)]"
        {...fadeInUp}
      >
        <h2 className="text-3xl font-bold text-white tracking-wide drop-shadow-[0_0_12px_rgba(139,92,246,0.8)]">
          {project.name}
        </h2>

        <p className="mt-4 text-gray-300 leading-relaxed">
          {project.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2" aria-label="Tech stack">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              role="listitem"
              className="px-3 py-1 text-xs font-semibold rounded-full border border-cyan-500 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.5)]"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <NeonButton href={project.links.live} disabled={!project.links.live} color="purple">
            View Live
          </NeonButton>
          <NeonButton href={project.links.github} disabled={!project.links.github} color="cyan">
            View Code
          </NeonButton>
          <NeonButton onClick={onBack} color="gray">
            Back
          </NeonButton>
        </div>
      </motion.div>
    </motion.div>
  );
}
