import { Routes, Route, Navigate } from 'react-router-dom';
import { KioskProvider } from './context/KioskContext';
import TopBar from './components/TopBar';
import SOSButton from './components/SOSButton';
import LanguagePage from './pages/LanguagePage';
import ConsentPage from './pages/ConsentPage';
import HistoryPage from './pages/HistoryPage';
import UploadPage from './pages/UploadPage';
import ConfirmationPage from './pages/ConfirmationPage';

export default function App() {
  return (
    <KioskProvider>
      <div className="h-full flex flex-col bg-surface-alt">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/language" replace />} />
            <Route path="/language" element={<LanguagePage />} />
            <Route path="/consent" element={<ConsentPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
          </Routes>
        </main>
        <SOSButton />
      </div>
    </KioskProvider>
  );
}
