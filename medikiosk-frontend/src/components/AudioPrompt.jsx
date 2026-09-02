import { FiVolume2 } from 'react-icons/fi';

export default function AudioPrompt({ label }) {
  const handlePlay = () => {
    // Placeholder for future TTS integration
    console.log(`[TTS] Would speak: "${label}"`);
  };

  return (
    <button
      onClick={handlePlay}
      title={`Listen: ${label}`}
      className="inline-flex items-center justify-center w-9 h-9 rounded-full text-[#0F4C75]/60 hover:text-[#0F4C75] hover:bg-[#0F4C75]/10 transition-colors"
    >
      <FiVolume2 size={18} />
    </button>
  );
}
