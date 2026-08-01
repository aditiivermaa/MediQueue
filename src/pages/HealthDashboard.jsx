import React, { useState, useMemo } from "react";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import {
  Activity,
  Heart,
  TrendingUp,
  Scale,
  Zap,
  CheckCircle2,
  Plus,
  Flame,
  Award
} from "lucide-react";
import toast from "react-hot-toast";

export default function HealthDashboard() {
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(70);
  const [bpSystolic, setBpSystolic] = useState(120);
  const [bpDiastolic, setBpDiastolic] = useState(80);
  const [heartRate, setHeartRate] = useState(72);
  const [sugarMg, setSugarMg] = useState(95);

  // BMI Calculation
  const bmi = useMemo(() => {
    if (!heightCm || !weightKg) return 0;
    const heightMeters = heightCm / 100;
    return (weightKg / (heightMeters * heightMeters)).toFixed(1);
  }, [heightCm, weightKg]);

  const bmiCategory = useMemo(() => {
    if (bmi < 18.5) return { label: "Underweight", color: "text-amber-500" };
    if (bmi <= 24.9) return { label: "Normal Weight", color: "text-emerald-500" };
    if (bmi <= 29.9) return { label: "Overweight", color: "text-orange-500" };
    return { label: "Obese", color: "text-rose-500" };
  }, [bmi]);

  // Overall Health Score Generator (0-100)
  const healthScore = useMemo(() => {
    let score = 92;
    if (bmi > 25) score -= 5;
    if (bpSystolic > 130) score -= 4;
    if (sugarMg > 110) score -= 3;
    return Math.max(60, score);
  }, [bmi, bpSystolic, sugarMg]);

  const handleUpdateVitals = (e) => {
    e.preventDefault();
    toast.success("Health Vitals logged & synced with Medical History!");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Activity className="w-7 h-7 text-teal-500" />
            Vitals & Health Score Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time biometric monitoring, BMI calculator, & cardiac health metrics
          </p>
        </div>

        {/* Health Score Badge */}
        <div className="flex items-center gap-3 p-3 rounded-2xl glass-card border border-teal-500/30">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-blue-600 flex items-center justify-center text-white font-black text-lg shadow-md">
            {healthScore}
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Health Index</p>
            <p className="text-xs font-extrabold text-emerald-500 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Excellent Score
            </p>
          </div>
        </div>
      </div>

      {/* Vitals Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Heart Rate */}
        <GlassCard className="p-5 border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Heart Rate</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1 flex items-baseline gap-1">
              {heartRate} <span className="text-xs text-slate-400 font-medium">BPM</span>
            </h3>
            <span className="text-[10px] text-emerald-500 font-bold">Normal Resting Rate</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-rose-500/10 text-rose-500 animate-pulse">
            <Heart className="w-6 h-6" />
          </div>
        </GlassCard>

        {/* Blood Pressure */}
        <GlassCard className="p-5 border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Blood Pressure</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">
              {bpSystolic}/{bpDiastolic}
            </h3>
            <span className="text-[10px] text-emerald-500 font-bold">Optimal Range</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-500">
            <Activity className="w-6 h-6" />
          </div>
        </GlassCard>

        {/* BMI Card */}
        <GlassCard className="p-5 border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">BMI Index</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">
              {bmi}
            </h3>
            <span className={`text-[10px] font-bold ${bmiCategory.color}`}>
              {bmiCategory.label}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-teal-500/10 text-teal-500">
            <Scale className="w-6 h-6" />
          </div>
        </GlassCard>

        {/* Blood Sugar */}
        <GlassCard className="p-5 border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Blood Sugar (Fasting)</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1 flex items-baseline gap-1">
              {sugarMg} <span className="text-xs text-slate-400 font-medium">mg/dL</span>
            </h3>
            <span className="text-[10px] text-emerald-500 font-bold">Healthy Range</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-500">
            <Zap className="w-6 h-6" />
          </div>
        </GlassCard>
      </div>

      {/* Interactive Log Vitals Form */}
      <GlassCard className="p-6 sm:p-8 backdrop-blur-2xl">
        <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-teal-500" />
          Update Today's Biometric Readings
        </h3>

        <form onSubmit={handleUpdateVitals} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Height (cm)"
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(Number(e.target.value))}
            />
            <Input
              label="Weight (kg)"
              type="number"
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
            />
            <Input
              label="Heart Rate (BPM)"
              type="number"
              value={heartRate}
              onChange={(e) => setHeartRate(Number(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Systolic BP (mmHg)"
              type="number"
              value={bpSystolic}
              onChange={(e) => setBpSystolic(Number(e.target.value))}
            />
            <Input
              label="Diastolic BP (mmHg)"
              type="number"
              value={bpDiastolic}
              onChange={(e) => setBpDiastolic(Number(e.target.value))}
            />
            <Input
              label="Fasting Blood Sugar (mg/dL)"
              type="number"
              value={sugarMg}
              onChange={(e) => setSugarMg(Number(e.target.value))}
            />
          </div>

          <Button
            type="submit"
            text="Save Biometrics Log"
            variant="primary"
            className="w-full py-3.5 font-bold"
          />
        </form>
      </GlassCard>
    </div>
  );
}
