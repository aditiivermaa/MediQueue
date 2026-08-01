import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, AlertTriangle, Calendar, CheckCircle2, Clock } from "lucide-react";

export default function NotificationCenter({ isOpen, onClose }) {
  const dummyNotifications = [
    {
      id: 1,
      title: "Queue Token Updated",
      message: "Token A002 is currently being served in Cardiology Dept.",
      time: "2 mins ago",
      type: "queue",
      icon: Clock
    },
    {
      id: 2,
      title: "Appointment Confirmed",
      message: "Dr. Rahul Sharma confirmed your booking for tomorrow at 10:00 AM.",
      time: "1 hour ago",
      type: "appointment",
      icon: Calendar
    },
    {
      id: 3,
      title: "Emergency Fast Track Alert",
      message: "High priority patient assigned to Dr. Priya Singh.",
      time: "3 hours ago",
      type: "emergency",
      icon: AlertTriangle
    },
    {
      id: 4,
      title: "Lab Report Ready",
      message: "Blood Test & Lipid Profile reports are now available to view.",
      time: "Yesterday",
      type: "report",
      icon: CheckCircle2
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-l border-slate-200 dark:border-slate-800 shadow-2xl p-6 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                    Notifications
                  </h3>
                  <p className="text-xs text-slate-500">Live MediQueue updates</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {dummyNotifications.map((n) => {
                const IconComponent = n.icon;
                return (
                  <div
                    key={n.id}
                    className="p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 hover:shadow-md transition flex gap-3.5 items-start"
                  >
                    <div
                      className={`p-2 rounded-xl flex-shrink-0 ${
                        n.type === "emergency"
                          ? "bg-rose-500/10 text-rose-500"
                          : n.type === "appointment"
                          ? "bg-blue-500/10 text-blue-500"
                          : "bg-teal-500/10 text-teal-500"
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {n.title}
                        </h4>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
              <button
                onClick={onClose}
                className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
              >
                Mark all as read
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
