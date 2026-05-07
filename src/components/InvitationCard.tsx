"use client";

import React from "react";
import { Invitation } from "@/lib/types";
import { themes } from "@/lib/themes";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Share2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface InvitationCardProps {
  invitation: Invitation;
}

export default function InvitationCard({ invitation }: InvitationCardProps) {
  const theme = themes[invitation.type] || themes.other;

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.33, 1, 0.68, 1] as const,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  const shareInvitation = () => {
    if (navigator.share) {
      navigator
        .share({
          title: invitation.title,
          text: `${invitation.host} tanaig ${invitation.title} urij baina!`,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      // Fallback: Copy link
      navigator.clipboard.writeText(window.location.href);
      alert("Link хуулагдлаа!");
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`max-w-xl mx-auto ${theme.bg} ${theme.font} p-4 sm:p-8 rounded-3xl shadow-2xl overflow-hidden border-8 ${theme.border} relative`}
    >
      {/* Decorative Elements */}
      <div
        className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 opacity-20 pointer-events-none"
        style={{ borderColor: "currentColor" }}
      />
      <div
        className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 opacity-20 pointer-events-none"
        style={{ borderColor: "currentColor" }}
      />

      <div className={`text-center space-y-6 ${theme.text}`}>
        <motion.div variants={itemVariants} className="space-y-2">
          <p
            className={`uppercase tracking-widest text-sm font-semibold ${theme.accent}`}
          >
            Урилга
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            {invitation.title}
          </h1>
          <p className="text-lg opacity-80 italic">
            Зохион байгуулагч: {invitation.host}
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className={`flex flex-col items-center gap-4 py-8 border-y-2 ${theme.border} bg-white/30 backdrop-blur-sm rounded-xl`}
        >
          <div className="flex items-center gap-3 text-xl font-medium">
            <Calendar className={theme.icon} />
            <span>{invitation.date}</span>
          </div>
          <div className="flex items-center gap-3 text-xl font-medium">
            <Clock className={theme.icon} />
            <span>{invitation.time}</span>
          </div>
          <div className="flex items-center gap-3 text-xl font-medium text-center px-4">
            <MapPin className={theme.icon} />
            <span>{invitation.location}</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="py-4">
          <p className="text-lg leading-relaxed">{invitation.description}</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center gap-6 pt-6"
        >
          <div className="bg-white p-4 rounded-2xl shadow-inner border-2 border-slate-100">
            <QRCodeSVG
              value={window.location.href}
              size={150}
              level="H"
              includeMargin={true}
            />
            <p className="text-[10px] mt-2 opacity-50 text-slate-500 uppercase tracking-tighter">
              Scan to share or check-in
            </p>
          </div>

          <button
            onClick={shareInvitation}
            className={`flex items-center gap-2 px-8 py-4 rounded-full font-bold shadow-lg transform transition-all active:scale-95 ${theme.button}`}
          >
            <Share2 size={20} />
            Урилга түгээх (Share)
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
