"use client";

import { motion } from "framer-motion";
import { Project } from "../types";

interface ProjectOverlayProps {
  project: Project;
  onBack: () => void;
}

export default function ProjectOverlay({ project, onBack }: ProjectOverlayProps) {
  const hasLive = project.links.live !== "";
  const hasGithub = project.links.github !== "";

  return (
    <motion.div
      className="fixed inset-0 z-10 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.div
        className="relative w-full max-w-lg bg-gray-950 border border-purple-800 rounded-2xl p-8 shadow-[0_0_40px_rgba(139,92,246,0.3)]"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Title */}
        <h2 className="text-3xl font-bold text-white tracking-wide drop-shadow-[0_0_12px_rgba(139,92,246,0.8)]">
          {project.name}
        </h2>

        {/* Description */}
        <p className="mt-4 text-gray-300 leading-relaxed">
          {project.description}
        </p>

        {/* Tech stack tags */}
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

        {/* Action buttons */}
        <div className="mt-8 flex flex-wrap gap-3">
          {/* View Live */}
          {hasLive ? (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-full border border-purple-500 text-purple-300 text-sm font-semibold tracking-wide transition-all duration-300 hover:bg-purple-500 hover:text-white hover:shadow-[0_0_16px_rgba(139,92,246,0.8)]"
            >
              View Live
            </a>
          ) : (
            <button
              disabled
              aria-disabled="true"
              className="px-5 py-2 rounded-full border border-gray-700 text-gray-600 text-sm font-semibold tracking-wide cursor-not-allowed"
            >
              View Live
            </button>
          )}

          {/* View Code */}
          {hasGithub ? (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-full border border-cyan-500 text-cyan-300 text-sm font-semibold tracking-wide transition-all duration-300 hover:bg-cyan-500 hover:text-white hover:shadow-[0_0_16px_rgba(6,182,212,0.8)]"
            >
              View Code
            </a>
          ) : (
            <button
              disabled
              aria-disabled="true"
              className="px-5 py-2 rounded-full border border-gray-700 text-gray-600 text-sm font-semibold tracking-wide cursor-not-allowed"
            >
              View Code
            </button>
          )}

          {/* Back */}
          <button
            onClick={onBack}
            className="px-5 py-2 rounded-full border border-gray-500 text-gray-400 text-sm font-semibold tracking-wide transition-all duration-300 hover:border-white hover:text-white hover:shadow-[0_0_12px_rgba(255,255,255,0.2)]"
          >
            Back
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
