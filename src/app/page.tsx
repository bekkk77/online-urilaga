"use client";

import InvitationForm from "@/components/InvitationForm";
import { Sparkles, QrCode, BarChart3, Share2, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f172a] text-white selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-purple-600/15 blur-[100px] rounded-full" />
        <div className="absolute top-[30%] right-[10%] w-[20%] h-[20%] bg-blue-500/10 blur-[80px] rounded-full" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 sm:pt-32 sm:pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-indigo-400 text-sm font-medium mb-8 animate-fade-up">
            <Sparkles size={14} className="animate-pulse" />
            <span>Хамгийн хялбар урилга үүсгэгч</span>
          </div>
          
          <h1 className="text-5xl sm:text-8xl font-black tracking-tight mb-8 animate-fade-up [animation-delay:100ms]">
            <span className="text-gradient">Давтагдашгүй</span> <br /> 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">урилга үүсгэх.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-400 leading-relaxed mb-16 animate-fade-up [animation-delay:200ms]">
            Төрсөн өдөр, хурим найр, төгсөлтийн баяр зэрэг бүх төрлийн арга
            хэмжээнд зориулсан онлайн урилгын систем. Хялбар, хурдан, загварлаг.
          </p>

          <div className="relative z-10 animate-fade-up [animation-delay:300ms]">
            <InvitationForm />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative max-w-7xl mx-auto px-6 lg:px-8 pb-32">
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gradient">Яагаад биднийг сонгох вэ?</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Бид таны арга хэмжээг төлөвлөхөд туслах хамгийн шилдэг хэрэгслүүдийг санал болгож байна.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <FeatureCard
            icon={<QrCode className="text-indigo-400" size={24} />}
            title="Ухаалаг QR Код"
            desc="Зочид таны урилгыг уншуулж мэдээлэл авах, бүртгүүлэх боломжтой."
          />
          <FeatureCard
            icon={<BarChart3 className="text-purple-400" size={24} />}
            title="RSVP Хяналт"
            desc="Хэн ирэх, хэн ирэхгүйг Админ панел дээр бодит хугацаанд харна."
          />
          <FeatureCard
            icon={<Share2 className="text-blue-400" size={24} />}
            title="Хялбар Түгээлт"
            desc="WhatsApp, Telegram, Messenger-ээр нэг товшилтоор хуваалцаарай."
          />
        </div>
      </section>

      {/* Stats/Social Proof (Optional visual enhancement) */}
      <section className="max-w-5xl mx-auto px-6 mb-32">
        <div className="glass rounded-[32px] p-12 border border-white/10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <Zap size={120} />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold mb-6">Бэлэн үү? Өөрийн урилгаа одоо үүсгэ.</h3>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            Олон зуун хэрэглэгчид бидэнд итгэж өөрсдийн мартагдашгүй мөчөө хуваалцаж байна.
          </p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-8 py-4 bg-white text-indigo-950 rounded-2xl font-bold hover:bg-slate-200 transition-all transform hover:scale-105 active:scale-95"
          >
            Эхлэх
          </button>
        </div>
      </section>
      
      <footer className="py-12 border-t border-white/5 text-center text-slate-500 text-sm">
        <p>© 2026 Online Invitation. Бүх эрх хуулиар хамгаалагдсан.</p>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="p-10 rounded-[32px] glass border border-white/10 hover:border-indigo-500/30 hover:bg-white/[0.05] transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-all" />
      <div className="mb-6 inline-flex p-4 rounded-2xl bg-white/5 ring-1 ring-white/10 group-hover:ring-indigo-500/30 transition-all">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4 text-white group-hover:text-indigo-300 transition-colors">
        {title}
      </h3>
      <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{desc}</p>
    </div>
  );
}
