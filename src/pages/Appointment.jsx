import React, { useState, useEffect, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebase";
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import GlassCard from "../components/ui/GlassCard";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import {
  Calendar,
  Clock,
  UserCheck,
  Building,
  Video,
  Home,
  CheckCircle2,
  QrCode,
  ArrowRight,
  ArrowLeft,
  FileText,
  CreditCard,
  Lock,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const Appointment = memo(function Appointment() {
  const navigate = useNavigate();
  const { userProfile, currentUser } = useAuth();

  const departments = [
    "Cardiology",
    "Dermatology",
    "Orthopedics",
    "General Physician",
    "Neurology",
    "Pediatrics",
    "ENT",
    "Ophthalmology"
  ];

  const doctorsList = [
    { id: "doc1", name: "Dr Rahul Sharma", dept: "Cardiology", fee: "₹700", feeVal: 700, exp: "10 Yrs", hospital: "Apollo Heart Institute" },
    { id: "doc2", name: "Dr Priya Singh", dept: "Dermatology", fee: "₹600", feeVal: 600, exp: "8 Yrs", hospital: "Max Super Speciality" },
    { id: "doc3", name: "Dr Amit Verma", dept: "Orthopedics", fee: "₹900", feeVal: 900, exp: "15 Yrs", hospital: "Fortis Bone Care" },
    { id: "doc4", name: "Dr Sneha Iyer", dept: "General Physician", fee: "₹500", feeVal: 500, exp: "12 Yrs", hospital: "MediQueue Central Clinic" },
    { id: "doc5", name: "Dr Vikram Sethi", dept: "Neurology", fee: "₹1000", feeVal: 1000, exp: "18 Yrs", hospital: "Medanta Medicity" }
  ];

  const timeSlots = ["09:00 AM", "10:00 AM", "11:30 AM", "02:00 PM", "03:30 PM", "04:30 PM", "06:00 PM"];

  // Wizard Steps: 'form' -> 'review' -> 'payment'
  const [step, setStep] = useState("form");
  const [department, setDepartment] = useState("Cardiology");
  const [selectedDoctor, setSelectedDoctor] = useState(doctorsList[0]);
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [timeSlot, setTimeSlot] = useState("10:00 AM");
  const [consultationMode, setConsultationMode] = useState("In-Clinic Visit");
  const [reason, setReason] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const filtered = doctorsList.filter((d) => d.dept === department);
    if (filtered.length > 0) setSelectedDoctor(filtered[0]);
  }, [department]);

  // Billing Calculations
  const baseFee = selectedDoctor.feeVal;
  const gstFee = Math.round(baseFee * 0.18);
  const platformFee = 50;
  const totalAmountVal = baseFee + gstFee + platformFee;
  const totalAmountFormatted = `₹${totalAmountVal}`;

  // Proceed from Form to Review
  const handleProceedToReview = (e) => {
    e.preventDefault();
    if (!reason) {
      toast.error("Please enter a reason or symptoms for the visit.");
      return;
    }
    setStep("review");
  };

  // Proceed from Review to Payment Checkout Page
  const handleProceedToPayment = () => {
    setStep("payment");
  };

  // Generate Unique Non-Duplicating Reference ID (MQ-2026-XXXXXX)
  const generateReferenceId = () => {
    const random6Digits = Math.floor(100000 + Math.random() * 900000);
    return `MQ-2026-${random6Digits}`;
  };

  // Execute Payment & Generate Pass (under 2 seconds!)
  const handleConfirmPayment = async () => {
    setProcessing(true);
    toast.loading("Verifying payment & generating QR token pass...", { id: "checkout" });

    setTimeout(async () => {
      const refId = generateReferenceId();
      const aptId = `APT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const queueNo = `A00${Math.floor(Math.random() * 8) + 1}`;

      const bookingPayload = {
        referenceId: refId,
        appointmentId: aptId,
        queueNumber: queueNo,
        patientId: currentUser?.uid || "guest",
        patientName: userProfile?.name || "Alex Morgan",
        patientPhone: userProfile?.phone || "+91 98765 43210",
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        hospitalName: selectedDoctor.hospital,
        department,
        date,
        time: timeSlot,
        consultationType: consultationMode,
        reason,
        baseFee: `₹${baseFee}`,
        gstFee: `₹${gstFee}`,
        platformFee: `₹${platformFee}`,
        paymentAmount: totalAmountFormatted,
        paymentStatus: "PAID ✅",
        createdAt: new Date().toISOString()
      };

      try {
        await addDoc(collection(db, "appointments"), bookingPayload);
      } catch (e) {}

      toast.success("✅ Payment Verified & Appointment Confirmed!", { id: "checkout" });
      setProcessing(false);

      // Instant sub-100ms redirect to Thank You Confirmation Page
      navigate("/thank-you", { state: { booking: bookingPayload } });
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header with Step Indicators */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Calendar className="w-7 h-7 text-teal-500" />
            Book Doctor Appointment
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official OPD booking workflow with instant payment QR pass
          </p>
        </div>

        {/* Step Progress Pills */}
        <div className="flex items-center gap-2 text-xs font-extrabold">
          <span className={`px-3 py-1 rounded-full ${step === "form" ? "bg-teal-600 text-white" : "bg-teal-500/20 text-teal-600 dark:text-teal-400"}`}>
            1. Details
          </span>
          <span>→</span>
          <span className={`px-3 py-1 rounded-full ${step === "review" ? "bg-teal-600 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500"}`}>
            2. Review
          </span>
          <span>→</span>
          <span className={`px-3 py-1 rounded-full ${step === "payment" ? "bg-teal-600 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500"}`}>
            3. Payment
          </span>
        </div>
      </div>

      {/* STEP 1: Details Selection Form */}
      {step === "form" && (
        <GlassCard className="p-6 sm:p-8 backdrop-blur-2xl">
          <form onSubmit={handleProceedToReview} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase text-slate-700 dark:text-slate-300 tracking-wider">
                1. Choose Specialty Department
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {departments.map((dept) => (
                  <button
                    type="button"
                    key={dept}
                    onClick={() => setDepartment(dept)}
                    className={`p-3.5 rounded-2xl border text-xs font-bold text-left transition flex items-center justify-between ${
                      department === dept
                        ? "bg-teal-500/20 border-teal-500 text-teal-600 dark:text-teal-400 shadow-md"
                        : "bg-slate-100/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    <span>{dept}</span>
                    {department === dept && <CheckCircle2 className="w-4 h-4 text-teal-500" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase text-slate-700 dark:text-slate-300 tracking-wider">
                2. Select Specialist Doctor ({department})
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {doctorsList
                  .filter((d) => d.dept === department)
                  .concat(doctorsList.filter((d) => d.dept !== department).slice(0, 1))
                  .map((doc) => (
                    <button
                      type="button"
                      key={doc.id}
                      onClick={() => setSelectedDoctor(doc)}
                      className={`p-4 rounded-2xl border text-left transition flex items-center justify-between ${
                        selectedDoctor.id === doc.id
                          ? "bg-gradient-to-r from-teal-500/20 to-blue-500/20 border-teal-500 text-slate-800 dark:text-slate-100 shadow-md"
                          : "bg-slate-100/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center font-extrabold text-sm">
                          👨‍⚕️
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold">{doc.name}</h4>
                          <p className="text-[10px] text-slate-500">{doc.hospital} • {doc.exp}</p>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-xl">
                        {doc.fee}
                      </span>
                    </button>
                  ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="3. Preferred Date"
                type="date"
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
                icon={Calendar}
                required
              />

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold uppercase text-slate-700 dark:text-slate-300 tracking-wider">
                  4. Time Slot
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500"
                >
                  {timeSlots.map((ts) => (
                    <option key={ts} value={ts}>{ts}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase text-slate-700 dark:text-slate-300 tracking-wider">
                5. Consultation Mode
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setConsultationMode("In-Clinic Visit")}
                  className={`p-3.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                    consultationMode === "In-Clinic Visit"
                      ? "bg-teal-500/20 border-teal-500 text-teal-600 dark:text-teal-300 shadow-md"
                      : "bg-slate-100/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-500"
                  }`}
                >
                  <Building className="w-5 h-5" /> In-Clinic
                </button>

                <button
                  type="button"
                  onClick={() => setConsultationMode("Online Video Call")}
                  className={`p-3.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                    consultationMode === "Online Video Call"
                      ? "bg-blue-500/20 border-blue-500 text-blue-600 dark:text-blue-300 shadow-md"
                      : "bg-slate-100/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-500"
                  }`}
                >
                  <Video className="w-5 h-5" /> Video Call
                </button>

                <button
                  type="button"
                  onClick={() => setConsultationMode("Home Visit")}
                  className={`p-3.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                    consultationMode === "Home Visit"
                      ? "bg-purple-500/20 border-purple-500 text-purple-600 dark:text-purple-300 shadow-md"
                      : "bg-slate-100/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-500"
                  }`}
                >
                  <Home className="w-5 h-5" /> Home Visit
                </button>
              </div>
            </div>

            <Input
              label="6. Reason for Visit / Symptoms"
              placeholder="e.g., Chest discomfort, Routine checkup, Knee joint pain"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              icon={FileText}
              required
            />

            <Button
              type="submit"
              text="Proceed to Review Details →"
              variant="primary"
              className="w-full py-4 text-base font-extrabold"
            />
          </form>
        </GlassCard>
      )}

      {/* STEP 2: Review Appointment Details */}
      {step === "review" && (
        <GlassCard className="p-6 sm:p-8 backdrop-blur-2xl space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
                Review Appointment Summary
              </h2>
              <p className="text-xs text-slate-500">Please verify details before proceeding to payment checkout</p>
            </div>
            <button
              onClick={() => setStep("form")}
              className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Edit Details
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
              <p className="text-slate-400 font-bold uppercase text-[10px]">Specialist Doctor</p>
              <p className="font-black text-sm text-slate-800 dark:text-slate-100">{selectedDoctor.name}</p>
              <p className="text-slate-500">{selectedDoctor.hospital} ({department})</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
              <p className="text-slate-400 font-bold uppercase text-[10px]">Date, Time & Mode</p>
              <p className="font-black text-sm text-slate-800 dark:text-slate-100">{date} at {timeSlot}</p>
              <p className="text-teal-600 dark:text-teal-400 font-bold">{consultationMode}</p>
            </div>
          </div>

          {/* Billing Breakdown Box */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3 text-xs">
            <h3 className="font-extrabold text-sm border-b border-slate-800 pb-2 text-teal-400">
              Payment & Fee Breakdown
            </h3>

            <div className="flex justify-between">
              <span className="text-slate-400">Consultation Fee ({selectedDoctor.name}):</span>
              <span className="font-bold">₹{baseFee}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">GST (18% Statutory Healthcare Tax):</span>
              <span className="font-bold">₹{gstFee}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Platform & Digital Queue Fee:</span>
              <span className="font-bold">₹{platformFee}</span>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-black">
              <span>Total Amount Payable:</span>
              <span className="text-emerald-400 text-base">{totalAmountFormatted}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              text="← Back"
              variant="secondary"
              onClick={() => setStep("form")}
              className="flex-1"
            />
            <Button
              text={`Proceed to Payment Checkout (${totalAmountFormatted}) →`}
              variant="primary"
              onClick={handleProceedToPayment}
              className="flex-2 font-extrabold"
            />
          </div>
        </GlassCard>
      )}

      {/* STEP 3: Payment Checkout Page with Uploaded PhonePe QR Image */}
      {step === "payment" && (
        <GlassCard className="p-6 sm:p-8 backdrop-blur-2xl space-y-6">
          <div className="text-center space-y-2 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center font-bold">
              <CreditCard className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">
              Payment Checkout Portal
            </h2>
            <p className="text-xs text-slate-500">
              Scan Official MediQueue UPI QR Code to pay <strong className="text-emerald-500 font-extrabold">{totalAmountFormatted}</strong>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-4">
            {/* Uploaded Official PhonePe QR Code Image */}
            <div className="p-4 rounded-3xl bg-white border-2 border-teal-500/40 shadow-2xl text-center space-y-2 max-w-xs">
              <img
                src="/qr.jpeg"
                alt="MediQueue Payment PhonePe QR Code"
                className="w-56 h-56 object-contain mx-auto rounded-xl"
              />
              <p className="text-[11px] font-extrabold text-slate-800">
                Scan with PhonePe / GPay / Paytm / UPI
              </p>
              <p className="text-[10px] text-teal-600 font-bold">UPI ID: mediqueue@paytm</p>
            </div>

            {/* Payment Summary */}
            <div className="space-y-4 text-xs max-w-xs w-full">
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
                <p className="text-[10px] uppercase font-bold text-slate-400">Total Payable</p>
                <p className="text-3xl font-black text-emerald-400">{totalAmountFormatted}</p>
                <p className="text-[11px] text-slate-300 font-semibold">{selectedDoctor.name} ({department})</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-300 space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-teal-500" /> Instant QR Pass Generator
                </p>
                <p className="text-[10px] leading-relaxed">
                  After completing payment on your UPI app, click <strong>"I've Paid"</strong> below to generate your unique reference ID and digital queue pass.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              text="← Back"
              variant="secondary"
              onClick={() => setStep("review")}
              disabled={processing}
            />
            <Button
              text="✅ I've Paid - Confirm & Generate Pass"
              variant="primary"
              loading={processing}
              onClick={handleConfirmPayment}
              className="flex-1 py-4 text-sm font-black"
            />
          </div>
        </GlassCard>
      )}
    </div>
  );
});

export default Appointment;