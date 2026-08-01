import React from "react";
import { motion } from "framer-motion";

export default function GlassCard({
  children,
  className = "",
  hover = true,
  onClick,
  ...props
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onClick={onClick}
      className={`glass-card rounded-3xl p-6 relative overflow-hidden backdrop-blur-xl border border-white/50 dark:border-slate-800/60 shadow-xl ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
      {...props}
    >
      {/* Decorative top accent sheen */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-teal-500 to-blue-600 opacity-80" />
      {children}
    </motion.div>
  );
}