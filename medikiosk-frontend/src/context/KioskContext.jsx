import React, { createContext, useContext, useReducer } from 'react';

const initialState = {
  language: '',
  consent: {
    agreed: false,
    abhaId: '',
    useAadhaar: false,
  },
  history: {
    step: 0,
    complaint: '',
    onset: '',
    symptoms: [],
    pastHistory: '',
    medicines: '',
    allergies: '',
    familyHistory: '',
    ayushEnabled: false,
    prakritiVata: 50,
    prakritiPitta: 50,
    prakritiKapha: 50,
    dietType: '',
    bowelHabits: '',
    sleepPattern: '',
  },
  uploads: [],
  token: null,
};

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export const TRANSLATIONS = {
  en: { welcome: 'Welcome to MediKiosk', selectLanguage: 'Please select your preferred language', patientIdentification: 'Patient Identification', patientConsent: 'Patient Consent', continue: 'Continue', next: 'Next', previous: 'Previous', chiefComplaint: 'Chief Complaint', mainConcern: 'What is your main health concern today?', doctorPortal: 'Doctor Portal', viewDoctor: 'View Doctor Screen' },
  hi: { welcome: 'MediKiosk में आपका स्वागत है', selectLanguage: 'अपनी पसंदीदा भाषा चुनें', patientIdentification: 'मरीज़ की पहचान', patientConsent: 'मरीज़ की सहमति', continue: 'जारी रखें', next: 'अगला', previous: 'पिछला', chiefComplaint: 'मुख्य शिकायत', mainConcern: 'आज आपकी मुख्य स्वास्थ्य समस्या क्या है?', doctorPortal: 'डॉक्टर पोर्टल', viewDoctor: 'डॉक्टर स्क्रीन देखें' },
  ta: { welcome: 'MediKiosk-க்கு வரவேற்கிறோம்', selectLanguage: 'உங்களுக்கு விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்', patientIdentification: 'நோயாளி அடையாளம்', patientConsent: 'நோயாளி ஒப்புதல்', continue: 'தொடரவும்', next: 'அடுத்து', previous: 'பின்செல்', chiefComplaint: 'முக்கியப் புகார்', mainConcern: 'இன்று உங்கள் முக்கிய உடல்நலக் கவலை என்ன?', doctorPortal: 'மருத்துவர் போர்டல்', viewDoctor: 'மருத்துவர் திரையைப் பார்க்கவும்' },
  te: { welcome: 'MediKiosk కు స్వాగతం', selectLanguage: 'మీకు ఇష్టమైన భాషను ఎంచుకోండి', patientIdentification: 'రోగి గుర్తింపు', patientConsent: 'రోగి సమ్మతి', continue: 'కొనసాగించు', next: 'తదుపరి', previous: 'మునుపటి', chiefComplaint: 'ప్రధాన ఫిర్యాదు', mainConcern: 'ఈ రోజు మీ ప్రధాన ఆరోగ్య సమస్య ఏమిటి?', doctorPortal: 'డాక్టర్ పోర్టల్', viewDoctor: 'డాక్టర్ స్క్రీన్ చూడండి' },
  kn: { welcome: 'MediKiosk ಗೆ ಸ್ವಾಗತ', selectLanguage: 'ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ', patientIdentification: 'ರೋಗಿಯ ಗುರುತು', patientConsent: 'ರೋಗಿಯ ಒಪ್ಪಿಗೆ', continue: 'ಮುಂದುವರಿಸಿ', next: 'ಮುಂದೆ', previous: 'ಹಿಂದಿನದು', chiefComplaint: 'ಮುಖ್ಯ ದೂರು', mainConcern: 'ಇಂದು ನಿಮ್ಮ ಮುಖ್ಯ ಆರೋಗ್ಯ ಸಮಸ್ಯೆ ಏನು?', doctorPortal: 'ವೈದ್ಯರ ಪೋರ್ಟಲ್', viewDoctor: 'ವೈದ್ಯರ ಪರದೆ ನೋಡಿ' },
  bn: { welcome: 'MediKiosk-এ স্বাগতম', selectLanguage: 'আপনার পছন্দের ভাষা নির্বাচন করুন', patientIdentification: 'রোগীর পরিচয়', patientConsent: 'রোগীর সম্মতি', continue: 'চালিয়ে যান', next: 'পরবর্তী', previous: 'আগের', chiefComplaint: 'প্রধান অভিযোগ', mainConcern: 'আজ আপনার প্রধান স্বাস্থ্য সমস্যা কী?', doctorPortal: 'ডাক্তার পোর্টাল', viewDoctor: 'ডাক্তারের স্ক্রিন দেখুন' },
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'UPDATE_CONSENT':
      return { ...state, consent: { ...state.consent, ...action.payload } };
    case 'UPDATE_HISTORY':
      return { ...state, history: { ...state.history, ...action.payload } };
    case 'ADD_UPLOAD':
      return { ...state, uploads: [...state.uploads, action.payload] };
    case 'REMOVE_UPLOAD':
      return { ...state, uploads: state.uploads.filter(u => u.id !== action.payload) };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'RESET_FORM':
      return initialState;
    default:
      return state;
  }
};

const KioskContext = createContext();

export const KioskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setLanguage = (lang) => dispatch({ type: 'SET_LANGUAGE', payload: lang });
  const updateConsent = (updates) => dispatch({ type: 'UPDATE_CONSENT', payload: updates });
  const updateHistory = (updates) => dispatch({ type: 'UPDATE_HISTORY', payload: updates });
  const addUpload = (file) => dispatch({ type: 'ADD_UPLOAD', payload: file });
  const removeUpload = (id) => dispatch({ type: 'REMOVE_UPLOAD', payload: id });
  
  const submitForm = async () => {
    const token = `T-${Math.floor(1000 + Math.random() * 9000)}`;
    dispatch({ type: 'SET_TOKEN', payload: token });
    try {
      const response = await fetch(`${API_BASE}/api/intake`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...state, token })
      });
      if (response.ok) {
        const result = await response.json();
        if (result.submission?.token) dispatch({ type: 'SET_TOKEN', payload: result.submission.token });
      }
    } catch (error) {
      console.warn('Backend unavailable; keeping local demo submission.', error);
    }
  };

  const resetForm = () => dispatch({ type: 'RESET_FORM' });

  return (
    <KioskContext.Provider
      value={{
        state,
        language: state.language,
        consent: state.consent,
        history: state.history,
        uploads: state.uploads,
        token: state.token,
        setLanguage,
        updateConsent,
        updateHistory,
        addUpload,
        removeUpload,
        submitForm,
        resetForm,
        t: (key) => (TRANSLATIONS[state.language || 'en'] || TRANSLATIONS.en)[key] || TRANSLATIONS.en[key] || key,
      }}
    >
      {children}
    </KioskContext.Provider>
  );
};

export const useKiosk = () => {
  const context = useContext(KioskContext);
  if (!context) {
    throw new Error('useKiosk must be used within a KioskProvider');
  }
  return context;
};
