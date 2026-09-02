import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useKiosk } from '../context/KioskContext';

const LANGUAGES = [
  { code: 'en', name: 'English',  native: 'English',  icon: '🇬🇧' },
  { code: 'hi', name: 'Hindi',    native: 'हिन्दी',    icon: '🇮🇳' },
  { code: 'ta', name: 'Tamil',    native: 'தமிழ்',     icon: '🇮🇳' },
  { code: 'te', name: 'Telugu',   native: 'తెలుగు',    icon: '🇮🇳' },
  { code: 'kn', name: 'Kannada',  native: 'ಕನ್ನಡ',     icon: '🇮🇳' },
  { code: 'bn', name: 'Bengali',  native: 'বাংলা',     icon: '🇮🇳' },
];

export default function LanguagePage() {
  const navigate = useNavigate();
  const { setLanguage, t } = useKiosk();

  const handleSelectLanguage = (code) => {
    setLanguage(code);
    navigate('/consent');
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-[#f6f8fb] text-[#1A1A2E] p-6 sm:p-10">
      <div className="absolute -left-32 -top-32 w-96 h-96 rounded-full bg-[#bce5f6]/60 blur-3xl animate-ambient" /><div className="absolute -right-24 bottom-0 w-80 h-80 rounded-full bg-[#ffe0e3]/60 blur-3xl animate-ambient" />
      <div className="relative z-10 text-center mb-10 animate-float-in">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-[28px] bg-white shadow-xl shadow-[#0F4C75]/15 mb-5">
          <svg className="w-11 h-11 text-[#0F4C75]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </div>
        <div className="text-xs uppercase tracking-[.28em] text-[#0F4C75] font-bold mb-3">Care starts with listening</div><h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">{t('welcome')}</h1>
        <p className="text-lg sm:text-xl text-gray-600">{t('selectLanguage')}</p>
      </div>

      <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl w-full">
        {LANGUAGES.map((lang, index) => (
          <button
            key={lang.code}
            onClick={() => handleSelectLanguage(lang.code)}
            className="soft-card flex flex-col items-center justify-center bg-white/90 rounded-3xl shadow-md border border-white hover:border-[#65b5d8] active:scale-95 min-h-[140px] animate-float-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <span className="text-3xl font-bold text-[#1A1A2E] mb-2">{lang.native}</span><span className="text-base text-gray-500">{lang.name}</span>
          </button>
        ))}
      </div>
      <a href="/doctor" className="relative z-10 mt-8 text-[#0F4C75] font-semibold text-base hover:underline">{t('viewDoctor')} →</a>
    </div>
  );
}
