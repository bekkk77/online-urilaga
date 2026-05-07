"use client";

import React, { useState } from "react";
import { Invitation } from "@/lib/types";
import { saveGuestInvite } from "@/lib/store";
import { X, Send, Mail } from "lucide-react";

interface SendInviteModalProps {
  invitation: Invitation;
  open: boolean;
  onClose: () => void;
  onSuccess: (count: number) => void;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SendInviteModal({
  invitation,
  open,
  onClose,
  onSuccess,
}: SendInviteModalProps) {
  const [emailInput, setEmailInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const parseEmails = (value: string) => {
    return value
      .split(/[\n,;]+/)
      .map((email) => email.trim())
      .filter(Boolean);
  };

  const handleSend = async () => {
    setError(null);
    const emails = parseEmails(emailInput);
    if (emails.length === 0) {
      setError("Та дор хаяж нэг мэйл хаяг оруулна уу.");
      return;
    }

    const invalid = emails.filter((email) => !emailRegex.test(email));
    if (invalid.length > 0) {
      setError(`Зөв форматтайгүй мэйл хаяг: ${invalid.join(", ")}`);
      return;
    }

    const uniqueEmails = Array.from(
      new Set(emails.map((email) => email.toLowerCase())),
    );
    const invites = uniqueEmails.map((email) => {
      const guestId = Math.random().toString(36).substring(2, 10);
      const link = `${window.location.origin}/invitation/${invitation.id}?guest=${guestId}`;
      return { email, guestId, link };
    });

    setSending(true);

    try {
      const response = await fetch("/api/send-invites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invitation, // Pass the full invitation object
          emailInvites: invites,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Илгээх явцад алдаа гарлаа.");
      }

      invites.forEach(({ email, guestId, link }) => {
        saveGuestInvite({
          id: guestId,
          invitationId: invitation.id,
          email,
          link,
          sentAt: new Date().toISOString(),
        });
      });

      setEmailInput("");
      onClose();
      onSuccess(result.sentCount || uniqueEmails.length);
    } catch (sendError) {
      setError(
        sendError instanceof Error
          ? sendError.message
          : "Илгээх явцад алдаа гарлаа. Дахин оролдоно уу.",
      );
      console.error(sendError);
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8">
      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200 overflow-hidden">
        <div className="flex items-center justify-between bg-slate-100 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold">Урилга илгээх</h2>
            <p className="text-sm text-slate-600">
              Нэг дор олон мэйл хаяг оруулж, тус бүрд өвөрмөц линк үүсгэн
              илгээнэ.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-600 hover:bg-slate-200 transition"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 px-6 py-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-700">Оруулах боломжтой формат:</p>
            <p className="text-sm text-slate-500">
              email1@example.com, email2@example.com; email3@example.com
            </p>
            <p className="text-sm text-slate-500">
              Эсвэл мөр бүрт нэг мэйл хаяг оруулна.
            </p>
          </div>

          <label className="block text-sm font-semibold text-slate-700">
            Мэйл хаягууд
          </label>
          <textarea
            rows={6}
            className="w-full rounded-2xl border border-slate-300 p-4 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="email1@example.com, email2@example.com, email3@example.com"
            value={emailInput}
            onChange={(event) => setEmailInput(event.target.value)}
          />

          {error ? <p className="text-sm text-rose-600">{error}</p> : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-600">
              {sending
                ? "Илгээж байна..."
                : "Хүлээн авагчдын тоо: " + parseEmails(emailInput).length}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-slate-300 px-5 py-3 text-slate-700 hover:bg-slate-100 transition"
              >
                Цуцлах
              </button>
              <button
                type="button"
                onClick={handleSend}
                disabled={sending}
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-white shadow-lg hover:bg-blue-700 transition disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                <Mail size={18} />
                Илгээх
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
