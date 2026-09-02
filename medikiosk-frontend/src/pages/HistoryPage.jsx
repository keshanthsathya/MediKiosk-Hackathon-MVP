import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKiosk } from '../context/KioskContext';
import BackButton from '../components/BackButton';
import AudioPrompt from '../components/AudioPrompt';

const STEPS = [
  { key: 'complaint',     title: 'Chief Complaint',     prompt: 'What is your main health concern today?' },
  { key: 'onset',         title: 'Onset & Duration',     prompt: 'When did this problem start?' },
  { key: 'symptoms',      title: 'Symptoms',             prompt: 'Select any symptoms you are experiencing' },
  { key: 'pastHistory',   title: 'Past Medical History', prompt: 'Do you have any previous medical conditions?' },
  { key: 'medicines',     title: 'Current Medicines',    prompt: 'Are you currently taking any medicines?' },
  { key: 'allergies',     title: 'Allergies',            prompt: 'Do you have any known allergies?' },
  { key: 'familyHistory', title: 'Family History',       prompt: 'Any significant medical conditions in your family?' },
];

const SYMPTOM_LIST = ['Fever', 'Headache', 'Cough', 'Body Pain', 'Fatigue', 'Nausea', 'Dizziness', 'Breathing Difficulty', 'Chest Pain', 'Stomach Pain', 'Joint Pain', 'Skin Rash'];
const DURATIONS = ['Today', 'Past week', 'Past month', 'More than a month', 'Not sure'];

