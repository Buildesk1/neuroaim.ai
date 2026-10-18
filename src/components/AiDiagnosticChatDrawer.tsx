import React, { useState, useRef, useEffect } from 'react';
import type { SensitivityProfile, DiagnosticResult } from '../types/sensitivity';
import { diagnoseAimSymptoms } from '../utils/sensitivityEngine';
import { X, Send, Bot, Sparkles, Check, Zap } from 'lucide-react';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: SensitivityProfile;
  onApplyRecommendedProfile: (profile: SensitivityProfile) => void;
  initialQuery?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  diagnostic?: DiagnosticResult;
}

export const AiDiagnosticChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onApplyRecommendedProfile,
  initialQuery,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: `Greetings Commander! I am your NeuroAim.AI Technical Coach. Describe your aim issue (e.g. "hands shake in fights", "over-flicking past enemies", or "cannot pull down vertical recoil") and I will compute an optimized profile adjustment.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  useEffect(() => {
    if (initialQuery && isOpen) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setLoading(true);

    try {
      // Call backend API endpoint or fallback to rule engine
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          currentProfile,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: data.reply || data.immediateDiagnosis,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          diagnostic: data.diagnosticResult,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error('Fallback to local engine');
      }
    } catch (err) {
      // Offline / Local Diagnostic Decision Tree Fallback
      const lower = query.toLowerCase();
      const symptoms = {
        handShake: lower.includes('shake') || lower.includes('jitter') || lower.includes('nervous'),
        overFlicking: lower.includes('flick') || lower.includes('past') || lower.includes('overshoot'),
        recoilSlip: lower.includes('recoil') || lower.includes('pull') || lower.includes('vertical'),
        longRangeUnderTrack: lower.includes('track') || lower.includes('far') || lower.includes('sluggish'),
      };

      const result = diagnoseAimSymptoms(currentProfile, symptoms);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: result.immediateDiagnosis,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        diagnostic: result,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-lg bg-slate-950 border-l border-cyan-900/40 h-full flex flex-col shadow-2xl relative">

        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/30 text-cyan-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm flex items-center space-x-2">
                <span>AI Aim Coach</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Online
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">Powered by Gemini & 47 Anchor Model</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex space-x-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs space-y-3 ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-slate-950 font-medium font-sans shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-200'
                }`}
              >
                <div className="flex justify-between items-center text-[10px] opacity-70 mb-1 font-mono">
                  <span>{msg.sender === 'user' ? 'You' : 'NeuroAim Coach'}</span>
                  <span>{msg.timestamp}</span>
                </div>

                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                {/* Diagnostic Result Prescription Card */}
                {msg.diagnostic && (
                  <div className="mt-3 pt-3 border-t border-slate-800 space-y-3">
                    <div className="bg-slate-950/80 p-3 rounded-xl border border-cyan-900/40 space-y-2">
                      <div className="flex items-center space-x-1.5 text-cyan-400 font-mono font-bold text-[11px]">
                        <Zap className="w-3.5 h-3.5" />
                        <span>Prescriptive Delta Calibration</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                        <div className="bg-slate-900 p-2 rounded border border-slate-800">
                          <span className="text-slate-400 block text-[10px]">Acceleration</span>
                          <span className="text-cyan-400 font-bold">
                            {msg.diagnostic.recommendedProfile.accelerationValue}
                          </span>
                        </div>
                        <div className="bg-slate-900 p-2 rounded border border-slate-800">
                          <span className="text-slate-400 block text-[10px]">Red Dot Camera</span>
                          <span className="text-cyan-400 font-bold">
                            {msg.diagnostic.recommendedProfile.redDotCamera}
                          </span>
                        </div>
                        <div className="bg-slate-900 p-2 rounded border border-slate-800">
                          <span className="text-slate-400 block text-[10px]">ADS Firing</span>
                          <span className="text-emerald-400 font-bold">
                            {msg.diagnostic.recommendedProfile.adsFiring}
                          </span>
                        </div>
                        <div className="bg-slate-900 p-2 rounded border border-slate-800">
                          <span className="text-slate-400 block text-[10px]">Gyro ADS</span>
                          <span className="text-teal-400 font-bold">
                            {msg.diagnostic.recommendedProfile.redDotGyro}
                          </span>
                        </div>
                      </div>

                      {msg.diagnostic.mathExplanation.length > 0 && (
                        <div className="text-[10px] text-slate-400 space-y-1 mt-2">
                          {msg.diagnostic.mathExplanation.map((exp, idx) => (
                            <p key={idx} className="flex items-start space-x-1">
                              <span className="text-cyan-400">•</span>
                              <span>{exp}</span>
                            </p>
                          ))}
                        </div>
                      )}

                      <button
                        onClick={() => onApplyRecommendedProfile(msg.diagnostic!.recommendedProfile)}
                        className="w-full mt-2 py-2 px-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono font-bold transition flex items-center justify-center space-x-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Apply Recommended Profile</span>
                      </button>
                    </div>

                    {/* Drill Card */}
                    <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] font-mono font-bold text-teal-400 block mb-1">
                        🎯 {msg.diagnostic.inGameDrill.title}
                      </span>
                      <ul className="text-[10px] text-slate-400 space-y-1">
                        {msg.diagnostic.inGameDrill.steps.map((step, idx) => (
                          <li key={idx}>• {step}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800 w-max">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Analyzing telemetry & FOV inverse scaling...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/90">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Describe your aim issue (e.g. over-flicking)..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || loading}
              className="p-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold rounded-xl disabled:opacity-50 hover:shadow-lg hover:shadow-cyan-500/20 transition"
            >
              <Send className="w-4 h-4 fill-slate-950" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
