import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import {
  Stethoscope,
  Users,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Upload,
  Plus,
  Play
} from "lucide-react";
import toast from "react-hot-toast";

export default function DoctorDashboard() {
  const { userProfile } = useAuth();

  const [activeTab, setActiveTab] = useState("queue"); // 'queue', 'emergency', 'prescribe'
  const [patients, setPatients] = useState([
    { id: "1", name: "Alex Morgan", token: "A001", time: "09:00 AM", status: "In Consultation", reason: "Chest tightness & stress" },
    { id: "2", name: "Maria Garcia", token: "A002", time: "10:00 AM", status: "Waiting", reason: "Routine ECG Followup" },
    { id: "3", name: "Robert Chen", token: "A003", time: "11:30 AM", status: "Waiting", reason: "High BP Symptoms" }
  ]);

  const [emergencies, setEmergencies] = useState([
    { id: "emg1", token: "EMG-109", patient: "Rajesh Kumar", type: "Chest Pain", priority: "CRITICAL", fee: "₹1,500" },
    { id: "emg2", token: "EMG-112", patient: "Anita Roy", type: "Accident Trauma", priority: "CRITICAL", fee: "₹1,800" }
  ]);

  // Prescription Form State
  const [patientName, setPatientName] = useState("Alex Morgan");
  const [diagnosis, setDiagnosis] = useState("");
  const [medicines, setMedicines] = useState("");
  const [doctorNotes, setDoctorNotes] = useState("");

  const handleAdvanceQueue = () => {
    toast.success("📢 Advanced token! Patient Alex Morgan marked Consulted.");
  };

  const handleSavePrescription = (e) => {
    e.preventDefault();
    if (!diagnosis || !medicines) {
      toast.error("Please enter diagnosis and prescribed medicines.");
      return;
    }
    toast.success(`Prescription generated & uploaded to ${patientName}'s Medical Vault!`);
    setDiagnosis("");
    setMedicines("");
    setDoctorNotes("");
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <GlassCard className="p-6 sm:p-8 bg-gradient-to-r from-blue-600 via-teal-600 to-indigo-700 text-white border-none shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-extrabold uppercase tracking-wider">
              Doctor Clinical Portal
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Dr. Rahul Sharma 👋
            </h1>
            <p className="text-teal-100 text-xs sm:text-sm">
              Head of Cardiology • OPD Room 104 • MediQueue Central Hospital
            </p>
          </div>

          <Button
            text="Call Next Queue Token"
            icon={Play}
            variant="secondary"
            onClick={handleAdvanceQueue}
            className="text-blue-700 font-extrabold"
          />
        </div>
      </GlassCard>

      {/* Doctor Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl glass-card border border-slate-200/60 dark:border-slate-800/60 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Today's Patients</p>
            <p className="text-lg font-black text-slate-800 dark:text-slate-100">18</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-200/60 dark:border-slate-800/60 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Emergencies</p>
            <p className="text-lg font-black text-rose-500">2 Active</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-200/60 dark:border-slate-800/60 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-teal-500/10 text-teal-500">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Appointments</p>
            <p className="text-lg font-black text-slate-800 dark:text-slate-100">12 Booked</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-200/60 dark:border-slate-800/60 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Completed</p>
            <p className="text-lg font-black text-slate-800 dark:text-slate-100">14 Done</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-200/60 dark:border-slate-800/60 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Pending</p>
            <p className="text-lg font-black text-slate-800 dark:text-slate-100">4 Waiting</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-200/80 dark:bg-slate-800/80 p-1.5 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveTab("queue")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "queue"
              ? "bg-blue-600 text-white shadow-md"
              : "text-slate-600 dark:text-slate-300"
          }`}
        >
          Patient Queue
        </button>
        <button
          onClick={() => setActiveTab("emergency")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "emergency"
              ? "bg-rose-600 text-white shadow-md"
              : "text-slate-600 dark:text-slate-300"
          }`}
        >
          ER Desk (2)
        </button>
        <button
          onClick={() => setActiveTab("prescribe")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "prescribe"
              ? "bg-teal-600 text-white shadow-md"
              : "text-slate-600 dark:text-slate-300"
          }`}
        >
          Write Rx
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "queue" && (
        <GlassCard className="p-6">
          <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 mb-4">
            OPD Room 104 Live Consultation Line
          </h3>

          <div className="space-y-3">
            {patients.map((pat) => (
              <div
                key={pat.id}
                className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-black text-sm">
                    {pat.token}
                  </span>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                      {pat.name}
                    </h4>
                    <p className="text-xs text-slate-500">{pat.time} • Reason: {pat.reason}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl text-xs font-bold bg-teal-500/10 text-teal-600">
                    {pat.status}
                  </span>
                  <Button
                    text="Write Rx"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setPatientName(pat.name);
                      setActiveTab("prescribe");
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {activeTab === "emergency" && (
        <div className="space-y-4">
          {emergencies.map((emg) => (
            <GlassCard key={emg.id} className="p-6 border-rose-500/30">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-rose-500 text-white font-bold text-xs">
                    {emg.token}
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                      {emg.patient}
                    </h4>
                    <p className="text-xs text-rose-500 font-bold">{emg.type}</p>
                  </div>
                </div>

                <Button
                  text="Accept Critical Case"
                  variant="emergency"
                  size="sm"
                  onClick={() => toast.success(`Accepted ${emg.patient}'s emergency case!`)}
                />
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {activeTab === "prescribe" && (
        <GlassCard className="p-6 sm:p-8">
          <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-500" />
            Digital Prescription & Lab Report Generator
          </h3>

          <form onSubmit={handleSavePrescription} className="space-y-4">
            <Input
              label="Patient Name"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              required
            />

            <Input
              label="Clinical Diagnosis"
              placeholder="e.g. Essential Hypertension, Mild Tachycardia"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              required
            />

            <Input
              label="Prescribed Medicines (Rx)"
              placeholder="e.g. Tab. Telmisartan 40mg 1-0-0 (30 Days), Tab. Aspirin 75mg 0-0-1"
              value={medicines}
              onChange={(e) => setMedicines(e.target.value)}
              required
            />

            <Input
              label="Doctor Advice & Dietary Notes"
              placeholder="e.g. Reduced salt diet, 30 mins morning walk, follow up in 2 weeks"
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
            />

            <Button
              type="submit"
              text="Upload Rx to Patient Record"
              variant="primary"
              className="w-full py-3.5 font-bold"
            />
          </form>
        </GlassCard>
      )}
    </div>
  );
}
