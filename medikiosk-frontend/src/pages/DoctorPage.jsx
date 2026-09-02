import { useEffect, useState } from 'react';
import { FiActivity, FiBell, FiRefreshCw } from 'react-icons/fi';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export default function DoctorPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadAlerts = () => {
    setLoading(true);
    fetch(`${API_BASE}/api/sos`).then((r) => r.json()).then((data) => setAlerts(data.alerts || [])).catch(() => setAlerts([])).finally(() => setLoading(false));
  };
  useEffect(() => { loadAlerts(); }, []);
  return <div className="min-h-screen bg-[#F4F6F8] p-8 text-[#1A1A2E]"><div className="max-w-6xl mx-auto">
    <header className="flex items-center justify-between mb-8"><div><div className="flex items-center gap-3 text-[#0F4C75]"><FiActivity size={32}/><h1 className="text-4xl font-bold">MediKiosk Doctor Portal</h1></div><p className="text-lg text-gray-600 mt-2">Live emergency notifications from the patient kiosk</p></div><button onClick={loadAlerts} className="flex items-center gap-2 px-5 py-3 bg-white rounded-xl shadow border font-semibold"><FiRefreshCw/> Refresh</button></header>
    <section className="bg-white rounded-2xl shadow border p-8"><div className="flex items-center gap-3 mb-6"><FiBell className="text-[#E63946]" size={28}/><h2 className="text-2xl font-bold">SOS Alerts</h2><span className="ml-auto rounded-full bg-red-100 text-red-700 px-3 py-1 font-bold">{alerts.length} active</span></div>
      {loading ? <p>Loading alerts...</p> : alerts.length === 0 ? <p className="text-gray-600 py-8 text-center">No emergency alerts right now.</p> : <div className="space-y-4">{alerts.map((alert) => <article key={alert.id} className="border-l-4 border-[#E63946] bg-red-50 rounded-xl p-5"><div className="flex justify-between"><strong>Emergency SOS</strong><span>{new Date(alert.created_at).toLocaleString()}</span></div><p className="mt-2">Token: {alert.token || 'Unidentified patient'} · Language: {alert.language || 'en'}</p></article>)}</div>}
    </section></div></div>;
}
