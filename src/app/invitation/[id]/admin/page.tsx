"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Invitation, Guest } from "@/lib/types";
import { getInvitationById, getGuests, saveGuest } from "@/lib/store";
import {
  CheckCircle2,
  HelpCircle,
  UserCheck,
  Users,
  ArrowLeft,
} from "lucide-react";

export default function AdminPage() {
  const { id } = useParams();
  const router = useRouter();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);

  useEffect(() => {
    if (id) {
      const inv = getInvitationById(id as string);
      if (inv) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setInvitation(inv);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setGuests(getGuests(id as string));
      }
    }
  }, [id]);

  const toggleCheckIn = (guest: Guest) => {
    const updated = { ...guest, checkedIn: !guest.checkedIn };
    saveGuest(updated);
    setGuests(getGuests(id as string));
  };

  if (!invitation)
    return <div className="p-8 text-center">Урилга олдсонгүй.</div>;

  const stats = {
    total: guests.length,
    going: guests.filter((g) => g.status === "going").length,
    notGoing: guests.filter((g) => g.status === "not-going").length,
    maybe: guests.filter((g) => g.status === "maybe").length,
    checkedIn: guests.filter((g) => g.checkedIn).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={() => router.push(`/invitation/${id}`)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={20} /> Буцах
        </button>

        <header className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <h1 className="text-3xl font-bold text-slate-900">
            {invitation.title} - Админ самбар
          </h1>
          <p className="text-slate-500">Зочдын бүртгэл болон ирц шалгаах</p>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            icon={<Users className="text-blue-500" />}
            label="Нийт зочид"
            value={stats.total}
          />
          <StatCard
            icon={<CheckCircle2 className="text-emerald-500" />}
            label="Очно"
            value={stats.going}
          />
          <StatCard
            icon={<UserCheck className="text-indigo-500" />}
            label="Ирсэн"
            value={stats.checkedIn}
          />
          <StatCard
            icon={<HelpCircle className="text-amber-500" />}
            label="Мэдэхгүй"
            value={stats.maybe}
          />
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-bold">Зочдын жагсаалт</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Нэр</th>
                  <th className="px-6 py-4 font-semibold">Төлөв</th>
                  <th className="px-6 py-4 font-semibold text-center">
                    Ирц (Check-in)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {guests.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-12 text-center text-slate-400 italic"
                    >
                      Зочид олдсонгүй.
                    </td>
                  </tr>
                ) : (
                  guests.map((guest) => (
                    <tr
                      key={guest.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {guest.name}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={guest.status} />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => toggleCheckIn(guest)}
                          className={`p-2 rounded-lg transition-all ${
                            guest.checkedIn
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600"
                          }`}
                        >
                          <UserCheck size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center gap-2">
      <div className="p-3 bg-slate-50 rounded-xl">{icon}</div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: Guest["status"] }) {
  const configs = {
    going: { label: "Очно", color: "bg-emerald-100 text-emerald-700" },
    "not-going": { label: "Амжихгүй", color: "bg-rose-100 text-rose-700" },
    maybe: { label: "Мэдэхгүй", color: "bg-amber-100 text-amber-700" },
  };
  const config = configs[status];
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tighter ${config.color}`}
    >
      {config.label}
    </span>
  );
}
