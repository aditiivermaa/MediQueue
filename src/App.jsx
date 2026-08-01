import React, { useState, lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "react-hot-toast";

// Layout & UI Primitives
import Navbar from "./components/common/Navbar";
import Sidebar from "./components/common/Sidebar";
import ProtectedRoutes from "./components/common/ProtectedRoutes";
import SkeletonLoader from "./components/ui/SkeletonLoader";

// Lazy-loaded Pages
const Splash = lazy(() => import("./pages/Splash"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const HealthDashboard = lazy(() => import("./pages/HealthDashboard"));
const MedicineReminders = lazy(() => import("./pages/MedicineReminders"));
const Appointment = lazy(() => import("./pages/Appointment"));
const ThankYou = lazy(() => import("./pages/ThankYou"));
const Emergency = lazy(() => import("./pages/Emergency"));
const Doctors = lazy(() => import("./pages/Doctors"));
const Queue = lazy(() => import("./pages/Queue"));
const MedicalHistory = lazy(() => import("./pages/MedicalHistory"));
const Reports = lazy(() => import("./pages/Reports"));
const AiAssistant = lazy(() => import("./pages/AiAssistant"));
const Profile = lazy(() => import("./pages/Profile"));
const DoctorDashboard = lazy(() => import("./pages/DoctorDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

export const prefetchRoutes = () => {
  import("./pages/Dashboard");
  import("./pages/Doctors");
  import("./pages/Appointment");
  import("./pages/ThankYou");
  import("./pages/Emergency");
  import("./pages/Queue");
  import("./pages/MedicalHistory");
  import("./pages/Reports");
  import("./pages/AiAssistant");
  import("./pages/Profile");
  import("./pages/HealthDashboard");
  import("./pages/MedicineReminders");
};

function MainLayout({ children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    prefetchRoutes();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Navbar toggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
      <div className="flex flex-1">
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          closeMobileSidebar={() => setMobileSidebarOpen(false)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          <Suspense fallback={<SkeletonLoader type="page" />}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: "rgba(15, 23, 42, 0.92)",
              color: "#fff",
              backdropFilter: "blur(16px)",
              borderRadius: "18px",
              border: "1px solid rgba(255, 255, 255, 0.12)"
            }
          }}
        />

        <Suspense fallback={<SkeletonLoader type="page" />}>
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoutes />}>
              <Route
                path="/dashboard"
                element={
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                }
              />
              <Route
                path="/vitals-dashboard"
                element={
                  <MainLayout>
                    <HealthDashboard />
                  </MainLayout>
                }
              />
              <Route
                path="/reminders"
                element={
                  <MainLayout>
                    <MedicineReminders />
                  </MainLayout>
                }
              />
              <Route
                path="/appointment"
                element={
                  <MainLayout>
                    <Appointment />
                  </MainLayout>
                }
              />
              <Route
                path="/thank-you"
                element={
                  <MainLayout>
                    <ThankYou />
                  </MainLayout>
                }
              />
              <Route
                path="/emergency"
                element={
                  <MainLayout>
                    <Emergency />
                  </MainLayout>
                }
              />
              <Route
                path="/doctors"
                element={
                  <MainLayout>
                    <Doctors />
                  </MainLayout>
                }
              />
              <Route
                path="/queue"
                element={
                  <MainLayout>
                    <Queue />
                  </MainLayout>
                }
              />
              <Route
                path="/medical-history"
                element={
                  <MainLayout>
                    <MedicalHistory />
                  </MainLayout>
                }
              />
              <Route
                path="/reports"
                element={
                  <MainLayout>
                    <Reports />
                  </MainLayout>
                }
              />
              <Route
                path="/ai-assistant"
                element={
                  <MainLayout>
                    <AiAssistant />
                  </MainLayout>
                }
              />
              <Route
                path="/profile"
                element={
                  <MainLayout>
                    <Profile />
                  </MainLayout>
                }
              />
              <Route
                path="/doctor-dashboard"
                element={
                  <MainLayout>
                    <DoctorDashboard />
                  </MainLayout>
                }
              />
              <Route
                path="/admin-dashboard"
                element={
                  <MainLayout>
                    <AdminDashboard />
                  </MainLayout>
                }
              />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </ThemeProvider>
    </AuthProvider>
  );
}