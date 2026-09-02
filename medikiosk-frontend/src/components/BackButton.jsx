import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

export default function BackButton({ to }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => (to ? navigate(to) : navigate(-1))}
      className="flex items-center gap-2 px-4 py-3 text-[#0F4C75] hover:bg-[#0F4C75]/5 rounded-xl transition-colors min-h-[48px]"
    >
      <FiArrowLeft size={22} />
      <span className="font-medium">Back</span>
    </button>
  );
}
