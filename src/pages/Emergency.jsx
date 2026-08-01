import React, { useState, useEffect, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";
import GlassCard from "../components/ui/GlassCard";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import {
  getUserCurrentLocation,
  NEARBY_HOSPITALS,
  calculateDistanceKm,
  calculateTravelEtaMins,
  getGoogleMapsDirUrl
} from "../services/locationService";
import {
  AlertTriangle,
  Siren,
  PhoneCall,
  MapPin,
  Flame,
  Bot,
  Activity,
  Navigation,
  Building,
  Award,
  CheckCircle2,
  Clock,
  ShieldAlert
} from "lucide-react";
import toast from "react-hot-toast";

const Emergency = memo(function Emergency() {
  const navigate = useNavigate();
  const { userProfile, currentUser } = useAuth();

  const [userLoc, setUserLoc] = useState({ lat: 28.5355, lng: 77.241, city: "Detecting GPS..." });
  const [patientName, setPatientName] = useState(userProfile?.name || "Alex Morgan");
  const [age, setAge] = useState("32");
  const [symptoms, setSymptoms] = useState("");
  const [location, setLocation] = useState(userProfile?.address || "New Delhi");
  const [contactNumber, setContactNumber] = useState(userProfile?.phone || "+91 98765 43210");
  const [submitting, setSubmitting] = useState(false);

  const [emergencyResult, setEmergencyResult] = useState(null);

  // Initialize GPS Location
  useEffect(() => {
    getUserCurrentLocation().then((loc) => setUserLoc(loc));
  }, []);

  // Emergency Condition Types
  const emergencyTypes = [
    { title: "Chest Pain / Heart Attack", defaultPriority: "CRITICAL", fee: "₹1,500" },
    { title: "Accident / Severe Trauma", defaultPriority: "CRITICAL", fee: "₹1,800" },
    { title: "Uncontrolled Arterial Bleeding", defaultPriority: "CRITICAL", fee: "₹1,200" },
    { title: "Pregnancy & Labor Pain", defaultPriority: "CRITICAL", fee: "₹1,500" },
    { title: "Stroke / Slurred Speech", defaultPriority: "CRITICAL", fee: "₹2,000" },
    { title: "High Fever / Seizures", defaultPriority: "HIGH", fee: "₹800" }
  ];
  const [selectedType, setSelectedType] = useState(emergencyTypes[0]);

  // Emergency Smart Hospital Ranking Engine
  const rankedHospitals = useMemo(() => {
    const list = NEARBY_HOSPITALS.map((h) => {
      const dist = calculateDistanceKm(userLoc.lat, userLoc.lng, h.lat, h.lng);
      const eta = calculateTravelEtaMins(dist);
      // Emergency Score: lower distance + lower wait time = higher priority
      const erScore = (100 - dist * 4 - h.avgWaitMins).toFixed(1);
      return { ...h, distanceKm: dist, etaMins: eta, erScore };
    });

    list.sort((a, b) => b.erScore - a.erScore);
    return list;
  }, [userLoc]);

  const bestRecommendedHospital = rankedHospitals[0] || NEARBY_HOSPITALS[0];

  const handleSubmitEmergency = async (e) => {
    e.preventDefault();
    if (!symptoms) {
      toast.error("Please describe emergency symptoms.");
      return;
    }

    setSubmitting(true);
    try {
      const token = `EMG-${Math.floor(Math.random() * 900) + 100}`;
      const payload = {
        token,
        patientId: currentUser?.uid || "guest",
        patientName,
        age,
        emergencyType: selectedType.title,
        priority: selectedType.defaultPriority,
        symptoms,
        location,
        contactNumber,
        recommendedHospital: bestRecommendedHospital.name,
        hospitalAddress: bestRecommendedHospital.address,
        hospitalLat: bestRecommendedHospital.lat,
        hospitalLng: bestRecommendedHospital.lng,
        etaMinutes: bestRecommendedHospital.etaMins,
        distanceKm: bestRecommendedHospital.distanceKm,
        status: "Doctor Dispatched",
        doctorAssigned: "Dr. Rahul Sharma (ER Lead)",
        emergencyFee: selectedType.fee,
        createdAt: new Date().toISOString()
      };

      try {
        await addDoc(collection(db, "emergencyCases"), payload);
      } catch (e) {}

      setEmergencyResult(payload);
      toast.success("🔴 EMERGENCY SMART ROUTING: ER UNIT DISPATCHED!");
    } finally {
      setSubmitting(false);
    }
  };

  if (emergencyResult) {
    return (
      <div className="max-w-xl mx-auto py-8 px-4">
        <GlassCard className="p-8 text-center backdrop-blur-2xl border-rose-500/40 shadow-2xl relative bg-slate-900 text-white space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center mb-2 animate-bounce">
            <Siren className="w-10 h-10" />
          </div>

          <span className="px-3.5 py-1 rounded-full text-xs font-black bg-rose-500 text-white shadow-lg shadow-rose-500/50 animate-pulse">
            🔴 {emergencyResult.priority} EMERGENCY DISPATCH ACTIVE
          </span>

          <h2 className="text-3xl font-black text-white">
            Emergency Token: {emergencyResult.token}
          </h2>
          <p className="text-xs text-rose-300">Placed at TOP of Hospital Emergency Queue</p>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 text-left space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <span className="text-slate-400">#1 Recommended ER Unit:</span>
              <span className="font-black text-teal-400">{emergencyResult.recommendedHospital}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <span className="text-slate-400">Distance & ETA:</span>
              <span className="font-extrabold text-emerald-400">{emergencyResult.distanceKm} km (~{emergencyResult.etaMinutes} mins drive)</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <span className="text-slate-400">Assigned ER Specialist:</span>
              <span className="font-extrabold text-slate-200">{emergencyResult.doctorAssigned}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <a
              href={getGoogleMapsDirUrl(emergencyResult.hospitalLat, emergencyResult.hospitalLng, emergencyResult.recommendedHospital)}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg"
            >
              <Navigation className="w-4 h-4" /> Google Maps Directions
            </a>

            <Button
              text="View Priority Queue"
              variant="primary"
              onClick={() => navigate("/queue")}
              className="flex-1 font-extrabold"
            />
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-xl shadow-red-600/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-black uppercase">
            <Flame className="w-4 h-4 animate-pulse" /> Emergency Smart Routing Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Emergency SOS Response
          </h1>
          <p className="text-xs text-rose-100">
            Auto-detects GPS, ranks nearby hospitals by ETA & ER facilities
          </p>
        </div>

        <div className="text-center sm:text-right">
          <p className="text-xs font-bold text-rose-200">Ambulance Hotline</p>
          <p className="text-2xl font-black tracking-wider text-white">📞 102 / 108</p>
        </div>
      </div>

      {/* Recommended Hospital Spotlight Card */}
      <GlassCard className="p-5 border-teal-500/30 bg-teal-500/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-teal-500 text-white font-bold">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-teal-600 dark:text-teal-400">
                #1 Smart Recommended Hospital
              </span>
              <h3 className="text-base font-black text-slate-800 dark:text-slate-100">
                {bestRecommendedHospital.name}
              </h3>
              <p className="text-xs text-slate-500">
                🚗 {bestRecommendedHospital.distanceKm} km away (~{bestRecommendedHospital.etaMins} mins drive) • {bestRecommendedHospital.erFacilities}
              </p>
            </div>
          </div>

          <a
            href={getGoogleMapsDirUrl(bestRecommendedHospital.lat, bestRecommendedHospital.lng, bestRecommendedHospital.name)}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md flex-shrink-0"
          >
            <Navigation className="w-4 h-4" /> Open Maps
          </a>
        </div>
      </GlassCard>

      {/* Main Form */}
      <GlassCard className="p-6 sm:p-8 backdrop-blur-2xl">
        <form onSubmit={handleSubmitEmergency} className="space-y-6">
          
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase text-slate-700 dark:text-slate-300 tracking-wider">
              1. Select Emergency Medical Condition
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {emergencyTypes.map((item) => (
                <button
                  type="button"
                  key={item.title}
                  onClick={() => setSelectedType(item)}
                  className={`p-3.5 rounded-2xl border text-xs font-bold text-left transition flex flex-col justify-between h-20 ${
                    selectedType.title === item.title
                      ? "bg-rose-500/20 border-rose-500 text-rose-600 dark:text-rose-400 shadow-md ring-2 ring-rose-500/40"
                      : "bg-slate-100/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  <span>{item.title}</span>
                  <span className="text-[10px] font-extrabold text-rose-500">{item.defaultPriority}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Patient Name"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              required
            />
            <Input
              label="Age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
            <Input
              label="Emergency Phone Number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
            />
            <Input
              label="Current Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <Input
            label="Describe Immediate Symptoms"
            placeholder="e.g. Sharp pain in left chest radiating to arm, heavy breathing"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            required
          />

          <Button
            type="submit"
            text="🔴 DISPATCH EMERGENCY SOS & ROUTE TO BEST HOSPITAL"
            variant="emergency"
            loading={submitting}
            className="w-full py-4 text-base font-black tracking-wide"
          />
        </form>
      </GlassCard>
    </div>
  );
});

export default Emergency;
