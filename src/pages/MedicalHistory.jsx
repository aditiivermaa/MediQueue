import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import {
  FileText,
  Heart,
  AlertCircle,
  Syringe,
  Scissors,
  Activity,
  Plus,
  User,
  Calendar,
  Stethoscope,
  CheckCircle2
} from "lucide-react";
import toast from "react-hot-toast";

export default function MedicalHistory() {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("records"); // 'records', 'vault'

  // Sample Lifetime Medical History Data
  const medicalData = {
    bloodGroup: userProfile?.bloodGroup || "O+",
    allergies: ["Penicillin", "Dust Mites", "Peanuts"],
    existingDiseases: ["Mild Hypertension", "Seasonal Asthma"],
    vaccinations: [
      { name: "COVID-19 Booster (Covishield)", date: "2024-01-15", status: "Completed" },
      { name: "Hepatitis B", date: "2022-08-10", status: "Completed" },
      { name: "Tetanus Shot", date: "2023-11-05", status: "Completed" }
    ],
    surgeries: [
      { procedure: "Appendectomy", hospital: "Apollo Hospital, Delhi", date: "2021-04-12" }
    ],
    pastAppointments: [
      {
        id: "APT-9921",
        doctor: "Dr. Rahul Sharma",
        department: "Cardiology",
        date: "2026-07-14",
        diagnosis: "Normal Sinus Rhythm, Mild Stress-Induced Palpitations",
        prescription: "Tab. Telmisartan 40mg 1-0-0 (30 Days), Multivitamins",
        notes: "Advised 30 minutes daily aerobic exercise, cut down sodium intake."
      },
      {
        id: "APT-8812",
        doctor: "Dr. Sneha Iyer",
        department: "General Physician",
        date: "2026-05-02",
        diagnosis: "Acute Viral Bronchitis",
        prescription: "Tab. Azithromycin 500mg 1-0-0 (5 Days), Cough Syrup",
        notes: "Steam inhalation twice daily. Rest for 3 days."
      }
    ]
  };

  // Family Members Vault State
  const [familyMembers, setFamilyMembers] = useState([
    { name: "Sarah Morgan", relation: "Spouse", bloodGroup: "A+", age: 30 },
    { name: "Leo Morgan", relation: "Child", bloodGroup: "O+", age: 5 }
  ]);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRelation, setNewMemberRelation] = useState("Spouse");

  const handleAddFamilyMember = (e) => {
    e.preventDefault();
    if (!newMemberName) return;
    setFamilyMembers([
      ...familyMembers,
      { name: newMemberName, relation: newMemberRelation, bloodGroup: "B+", age: 28 }
    ]);
    setNewMemberName("");
    toast.success("Family member profile added to vault!");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-7 h-7 text-teal-500" />
            Lifetime Medical History & Vault
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Centralized digital health timeline, past prescriptions, allergies, & family vault
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-200/80 dark:bg-slate-800/80 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab("records")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "records"
                ? "bg-teal-600 text-white shadow-md"
                : "text-slate-600 dark:text-slate-300"
            }`}
          >
            My Records
          </button>
          <button
            onClick={() => setActiveTab("vault")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "vault"
                ? "bg-teal-600 text-white shadow-md"
                : "text-slate-600 dark:text-slate-300"
            }`}
          >
            Family Vault
          </button>
        </div>
      </div>

      {activeTab === "records" ? (
        <>
          {/* Health Summary Vitals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <GlassCard className="p-5 flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Blood Group</p>
                <p className="text-xl font-black text-slate-800 dark:text-slate-100">
                  {medicalData.bloodGroup}
                </p>
              </div>
            </GlassCard>

            <GlassCard className="p-5 flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Known Allergies</p>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  {medicalData.allergies.join(", ")}
                </p>
              </div>
            </GlassCard>

            <GlassCard className="p-5 flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                <Syringe className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Vaccinations</p>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  3 Completed
                </p>
              </div>
            </GlassCard>

            <GlassCard className="p-5 flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500">
                <Scissors className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Past Surgeries</p>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  1 Record Logged
                </p>
              </div>
            </GlassCard>
          </div>

          {/* Past Consultations & Doctor Diagnoses */}
          <div className="space-y-4">
            <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-teal-500" />
              Past Consultation History & Doctor Notes
            </h3>

            <div className="space-y-4">
              {medicalData.pastAppointments.map((apt) => (
                <GlassCard key={apt.id} className="p-6 border-slate-200/60 dark:border-slate-800/60">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center font-bold">
                        🩺
                      </div>
                      <div>
                        <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                          {apt.doctor}
                        </h4>
                        <p className="text-xs text-slate-500">{apt.department}</p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-3 py-1 rounded-xl">
                      📅 {apt.date}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Clinical Diagnosis</p>
                      <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                        {apt.diagnosis}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Prescription Rx</p>
                      <p className="font-bold text-teal-600 dark:text-teal-400 mt-0.5">
                        {apt.prescription}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-400">
                    <span className="font-extrabold text-slate-700 dark:text-slate-300">Doctor Notes: </span>
                    {apt.notes}
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Family Health Vault */
        <div className="space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-teal-500" />
              Add Family Member to Health Vault
            </h3>

            <form onSubmit={handleAddFamilyMember} className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Member Full Name"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                required
              />

              <select
                value={newMemberRelation}
                onChange={(e) => setNewMemberRelation(e.target.value)}
                className="rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500"
              >
                <option value="Spouse">Spouse</option>
                <option value="Child">Child</option>
                <option value="Parent">Parent</option>
                <option value="Sibling">Sibling</option>
              </select>

              <Button
                type="submit"
                text="Add Member"
                icon={Plus}
                variant="primary"
              />
            </form>
          </GlassCard>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {familyMembers.map((fam, idx) => (
              <GlassCard key={idx} className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-extrabold text-base">
                    {fam.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                      {fam.name}
                    </h4>
                    <p className="text-xs text-slate-500">{fam.relation} • {fam.age} yrs • Blood Group: {fam.bloodGroup}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-500">Vault Linked ✅</span>
              </GlassCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
