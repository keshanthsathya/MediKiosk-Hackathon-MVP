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
    <header className="h-[72px] bg-gradient-to-r from-[#082f49] via-[#0F4C75] to-[#17648f] text-white flex items-center justify-between px-7 shadow-lg shrink-0 w-full font-inter relative overflow-hidden">
      <div className="absolute -right-8 -top-16 w-44 h-44 rounded-full bg-white/10 animate-ambient" />
      <div className="flex items-center gap-3 h-full min-h-[60px] min-w-[60px]">
        <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center"><FiActivity size={25} className="text-[#ff7180]" /></div>
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
