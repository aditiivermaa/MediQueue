import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, HeartPulse } from "lucide-react";
import Button from "../components/ui/Button";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 2800);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-teal-950 to-slate-950 text-white px-4">
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-lg w-full text-center glass-panel p-10 rounded-3xl border border-white/20 shadow-2xl backdrop-blur-2xl"
      >
        {/* Animated Official MediQueue Logo */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto w-24 h-24 rounded-3xl overflow-hidden shadow-2xl shadow-teal-500/40 mb-6 border-2 border-white/30"
        >
          <img
            src="/logo.jpeg"
            alt="MediQueue Official Logo"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-teal-300 via-teal-100 to-blue-300 bg-clip-text text-transparent">
          MediQueue
        </h1>

        <p className="text-xs font-black tracking-widest uppercase text-teal-400 mt-2">
          Smart Digital Healthcare Stack
        </p>

        <p className="text-slate-300 text-xs sm:text-sm mt-4 leading-relaxed max-w-sm mx-auto">
          Smart queue management, instant emergency fast-track, digital medical pass, and MediGuide care.
        </p>

        <div className="flex items-center justify-center gap-4 mt-6 text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-teal-400" /> Firebase Secured
          </span>
          <span className="flex items-center gap-1">
            <HeartPulse className="w-4 h-4 text-rose-400" /> Live Queue Token Pass
          </span>
        </div>

        <div className="mt-8">
          <Button
            text="Get Started Now"
            icon={ArrowRight}
            variant="primary"
            size="lg"
            className="w-full font-black"
            onClick={() => navigate("/login")}
          />
        </div>

        <div className="mt-6 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.8, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-teal-400 to-blue-500"
          />
        </div>
      </motion.div>
    </div>
  );
}