/**
 * Location & Geolocation Service for MediQueue
 * Computes Haversine distances, driving ETAs, and Google Maps direction links.
 */

// Sample Verified Hospitals with GPS Coordinates (Delhi NCR default reference)
export const NEARBY_HOSPITALS = [
  {
    id: "hosp-1",
    name: "Apollo Heart & Multi-Speciality Institute",
    address: "Sarita Vihar, Mathura Road, New Delhi",
    lat: 28.5372,
    lng: 77.2831,
    rating: 4.9,
    erFacilities: "Level 1 Trauma & Cardiac ICU",
    erAvailable: true,
    availableDoctorsCount: 14,
    liveQueueLength: 3,
    avgWaitMins: 12,
    image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "hosp-2",
    name: "Max Super Speciality Hospital",
    address: "Press Enclave Marg, Saket, New Delhi",
    lat: 28.5283,
    lng: 77.2117,
    rating: 4.8,
    erFacilities: "24/7 ER, Stroke Unit & Cath Lab",
    erAvailable: true,
    availableDoctorsCount: 18,
    liveQueueLength: 5,
    avgWaitMins: 18,
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "hosp-3",
    name: "Fortis Bone & Joint Care Centre",
    address: "Sector B, Pocket 1, Vasant Kunj, New Delhi",
    lat: 28.5412,
    lng: 77.1554,
    rating: 4.85,
    erFacilities: "Ortho Trauma & Fracture Unit",
    erAvailable: true,
    availableDoctorsCount: 9,
    liveQueueLength: 2,
    avgWaitMins: 10,
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "hosp-4",
    name: "Medanta Medicity Healthcare",
    address: "CH Baktawar Singh Road, Sector 38, Gurugram",
    lat: 28.4392,
    lng: 77.0425,
    rating: 4.95,
    erFacilities: "Advanced Neuro & Organ Transplant ER",
    erAvailable: true,
    availableDoctorsCount: 22,
    liveQueueLength: 4,
    avgWaitMins: 15,
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=400&q=80"
  }
];

// Haversine Distance Formula (km)
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

// Estimate Driving Travel Time (mins)
export function calculateTravelEtaMins(distanceKm) {
  // Average city driving speed ~25 km/h + 2 mins traffic buffer
  const mins = Math.round((distanceKm / 25) * 60) + 2;
  return Math.max(3, mins);
}

// Generate Google Maps Directions Link
export function getGoogleMapsDirUrl(destLat, destLng, destName) {
  return `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&destination_place_name=${encodeURIComponent(
    destName
  )}`;
}

// Request Browser Geolocation
export function getUserCurrentLocation() {
  return new Promise((resolve) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            city: "Current GPS Location"
          });
        },
        () => {
          // Fallback to New Delhi default reference
          resolve({ lat: 28.5355, lng: 77.241, city: "New Delhi (Default)" });
        },
        { timeout: 3000 }
      );
    } else {
      resolve({ lat: 28.5355, lng: 77.241, city: "New Delhi (Default)" });
    }
  });
}
