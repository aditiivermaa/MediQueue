import React, { memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";
import {
  CalendarPlus,
  AlertTriangle,
  UserCheck,
  FileText,
  UploadCloud,
  Clock,
  Bot,
  User,
  Activity,
  ArrowRight,
  ShieldCheck,
  Heart,
  TrendingUp,
  Award,
  Pill,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";

const Dashboard = memo(function Dashboard() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  const cards = [
    { title: "Vitals & Health Score", desc: "BMI, Blood Pressure, Sugar & Health Index", icon: Activity, path: "/vitals-dashboard", iconColor: "text-emerald-500", badge: "Live Tracking" },
    { title: "Pill Reminders", desc: "Daily dosage alarm checklist & reminders", icon: Pill, path: "/reminders", iconColor: "text-amber-500", badge: "Adherence" },
    { title: "Book Appointment", desc: "Specialist doctors & instant OPD queue token", icon: CalendarPlus, path: "/appointment", iconColor: "text-teal-500", badge: "Fast Track" },
    { title: "Emergency SOS", desc: "AI Smart Triage & instant ER doctor alert", icon: AlertTriangle, path: "/emergency", iconColor: "text-rose-500", badge: "High Priority" },
    { title: "Find Doctors", path: "/doctors", desc: "Browse top hospital specialists", icon: UserCheck, iconColor: "text-blue-500" },
    { title: "Live Queue Status", path: "/queue", desc: "Real-time token tracking & wait time", icon: Clock, iconColor: "text-cyan-500", badge: "Live" },
    { title: "Medical Timeline", path: "/medical-history", desc: "Diagnoses, Rx, vaccinations & family vault", icon: FileText, iconColor: "text-indigo-500" },
    { title: "AI Health Assistant", path: "/ai-assistant", desc: "Gemini symptom explainer & advice", icon: Bot, iconColor: "text-purple-500", badge: "AI Powered" }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Apple Health Welcome Banner */}
      <GlassCard className="p-6 sm:p-8 bg-gradient-to-r from-teal-600/95 via-teal-700/95 to-blue-700/95 text-white border-none shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-teal-100">
              <Activity className="w-3.5 h-3.5 text-teal-300 animate-pulse" />
              Apple Health + Practo Stack
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Welcome back, {userProfile?.name || "Patient"}! 👋
            </h1>
            <p className="text-teal-100 text-xs sm:text-sm max-w-xl">
              Your biometric health score is 92/100 (Optimal). Manage appointments, track queue tokens, or consult AI Assistant.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              text="Book Appointment"
              icon={CalendarPlus}
              variant="secondary"
              onClick={() => navigate("/appointment")}
              className="text-teal-700 font-extrabold"
            />
            <Button
              text="Emergency SOS"
              icon={AlertTriangle}
              variant="emergency"
              onClick={() => navigate("/emergency")}
            />
          </div>
        </div>
      </GlassCard>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-card border border-slate-200/60 dark:border-slate-800/60 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-blue-600 flex items-center justify-center text-white font-black text-lg shadow-md">
            92
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Health Index</p>
            <p className="text-xs font-extrabold text-emerald-500">Optimal (92/100)</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-200/60 dark:border-slate-800/60 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Active Queue Token</p>
            <p className="text-lg font-extrabold text-slate-800 dark:text-slate-100">A003</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-200/60 dark:border-slate-800/60 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Today's Pills</p>
            <p className="text-xs font-extrabold text-slate-800 dark:text-slate-100">1/3 Taken ✅</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-200/60 dark:border-slate-800/60 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">ABHA Stack</p>
            <p className="text-xs font-extrabold text-emerald-500">Verified ✅</p>
          </div>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div>
        <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-teal-500" />
          MediQueue Healthcare Features
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.03 }}
              >
                <GlassCard
                  onClick={() => navigate(card.path)}
                  className="h-full flex flex-col justify-between p-6 border-slate-200/60 dark:border-slate-800/60 hover:shadow-2xl transition"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 ${card.iconColor}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      {card.badge && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-500/10 text-teal-600 dark:text-teal-400">
                          {card.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-teal-600 dark:text-teal-400">
                    <span>Open Module</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default Dashboard;