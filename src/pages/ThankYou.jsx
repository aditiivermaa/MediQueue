import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";
import {
  CheckCircle2,
  Download,
  Calendar,
  Clock,
  UserCheck,
  Building,
  QrCode,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function ThankYou() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve booking payload from state or fallback mock
  const booking = location.state?.booking || {
    referenceId: "MQ-2026-824913",
    appointmentId: "APT-2026-9912",
    queueNumber: "A001",
    doctorName: "Dr Rahul Sharma",
    hospitalName: "Apollo Heart & Multi-Speciality Institute",
    department: "Cardiology",
    date: new Date().toISOString().split("T")[0],
    time: "10:00 AM",
    consultationType: "In-Clinic Visit",
    patientName: "Alex Morgan",
    paymentAmount: "₹876",
    paymentStatus: "PAID ✅"
  };

  // Google Calendar URL Generator
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    `MediQueue Appointment with ${booking.doctorName}`
  )}&dates=${booking.date.replace(/-/g, "")}T100000Z/${booking.date.replace(
    /-/g,
    ""
  )}T110000Z&details=${encodeURIComponent(
    `Department: ${booking.department}\nHospital: ${booking.hospitalName}\nRef ID: ${booking.referenceId}\nQueue Token: ${booking.queueNumber}`
  )}&location=${encodeURIComponent(booking.hospitalName)}`;

  const handlePrintSlip = () => {
    window.print();
  };

  const handleDownloadQRPass = () => {
    toast.success("Digital QR Pass downloaded to your device!");
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      {/* Confetti & Success Banner */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center space-y-3"
      >
        <div className="mx-auto w-24 h-24 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-500/20 border-2 border-emerald-500/30 animate-pulse">
          <CheckCircle2 className="w-14 h-14" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
          <Sparkles className="w-4 h-4" /> PAYMENT CONFIRMED • APPOINTMENT BOOKED
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
          Thank You for Booking!
        </h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Your OPD consultation and digital queue token have been generated & registered in MediQueue Firestore.
        </p>
      </motion.div>

      {/* Main Confirmation Card */}
      <GlassCard className="p-6 sm:p-8 backdrop-blur-2xl border-emerald-500/30 shadow-2xl relative">
        
        {/* Pass Header with Official Logo */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpeg"
              alt="MediQueue Logo"
              className="w-12 h-12 rounded-2xl object-cover border border-teal-500/30 shadow-md"
            />
            <div>
              <h2 className="text-lg font-black text-slate-800 dark:text-slate-100">
                MediQueue Digital Pass
              </h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Official OPD Token Pass
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-slate-400">Queue Token</p>
            <span className="text-3xl font-black text-teal-600 dark:text-teal-400">
              {booking.queueNumber}
            </span>
          </div>
        </div>

        {/* Reference & IDs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-6 p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs font-bold">
          <div>
            <span className="text-[10px] text-slate-400 uppercase">Unique Reference ID</span>
            <p className="text-slate-900 dark:text-slate-100 font-black tracking-wide">
              {booking.referenceId}
            </p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase">Appointment ID</span>
            <p className="text-slate-900 dark:text-slate-100 font-black">{booking.appointmentId}</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase">Payment Status</span>
            <p className="text-emerald-500 font-black">{booking.paymentStatus}</p>
          </div>
        </div>

        {/* Doctor & Appointment Summary */}
        <div className="space-y-3 text-xs border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-teal-500" /> Specialist Doctor:
            </span>
            <span className="font-extrabold text-slate-800 dark:text-slate-200 text-sm">
              {booking.doctorName}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Building className="w-4 h-4 text-teal-500" /> Hospital / Clinic:
            </span>
            <span className="font-extrabold text-slate-800 dark:text-slate-200">
              {booking.hospitalName} ({booking.department})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-teal-500" /> Date & Time Slot:
            </span>
            <span className="font-extrabold text-slate-800 dark:text-slate-200">
              {booking.date} at {booking.time}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-teal-500" /> Consultation Mode:
            </span>
            <span className="font-extrabold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-lg">
              {booking.consultationType}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-semibold">Total Paid Amount:</span>
            <span className="font-black text-base text-emerald-500">{booking.paymentAmount}</span>
          </div>
        </div>

        {/* Digital QR Code Pass Box */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md">
              <QrCode className="w-16 h-16" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-800 dark:text-slate-100">
                Scan Digital QR Pass
              </p>
              <p className="text-[10px] text-slate-400">
                Show at OPD Kiosk / Scanner upon arrival
              </p>
              <p className="text-[10px] font-bold text-teal-600 dark:text-teal-400 mt-1">
                Ref: {booking.referenceId}
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadQRPass}
            className="px-4 py-2 rounded-2xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-teal-400 text-xs font-black flex items-center gap-1.5 border border-teal-500/30 transition"
          >
            <Download className="w-4 h-4" /> Download QR Pass
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button
            text="Download PDF Slip"
            icon={Download}
            variant="primary"
            onClick={handlePrintSlip}
            className="font-bold text-xs"
          />

          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noreferrer"
            className="py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md transition"
          >
            <ExternalLink className="w-4 h-4" /> Google Calendar
          </a>

          <Button
            text="Go to Dashboard"
            icon={ArrowRight}
            variant="secondary"
            onClick={() => navigate("/dashboard")}
            className="font-bold text-xs"
          />
        </div>
      </GlassCard>
    </div>
  );
}
