import { useState, useEffect } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import { useKiosk } from '../context/KioskContext';

export default function SOSButton() {
  const [showAlert, setShowAlert] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [status, setStatus] = useState('');
  const { state } = useKiosk();

  useEffect(() => {
    let timer;
    if (showAlert && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setShowAlert(false);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [showAlert, countdown]);

  const handleSOSClick = () => {
    setCountdown(5);
    setShowAlert(true);
    setStatus('Contacting hospital staff...');
    const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
    fetch(`${base}/api/sos`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ language: state.language, token: state.token, history: state.history }) })
      .then((response) => setStatus(response.ok ? 'Staff notification sent.' : 'Alert shown locally.'))
      .catch(() => setStatus('Alert shown locally; please contact staff immediately.'));
  };

  const handleCancel = () => {
    setShowAlert(false);
  };

  return (
    <>
      <button
        onClick={handleSOSClick}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-[#E63946] flex items-center justify-center shadow-lg animate-pulse-sos z-40 transition-transform active:scale-95"
        aria-label="Emergency SOS"
      >
        <FiAlertTriangle size={32} className="text-white" />
      </button>

      {showAlert && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 flex flex-col items-center text-center shadow-2xl">
            <div className="w-20 h-20 bg-[#E63946]/10 rounded-full flex items-center justify-center mb-6">
              <FiAlertTriangle size={48} className="text-[#E63946]" />
            </div>
            <h2 className="text-3xl font-bold text-[#1A1A2E] mb-4">EMERGENCY ALERT</h2>
            <p className="text-lg text-[#1A1A2E]/80 mb-8">
              {status}
            </p>
            <div className="text-6xl font-bold text-[#E63946] mb-8">
              {countdown}
            </div>
            <button
              onClick={handleCancel}
              className="px-8 py-4 bg-gray-100 text-[#1A1A2E] rounded-xl font-medium text-lg hover:bg-gray-200 transition-colors min-w-[160px] min-h-[60px]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
