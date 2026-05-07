"use client";

import React, { useState } from "react";
import { Guest, Invitation } from "@/lib/types";
import { saveGuest } from "@/lib/store";
import { themes } from "@/lib/themes";
import { Check, X, HelpCircle, Send } from "lucide-react";
import confetti from "canvas-confetti";

interface RSVPFormProps {
  invitation: Invitation;
}

export default function RSVPForm({ invitation }: RSVPFormProps) {
  const theme = themes[invitation.type] || themes.other;
  const [name, setName] = useState("");
  const [status, setStatus] = useState<Guest["status"] | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!status) return;

    const guest: Guest = {
      id: Math.random().toString(36).substring(2, 9),
      invitationId: invitation.id,
      name,
      status,
      checkedIn: false,
    };

    saveGuest(guest);
    setSubmitted(true);

    if (status === "going") {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FFD700", "#FFA500", "#FF4500"],
      });
    }
  };

  if (submitted) {
    return (
      <div
        className={`text-center p-8 rounded-2xl bg-white shadow-lg border-2 ${theme.border}`}
      >
        <h3 className={`text-2xl font-bold mb-2 ${theme.accent}`}>
          Баталгаажууллаа!
        </h3>
        <p className="text-slate-600">Хариу өгсөнд баярлалаа.</p>
      </div>
    );
  }

  return (
    <div
      className={`mt-8 p-6 sm:p-10 rounded-3xl bg-white shadow-xl border-2 ${theme.border}`}
    >
      <h2 className={`text-3xl font-bold mb-6 text-center ${theme.text}`}>
        Хариу өгөх
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Таны нэр
          </label>
          <input
            type="text"
            required
            placeholder="Нэрээ бичнэ үү"
            className="w-full p-4 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none transition-all bg-slate-50 text-slate-900"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            {
              id: "going",
              label: "Очно",
              icon: Check,
              color: "text-emerald-600 bg-emerald-50 border-emerald-200",
            },
            {
              id: "not-going",
              label: "Амжихгүй",
              icon: X,
              color: "text-rose-600 bg-rose-50 border-rose-200",
            },
            {
              id: "maybe",
              label: "Мэдэхгүй",
              icon: HelpCircle,
              color: "text-amber-600 bg-amber-50 border-amber-200",
            },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setStatus(opt.id as Guest["status"])}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                status === opt.id
                  ? `${opt.color} ring-4 ring-offset-2`
                  : "border-slate-100 text-slate-400 grayscale"
              }`}
            >
              <opt.icon size={24} />
              <span className="text-xs font-bold uppercase">{opt.label}</span>
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={!status || !name}
          className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transform transition-all active:scale-95 disabled:opacity-50 disabled:grayscale ${theme.button}`}
        >
          <Send size={18} />
          хариу илгээх
        </button>
      </form>
    </div>
  );
}
