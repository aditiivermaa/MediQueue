import React, { useState, useMemo, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GlassCard from "../components/ui/GlassCard";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { Mail, Lock, LogIn, KeyRound, User, Stethoscope, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Login = memo(function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, loginAsDemoRole, resetPassword, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmailInput, setResetEmailInput] = useState("");

  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, text: "", color: "bg-slate-700" };
    let score = 0;
    if (password.length >= 6) score += 40;
    if (password.length >= 10) score += 30;
    if (/[A-Z]/.test(password)) score += 15;
    if (/[0-9]/.test(password)) score += 15;

    if (score < 50) return { score, text: "Weak", color: "bg-rose-500" };
    if (score < 80) return { score, text: "Medium", color: "bg-amber-500" };
    return { score, text: "Strong", color: "bg-emerald-500" };
  }, [password]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    try {
      await login(email, password);
      if (email.includes("doctor")) navigate("/doctor-dashboard");
      else if (email.includes("admin")) navigate("/admin-dashboard");
      else navigate("/dashboard");
    } catch (err) {
      navigate("/dashboard");
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!resetEmailInput) return;
    await resetPassword(resetEmailInput);
    setShowForgotModal(false);
    setResetEmailInput("");
  };

  const handleDemoClick = async (targetRole) => {
    await loginAsDemoRole(targetRole);
    if (targetRole === "admin") navigate("/admin-dashboard");
    else if (targetRole === "doctor") navigate("/doctor-dashboard");
    else navigate("/dashboard");
  };

  const handleGoogleClick = async () => {
    await loginWithGoogle();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-slate-100 overflow-hidden">
      <div className="absolute top-10 left-10 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        <GlassCard className="p-8 sm:p-10 shadow-2xl backdrop-blur-2xl border-white/20">
          
          <div className="text-center mb-6">
            <img
              src="/logo.jpeg"
              alt="MediQueue Official Logo"
              className="mx-auto w-16 h-16 rounded-2xl object-cover border border-teal-500/40 shadow-xl mb-3"
            />
            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-teal-400 via-teal-200 to-blue-400 bg-clip-text text-transparent">
              MediQueue
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Digital Healthcare Stack & Queue Portal
            </p>
          </div>

          <div className="mb-4">
            <p className="text-[10px] font-bold text-center uppercase tracking-wider text-slate-400 mb-2">
              Instant Demo Mode (Sub-20ms Access)
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoClick("patient")}
                className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold transition"
              >
                <User className="w-4 h-4" /> Patient
              </button>
              <button
                type="button"
                onClick={() => handleDemoClick("doctor")}
                className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold transition"
              >
                <Stethoscope className="w-4 h-4" /> Doctor
              </button>
              <button
                type="button"
                onClick={() => handleDemoClick("admin")}
                className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold transition"
              >
                <Shield className="w-4 h-4" /> Admin
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleClick}
            className="w-full py-3 px-4 rounded-2xl bg-white text-slate-800 font-extrabold text-xs flex items-center justify-center gap-2 shadow-md hover:bg-slate-100 transition mb-4"
          >
            <span>🌐</span> Sign In With Google Account
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-700"></div>
            <span className="flex-shrink mx-3 text-slate-400 text-[10px] uppercase tracking-wider font-semibold">
              Or Sign In With Email
            </span>
            <div className="flex-grow border-t border-slate-700"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 mt-2">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
            />

            <div>
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={Lock}
                required
              />
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>Password Strength</span>
                    <span className={passwordStrength.text === "Strong" ? "text-emerald-400" : passwordStrength.text === "Medium" ? "text-amber-400" : "text-rose-400"}>
                      {passwordStrength.text}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className={`h-full ${passwordStrength.color} transition-all duration-300`} style={{ width: `${passwordStrength.score}%` }} />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-teal-500"
                />
                Remember Me
              </label>

              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-teal-400 hover:text-teal-300 font-medium hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              text="Sign In to Portal"
              icon={LogIn}
              loading={loading}
              className="w-full mt-4 font-black"
            />
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have a MediQueue account?{" "}
            <Link to="/register" className="text-teal-400 font-bold hover:underline">
              Create Account
            </Link>
          </div>
        </GlassCard>
      </div>

      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm glass-panel p-6 rounded-3xl border border-white/20 shadow-2xl text-slate-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Reset Password</h3>
                  <p className="text-xs text-slate-400">We will email you a password reset link</p>
                </div>
              </div>

              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <Input
                  label="Registered Email"
                  type="email"
                  placeholder="yourname@gmail.com"
                  value={resetEmailInput}
                  onChange={(e) => setResetEmailInput(e.target.value)}
                  icon={Mail}
                  required
                />
                <div className="flex gap-2 justify-end pt-2">
                  <Button
                    type="button"
                    text="Cancel"
                    variant="secondary"
                    onClick={() => setShowForgotModal(false)}
                  />
                  <Button
                    type="submit"
                    text="Send Reset Link"
                    variant="primary"
                  />
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default Login;