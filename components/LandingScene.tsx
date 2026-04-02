"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { OWNER_NAME, OWNER_SUBTITLE } from "../lib/constants";

interface LandingSceneProps {
  onEnter: () => void;
}

function generateStars(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 2.5 + 0.5}px`,
    delay: `${Math.random() * 5}s`,
    duration: `${Math.random() * 3 + 2}s`,
  }));
}

export default function LandingScene({ onEnter }: LandingSceneProps) {
  const stars = useMemo(() => generateStars(200), []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col items-center justify-center">
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.6); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(139,92,246,0.6), 0 0 40px rgba(139,92,246,0.3); }
          50% { box-shadow: 0 0 35px rgba(139,92,246,0.9), 0 0 70px rgba(139,92,246,0.5); }
        }
      `}</style>

      {stars.map((star) => (
        <span
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animation: `twinkle ${star.duration} ${star.delay} ease-in-out infinite`,
          }}
        />
      ))}

      {/* Ambient glow behind title */}
      <motion.div
        className="absolute w-96 h-96 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.h1
        className="relative z-10 text-6xl md:text-8xl font-bold text-white tracking-widest text-center drop-shadow-[0_0_40px_rgba(139,92,246,0.9)]"
        initial={{ opacity: 0, y: -60, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        {OWNER_NAME}
      </motion.h1>

      <motion.p
        className="relative z-10 mt-5 text-xl md:text-2xl text-purple-300 tracking-[0.4em] uppercase text-center"
        initial={{ opacity: 0, letterSpacing: "0.8em" }}
        animate={{ opacity: 1, letterSpacing: "0.4em" }}
        transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
      >
        {OWNER_SUBTITLE}
      </motion.p>

      <motion.button
        onClick={onEnter}
        className="relative z-10 mt-14 px-12 py-4 border-2 border-purple-500 text-purple-200 rounded-full tracking-widest uppercase font-bold bg-black/30 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        style={{ fontSize: "1.1rem", animation: "pulse-glow 3s ease-in-out infinite" }}
        initial={{ opacity: 0, y: 60, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, delay: 1.2, ease: "easeOut" }}
        whileHover={{ scale: 1.08, backgroundColor: "rgba(139,92,246,0.3)" }}
        whileTap={{ scale: 0.93 }}
      >
        ✦ Enter Universe ✦
      </motion.button>
    </div>
  );
}
