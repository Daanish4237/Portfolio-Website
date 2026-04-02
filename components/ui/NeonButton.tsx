"use client";

import { motion } from "framer-motion";

interface NeonButtonProps {
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  color?: "purple" | "cyan" | "gray";
  children: React.ReactNode;
  className?: string;
}

const colorMap = {
  purple:
    "border-purple-500 text-purple-300 hover:bg-purple-500 hover:text-white hover:shadow-[0_0_16px_rgba(139,92,246,0.8)]",
  cyan: "border-cyan-500 text-cyan-300 hover:bg-cyan-500 hover:text-white hover:shadow-[0_0_16px_rgba(6,182,212,0.8)]",
  gray: "border-gray-500 text-gray-400 hover:border-white hover:text-white hover:shadow-[0_0_12px_rgba(255,255,255,0.2)]",
};

const disabledClass =
  "border-gray-700 text-gray-600 cursor-not-allowed opacity-50";

const baseClass =
  "px-5 py-2 rounded-full border text-sm font-semibold tracking-wide transition-all duration-300";

export default function NeonButton({
  onClick,
  href,
  disabled,
  color = "purple",
  children,
  className = "",
}: NeonButtonProps) {
  const classes = `${baseClass} ${disabled ? disabledClass : colorMap[color]} ${className}`;

  if (href && !disabled) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={classes}
      whileHover={disabled ? undefined : { scale: 1.05 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
    >
      {children}
    </motion.button>
  );
}
