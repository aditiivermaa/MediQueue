import React, { useState } from "react";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import {
  Pill,
  Clock,
  Plus,
  CheckCircle2,
  Bell,
  Trash2,
  AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";

export default function MedicineReminders() {
  const [reminders, setReminders] = useState([
    {
      id: 1,
      name: "Amoxicillin",
      dosage: "500 mg",
      time: "08:00 AM",
      frequency: "Twice Daily",
      completed: true,
      instructions: "Take with food"
    },
    {
      id: 2,
      name: "Telmisartan",
      dosage: "40 mg",
      time: "09:00 PM",
      frequency: "Once Daily",
      completed: false,
      instructions: "For blood pressure control"
    },
    {
      id: 3,
      name: "Multivitamin Gold",
      dosage: "1 Capsule",
      time: "02:00 PM",
      frequency: "Once Daily",
      completed: false,
      instructions: "Post lunch"
    }
  ]);

  const [medName, setMedName] = useState("");
  const [dosage, setDosage] = useState("500 mg");
  const [medTime, setMedTime] = useState("09:00 AM");
  const [frequency, setFrequency] = useState("Once Daily");
  const [instructions, setInstructions] = useState("");

  const handleAddMedicine = (e) => {
    e.preventDefault();
    if (!medName) return;

    const newMed = {
      id: Date.now(),
      name: medName,
      dosage,
      time: medTime,
      frequency,
      completed: false,
      instructions: instructions || "As advised by doctor"
    };

    setReminders([...reminders, newMed]);
    setMedName("");
    setInstructions("");
    toast.success(`Medicine reminder for ${medName} set!`);
  };

  const toggleComplete = (id) => {
    setReminders(
      reminders.map((r) => {
        if (r.id === id) {
          const nextState = !r.completed;
          if (nextState) toast.success(`Dose marked completed for ${r.name}!`);
          return { ...r, completed: nextState };
        }
        return r;
      })
    );
  };

  const handleDelete = (id) => {
    setReminders(reminders.filter((r) => r.id !== id));
    toast.success("Reminder removed.");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Pill className="w-7 h-7 text-teal-500" />
            Medicine Reminder & Pill Tracker
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Never miss a prescription dose with automated smart reminders & adherence tracking
          </p>
        </div>
      </div>

      {/* Add Medicine Form */}
      <GlassCard className="p-6 sm:p-8 backdrop-blur-2xl">
        <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-teal-500" />
          Add Prescription Medicine Reminder
        </h3>

        <form onSubmit={handleAddMedicine} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Medicine Name"
              placeholder="e.g. Paracetamol / Metformin"
              value={medName}
              onChange={(e) => setMedName(e.target.value)}
              required
            />

            <Input
              label="Dosage Strength"
              placeholder="e.g. 500 mg / 1 Tablet"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Alarm Time"
              type="time"
              value={medTime}
              onChange={(e) => setMedTime(e.target.value)}
              required
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500"
              >
                <option value="Once Daily">Once Daily</option>
                <option value="Twice Daily">Twice Daily</option>
                <option value="Thrice Daily">Thrice Daily</option>
                <option value="As Needed (PRN)">As Needed (PRN)</option>
              </select>
            </div>
          </div>

          <Input
            label="Special Instructions"
            placeholder="e.g. Take after breakfast with warm water"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />

          <Button
            type="submit"
            text="Schedule Pill Alarm"
            icon={Bell}
            variant="primary"
            className="w-full py-3.5 font-bold"
          />
        </form>
      </GlassCard>

      {/* Today's Schedule Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">
          Today's Prescription Schedule ({reminders.length})
        </h3>

        <div className="space-y-3">
          {reminders.map((r) => (
            <GlassCard
              key={r.id}
              className={`p-5 flex items-center justify-between transition ${
                r.completed ? "opacity-60 bg-emerald-500/5 border-emerald-500/30" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleComplete(r.id)}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition ${
                    r.completed
                      ? "bg-emerald-500 text-white"
                      : "bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500/20"
                  }`}
                >
                  <CheckCircle2 className="w-6 h-6" />
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className={`text-base font-extrabold ${r.completed ? "line-through text-slate-400" : "text-slate-800 dark:text-slate-100"}`}>
                      {r.name} ({r.dosage})
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-600">
                      ⏰ {r.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{r.frequency} • {r.instructions}</p>
                </div>
              </div>

              <button
                onClick={() => handleDelete(r.id)}
                className="p-2 rounded-xl text-rose-400 hover:text-rose-600 hover:bg-rose-500/10 transition"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
