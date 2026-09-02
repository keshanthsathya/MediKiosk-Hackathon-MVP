import React from 'react';
import { FiActivity } from 'react-icons/fi';
import { useKiosk } from '../context/KioskContext';

const LANG_LABELS = {
  en: 'English',
  hi: 'हिन्दी',
  ta: 'தமிழ்',
  te: 'తెలుగు',
  kn: 'ಕನ್ನಡ',
  bn: 'বাংলা',
};

const TopBar = () => {
  const { state } = useKiosk();
  const { language } = state;

  return (
    <header className="h-[60px] bg-[#0F4C75] text-white flex items-center justify-between px-6 shadow-md shrink-0 w-full font-inter">
      <div className="flex items-center gap-3 h-full min-h-[60px] min-w-[60px]">
        <FiActivity size={28} className="text-[#E63946]" />
        <h1 className="text-2xl font-bold tracking-wide">MediKiosk</h1>
      </div>
      
      {language && LANG_LABELS[language] && (
        <div className="bg-white/20 px-4 py-2 rounded-full min-h-[40px] flex items-center justify-center font-medium">
          {LANG_LABELS[language]}
        </div>
      )}
    </header>
  );
};

export default TopBar;
