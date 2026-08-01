import React from "react";
import { motion } from "framer-motion";

export default function Loader({ fullScreen = false, text = "Loading MediQueue..." }) {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center gap-4">
      <div className="relative flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-full border-4 border-teal-500/20 border-t-teal-600 border-r-blue-600"
        />
        <div className="absolute text-2xl font-bold text-teal-600 dark:text-teal-400">
          🏥
        </div>
      </div>
      <p className="text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-300 animate-pulse">
        {text}
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md">
        <div className="glass-panel p-6 rounded-3xl shadow-2xl">
          {content}
        </div>
      </div>
    );
  }

  return content;
}
