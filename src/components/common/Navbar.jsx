import React, { useState, memo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import {
  Sun,
  Moon,
  Bell,
  LogOut,
  Shield,
  Menu,
  AlertTriangle,
  Globe,
  Mic
} from "lucide-react";
import NotificationCenter from "./NotificationCenter";
import toast from "react-hot-toast";

const Navbar = memo(function Navbar({ toggleMobileSidebar }) {
  const { currentUser, userProfile, role, logout, loginAsDemoRole } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [lang, setLang] = useState("EN");
  const [listening, setListening] = useState(false);

  const handleVoiceSearch = () => {
    setListening(true);
    toast.loading("Listening... Speak symptoms or doctor name", { id: "voice" });
    setTimeout(() => {
      setListening(false);
      toast.success("Voice recognized: 'Dr. Rahul Sharma Cardiology'", { id: "voice" });
      navigate("/doctors");
    }, 1500);
  };

  const toggleLanguage = () => {
    const nextLang = lang === "EN" ? "HI" : lang === "HI" ? "DE" : "EN";
    setLang(nextLang);
    toast.success(`Language set to ${nextLang === "EN" ? "English" : nextLang === "HI" ? "Hindi (हिंदी)" : "German (Deutsch)"}`);
  };

  const getRoleBadge = () => {
    switch (role) {
      case "admin":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30";
      case "doctor":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30";
      default:
        return "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30";
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-white/75 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left: Mobile Toggle & Official Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMobileSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <img
                src="/logo.jpeg"
                alt="MediQueue Official Logo"
                className="w-10 h-10 rounded-2xl object-cover border border-teal-500/30 shadow-md group-hover:scale-105 transition-transform duration-300"
              />
              <div className="flex flex-col">
                <span className="text-xl font-black bg-gradient-to-r from-teal-600 via-teal-500 to-blue-600 dark:from-teal-400 dark:to-blue-400 bg-clip-text text-transparent tracking-tight">
                  MediQueue
                </span>
                <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 -mt-1 tracking-widest uppercase">
                  Healthcare Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Center Controls */}
          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getRoleBadge()} flex items-center gap-1.5 hover:opacity-80 transition cursor-pointer`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="capitalize">{role} View</span>
              </button>

              {showRoleMenu && (
                <div className="absolute top-10 left-0 w-44 glass-panel rounded-2xl shadow-xl p-2 z-50 flex flex-col gap-1 text-xs">
                  <span className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400">Switch View Mode</span>
                  <button
                    onClick={() => { loginAsDemoRole("patient"); setShowRoleMenu(false); navigate("/dashboard"); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-teal-500/10 text-slate-700 dark:text-slate-200 text-left font-medium"
                  >
                    🏥 Patient View
                  </button>
                  <button
                    onClick={() => { loginAsDemoRole("doctor"); setShowRoleMenu(false); navigate("/doctor-dashboard"); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-blue-500/10 text-slate-700 dark:text-slate-200 text-left font-medium"
                  >
                    👨‍⚕️ Doctor View
                  </button>
                  <button
                    onClick={() => { loginAsDemoRole("admin"); setShowRoleMenu(false); navigate("/admin-dashboard"); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-purple-500/10 text-slate-700 dark:text-slate-200 text-left font-medium"
                  >
                    👑 Admin View
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleVoiceSearch}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                listening ? "bg-rose-500 text-white animate-pulse" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
              title="Voice Search"
            >
              <Mic className="w-4 h-4 text-teal-500" />
            </button>

            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5 text-blue-500" />
              <span>{lang}</span>
            </button>

            <Link
              to="/emergency"
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-red-500/20 animate-pulse"
            >
              <AlertTriangle className="w-4 h-4" />
              SOS Fast Track
            </Link>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              title="Toggle Dark / Light Mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            <button
              onClick={() => setShowNotifications(true)}
              className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            </button>

            {currentUser || userProfile ? (
              <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
                <Link to="/profile" className="flex items-center gap-2.5 group">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-extrabold text-xs shadow-md">
                    {userProfile?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-teal-600 transition">
                      {userProfile?.name || "User"}
                    </span>
                    <span className="text-[10px] text-slate-500 capitalize">
                      {role}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-teal-600 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  );
});

export default Navbar;
