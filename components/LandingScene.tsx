"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { OWNER_NAME, OWNER_SUBTITLE } from "../lib/constants";
import { fadeInDown, fadeIn, fadeInUp } from "../lib/animations";
import NeonButton from "./ui/NeonButton";

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

      <motion.h1
        className="relative z-10 text-5xl md:text-7xl font-bold text-white tracking-widest text-center drop-shadow-[0_0_30px_rgba(139,92,246,0.8)]"
        {...fadeInDown}
      >
        {OWNER_NAME}
      </motion.h1>

      <motion.p
        className="relative z-10 mt-4 text-lg md:text-xl text-purple-300 tracking-[0.3em] uppercase text-center"
        initial={fadeIn.initial}
        animate={fadeIn.animate}
        transition={{ ...fadeIn.transition, delay: 0.5 }}
      >
        {OWNER_SUBTITLE}
      </motion.p>

      <motion.div
        className="relative z-10 mt-12"
        initial={fadeInUp.initial}
        animate={fadeInUp.animate}
        transition={{ ...fadeInUp.transition, delay: 1, duration: 1 }}
      >
        <NeonButton onClick={onEnter} color="purple">
          Enter Universe
        </NeonButton>
      </motion.div>
    </div>
  );
}
