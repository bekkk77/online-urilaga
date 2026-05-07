"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Invitation, EventType } from "@/lib/types";
import { saveInvitation } from "@/lib/store";
import { Calendar, Clock, MapPin, Type, User } from "lucide-react";
import SendInviteModal from "./SendInviteModal";
import Toast from "./Toast";

export default function InvitationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    type: "birthday" as EventType,
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    host: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [currentInvitation, setCurrentInvitation] = useState<Invitation | null>(
    null,
  );
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Math.random().toString(36).substring(2, 9);
    const newInvitation: Invitation = { ...formData, id };
    saveInvitation(newInvitation);
    setCurrentInvitation(newInvitation);
    setShowModal(true);
  };

  const handleInviteSuccess = (count: number) => {
    setToastMessage(`${count} мэйл хаягт амжилттай илгээгдлээ`);
    setShowToast(true);
    if (currentInvitation) {
      router.push(`/invitation/${currentInvitation.id}`);
    }
  };

  const inputClasses =
    "w-full p-4 border border-slate-200/50 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white/50 backdrop-blur-sm text-slate-900 placeholder:text-slate-400";
  const labelClasses =
    "flex items-center gap-2 text-sm font-bold text-slate-700 mb-2 ml-1";

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-8 max-w-2xl mx-auto p-10 bg-white/90 backdrop-blur-xl rounded-[32px] shadow-2xl border border-white/40 animate-fade-up"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className={labelClasses}>
              <Type size={16} className="text-indigo-500" /> Арга хэмжээний төрөл
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value as EventType })
              }
              className={`${inputClasses} appearance-none cursor-pointer`}
            >
              <option value="birthday">🎂 Төрсөн өдөр</option>
              <option value="wedding">💍 Хурим найр</option>
              <option value="graduation">🎓 Төгсөлтийн баяр</option>
              <option value="other">✨ Бусад</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className={labelClasses}>
              <User size={16} className="text-indigo-500" /> Зохион байгуулагч
            </label>
            <input
              type="text"
              required
              placeholder="Таны нэр"
              className={inputClasses}
              value={formData.host}
              onChange={(e) =>
                setFormData({ ...formData, host: e.target.value })
              }
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className={labelClasses}>Арга хэмжээний нэр</label>
          <input
            type="text"
            required
            placeholder="Урилгын гарчиг"
            className={inputClasses}
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className={labelClasses}>
              <Calendar size={16} className="text-indigo-500" /> Огноо
            </label>
            <input
              type="date"
              required
              className={inputClasses}
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </div>
          <div className="space-y-1">
            <label className={labelClasses}>
              <Clock size={16} className="text-indigo-500" /> Цаг
            </label>
            <input
              type="time"
              required
              className={inputClasses}
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className={labelClasses}>
            <MapPin size={16} className="text-indigo-500" /> Байршил
          </label>
          <input
            type="text"
            required
            placeholder="Хаана болох вэ? (Жишээ: Shangri-La Hotel)"
            className={inputClasses}
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
          />
        </div>

        <div className="space-y-1">
          <label className={labelClasses}>Тайлбар</label>
          <textarea
            rows={4}
            placeholder="Зочиддоо зориулсан тусгай мэдээлэл..."
            className={`${inputClasses} resize-none`}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 active:scale-[0.98] transition-all text-lg"
        >
          Урилга үүсгэх
        </button>
      </form>

      {currentInvitation && (
        <SendInviteModal
          invitation={currentInvitation}
          open={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={handleInviteSuccess}
        />
      )}

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}
