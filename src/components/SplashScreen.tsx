import React, { useRef } from 'react';
import { Camera, Sparkles, ArrowRight, Award, BookOpen, School, CheckCircle2 } from 'lucide-react';
import { SchoolIdentity } from '../types/anabus';

interface SplashScreenProps {
  school: SchoolIdentity;
  developerPhoto: string;
  onPhotoUpload: (base64Photo: string) => void;
  onStart: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  school,
  developerPhoto,
  onPhotoUpload,
  onStart,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onPhotoUpload(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-gradient-to-br from-sky-100 via-blue-50/70 to-indigo-100">
      {/* Soft futuristic ambient light orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-cyan-300/30 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-10 w-[28rem] h-[28rem] rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />
      <div className="absolute -top-20 right-1/4 w-80 h-80 rounded-full bg-indigo-300/25 blur-3xl pointer-events-none" />

      {/* Futuristic grid overlay subtle */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#0284c7 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Main Glassmorphic Card */}
      <div className="relative z-10 w-full max-w-2xl backdrop-blur-2xl bg-white/75 border border-white/80 shadow-[0_20px_60px_-15px_rgba(14,165,233,0.18)] rounded-3xl p-6 sm:p-10 text-center transition-all duration-300">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-sky-500/10 to-indigo-500/10 border border-sky-200/60 text-sky-800 text-xs font-semibold shadow-sm mb-6">
          <Sparkles className="w-3.5 h-3.5 text-sky-600 animate-spin" style={{ animationDuration: '4s' }} />
          <span>SISTEM ANALISIS BUTIR SOAL KEMENDIKDASMEN 2025</span>
        </div>

        {/* Circular Developer Photo with Upload */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="relative group">
            {/* Soft futuristic pulsing aura */}
            <div className="absolute -inset-2 bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-500 rounded-full blur-md opacity-70 group-hover:opacity-100 transition duration-500 animate-tilt" />

            <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full p-1 bg-gradient-to-br from-white via-sky-100 to-blue-200 shadow-xl overflow-hidden ring-4 ring-white/90">
              {developerPhoto ? (
                <img
                  src={developerPhoto}
                  alt="Foto Pengembang Asriza Rinandar"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-700 flex flex-col items-center justify-center text-white p-2">
                  <span className="text-4xl font-extrabold tracking-tight">AR</span>
                  <span className="text-[10px] tracking-wider uppercase font-semibold text-sky-200 mt-1">
                    SD 105285
                  </span>
                </div>
              )}

              {/* Hover overlay to change photo */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer rounded-full"
                title="Klik untuk upload foto Anda"
              >
                <Camera className="w-6 h-6 mb-1 text-sky-300" />
                <span className="text-[10px] font-bold tracking-wide">Unggah Foto</span>
              </div>
            </div>

            {/* Quick Upload Action Button Icon */}
            <button
              onClick={() => fileInputRef.current?.click()}
              type="button"
              className="absolute bottom-1 right-1 bg-sky-600 hover:bg-sky-500 text-white p-2.5 rounded-full shadow-lg border-2 border-white transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
              title="Upload foto pengembang"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1 font-medium">
            <span>Klik lingkaran untuk mengganti foto profil pengembang</span>
          </p>
        </div>

        {/* Title & Developer Info */}
        <div className="space-y-2 mb-6">
          <div className="inline-block">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight bg-gradient-to-r from-sky-700 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
              ANABUS 105285
            </h1>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full mt-1" />
          </div>

          <div className="pt-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">
              Asriza Rinandar, S.Pd.
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-sky-700 flex items-center justify-center gap-1.5 mt-0.5">
              <School className="w-4 h-4 text-sky-600" />
              Guru Kelas UPT SPF SD Inpres 105285 Tandam Hilir I
            </p>
            <p className="text-xs text-slate-500">
              Kec. Hamparan Perak, Kab. Deli Serdang, Sumatera Utara
            </p>
          </div>
        </div>

        {/* Motto In Box */}
        <div className="relative my-6 px-6 py-4 rounded-2xl bg-gradient-to-r from-sky-500/10 via-blue-500/5 to-indigo-500/10 border border-sky-200/70 text-center shadow-xs">
          <div className="text-2xl text-sky-400 font-serif leading-none select-none">“</div>
          <p className="text-xs sm:text-sm font-semibold text-slate-700 italic px-2 -mt-3">
            Mudahkanlah bagimu kesulitan orang lain, maka Allah akan memudahkan kesulitanmu
          </p>
          <div className="text-2xl text-sky-400 font-serif leading-none select-none -mt-1 text-right">”</div>
        </div>

        {/* Features Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8 text-[11px]">
          <div className="bg-white/80 border border-sky-100 rounded-xl p-2.5 flex flex-col items-center justify-center shadow-xs text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mb-1" />
            <span className="font-semibold text-slate-800">Guru Kelas & Mapel</span>
            <span className="text-[10px] text-slate-500">Multi-kelas & Mapel</span>
          </div>
          <div className="bg-white/80 border border-sky-100 rounded-xl p-2.5 flex flex-col items-center justify-center shadow-xs text-slate-700">
            <BookOpen className="w-4 h-4 text-sky-600 mb-1" />
            <span className="font-semibold text-slate-800">1 - 50 Soal</span>
            <span className="text-[10px] text-slate-500">Dinamis 6 Tipe Soal</span>
          </div>
          <div className="bg-white/80 border border-sky-100 rounded-xl p-2.5 flex flex-col items-center justify-center shadow-xs text-slate-700">
            <Award className="w-4 h-4 text-indigo-600 mb-1" />
            <span className="font-semibold text-slate-800">Analisis Kemendikdasmen</span>
            <span className="text-[10px] text-slate-500">TK, DP & Pengecoh</span>
          </div>
          <div className="bg-white/80 border border-sky-100 rounded-xl p-2.5 flex flex-col items-center justify-center shadow-xs text-slate-700">
            <Sparkles className="w-4 h-4 text-amber-500 mb-1" />
            <span className="font-semibold text-slate-800">Cetak V3 Anti-Hitam</span>
            <span className="text-[10px] text-slate-500">Auto-Split A4 Land</span>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={onStart}
          type="button"
          className="w-full sm:w-auto min-w-[260px] inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:via-blue-500 hover:to-indigo-500 text-white font-bold text-base sm:text-lg shadow-[0_10px_25px_-5px_rgba(2,132,199,0.5)] hover:shadow-[0_15px_30px_-5px_rgba(2,132,199,0.7)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <span>MULAI ANALISIS SEKARANG</span>
          <ArrowRight className="w-5 h-5 animate-pulse" />
        </button>

        <p className="text-[11px] text-slate-400 mt-5 font-mono">
          Versi Final Terpadu 2025 • UPT SPF SD Inpres 105285 Tandam Hilir I
        </p>
      </div>
    </div>
  );
};
