import React, { useState } from "react";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import {
  ShieldAlert,
  Users,
  UserCheck,
  Building,
  Calendar,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Plus,
  Trash2,
  CheckCircle2
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("analytics"); // 'analytics', 'doctors', 'appointments', 'emergency'

  const metrics = [
    { title: "Total Patients Registered", count: "1,420", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Active Consultants", count: "38", icon: UserCheck, color: "text-teal-500", bg: "bg-teal-500/10" },
    { title: "Today's OPD Appointments", count: "184", icon: Calendar, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { title: "Hospital Monthly Revenue", count: "₹14,85,000", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" }
  ];

  const doctorsList = [
    { id: 1, name: "Dr Rahul Sharma", dept: "Cardiology", status: "On Duty", fee: "₹700" },
    { id: 2, name: "Dr Priya Singh", dept: "Dermatology", status: "On Duty", fee: "₹600" },
    { id: 3, name: "Dr Amit Verma", dept: "Orthopedics", status: "Available", fee: "₹900" },
    { id: 4, name: "Dr Sneha Iyer", dept: "General Physician", status: "On Duty", fee: "₹500" }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <GlassCard className="p-6 sm:p-8 bg-gradient-to-r from-purple-700 via-indigo-700 to-slate-900 text-white border-none shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-extrabold uppercase tracking-wider">
              Hospital Master Admin Suite
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              System Operations & Analytics
            </h1>
            <p className="text-purple-200 text-xs sm:text-sm">
              Control center for MediQueue healthcare network, staff, & emergency triage
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              text="Add Specialist Doctor"
              icon={Plus}
              variant="secondary"
              onClick={() => toast.success("Opened doctor onboarding portal")}
              className="text-purple-700 font-bold"
            />
          </div>
        </div>
      </GlassCard>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <GlassCard key={m.title} className="p-5 border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">{m.title}</p>
                <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">{m.count}</h3>
              </div>
              <div className={`p-3 rounded-2xl ${m.bg} ${m.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-200/80 dark:bg-slate-800/80 p-1.5 rounded-2xl max-w-lg">
        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "analytics" ? "bg-purple-600 text-white shadow-md" : "text-slate-600 dark:text-slate-300"
          }`}
        >
          Analytics & Revenue
        </button>
        <button
          onClick={() => setActiveTab("doctors")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "doctors" ? "bg-purple-600 text-white shadow-md" : "text-slate-600 dark:text-slate-300"
          }`}
        >
          Manage Doctors
        </button>
        <button
          onClick={() => setActiveTab("emergency")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "emergency" ? "bg-purple-600 text-white shadow-md" : "text-slate-600 dark:text-slate-300"
          }`}
        >
          Emergency Desk
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard className="p-6">
            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-500" />
              Departmental OPD Traffic Distribution
            </h3>

            <div className="space-y-4 text-xs font-bold">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Cardiology</span>
                  <span className="text-teal-600">38% (70 Patients)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-teal-500 w-[38%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Orthopedics</span>
                  <span className="text-blue-600">25% (46 Patients)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-blue-500 w-[25%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>General Physician</span>
                  <span className="text-purple-600">20% (36 Patients)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-purple-500 w-[20%]" />
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 mb-4">
              Real-time Hospital Queue Metrics
            </h3>
            <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs space-y-2">
              <p className="font-extrabold text-teal-700 dark:text-teal-300">
                ⚡ Average Patient Consultation Time: 6.8 Minutes
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                Peak OPD hours detected between 10:00 AM - 01:00 PM. 98.4% queue satisfaction rate.
              </p>
            </div>
          </GlassCard>
        </div>
      )}

      {activeTab === "doctors" && (
        <GlassCard className="p-6">
          <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 mb-4">
            Specialist Roster Control
          </h3>

          <div className="space-y-3">
            {doctorsList.map((d) => (
              <div key={d.id} className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">{d.name}</h4>
                  <p className="text-xs text-slate-500">{d.dept} • Fee: {d.fee}</p>
                </div>
                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-500">
                  {d.status}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
