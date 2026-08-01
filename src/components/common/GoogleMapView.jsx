import React, { useState } from "react";
import { MapPin, Navigation, Building, Pill, Truck, ExternalLink } from "lucide-react";
import { getGoogleMapsDirUrl } from "../../services/locationService";

export default function GoogleMapView({ userLocation, hospitals = [] }) {
  const [activeCategory, setActiveCategory] = useState("hospitals"); // 'hospitals', 'pharmacies', 'ambulances'

  const pharmacies = [
    { name: "Apollo Pharmacy 24/7", distance: "0.8 km", time: "3 mins", lat: 28.538, lng: 77.284 },
    { name: "MedPlus Wellness Pharmacy", distance: "1.4 km", time: "5 mins", lat: 28.529, lng: 77.212 }
  ];

  const ambulances = [
    { name: "MediQueue Express Ambulance #104", status: "On Standby", distance: "0.5 km", time: "2 mins" },
    { name: "Cardiac ICU Ambulance #108", status: "Available", distance: "1.2 km", time: "4 mins" }
  ];

  return (
    <div className="glass-panel p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
      {/* Map Header & Filter Chips */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <MapPin className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
              Live Google Maps & Nearby Health Stack
            </h3>
            <p className="text-[10px] text-slate-400">
              GPS Location: {userLocation?.city || "New Delhi (28.53° N, 77.24° E)"}
            </p>
          </div>
        </div>

        {/* Category Switcher */}
        <div className="flex bg-slate-200/80 dark:bg-slate-800/80 p-1 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setActiveCategory("hospitals")}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeCategory === "hospitals"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-300"
            }`}
          >
            Hospitals ({hospitals.length})
          </button>
          <button
            onClick={() => setActiveCategory("pharmacies")}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeCategory === "pharmacies"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-300"
            }`}
          >
            Pharmacies 24/7
          </button>
          <button
            onClick={() => setActiveCategory("ambulances")}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeCategory === "ambulances"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-300"
            }`}
          >
            Ambulances
          </button>
        </div>
      </div>

      {/* Simulated Interactive Map Display Container */}
      <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 flex items-center justify-center text-white shadow-inner">
        {/* Map Grid Decorative Layer */}
        <div className="absolute inset-0 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />
        
        {/* Map Radar Pulse */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-teal-500/30 animate-pulse-ring" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-teal-500/30 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-teal-400 ring-4 ring-white dark:ring-slate-900 shadow-lg" />
        </div>

        {/* Floating Hospital Markers */}
        {activeCategory === "hospitals" &&
          hospitals.slice(0, 3).map((h, i) => (
            <a
              key={h.id}
              href={getGoogleMapsDirUrl(h.lat, h.lng, h.name)}
              target="_blank"
              rel="noreferrer"
              className={`absolute p-2 rounded-2xl bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 shadow-xl border border-teal-500/40 text-[10px] font-extrabold flex items-center gap-1.5 hover:scale-105 transition ${
                i === 0 ? "top-6 left-8" : i === 1 ? "bottom-8 right-10" : "top-10 right-12"
              }`}
            >
              <Building className="w-3.5 h-3.5 text-teal-500" />
              <span>{h.name.split(" ")[0]} ({h.distanceKm} km)</span>
              <Navigation className="w-3 h-3 text-blue-500 ml-0.5" />
            </a>
          ))}

        {/* Info Overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[10px] text-teal-300 font-bold flex items-center gap-2">
          <span>📍 GPS Active</span>
          <span>•</span>
          <span>Google Maps Direction Engine Ready</span>
        </div>
      </div>

      {/* Category List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {activeCategory === "hospitals" &&
          hospitals.map((h) => (
            <div
              key={h.id}
              className="p-3.5 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between text-xs"
            >
              <div>
                <h4 className="font-extrabold text-slate-800 dark:text-slate-100">{h.name}</h4>
                <p className="text-[10px] text-slate-500">{h.address}</p>
                <p className="text-[10px] font-bold text-teal-600 dark:text-teal-400 mt-0.5">
                  🚗 {h.distanceKm} km away • ~{h.etaMins} mins drive
                </p>
              </div>

              <a
                href={getGoogleMapsDirUrl(h.lat, h.lng, h.name)}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-teal-400 font-extrabold text-[11px] flex items-center gap-1 transition"
              >
                <Navigation className="w-3.5 h-3.5" /> Route
              </a>
            </div>
          ))}

        {activeCategory === "pharmacies" &&
          pharmacies.map((p, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between text-xs"
            >
              <div>
                <h4 className="font-extrabold text-slate-800 dark:text-slate-100">{p.name}</h4>
                <p className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">{p.distance} • {p.time} drive</p>
              </div>
              <a
                href={getGoogleMapsDirUrl(p.lat, p.lng, p.name)}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-600 text-[11px] font-bold flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Open Maps
              </a>
            </div>
          ))}

        {activeCategory === "ambulances" &&
          ambulances.map((a, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between text-xs"
            >
              <div>
                <h4 className="font-extrabold text-slate-800 dark:text-slate-100">{a.name}</h4>
                <p className="text-[10px] text-rose-500 font-bold">{a.status} • {a.distance} ({a.time})</p>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-rose-500/10 text-rose-500 font-bold text-[10px]">
                Dispatched via SOS
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
