import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import GlassCard from "../components/ui/GlassCard";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import {
  User,
  Mail,
  Phone,
  Heart,
  AlertCircle,
  MapPin,
  FileCheck,
  Shield,
  LogOut,
  Save,
  CheckCircle2
} from "lucide-react";
import toast from "react-hot-toast";

export default function Profile() {
  const { userProfile, updateProfileData, logout, role } = useAuth();

  const [formData, setFormData] = useState({
    name: userProfile?.name || "Alex Morgan",
    email: userProfile?.email || "alex@gmail.com",
    phone: userProfile?.phone || "+91 98765 43210",
    bloodGroup: userProfile?.bloodGroup || "O+",
    emergencyContact: userProfile?.emergencyContact || "+91 91234 56789",
    address: userProfile?.address || "Block B, Green Park, New Delhi",
    abhaId: userProfile?.abhaId || "ABHA-9821-4432",
    aadhaar: userProfile?.aadhaar || "XXXX-XXXX-1234"
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfileData(formData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <User className="w-7 h-7 text-teal-500" />
            Patient Health Profile & ABHA Vault
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your personal demographics, emergency numbers, & verified government health IDs
          </p>
        </div>

        <Button
          text="Logout"
          icon={LogOut}
          variant="danger"
          size="sm"
          onClick={logout}
        />
      </div>

      {/* Main Profile Form */}
      <GlassCard className="p-6 sm:p-8 backdrop-blur-2xl">
        {/* User Card Avatar */}
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 mb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-teal-500 to-blue-600 flex items-center justify-center text-white font-extrabold text-3xl shadow-xl shadow-teal-500/30">
            {formData.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
                {formData.name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-500/10 text-teal-600 dark:text-teal-400 uppercase">
                {role} Account
              </span>
            </div>
            <p className="text-xs text-slate-500">{formData.email}</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-emerald-500 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> ABHA Health Stack Verified
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              icon={User}
              required
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              icon={Mail}
              disabled
            />

            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              icon={Phone}
              required
            />

            <Input
              label="Emergency Contact"
              type="tel"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              icon={AlertCircle}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                Blood Group
              </label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500"
              >
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="ABHA Health ID"
              name="abhaId"
              value={formData.abhaId}
              onChange={handleChange}
              icon={Heart}
            />

            <Input
              label="Aadhaar Number"
              name="aadhaar"
              value={formData.aadhaar}
              onChange={handleChange}
              icon={FileCheck}
            />
          </div>

          <Input
            label="Residential Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            icon={MapPin}
            required
          />

          <Button
            type="submit"
            text="Save Profile Updates"
            icon={Save}
            loading={saving}
            className="w-full py-3.5 font-extrabold"
          />
        </form>
      </GlassCard>
    </div>
  );
}
