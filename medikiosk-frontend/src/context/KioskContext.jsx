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
