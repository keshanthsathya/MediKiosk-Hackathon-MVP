import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKiosk } from '../context/KioskContext';
import BackButton from '../components/BackButton';
import { FiCheckCircle, FiGrid } from 'react-icons/fi';

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const { language, consent, history, uploads, token, submitForm, resetForm } = useKiosk();

  useEffect(() => {
    submitForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStartNew = () => {
    resetForm();
    navigate('/language');
  };

  return (
    <div className="flex flex-col h-full bg-[#FFFFFF] text-[#1A1A2E] p-6 relative items-center justify-center">
      <div className="absolute top-6 left-6">
        <BackButton onClick={() => navigate('/upload')} />
      </div>

      <div className="flex flex-col items-center flex-1 w-full max-w-4xl mt-12 overflow-y-auto">
        <FiCheckCircle className="text-green-500 text-8xl mb-6 animate-bounce" />
        <h1 className="text-5xl font-bold mb-10 text-[#0F4C75]">Registration Complete!</h1>

        <div className="bg-[#0F4C75] p-8 rounded-2xl shadow-xl w-full text-center mb-10">
          <p className="text-white text-2xl mb-2 opacity-80">Your Token Number</p>
          <p className="text-white text-7xl font-bold tracking-wider">{token || "Generating..."}</p>
        </div>

        <div className="flex w-full gap-8 mb-10">
          <div className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">Summary</h2>
            <div className="space-y-3 text-lg">
              <p><span className="font-semibold">Language:</span> {language || 'English'}</p>
              <p><span className="font-semibold">ID:</span> {consent?.idValue || 'N/A'}</p>
              <p><span className="font-semibold">Complaint:</span> {history?.complaint || 'N/A'}</p>
              <p><span className="font-semibold">Documents:</span> {uploads?.length || 0} uploaded</p>
            </div>
          </div>
          
          <div className="w-64 h-64 bg-gray-50 border-4 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400">
            <FiGrid className="text-6xl mb-4" />
            <span className="text-xl font-medium">QR Code</span>
          </div>
        </div>

        <button
          onClick={handleStartNew}
          className="min-h-[80px] w-full max-w-lg text-3xl font-bold bg-[#E63946] text-white rounded-xl shadow-lg mt-auto mb-4 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center"
        >
          Start New Registration
        </button>
      </div>
    </div>
  );
}
