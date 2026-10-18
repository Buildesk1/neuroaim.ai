import { useState } from 'react';
import type { SensitivityProfile } from './types/sensitivity';
import { calculateBalancedProfile } from './utils/sensitivityEngine';
import { Navbar } from './components/Navbar';
import { SensitivityCalculator } from './components/SensitivityCalculator';
import { ProPresetComparison } from './components/ProPresetComparison';
import { AiDiagnosticChatDrawer } from './components/AiDiagnosticChatDrawer';
import { Crosshair } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'preset' | 'diagnostic'>('calculator');
  const [profile, setProfile] = useState<SensitivityProfile>(calculateBalancedProfile(47, 273));
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatInitialQuery, setChatInitialQuery] = useState<string>('');

  const handleOpenChatWithQuery = (query: string) => {
    setChatInitialQuery(query);
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Hero Header */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs mb-1">
              <Crosshair className="w-4 h-4" />
              <span>CODM Aim Telemetry & FOV Scaling Matrix</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-cyan-200 to-teal-300">
              NeuroAim.AI Engine
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Mathematically balanced sensitivity calibration, high-precision FOV inverse-scaling, and conversational AI aim diagnostics for competitive Call of Duty: Mobile players.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-900/90 p-3 rounded-2xl border border-slate-800 shrink-0">
            <div className="text-right font-mono">
              <span className="text-[10px] text-slate-400 block uppercase">Active Red Dot Anchor</span>
              <span className="text-xl font-bold text-cyan-400">{profile.redDotCamera}</span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-right font-mono">
              <span className="text-[10px] text-slate-400 block uppercase">Acceleration</span>
              <span className="text-xl font-bold text-teal-400">{profile.accelerationValue}</span>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'calculator' && (
          <SensitivityCalculator
            profile={profile}
            onChange={setProfile}
            onOpenChatWithQuery={handleOpenChatWithQuery}
          />
        )}

        {activeTab === 'preset' && (
          <ProPresetComparison
            currentProfile={profile}
            onApplyPreset={(newProfile) => {
              setProfile(newProfile);
              setActiveTab('calculator');
            }}
          />
        )}
      </main>

      {/* AI Diagnostic Chat Drawer */}
      <AiDiagnosticChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentProfile={profile}
        onApplyRecommendedProfile={(recommended) => {
          setProfile(recommended);
        }}
        initialQuery={chatInitialQuery}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <span>NeuroAim.AI v2.4 • CODM Sensitivity & Aim Diagnostic Coach</span>
          <span>Powered by 47 Anchor Model & Gemini API</span>
        </div>
      </footer>

    </div>
  );
}

export default App;
