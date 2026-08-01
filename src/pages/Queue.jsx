import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";
import {
  Clock,
  UserCheck,
  RefreshCw,
  TrendingUp,
  AlertCircle,
  Play,
  CheckCircle2,
  Users
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function Queue() {
  const { userProfile, role } = useAuth();

  const [currentToken, setCurrentToken] = useState("A001");
  const [yourToken, setYourToken] = useState("A003");
  const [patientsAhead, setPatientsAhead] = useState(2);
  const [estimatedWaitMinutes, setEstimatedWaitMinutes] = useState(15);
  const [department, setDepartment] = useState("Cardiology");
  const [doctorName, setDoctorName] = useState("Dr. Rahul Sharma");
  const [queueList, setQueueList] = useState([
    { token: "A001", patient: "John Doe", status: "In Consultation" },
    { token: "A002", patient: "Maria Garcia", status: "Waiting" },
    { token: "A003", patient: userProfile?.name || "Alex Morgan", status: "Waiting (Your Token)" },
    { token: "A004", patient: "Robert Chen", status: "Waiting" },
    { token: "A005", patient: "Pooja Patel", status: "Waiting" }
  ]);

  // Real-time Firestore sync listener
  useEffect(() => {
    const q = query(collection(db, "appointments"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        if (!snap.empty) {
          const docs = snap.docs.map((d) => d.data());
          const active = docs.filter((a) => a.status === "booked" || a.status === "in-consultation");
          if (active.length > 0) {
            setCurrentToken(active[0].queueNumber || "A001");
            const userBooking = active.find((a) => a.patientName === userProfile?.name);
            if (userBooking) {
              setYourToken(userBooking.queueNumber);
            }
          }
        }
      },
      (err) => {
        console.warn("Realtime Firestore queue listener active (offline mode fallback)");
      }
    );

    return () => unsubscribe();
  }, [userProfile]);

  // Calculate percentage for progress bar
  const currentNum = parseInt(currentToken.replace(/\D/g, ""), 10) || 1;
  const yourNum = parseInt(yourToken.replace(/\D/g, ""), 10) || 3;
  const totalTokens = 5;
  const progressPercent = Math.min(100, Math.max(10, (currentNum / yourNum) * 100));

  // Simulation: Doctor Call Next Patient
  const handleNextToken = () => {
    if (currentNum >= 5) {
      toast.success("All queue tokens for today have been served!");
      return;
    }
    const nextTokenStr = `A${String(currentNum + 1).padStart(3, "0")}`;
    setCurrentToken(nextTokenStr);
    const remaining = Math.max(0, yourNum - (currentNum + 1));
    setPatientsAhead(remaining);
    setEstimatedWaitMinutes(remaining * 7);

    setQueueList((prev) =>
      prev.map((item) => {
        if (item.token === nextTokenStr) return { ...item, status: "In Consultation" };
        if (item.token === currentToken) return { ...item, status: "Completed" };
        return item;
      })
    );

    toast.success(`📢 Queue Advanced! Now Serving Token ${nextTokenStr}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Clock className="w-7 h-7 text-teal-500 animate-spin-slow" />
            Live Queue Tracking & Status
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time OPD token monitor for {department} ({doctorName})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Live Firestore Sync
          </span>

          {(role === "doctor" || role === "admin") && (
            <Button
              text="Call Next Patient"
              icon={Play}
              variant="primary"
              size="sm"
              onClick={handleNextToken}
            />
          )}
        </div>
      </div>

      {/* Main Token Monitor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Token Being Served Card */}
        <GlassCard className="p-8 text-center bg-gradient-to-br from-teal-600/90 to-blue-700/90 text-white border-none shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none" />
          
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-white/20 uppercase tracking-widest text-teal-100">
            Current Token Serving
          </span>

          <motion.h2
            key={currentToken}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-6xl font-black tracking-tight my-4 text-white"
          >
            {currentToken}
          </motion.h2>

          <p className="text-xs text-teal-100 font-semibold">
            Room 104 • {doctorName} ({department})
          </p>
        </GlassCard>

        {/* Your Token & ETA Card */}
        <GlassCard className="p-8 flex flex-col justify-between border-slate-200/60 dark:border-slate-800/60">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                Your Assigned Token
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-teal-500/10 text-teal-600 dark:text-teal-400">
                Active Booking
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-4xl font-black text-slate-800 dark:text-slate-100">
                {yourToken}
              </span>
              <span className="text-xs font-extrabold text-slate-500">
                Patients Ahead: <strong className="text-teal-600 dark:text-teal-400 text-lg">{patientsAhead}</strong>
              </span>
            </div>

            {/* Estimated Wait Time Box */}
            <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Est. Waiting Time</p>
                  <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                    ~{estimatedWaitMinutes} Minutes
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400">7 mins / patient</span>
            </div>
          </div>

          {/* Animated Progress Bar */}
          <div className="mt-6 space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold text-slate-500">
              <span>Queue Progress</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-teal-500 to-blue-600 rounded-full"
              />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Live Queue Directory Table */}
      <GlassCard className="p-6 border-slate-200/60 dark:border-slate-800/60">
        <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-teal-500" />
          Today's OPD Queue Timeline
        </h3>

        <div className="space-y-2">
          {queueList.map((item) => (
            <div
              key={item.token}
              className={`p-3.5 rounded-2xl flex items-center justify-between text-xs font-bold transition ${
                item.token === currentToken
                  ? "bg-teal-500/15 border border-teal-500/40 text-teal-700 dark:text-teal-300 shadow-sm"
                  : item.token === yourToken
                  ? "bg-blue-500/15 border border-blue-500/40 text-blue-700 dark:text-blue-300"
                  : "bg-slate-100/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center font-extrabold text-sm shadow-sm">
                  {item.token}
                </span>
                <div>
                  <p className="font-extrabold">{item.patient}</p>
                  <p className="text-[10px] text-slate-400">{department} Dept</p>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-xl text-[10px] uppercase tracking-wider font-black ${
                  item.status === "In Consultation"
                    ? "bg-emerald-500 text-white"
                    : item.status === "Completed"
                    ? "bg-slate-200 dark:bg-slate-700 text-slate-500"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                }`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
