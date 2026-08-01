import React, { useState, useEffect, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import GoogleMapView from "../components/common/GoogleMapView";
import {
  getUserCurrentLocation,
  NEARBY_HOSPITALS,
  calculateDistanceKm,
  calculateTravelEtaMins,
  getGoogleMapsDirUrl
} from "../services/locationService";
import {
  UserCheck,
  Star,
  Search,
  Award,
  Building,
  Languages,
  CalendarCheck,
  Filter,
  Navigation,
  MapPin,
  Clock,
  Heart,
  Flame,
  ArrowUpDown,
  X,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const Doctors = memo(function Doctors() {
  const navigate = useNavigate();

  const [userLoc, setUserLoc] = useState({ lat: 28.5355, lng: 77.241, city: "Detecting GPS Location..." });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [sortBy, setSortBy] = useState("distance"); // 'distance', 'rating', 'fee', 'wait'
  const [favorites, setFavorites] = useState([]);
  const [showMapView, setShowMapView] = useState(false);
  const [selectedDocProfile, setSelectedDocProfile] = useState(null);

  // Initialize Geolocation & Distances
  useEffect(() => {
    getUserCurrentLocation().then((loc) => {
      setUserLoc(loc);
    });
  }, []);

  // Doctors Database with Hospital GPS Anchors
  const doctorsList = useMemo(() => {
    const rawDocs = [
      {
        id: "doc1",
        name: "Dr Rahul Sharma",
        specialization: "Cardiology",
        experience: "10 Years",
        qualification: "MD, DM (Cardiology) - AIIMS",
        hospital: NEARBY_HOSPITALS[0].name,
        hospitalAddress: NEARBY_HOSPITALS[0].address,
        lat: NEARBY_HOSPITALS[0].lat,
        lng: NEARBY_HOSPITALS[0].lng,
        feeVal: 700,
        fee: "₹700",
        rating: 4.9,
        reviews: 142,
        languages: "English, Hindi",
        availability: "Available Today",
        emergencyAvailable: true,
        liveQueueCount: NEARBY_HOSPITALS[0].liveQueueLength,
        avgWaitMins: NEARBY_HOSPITALS[0].avgWaitMins,
        photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80"
      },
      {
        id: "doc2",
        name: "Dr Priya Singh",
        specialization: "Dermatology",
        experience: "8 Years",
        qualification: "MBBS, MD (Dermatology)",
        hospital: NEARBY_HOSPITALS[1].name,
        hospitalAddress: NEARBY_HOSPITALS[1].address,
        lat: NEARBY_HOSPITALS[1].lat,
        lng: NEARBY_HOSPITALS[1].lng,
        feeVal: 600,
        fee: "₹600",
        rating: 4.8,
        reviews: 98,
        languages: "English, Hindi, Punjabi",
        availability: "On Duty",
        emergencyAvailable: true,
        liveQueueCount: NEARBY_HOSPITALS[1].liveQueueLength,
        avgWaitMins: NEARBY_HOSPITALS[1].avgWaitMins,
        photo: "https://images.unsplash.com/photo-1594824813566-88855ce78961?auto=format&fit=crop&w=400&q=80"
      },
      {
        id: "doc3",
        name: "Dr Amit Verma",
        specialization: "Orthopedic",
        experience: "15 Years",
        qualification: "MS (Ortho), FRCS (UK)",
        hospital: NEARBY_HOSPITALS[2].name,
        hospitalAddress: NEARBY_HOSPITALS[2].address,
        lat: NEARBY_HOSPITALS[2].lat,
        lng: NEARBY_HOSPITALS[2].lng,
        feeVal: 900,
        fee: "₹900",
        rating: 4.95,
        reviews: 210,
        languages: "English, Hindi",
        availability: "Available Tomorrow",
        emergencyAvailable: false,
        liveQueueCount: NEARBY_HOSPITALS[2].liveQueueLength,
        avgWaitMins: NEARBY_HOSPITALS[2].avgWaitMins,
        photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80"
      },
      {
        id: "doc4",
        name: "Dr Sneha Iyer",
        specialization: "General Physician",
        experience: "12 Years",
        qualification: "MBBS, DNB (Internal Medicine)",
        hospital: NEARBY_HOSPITALS[0].name,
        hospitalAddress: NEARBY_HOSPITALS[0].address,
        lat: NEARBY_HOSPITALS[0].lat,
        lng: NEARBY_HOSPITALS[0].lng,
        feeVal: 500,
        fee: "₹500",
        rating: 4.75,
        reviews: 180,
        languages: "English, Hindi, Tamil",
        availability: "Available Today",
        emergencyAvailable: true,
        liveQueueCount: 2,
        avgWaitMins: 8,
        photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80"
      },
      {
        id: "doc5",
        name: "Dr Vikram Sethi",
        specialization: "Neurology",
        experience: "18 Years",
        qualification: "DM (Neurology), Fellowship (USA)",
        hospital: NEARBY_HOSPITALS[3].name,
        hospitalAddress: NEARBY_HOSPITALS[3].address,
        lat: NEARBY_HOSPITALS[3].lat,
        lng: NEARBY_HOSPITALS[3].lng,
        feeVal: 1000,
        fee: "₹1000",
        rating: 4.98,
        reviews: 320,
        languages: "English, Hindi",
        availability: "Available Today",
        emergencyAvailable: true,
        liveQueueCount: NEARBY_HOSPITALS[3].liveQueueLength,
        avgWaitMins: NEARBY_HOSPITALS[3].avgWaitMins,
        photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80"
      }
    ];

    return rawDocs.map((doc) => {
      const dist = calculateDistanceKm(userLoc.lat, userLoc.lng, doc.lat, doc.lng);
      const eta = calculateTravelEtaMins(dist);
      return { ...doc, distanceKm: dist, etaMins: eta };
    });
  }, [userLoc]);

  // Compute Hospital List for Map
  const hospitalsWithLoc = useMemo(() => {
    return NEARBY_HOSPITALS.map((h) => {
      const dist = calculateDistanceKm(userLoc.lat, userLoc.lng, h.lat, h.lng);
      const eta = calculateTravelEtaMins(dist);
      return { ...h, distanceKm: dist, etaMins: eta };
    });
  }, [userLoc]);

  const departments = ["All", "Cardiology", "Dermatology", "Orthopedic", "General Physician", "Neurology"];

  // Filter & Sort Engine
  const processedDoctors = useMemo(() => {
    let list = doctorsList.filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.hospital.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = selectedDept === "All" || doc.specialization === selectedDept;
      return matchesSearch && matchesDept;
    });

    if (sortBy === "distance") list.sort((a, b) => a.distanceKm - b.distanceKm);
    else if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "fee") list.sort((a, b) => a.feeVal - b.feeVal);
    else if (sortBy === "wait") list.sort((a, b) => a.avgWaitMins - b.avgWaitMins);

    return list;
  }, [doctorsList, searchTerm, selectedDept, sortBy]);

  const toggleFavorite = (docId) => {
    if (favorites.includes(docId)) {
      setFavorites(favorites.filter((id) => id !== docId));
      toast.success("Removed doctor from favorites");
    } else {
      setFavorites([...favorites, docId]);
      toast.success("Saved doctor to your favorites!");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <UserCheck className="w-7 h-7 text-teal-500" />
            Smart Doctor & Hospital Discovery
          </h1>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-teal-500" />
            <span>GPS Active: <strong>{userLoc.city}</strong> • Nearest hospital recommendations</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMapView(!showMapView)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition ${
              showMapView
                ? "bg-teal-600 text-white shadow-md"
                : "bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            }`}
          >
            <Navigation className="w-4 h-4" /> {showMapView ? "Hide Live Map" : "Show Google Map"}
          </button>

          <div className="w-full md:w-64">
            <Input
              placeholder="Search doctor, hospital..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
            />
          </div>
        </div>
      </div>

      {/* Google Map Display (Toggleable) */}
      {showMapView && (
        <GoogleMapView userLocation={userLoc} hospitals={hospitalsWithLoc} />
      )}

      {/* Filter & Sort Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition ${
                selectedDept === dept
                  ? "bg-teal-600 text-white shadow-md shadow-teal-500/20"
                  : "bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 flex-shrink-0">
          <ArrowUpDown className="w-4 h-4 text-teal-500" />
          <span>Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
          >
            <option value="distance">📍 Distance (Nearest First)</option>
            <option value="rating">⭐ Ratings (Highest First)</option>
            <option value="wait">⏱️ Wait Time (Shortest First)</option>
            <option value="fee">💰 Consultation Fee (Lowest First)</option>
          </select>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {processedDoctors.map((doc, idx) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.04 }}
          >
            <GlassCard className="p-6 h-full flex flex-col justify-between hover:shadow-2xl transition border-slate-200/60 dark:border-slate-800/60 relative">
              
              {/* Top Header Row */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={doc.photo}
                      alt={doc.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500/30 shadow-md"
                    />
                    <div>
                      <h3 className="text-base font-black text-slate-800 dark:text-slate-100">
                        {doc.name}
                      </h3>
                      <p className="text-[11px] font-bold text-teal-600 dark:text-teal-400">
                        {doc.specialization} • {doc.experience}
                      </p>
                    </div>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => toggleFavorite(doc.id)}
                    className={`p-2 rounded-xl border transition ${
                      favorites.includes(doc.id)
                        ? "bg-rose-500 text-white border-rose-500"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>

                {/* Distance & GPS Banner */}
                <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300">
                    <MapPin className="w-4 h-4 text-teal-500" />
                    <span>{doc.distanceKm} km away</span>
                  </div>
                  <span className="text-slate-600 dark:text-slate-400 font-bold">
                    🚗 ~{doc.etaMins} mins drive
                  </span>
                </div>

                {/* Hospital Details & Badges */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Building className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="font-extrabold truncate">{doc.hospital}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      Queue: <strong className="text-slate-800 dark:text-slate-200">{doc.liveQueueCount} ahead</strong> ({doc.avgWaitMins}m wait)
                    </span>
                    <span className="flex items-center gap-1 text-amber-500 font-black">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {doc.rating} ({doc.reviews})
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="text-emerald-500 font-bold">
                      {doc.availability}
                    </span>
                    {doc.emergencyAvailable && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center gap-1">
                        <Flame className="w-3 h-3" /> ER Available
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Fee</span>
                    <p className="text-lg font-black text-slate-800 dark:text-slate-100">{doc.fee}</p>
                  </div>

                  {/* Google Maps Directions Link */}
                  <a
                    href={getGoogleMapsDirUrl(doc.lat, doc.lng, doc.hospital)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-extrabold text-xs flex items-center gap-1.5 transition"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Navigate Maps
                  </a>
                </div>

                <div className="flex gap-2">
                  <Button
                    text="View Profile"
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedDocProfile(doc)}
                    className="flex-1 text-xs"
                  />
                  <Button
                    text="Book Now"
                    variant="primary"
                    size="sm"
                    onClick={() => navigate("/appointment")}
                    className="flex-1 text-xs font-black"
                  />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Doctor Profile Drawer Modal */}
      <AnimatePresence>
        {selectedDocProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg glass-panel p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl text-slate-100 space-y-4 relative"
            >
              <button
                onClick={() => setSelectedDocProfile(null)}
                className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <img
                  src={selectedDocProfile.photo}
                  alt={selectedDocProfile.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500"
                />
                <div>
                  <h3 className="text-xl font-black">{selectedDocProfile.name}</h3>
                  <p className="text-xs text-teal-400 font-bold">{selectedDocProfile.qualification}</p>
                  <p className="text-xs text-slate-400">{selectedDocProfile.experience} Experience</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2 text-xs">
                <p>📍 <strong>Hospital:</strong> {selectedDocProfile.hospital}</p>
                <p>🚗 <strong>Distance:</strong> {selectedDocProfile.distanceKm} km away (~{selectedDocProfile.etaMins} mins drive)</p>
                <p>🗣️ <strong>Languages Spoken:</strong> {selectedDocProfile.languages}</p>
                <p>⏱️ <strong>Average Consultation Wait:</strong> {selectedDocProfile.avgWaitMins} Minutes</p>
              </div>

              <div className="flex gap-2 pt-2">
                <a
                  href={getGoogleMapsDirUrl(selectedDocProfile.lat, selectedDocProfile.lng, selectedDocProfile.hospital)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 rounded-2xl bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Navigation className="w-4 h-4" /> Open Maps Navigation
                </a>
                <Button
                  text="Book Appointment"
                  variant="primary"
                  onClick={() => {
                    setSelectedDocProfile(null);
                    navigate("/appointment");
                  }}
                  className="flex-1 font-black"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default Doctors;
