import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKiosk } from '../context/KioskContext';
import BackButton from '../components/BackButton';
import AudioPrompt from '../components/AudioPrompt';
import { FiUploadCloud, FiX, FiFile } from 'react-icons/fi';

export default function UploadPage() {
  const navigate = useNavigate();
  const { uploads, addUpload, removeUpload } = useKiosk();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        addUpload({
          id: Math.random().toString(36).substr(2, 9),
          file: file,
          name: file.name,
          type: file.type,
          dataUrl: event.target.result
        });
      };
      reader.readAsDataURL(file);
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDropzoneClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFFFF] text-[#1A1A2E] p-8">
      <BackButton to="/history" />
      
      <div className="max-w-5xl mx-auto w-full mt-4 flex-1 flex flex-col">
        <div className="mb-10 text-center flex flex-col items-center">
          <div className="flex items-center gap-6 mb-4">
            <h1 className="text-4xl font-bold">Upload Documents</h1>
            <AudioPrompt promptText="Please upload any previous medical documents or prescriptions." />
          </div>
          <p className="text-2xl text-gray-600">Upload any previous prescriptions, lab reports, or medical records</p>
        </div>

        <div 
          onClick={handleDropzoneClick}
          className="border-4 border-dashed border-gray-300 rounded-3xl p-16 flex flex-col items-center justify-center bg-gray-50 hover:bg-blue-50 hover:border-[#0F4C75] transition-all cursor-pointer min-h-[300px] mb-8 group"
        >
          <FiUploadCloud className="text-8xl text-gray-400 mb-6 group-hover:text-[#0F4C75] transition-colors" />
          <p className="text-3xl font-medium text-gray-600 group-hover:text-[#0F4C75]">Tap to upload or take a photo</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*,.pdf" 
            multiple 
            className="hidden" 
          />
        </div>

        {uploads && uploads.length > 0 && (
          <div className="grid grid-cols-4 gap-6 mb-8 overflow-y-auto max-h-[300px] p-4 -m-4">
            {uploads.map(upload => (
              <div key={upload.id} className="relative bg-white p-4 rounded-xl shadow-md border border-gray-200 flex flex-col">
                <button 
                  onClick={(e) => { e.stopPropagation(); removeUpload(upload.id); }}
                  className="absolute -top-4 -right-4 bg-[#E63946] text-white rounded-full p-2 hover:scale-110 transition-transform shadow-lg z-10 min-w-[48px] min-h-[48px] flex items-center justify-center"
                >
                  <FiX size={24} />
                </button>
                <div className="h-32 flex items-center justify-center bg-gray-100 rounded-lg mb-3 overflow-hidden">
                  {upload.type.startsWith('image/') ? (
                    <img src={upload.dataUrl} alt={upload.name} className="object-cover w-full h-full" />
                  ) : (
                    <FiFile className="text-5xl text-gray-400" />
                  )}
                </div>
                <p className="text-sm font-medium truncate w-full px-1 text-center text-gray-700">{upload.name}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-auto flex flex-col items-center gap-6 pb-6">
          <button
            onClick={() => navigate('/confirmation')}
            className="w-full max-w-2xl py-6 text-2xl font-bold bg-[#0F4C75] text-white rounded-xl min-h-[80px] shadow-lg hover:bg-blue-900 active:scale-95 transition-all"
          >
            Continue
          </button>
          <button 
            onClick={() => navigate('/confirmation')}
            className="text-xl font-medium text-gray-500 hover:text-[#0F4C75] min-h-[60px] px-8 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
