import React, { memo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  CalendarPlus,
  AlertTriangle,
  UserCheck,
  Clock,
  FileText,
  UploadCloud,
  Bot,
  User,
  Stethoscope,
  ShieldAlert,
  X,
  ChevronRight,
  Activity,
  Pill
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = memo(function Sidebar({ mobileOpen, closeMobileSidebar }) {
  const { role } = useAuth();
  const location = useLocation();

  const patientNav = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Vitals & Health Score", path: "/vitals-dashboard", icon: Activity },
    { label: "Pill Reminders", path: "/reminders", icon: Pill },
    { label: "Book Appointment", path: "/appointment", icon: CalendarPlus },
    { label: "Emergency Fast Track", path: "/emergency", icon: AlertTriangle, highlight: true },
    { label: "Find Doctors", path: "/doctors", icon: UserCheck },
    { label: "Live Queue Status", path: "/queue", icon: Clock },
    { label: "Medical Timeline", path: "/medical-history", icon: FileText },
    { label: "Lab Reports", path: "/reports", icon: UploadCloud },
    { label: "AI Health Assistant", path: "/ai-assistant", icon: Bot },
    { label: "Profile & Vault", path: "/profile", icon: User }
  ];

  const doctorNav = [
    { label: "Doctor Portal", path: "/doctor-dashboard", icon: Stethoscope },
    { label: "Patient Queue", path: "/queue", icon: Clock },
    { label: "Appointments", path: "/appointment", icon: CalendarPlus },
    { label: "Emergency Desk", path: "/emergency", icon: AlertTriangle, highlight: true },
    { label: "Medical History", path: "/medical-history", icon: FileText },
    { label: "Lab Reports", path: "/reports", icon: UploadCloud },
    { label: "My Profile", path: "/profile", icon: User }
  ];

  const adminNav = [
    { label: "Admin Control", path: "/admin-dashboard", icon: ShieldAlert },
    { label: "Doctors List", path: "/doctors", icon: UserCheck },
    { label: "All Appointments", path: "/appointment", icon: CalendarPlus },
    { label: "Emergency Monitor", path: "/emergency", icon: AlertTriangle, highlight: true },
    { label: "Queue Operations", path: "/queue", icon: Clock },
    { label: "System Reports", path: "/reports", icon: UploadCloud },
    { label: "Admin Profile", path: "/profile", icon: User }
  ];

  const currentNav = role === "admin" ? adminNav : role === "doctor" ? doctorNav : patientNav;

  const sidebarContent = (
    <div className="flex flex-col h-full py-6 px-4">
      {/* Role Title */}
      <div className="mb-6 px-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold tracking-wider uppercase text-teal-600 dark:text-teal-400">
            {role.toUpperCase()} PORTAL
          </span>
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Navigation Stack
          </h2>
        </div>
        {mobileOpen && (
          <button
            onClick={closeMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav List */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {currentNav.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMobileSidebar}
              className={({ isActive }) => `
                flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 group
                ${
                  isActive
                    ? "bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-md shadow-teal-500/20"
                    : item.highlight
                    ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20"
                    : "text-slate-600 dark:text-slate-300 hover:bg-teal-500/10 hover:text-teal-600 dark:hover:text-teal-400"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? "text-white" : item.highlight ? "text-rose-500" : "text-slate-400 dark:text-slate-500 group-hover:text-teal-500"
                  }`}
                />
                <span>{item.label}</span>
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 transition-transform ${
                  isActive ? "text-white opacity-100 translate-x-0" : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
                }`}
              />
            </NavLink>
          );
        })}
      </nav>

      {/* Health Helpline */}
      <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-br from-teal-500/10 to-blue-500/10 border border-teal-500/20 text-center">
        <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">
          24/7 Helpline
        </p>
        <p className="text-xs font-extrabold text-teal-600 dark:text-teal-400 mt-0.5">
          📞 1800-MEDIQUEUE
        </p>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-64 flex-shrink-0 backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border-r border-slate-200/80 dark:border-slate-800/80 min-h-[calc(100vh-4rem)]">
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileSidebar}
              className="lg:hidden fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 left-0 z-50 h-full w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-r border-slate-200 dark:border-slate-800 shadow-2xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
});

export default Sidebar;
