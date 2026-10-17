import React from 'react';
import type { SensitivityProfile } from '../types/sensitivity';
import { Sliders, RefreshCw, Crosshair, Zap } from 'lucide-react';
import { calculateBalancedProfile } from '../utils/sensitivityEngine';

interface CalculatorProps {
  profile: SensitivityProfile;
  onChange: (updated: SensitivityProfile) => void;
  onOpenChatWithQuery?: (query: string) => void;
}

export const SensitivityCalculator: React.FC<CalculatorProps> = ({
  profile,
  onChange,
  onOpenChatWithQuery,
}) => {
  const [autoBalance, setAutoBalance] = React.useState<boolean>(true);

  const handleAnchorChange = (newAnchor: number) => {
    if (autoBalance) {
      const balanced = calculateBalancedProfile(newAnchor, profile.accelerationValue, profile.rotationMode);
      onChange(balanced);
    } else {
      onChange({ ...profile, redDotCamera: newAnchor });
    }
  };

  const handleSliderChange = (key: keyof SensitivityProfile, value: number | string) => {
    if (key === 'redDotCamera' && autoBalance && typeof value === 'number') {
      handleAnchorChange(value);
      return;
    }
    onChange({ ...profile, [key]: value });
  };

  const handleResetTo47 = () => {
    const defaultProfile = calculateBalancedProfile(47, 273, 'Speed Acceleration');
    onChange(defaultProfile);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 mb-1">
              <Zap className="w-5 h-5 fill-cyan-400/20" />
              <span className="font-mono text-xs font-semibold uppercase tracking-wider">47 Anchor Model Engine</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100">Interactive Sensitivity Calibrator</h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Adjust your primary <span className="text-cyan-300 font-medium">Red Dot Anchor</span> or Acceleration value. When <span className="text-emerald-400 font-medium">Auto-Balance</span> is active, all optic tiers recalculate based on FOV inverse-scaling math.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Auto Balance Toggle */}
            <button
              type="button"
              onClick={() => setAutoBalance(!autoBalance)}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all border flex items-center space-x-2 ${
                autoBalance
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 shadow-md shadow-emerald-950'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${autoBalance ? 'animate-spin text-emerald-400' : ''}`} />
              <span>Auto-Balance Ratios: {autoBalance ? 'ON' : 'OFF'}</span>
            </button>

            {/* Reset Button */}
            <button
              type="button"
              onClick={handleResetTo47}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-mono font-medium transition-all"
            >
              Reset 47 Anchor
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Section 1: Rotation & Acceleration */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-5">
          <div className="flex items-center space-x-2 text-teal-400 pb-2 border-b border-slate-800">
            <Sliders className="w-5 h-5" />
            <h3 className="font-bold text-slate-200">1. Rotation & Speed Acceleration</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1.5">Rotation Mode</label>
              <select
                value={profile.rotationMode}
                onChange={(e) => handleSliderChange('rotationMode', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Speed Acceleration">Speed Acceleration (Recommended)</option>
                <option value="Fixed Speed">Fixed Speed</option>
                <option value="Distance Acceleration">Distance Acceleration</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-mono text-slate-300">Acceleration Value</span>
                <span className="font-mono text-sm font-bold text-cyan-400">{profile.accelerationValue}</span>
              </div>
              <input
                type="range"
                min="100"
                max="400"
                value={profile.accelerationValue}
                onChange={(e) => handleSliderChange('accelerationValue', parseInt(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
              <span className="text-[11px] text-slate-500 block mt-1">Recommended competitive range: 200 – 280</span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-mono text-slate-300">Vertical Turning Ratio</span>
                <span className="font-mono text-sm font-bold text-teal-400">{profile.verticalTurning}%</span>
              </div>
              <input
                type="range"
                min="80"
                max="150"
                value={profile.verticalTurning}
                onChange={(e) => handleSliderChange('verticalTurning', parseInt(e.target.value))}
                className="w-full accent-teal-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
              <span className="text-[11px] text-slate-500 block mt-1">Standard 1:1 match = 100%</span>
            </div>
          </div>
        </div>

        {/* Section 2: Camera Sensitivities */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2 text-cyan-400">
              <Crosshair className="w-5 h-5" />
              <h3 className="font-bold text-slate-200">2. Camera Sensitivity (Looking)</h3>
            </div>
            {autoBalance && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                Auto-Synced
              </span>
            )}
          </div>

          <div className="space-y-3">
            {/* Primary Red Dot Anchor */}
            <div className="bg-cyan-950/20 border border-cyan-800/40 rounded-xl p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-cyan-300">Red Dot / Holo (Anchor)</span>
                <span className="font-mono text-base font-extrabold text-cyan-400">{profile.redDotCamera}</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={profile.redDotCamera}
                onChange={(e) => handleSliderChange('redDotCamera', parseInt(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* TPP */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-mono text-slate-300">Third Person (TPP)</span>
                <span className="font-mono text-sm text-slate-200">{profile.tppCamera}</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={profile.tppCamera}
                onChange={(e) => handleSliderChange('tppCamera', parseInt(e.target.value))}
                className="w-full accent-slate-600 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Standard ADS */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-mono text-slate-300">Standard Iron ADS</span>
                <span className="font-mono text-sm text-slate-200">{profile.adsCamera}</span>
              </div>
              <input
                type="range"
                min="15"
                max="90"
                value={profile.adsCamera}
                onChange={(e) => handleSliderChange('adsCamera', parseInt(e.target.value))}
                className="w-full accent-slate-600 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Sniper Scope */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-mono text-slate-300">Sniper Scope</span>
                <span className="font-mono text-sm text-slate-200">{profile.sniperCamera}</span>
              </div>
              <input
                type="range"
                min="15"
                max="90"
                value={profile.sniperCamera}
                onChange={(e) => handleSliderChange('sniperCamera', parseInt(e.target.value))}
                className="w-full accent-slate-600 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Firing Sensitivities */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2 text-emerald-400">
              <Zap className="w-5 h-5" />
              <h3 className="font-bold text-slate-200">3. Firing Sensitivity (Recoil Drag)</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">~75-85% ratio</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-mono text-slate-300">Red Dot Firing</span>
                <span className="font-mono text-sm text-emerald-400 font-bold">{profile.redDotFiring}</span>
              </div>
              <input
                type="range"
                min="15"
                max="100"
                value={profile.redDotFiring}
                onChange={(e) => handleSliderChange('redDotFiring', parseInt(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-mono text-slate-300">Standard ADS Firing</span>
                <span className="font-mono text-sm text-slate-200">{profile.adsFiring}</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                value={profile.adsFiring}
                onChange={(e) => handleSliderChange('adsFiring', parseInt(e.target.value))}
                className="w-full accent-slate-600 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-mono text-slate-300">Sniper Firing</span>
                <span className="font-mono text-sm text-slate-200">{profile.sniperFiring}</span>
              </div>
              <input
                type="range"
                min="15"
                max="90"
                value={profile.sniperFiring}
                onChange={(e) => handleSliderChange('sniperFiring', parseInt(e.target.value))}
                className="w-full accent-slate-600 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Quick Diagnostic Trigger Shortcuts */}
            {onOpenChatWithQuery && (
              <div className="pt-3 border-t border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 block mb-2">Diagnose Aim Issues:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => onOpenChatWithQuery('My hands shake during tense fights')}
                    className="text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-700 transition"
                  >
                    Nervous Shake
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenChatWithQuery('I keep over-flicking past targets')}
                    className="text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-700 transition"
                  >
                    Over-flicking
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenChatWithQuery('I cannot control vertical recoil')}
                    className="text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-700 transition"
                  >
                    Recoil Control
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
