"use client";

import { motion } from "framer-motion";
import { Project } from "../types";

interface ProjectOverlayProps {
  project: Project;
  onBack: () => void;
}

export default function ProjectOverlay({ project, onBack }: ProjectOverlayProps) {
  return (
    <motion.div
      className="fixed inset-0 z-10 flex items-center justify-center bg-black/85 backdrop-blur-md p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <motion.div
        className="relative w-full max-w-lg bg-gray-950 border border-purple-700 rounded-2xl p-8 shadow-[0_0_60px_rgba(139,92,246,0.4)]"
        initial={{ opacity: 0, y: 60, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        {/* Glow border pulse */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ border: `1px solid ${project.color}` }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />

        <motion.h2
          className="text-3xl font-bold text-white tracking-wide"
          style={{ textShadow: `0 0 20px ${project.color}` }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          {project.name}
        </motion.h2>

        <motion.p
          className="mt-4 text-gray-300 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          {project.description}
        </motion.p>

        {/* Staggered tech tags */}
        <motion.div
          className="mt-5 flex flex-wrap gap-2"
          aria-label="Tech stack"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.3 } } }}
        >
          {project.techStack.map((tech) => (
            <motion.span
              key={tech}
              role="listitem"
              className="px-3 py-1 text-xs font-semibold rounded-full border border-cyan-500 text-cyan-300"
              style={{ boxShadow: "0 0 8px rgba(6,182,212,0.5)" }}
              variants={{
                hidden: { opacity: 0, scale: 0.7, y: 10 },
                visible: { opacity: 1, scale: 1, y: 0 },
              }}
              whileHover={{ scale: 1.1, boxShadow: "0 0 14px rgba(6,182,212,0.8)" }}
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>

        {/* Action buttons */}
        <motion.div
          className="mt-8 flex flex-wrap gap-3"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } } }}
        >
          {[
            { label: "View Live", href: project.links.live, disabled: !project.links.live, color: "rgba(139,92,246,0.8)" },
            { label: "View Code", href: project.links.github, disabled: !project.links.github, color: "rgba(6,182,212,0.8)" },
          ].map(({ label, href, disabled, color }) => (
            <motion.div
              key={label}
              variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
            >
              {href && !disabled ? (
                <motion.a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-5 py-2 rounded-full border text-sm font-semibold tracking-wide"
                  style={{ borderColor: color, color: "white" }}
                  whileHover={{ scale: 1.07, boxShadow: `0 0 20px ${color}` }}
                  whileTap={{ scale: 0.94 }}
                >
                  {label}
                </motion.a>
              ) : (
                <span className="block px-5 py-2 rounded-full border border-gray-700 text-gray-600 text-sm font-semibold tracking-wide cursor-not-allowed opacity-50">
                  {label}
                </span>
              )}
            </motion.div>
          ))}

          <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
            <motion.button
              onClick={onBack}
              className="px-5 py-2 rounded-full border border-gray-500 text-gray-300 text-sm font-semibold tracking-wide"
              whileHover={{ scale: 1.07, borderColor: "white", color: "white", boxShadow: "0 0 14px rgba(255,255,255,0.2)" }}
              whileTap={{ scale: 0.94 }}
            >
              ← Back
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
