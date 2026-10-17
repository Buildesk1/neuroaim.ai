import React from 'react';
import { Shield, Cpu, Activity, MessageSquare } from 'lucide-react';

interface NavbarProps {
  activeTab: 'calculator' | 'preset' | 'diagnostic';
  setActiveTab: (tab: 'calculator' | 'preset' | 'diagnostic') => void;
  onOpenChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenChat }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-cyan-900/40 px-4 lg:px-8 py-3.5 shadow-lg shadow-cyan-950/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('calculator')}>
          <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/30 text-cyan-400">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                Caliber.ai
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                CODM v2.4
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">Sensitivity & Aim Calibrator</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
              activeTab === 'calculator'
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md shadow-cyan-900/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Sensitivity Calculator</span>
          </button>

          <button
            onClick={() => setActiveTab('preset')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
              activeTab === 'preset'
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md shadow-cyan-900/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Pro Benchmarks</span>
          </button>
        </nav>

        {/* AI Assistant Button */}
        <button
          onClick={onOpenChat}
          className="relative group px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-sm shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center space-x-2"
        >
          <MessageSquare className="w-4 h-4 fill-slate-950" />
          <span>AI Coach Chat</span>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </button>
      </div>
    </header>
  );
};
