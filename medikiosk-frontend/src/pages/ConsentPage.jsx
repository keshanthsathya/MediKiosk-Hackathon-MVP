import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKiosk } from '../context/KioskContext';
import BackButton from '../components/BackButton';
import { FiCpu } from 'react-icons/fi';

export default function ConsentPage() {
  const navigate = useNavigate();
  const { updateConsent } = useKiosk();
  const [idMode, setIdMode] = useState('abha'); // 'abha' or 'aadhaar'
  const [abhaId, setAbhaId] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [consents, setConsents] = useState({
    c1: false,
    c2: false,
    c3: false
  });

  const allConsented = consents.c1 && consents.c2 && consents.c3;
  const idProvided = idMode === 'abha' ? abhaId.length === 14 : scanComplete;
  const canProceed = allConsented && idProvided;

  const handleContinue = () => {
    updateConsent({ 
      idMode, 
      idValue: idMode === 'abha' ? abhaId : 'biometric_scanned', 
      consents 
    });
    navigate('/history');
  };

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFFFF] text-[#1A1A2E] p-8">
      <BackButton to="/language" />
      
      <div className="flex flex-1 gap-12 max-w-6xl mx-auto w-full mt-12">
        {/* Left Section - Patient Identification */}
        <div className="flex-1 bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col">
          <h2 className="text-3xl font-bold mb-8">Patient Identification</h2>
          
          <div className="flex bg-gray-100 rounded-xl p-1 mb-10">
            <button 
              className={`flex-1 py-4 text-xl font-medium rounded-lg transition-colors min-h-[60px] ${idMode === 'abha' ? 'bg-white shadow text-[#0F4C75]' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setIdMode('abha')}
            >
              ABHA ID
            </button>
            <button 
              className={`flex-1 py-4 text-xl font-medium rounded-lg transition-colors min-h-[60px] ${idMode === 'aadhaar' ? 'bg-white shadow text-[#0F4C75]' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setIdMode('aadhaar')}
            >
              Aadhaar Biometric
            </button>
          </div>

          {idMode === 'abha' ? (
            <div className="flex flex-col gap-4">
              <label className="text-xl font-medium">Enter 14-digit ABHA ID</label>
              <input 
                type="text" 
                maxLength="14"
                value={abhaId}
                onChange={(e) => setAbhaId(e.target.value.replace(/\D/g, ''))}
                placeholder="0000 0000 0000 00"
                className="w-full text-3xl p-6 border-4 border-gray-200 rounded-xl focus:border-[#0F4C75] focus:outline-none transition-colors min-h-[80px]"
              />
              <p className="text-lg text-gray-500 mt-2">Enter only numbers</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center border-4 border-dashed border-gray-300 rounded-xl p-12 h-64 cursor-pointer hover:bg-gray-50 transition-colors"
                 onClick={handleScan}>
              {scanComplete ? (
                <div className="text-[#0F4C75] flex flex-col items-center">
                  <FiCpu className="text-6xl mb-6" />
                  <p className="text-2xl font-bold">Scan Successful</p>
                </div>
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                  <FiCpu className={`text-6xl mb-6 ${isScanning ? 'animate-pulse text-[#0F4C75]' : ''}`} />
                  <p className="text-2xl font-medium text-center">
                    {isScanning ? 'Scanning...' : 'Place finger on biometric scanner'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Section - Consent */}
        <div className="flex-1 bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col">
          <h2 className="text-3xl font-bold mb-8">Patient Consent</h2>
          
          <div className="flex flex-col gap-8 mb-12 flex-1">
            {[
              { id: 'c1', label: 'I consent to share my medical history with the attending doctor' },
              { id: 'c2', label: 'I understand my data will be stored securely as per hospital policy' },
              { id: 'c3', label: 'I confirm the information provided is accurate to the best of my knowledge' }
            ].map(item => (
              <label key={item.id} className="flex items-start gap-6 cursor-pointer group min-h-[60px] p-4 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all">
                <div className="relative flex items-center justify-center w-8 h-8 mt-1 border-4 border-gray-300 rounded shrink-0 group-hover:border-[#0F4C75] transition-colors">
                  <input 
                    type="checkbox" 
                    className="opacity-0 absolute w-full h-full cursor-pointer"
                    checked={consents[item.id]}
                    onChange={(e) => setConsents({...consents, [item.id]: e.target.checked})}
                  />
                  {consents[item.id] && (
                    <div className="absolute inset-0 bg-[#0F4C75] rounded-[2px] m-[3px]" />
                  )}
                </div>
                <span className="text-2xl leading-tight text-gray-700">{item.label}</span>
              </label>
            ))}
          </div>

          <div className="mt-auto">
            <button
              onClick={handleContinue}
              disabled={!canProceed}
              className={`w-full py-6 text-2xl font-bold rounded-xl min-h-[80px] transition-all shadow-md ${canProceed ? 'bg-[#0F4C75] text-white hover:bg-blue-900 active:scale-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
