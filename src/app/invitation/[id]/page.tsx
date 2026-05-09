"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Invitation, Guest } from "@/lib/types";
import { getInvitationById, getGuests } from "@/lib/store";
import InvitationCard from "@/components/InvitationCard";
import RSVPForm from "@/components/RSVPForm";
import { Settings, ArrowLeft } from "lucide-react";
import { themes } from "@/lib/themes";

export default function InvitationPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const guestId = searchParams.get("guest");

  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [isComing, setIsComing] = useState(false);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    if (id) {
      const inv = getInvitationById(id as string);
      if (inv) {
        setInvitation(inv);
      }

      if (guestId) {
        const guests = getGuests(id as string);
        const currentGuest = guests.find((g) => g.id === guestId);
        if (currentGuest?.status === "going") {
          setIsComing(true);
        }
      }
    }
  }, [id, guestId]);

  const handleRSVPSubmitted = (status: Guest["status"]) => {
    if (status === "going") {
      setIsComing(true);
    }
  };

  if (!invitation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Урилга олдсонгүй</h1>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          Шинэ урилга үүсгэх
        </button>
      </div>
    );
  }

  const theme = themes[invitation.type] || themes.other;

  return (
    <div
      className={`min-h-screen ${theme.bg} py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-1000`}
    >
      <div className="max-w-xl mx-auto space-y-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/")}
              className="p-2 bg-white/50 backdrop-blur-sm rounded-full text-slate-600 hover:bg-white transition-all shadow-sm"
            >
              <ArrowLeft size={20} />
            </button>
          </div>
          <button
            onClick={() => router.push(`/invitation/${id}/admin`)}
            className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full text-slate-600 hover:bg-white transition-all shadow-sm font-medium"
          >
            <Settings size={18} />
            Админ
          </button>
        </div>

        {toast ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700 shadow-sm mb-6">
            {toast}
          </div>
        ) : null}

        <InvitationCard invitation={invitation} showQR={isComing} />
        
        <RSVPForm 
          invitation={invitation} 
          onSubmitted={handleRSVPSubmitted}
        />

        <footer className="text-center pt-12 pb-6 opacity-30 text-xs tracking-widest uppercase">
          Online Invitation App &copy; 2026
        </footer>
      </div>
    </div>
  );
}
