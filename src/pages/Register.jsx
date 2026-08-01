import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GlassCard from "../components/ui/GlassCard";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import {
  User,
  Mail,
  Phone,
  Lock,
  Calendar,
  Heart,
  Shield,
  MapPin,
  AlertCircle,
  FileCheck,
  UserCheck
} from "lucide-react";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();
  const { registerUser, loading } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "Male",
    dob: "",
    bloodGroup: "O+",
    aadhaar: "",
    abhaId: "",
    emergencyContact: "",
    address: "",
    role: "patient"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    try {
      await registerUser(formData);
      if (formData.role === "doctor") {
        navigate("/doctor-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      // Error handled in AuthContext
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-slate-100 flex items-center justify-center relative overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl" />

      <div className="w-full max-w-3xl relative z-10">
        <GlassCard className="p-6 sm:p-10 backdrop-blur-2xl border-white/20">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/30 mb-3">
              <UserCheck className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-teal-400 via-teal-200 to-blue-400 bg-clip-text text-transparent">
              Create MediQueue Account
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Join India's smartest digital healthcare platform
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Account Role Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Select Account Role <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "patient" })}
                  className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                    formData.role === "patient"
                      ? "bg-teal-500/20 border-teal-500 text-teal-300 shadow-md shadow-teal-500/20"
                      : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  <User className="w-4 h-4" /> Patient Account
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "doctor" })}
                  className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                    formData.role === "doctor"
                      ? "bg-blue-500/20 border-blue-500 text-blue-300 shadow-md shadow-blue-500/20"
                      : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  <Shield className="w-4 h-4" /> Doctor Account
                </button>
              </div>
            </div>

            {/* Grid 1: Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="fullName"
                placeholder="Alex Morgan"
                value={formData.fullName}
                onChange={handleChange}
                icon={User}
                required
              />

              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="alex@gmail.com"
                value={formData.email}
                onChange={handleChange}
                icon={Mail}
                required
              />

              <Input
                label="Phone Number"
                type="tel"
                name="phone"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                icon={Phone}
                required
              />

              <Input
                label="Emergency Contact"
                type="tel"
                name="emergencyContact"
                placeholder="+91 91234 56789"
                value={formData.emergencyContact}
                onChange={handleChange}
                icon={AlertCircle}
                required
              />
            </div>

            {/* Grid 2: Security Credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                icon={Lock}
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                icon={Lock}
                required
              />
            </div>

            {/* Grid 3: Medical & Personal Demographics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-100 px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <Input
                label="Date of Birth"
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                icon={Calendar}
                required
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Blood Group *
                </label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-100 px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500"
                >
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid 4: Identification (Optional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Aadhaar Number (Optional)"
                name="aadhaar"
                placeholder="1234-5678-9012"
                value={formData.aadhaar}
                onChange={handleChange}
                icon={FileCheck}
              />

              <Input
                label="ABHA Health ID (Optional)"
                name="abhaId"
                placeholder="ABHA-1234-5678"
                value={formData.abhaId}
                onChange={handleChange}
                icon={Heart}
              />
            </div>

            {/* Address */}
            <Input
              label="Permanent Residential Address"
              name="address"
              placeholder="House No., Street Name, City, State, Pincode"
              value={formData.address}
              onChange={handleChange}
              icon={MapPin}
              required
            />

            {/* Submit */}
            <Button
              type="submit"
              text={`Register as ${formData.role.toUpperCase()}`}
              loading={loading}
              className="w-full mt-4"
            />
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-slate-400">
            Already registered?{" "}
            <Link to="/login" className="text-teal-400 font-bold hover:underline">
              Sign In Instead
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}