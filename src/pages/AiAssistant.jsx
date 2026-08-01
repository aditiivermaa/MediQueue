import React, { useState, useRef, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import {
  Stethoscope,
  Send,
  Sparkles,
  HeartPulse,
  Pill,
  FileSearch,
  UserCheck,
  BellRing,
  Lightbulb,
  ShieldCheck,
  AlertTriangle,
  FileText,
  CalendarCheck,
  Bot
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AiAssistant = memo(function AiAssistant() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  const [conversationStep, setConversationStep] = useState(0);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "guide",
      type: "question",
      text: `Hello ${userProfile?.name || "Patient"}, I am your MediGuide Healthcare Assistant. What primary medical concern or symptom can I help evaluate for you today?`,
      time: "Just now"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const quickActions = [
    { label: "Explain Symptoms", query: "I want to explain my symptoms", icon: HeartPulse },
    { label: "Book Appointment", query: "Help me book an appointment", icon: CalendarCheck },
    { label: "Medicine Information", query: "Explain dosage for my medicine", icon: Pill },
    { label: "Health Tips", query: "Provide daily health wellness tips", icon: Lightbulb },
    { label: "Find Specialist", query: "Recommend a doctor specialist", icon: UserCheck },
    { label: "Lab Report Explanation", query: "Help explain my blood test report", icon: FileSearch },
    { label: "Prescription Explanation", query: "Explain doctor prescription Rx", icon: FileText },
    { label: "Emergency Help", query: "I need immediate emergency care", icon: AlertTriangle }
  ];

  const handleSendMessage = (textToSend) => {
    const queryText = textToSend || inputText;
    if (!queryText.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: queryText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");
    setTyping(true);

    // Single-question conversational clinical engine
    setTimeout(() => {
      let nextStep = conversationStep + 1;
      setConversationStep(nextStep);
      let responseObj;
      const lower = queryText.toLowerCase();

      if (lower.includes("emergency") || lower.includes("chest pain") || lower.includes("severe")) {
        responseObj = {
          id: Date.now() + 1,
          sender: "guide",
          type: "emergency_card",
          title: "🚨 Emergency Alert Triggered",
          text: "Based on your symptom intensity, immediate triage is recommended. Please use Emergency SOS Fast Track.",
          actionText: "Bypass Queue -> Go to Emergency SOS",
          actionPath: "/emergency"
        };
      } else if (lower.includes("book") || lower.includes("appointment") || lower.includes("doctor")) {
        responseObj = {
          id: Date.now() + 1,
          sender: "guide",
          type: "card",
          title: "👨‍⚕️ Specialist Referral",
          text: "I recommend consulting Dr. Rahul Sharma (Cardiology) or Dr. Sneha Iyer (General Physician) at MediQueue Central Hospital.",
          suggestion: "Average wait time is under 12 minutes. Would you like to book a slot now?",
          actionText: "Book Appointment Now",
          actionPath: "/appointment"
        };
      } else if (nextStep === 1) {
        responseObj = {
          id: Date.now() + 1,
          sender: "guide",
          type: "question",
          text: `Thank you for sharing. Question 1/2: How many days have you experienced "${queryText}", and is it constant or intermittent?`
        };
      } else if (nextStep === 2) {
        responseObj = {
          id: Date.now() + 1,
          sender: "guide",
          type: "card",
          title: "📋 Clinical Assessment Summary",
          text: "Based on your clinical responses, your symptoms align with mild tension or viral fatigue.",
          suggestion: "• Rest 8 hours daily\n• Stay hydrated (2.5L water)\n• Monitor temperature\n• Consult doctor if symptoms persist past 3 days.",
          actionText: "Find Nearby Doctors",
          actionPath: "/doctors"
        };
      } else {
        responseObj = {
          id: Date.now() + 1,
          sender: "guide",
          type: "card",
          title: "💡 Health & Wellness Guidance",
          text: "MediGuide has logged your query. Our hospital specialists are on duty and available for booking today.",
          suggestion: "You can track your live OPD queue token or view lab reports in your health vault anytime."
        };
      }

      setMessages((prev) => [...prev, responseObj]);
      setTyping(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header with Official Logo */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/logo.jpeg"
            alt="MediQueue Logo"
            className="w-12 h-12 rounded-2xl object-cover border border-teal-500/30 shadow-md"
          />
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              MediGuide Healthcare Assistant
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Interactive clinical triage, symptom analyzer & doctor recommendation
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-black bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 flex items-center gap-1.5">
          <Stethoscope className="w-4 h-4" /> MediGuide 2.0 Active
        </span>
      </div>

      {/* Quick Action Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickActions.map((qa, idx) => {
          const Icon = qa.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSendMessage(qa.query)}
              className="p-3.5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 hover:border-teal-500 text-left transition flex items-center gap-2.5 group"
            >
              <div className="p-2 rounded-xl bg-teal-500/10 text-teal-500 group-hover:scale-110 transition-transform">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">
                {qa.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Conversational Medical Assistant UI */}
      <GlassCard className="p-0 border-slate-200/60 dark:border-slate-800/60 flex flex-col h-[520px] overflow-hidden">
        
        {/* Assistant Header */}
        <div className="p-4 bg-gradient-to-r from-teal-600 via-teal-700 to-blue-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center font-bold">
              🩺
            </div>
            <div>
              <h3 className="text-sm font-black">MediGuide Clinical Consultation</h3>
              <p className="text-[10px] text-teal-100">Step-by-Step Question Triage</p>
            </div>
          </div>

          <div className="text-[10px] text-teal-100 bg-white/10 px-2.5 py-1 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Certified Medical Protocol
          </div>
        </div>

        {/* Conversation Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "guide" && (
                <div className="w-8 h-8 rounded-2xl bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  🩺
                </div>
              )}

              {msg.type === "emergency_card" ? (
                /* Emergency Warning Card */
                <div className="max-w-md p-5 rounded-3xl bg-rose-500/10 border-2 border-rose-500 text-slate-800 dark:text-slate-100 space-y-3">
                  <div className="flex items-center gap-2 text-rose-500 font-black text-sm">
                    <AlertTriangle className="w-5 h-5 animate-pulse" /> {msg.title}
                  </div>
                  <p className="text-xs leading-relaxed">{msg.text}</p>
                  {msg.actionText && (
                    <Button
                      text={msg.actionText}
                      variant="emergency"
                      size="sm"
                      onClick={() => navigate(msg.actionPath)}
                      className="w-full font-bold"
                    />
                  )}
                </div>
              ) : msg.type === "card" ? (
                /* Medical Suggestion Card */
                <div className="max-w-md p-5 rounded-3xl glass-panel border border-teal-500/30 text-slate-800 dark:text-slate-100 space-y-3">
                  <h4 className="text-sm font-black text-teal-600 dark:text-teal-400">{msg.title}</h4>
                  <p className="text-xs leading-relaxed">{msg.text}</p>
                  {msg.suggestion && (
                    <div className="p-3 rounded-2xl bg-teal-500/10 text-xs font-semibold text-teal-700 dark:text-teal-300 whitespace-pre-line">
                      {msg.suggestion}
                    </div>
                  )}
                  {msg.actionText && (
                    <Button
                      text={msg.actionText}
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(msg.actionPath)}
                      className="w-full font-extrabold"
                    />
                  )}
                </div>
              ) : (
                /* Standard Conversational Bubble */
                <div
                  className={`max-w-md p-4 rounded-3xl text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-tr-none shadow-md"
                      : "glass-panel text-slate-800 dark:text-slate-100 rounded-tl-none border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {msg.text}
                </div>
              )}
            </div>
          ))}

          {typing && (
            <div className="flex gap-3 items-center text-xs text-slate-500">
              <div className="w-8 h-8 rounded-2xl bg-teal-500/20 text-teal-600 flex items-center justify-center font-bold text-xs">
                🩺
              </div>
              <span className="animate-pulse font-bold text-teal-600">MediGuide is analyzing clinical parameters...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <Input
              placeholder="Type your medical response or symptom..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1"
            />
            <Button
              type="submit"
              icon={Send}
              variant="primary"
              className="rounded-2xl px-5 font-bold"
            />
          </form>
        </div>
      </GlassCard>
    </div>
  );
});

export default AiAssistant;
