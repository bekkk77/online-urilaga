"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Invitation } from "@/lib/types";
import { getInvitationById } from "@/lib/store";
import InvitationCard from "@/components/InvitationCard";
import RSVPForm from "@/components/RSVPForm";
import SendInviteModal from "@/components/SendInviteModal";
import { Settings, ArrowLeft, Send } from "lucide-react";
import { themes } from "@/lib/themes";

export default function InvitationPage() {
  const { id } = useParams();
  const router = useRouter();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    if (id) {
      const inv = getInvitationById(id as string);
      if (inv) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setInvitation(inv);
      }
    }
  }, [id]);

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
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition-all"
            >
              <Send size={18} />
              Урилга илгээх
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

        <InvitationCard invitation={invitation} />
        <SendInviteModal
          invitation={invitation}
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={(count) =>
            showToast(`${count} урилга амжилттай илгээгдлээ`)
          }
        />
        <RSVPForm invitation={invitation} />

        <footer className="text-center pt-12 pb-6 opacity-30 text-xs tracking-widest uppercase">
          Online Invitation App &copy; 2026
        </footer>
      </div>
    </div>
  );
}
