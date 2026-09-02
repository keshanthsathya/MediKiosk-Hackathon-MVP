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
  const { setLanguage } = useKiosk();

  const handleSelectLanguage = (code) => {
    setLanguage(code);
    navigate('/consent');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFFFFF] text-[#1A1A2E] p-8">
      <div className="text-center mb-12 animate-fade-in">
        <div className="flex justify-center mb-4">
          <svg className="w-16 h-16 text-[#0F4C75]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </div>
        <h1 className="text-4xl font-bold mb-4">Welcome to MediKiosk</h1>
        <p className="text-xl text-gray-600">Please select your preferred language</p>
      </div>

      <div className="grid grid-cols-3 gap-6 max-w-5xl w-full">
        {LANGUAGES.map((lang, index) => (
          <button
            key={lang.code}
            onClick={() => handleSelectLanguage(lang.code)}
            className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-md border-4 border-transparent hover:border-[#0F4C75] active:border-[#0F4C75] hover:scale-105 transition-all duration-200 min-h-[120px] animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <span className="text-3xl font-bold text-[#1A1A2E] mb-2">{lang.native}</span>
            <span className="text-lg text-gray-500">{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
