"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface LandingSceneProps {
  onEnter: () => void;
}

interface Star {
  id: number;
  top: string;
  left: string;
  size: string;
  delay: string;
  duration: string;
}

function generateStars(count: number): Star[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 2 + 1}px`,
    delay: `${Math.random() * 4}s`,
    duration: `${Math.random() * 3 + 2}s`,
  }));
}

export default function LandingScene({ onEnter }: LandingSceneProps) {
  const stars = useMemo(() => generateStars(150), []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col items-center justify-center">
      {/* CSS star field */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
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

      {/* Title */}
      <motion.h1
        className="relative z-10 text-5xl md:text-7xl font-bold text-white tracking-widest text-center drop-shadow-[0_0_30px_rgba(139,92,246,0.8)]"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        John Developer
      </motion.h1>

      <motion.p
        className="relative z-10 mt-4 text-lg md:text-xl text-purple-300 tracking-[0.3em] uppercase text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
      >
        Full-Stack Engineer
      </motion.p>

      {/* Enter Universe button */}
      <motion.button
        onClick={onEnter}
        className="relative z-10 mt-12 px-8 py-3 border border-purple-500 text-purple-300 rounded-full tracking-widest uppercase text-sm font-semibold transition-all duration-300 hover:bg-purple-500 hover:text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.8)] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1, ease: "easeOut" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
      >
        Enter Universe
      </motion.button>
    </div>
  );
}