export default function HistoryPage() {
  const navigate = useNavigate();
  const { history, updateHistory, t } = useKiosk();
  const [currentStep, setCurrentStep] = useState(history?.step || 0);
  const [formData, setFormData] = useState({
    complaint: history?.complaint || '',
    onset: history?.onset || '',
    symptoms: history?.symptoms || [],
    pastHistory: history?.pastHistory || '',
    medicines: history?.medicines || '',
    allergies: history?.allergies || '',
    familyHistory: history?.familyHistory || '',
    isAyushEnabled: history?.isAyushEnabled || false,
    ayush: history?.ayush || {
      vata: 50, pitta: 50, kapha: 50,
      diet: '', bowel: '', sleep: ''
    }
  });
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  const sendChat = async () => {
    const message = chatInput.trim();
    if (!message || chatLoading) return;
    setChatInput('');
    const nextMessages = [...chatMessages, { role: 'user', text: message }];
    setChatMessages(nextMessages);
    setChatLoading(true);
    try {
      const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
      const response = await fetch(`${base}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message, turn: chatMessages.filter(m => m.role === 'assistant').length }) });
      const data = await response.json();
      setChatMessages([...nextMessages, { role: 'assistant', text: data.reply }]);
      if (data.emergency) updateHistory({ priority: true });
    } catch {
      setChatMessages([...nextMessages, { role: 'assistant', text: 'Please continue with the guided questions below. A staff member can assist if needed.' }]);
    } finally { setChatLoading(false); }
  };

  const stepDef = currentStep === 0 ? { ...STEPS[currentStep], title: t('chiefComplaint'), prompt: t('mainConcern') } : STEPS[currentStep];

  const handleNext = () => {
    updateHistory({ ...formData, step: currentStep + 1 });
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      navigate('/upload');
    }
  };

  const handlePrev = () => {
    updateHistory({ ...formData, step: currentStep - 1 });
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate('/consent');
    }
  };

  const handleFieldChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const toggleSymptom = (sym) => {
    setFormData(prev => {
      const current = prev.symptoms;
      if (current.includes(sym)) {
        return { ...prev, symptoms: current.filter(s => s !== sym) };
      } else {
        return { ...prev, symptoms: [...current, sym] };
      }
    });
  };

  const handleAyushChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      ayush: { ...prev.ayush, [key]: value }
    }));
  };

  return (
    <div className="flex flex-col h-full bg-[#FFFFFF] text-[#1A1A2E] p-6 relative">
      <BackButton onClick={handlePrev} />
      
      {/* Progress Bar */}
      <div className="w-full flex mt-16 mb-8 gap-2">
        {STEPS.map((_, i) => (
          <div key={i} className={`flex-1 h-3 rounded-full transition-colors ${i <= currentStep ? 'bg-[#0F4C75]' : 'bg-gray-200'}`} />
        ))}
      </div>

      <div className="flex-1 overflow-y-auto animate-fade-in" key={currentStep}>
        <div className="flex items-center mb-6 gap-4">
          <h1 className="text-4xl font-bold">{stepDef.title}</h1>
          <AudioPrompt text={stepDef.prompt} />
        </div>
        <p className="text-2xl mb-8">{stepDef.prompt}</p>

        {stepDef.key === 'complaint' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <textarea className="w-full h-64 p-4 text-2xl border-2 border-gray-300 rounded-lg focus:border-[#0F4C75] focus:outline-none" value={formData.complaint} onChange={(e) => handleFieldChange('complaint', e.target.value)} placeholder="Type here..." />
            <div className="rounded-2xl border-2 border-blue-100 bg-blue-50 p-5 flex flex-col min-h-64">
              <div className="font-bold text-xl text-[#0F4C75] mb-3">AI intake assistant</div>
              <div className="flex-1 space-y-2 overflow-y-auto mb-3 text-base">
                {chatMessages.length === 0 && <p className="text-gray-600">Share your concern in your own words. I’ll ask one simple follow-up question at a time.</p>}
                {chatMessages.map((m, i) => <div key={i} className={`p-2 rounded-lg ${m.role === 'user' ? 'bg-white ml-8' : 'bg-[#0F4C75] text-white mr-8'}`}>{m.text}</div>)}
              </div>
              <div className="flex gap-2"><input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChat()} className="flex-1 p-3 rounded-lg border bg-white" placeholder="Type your answer..." /><button onClick={sendChat} className="px-5 rounded-lg bg-[#0F4C75] text-white font-bold">Send</button></div>
              {chatLoading && <span className="text-sm text-gray-500 mt-2">Assistant is thinking…</span>}
            </div>
          </div>
        )}

        {stepDef.key === 'onset' && (
          <div className="flex flex-col gap-4">
            {DURATIONS.map(d => (
              <label key={d} className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50">
                <input
                  type="radio"
                  name="onset"
                  className="w-8 h-8"
                  checked={formData.onset === d}
                  onChange={() => handleFieldChange('onset', d)}
                />
                <span className="text-2xl">{d}</span>
              </label>
            ))}
          </div>
        )}

        {stepDef.key === 'symptoms' && (
          <div className="grid grid-cols-3 gap-6">
            {SYMPTOM_LIST.map(sym => {
              const isSelected = formData.symptoms.includes(sym);
              return (
                <button
                  key={sym}
                  onClick={() => toggleSymptom(sym)}
                  className={`min-h-[60px] text-xl font-medium rounded-full border-2 transition-colors flex items-center justify-center ${
                    isSelected 
                      ? 'bg-[#0F4C75] border-[#0F4C75] text-white' 
                      : 'border-gray-300 text-[#1A1A2E] hover:border-[#0F4C75]'
                  }`}
                >
                  {sym}
                </button>
              );
            })}
          </div>
        )}

        {['pastHistory', 'medicines', 'allergies', 'familyHistory'].includes(stepDef.key) && (
          <textarea
            className="w-full h-64 p-4 text-2xl border-2 border-gray-300 rounded-lg focus:border-[#0F4C75] focus:outline-none"
            value={formData[stepDef.key]}
            onChange={(e) => handleFieldChange(stepDef.key, e.target.value)}
            placeholder="Type here (optional)..."
          />
        )}

        {stepDef.key === 'familyHistory' && (
          <div className="mt-12 p-6 bg-blue-50 border-2 border-[#0F4C75] rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">AYUSH Assessment Mode</h3>
              <label className="relative inline-flex items-center cursor-pointer min-h-[60px]">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={formData.isAyushEnabled}
                  onChange={(e) => handleFieldChange('isAyushEnabled', e.target.checked)}
                />
                <div className="w-16 h-8 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#0F4C75]"></div>
                <span className="ml-4 text-xl font-medium">Enable AYUSH Mode</span>
              </label>
            </div>
            
            {formData.isAyushEnabled && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <p className="text-xl font-semibold mb-4">Prakriti (Constitution)</p>
                  <div className="space-y-4">
                    {['vata', 'pitta', 'kapha'].map(dosha => (
                      <div key={dosha} className="flex items-center gap-4">
                        <span className="w-20 text-lg capitalize font-medium">{dosha}</span>
                        <input 
                          type="range" 
                          min="0" max="100" 
                          value={formData.ayush[dosha]}
                          onChange={(e) => handleAyushChange(dosha, Number(e.target.value))}
                          className="flex-1 min-h-[60px] cursor-pointer"
                        />
                        <span className="w-12 text-lg text-right font-medium">{formData.ayush[dosha]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xl font-semibold mb-4">Diet Type</p>
                  <div className="flex gap-4">
                    {['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Other'].map(opt => (
                      <label key={opt} className="flex items-center gap-2 p-2 bg-white rounded-lg border min-h-[60px] px-4 cursor-pointer hover:bg-gray-50">
                        <input type="radio" name="ayush_diet" className="w-6 h-6" 
                          checked={formData.ayush.diet === opt}
                          onChange={() => handleAyushChange('diet', opt)}
                        />
                        <span className="text-lg">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xl font-semibold mb-4">Bowel Habits</p>
                  <div className="flex gap-4">
                    {['Regular', 'Constipation', 'Loose', 'Irregular'].map(opt => (
                      <label key={opt} className="flex items-center gap-2 p-2 bg-white rounded-lg border min-h-[60px] px-4 cursor-pointer hover:bg-gray-50">
                        <input type="radio" name="ayush_bowel" className="w-6 h-6"
                          checked={formData.ayush.bowel === opt}
                          onChange={() => handleAyushChange('bowel', opt)}
                        />
                        <span className="text-lg">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xl font-semibold mb-4">Sleep Pattern</p>
                  <div className="flex gap-4">
                    {['Good', 'Disturbed', 'Insomnia', 'Excess'].map(opt => (
                      <label key={opt} className="flex items-center gap-2 p-2 bg-white rounded-lg border min-h-[60px] px-4 cursor-pointer hover:bg-gray-50">
                        <input type="radio" name="ayush_sleep" className="w-6 h-6"
                          checked={formData.ayush.sleep === opt}
                          onChange={() => handleAyushChange('sleep', opt)}
                        />
                        <span className="text-lg">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={handlePrev}
          className="min-h-[60px] min-w-[200px] text-2xl font-bold bg-gray-200 text-[#1A1A2E] rounded-lg shadow-sm hover:bg-gray-300 transition-colors"
        >
          {t('previous')}
        </button>
        <button
          onClick={handleNext}
          className="min-h-[60px] min-w-[200px] text-2xl font-bold bg-[#0F4C75] text-white rounded-lg shadow-md hover:bg-blue-800 transition-colors"
        >
          {currentStep === STEPS.length - 1 ? 'Continue to Upload' : t('next')}
        </button>
      </div>
    </div>
  );
}
