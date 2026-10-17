import React, { useState } from 'react';
import type { SensitivityProfile } from '../types/sensitivity';
import { PRO_PRESETS } from '../utils/sensitivityEngine';
import { Shield, Check, Smartphone, Tablet } from 'lucide-react';

interface ProPresetComparisonProps {
  currentProfile: SensitivityProfile;
  onApplyPreset: (profile: SensitivityProfile) => void;
}

export const ProPresetComparison: React.FC<ProPresetComparisonProps> = ({
  currentProfile,
  onApplyPreset,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRO_PRESETS[0].id);

  const selectedPreset = PRO_PRESETS.find((p) => p.id === selectedPresetId) || PRO_PRESETS[0];

  const calculateDelta = (current: number, target: number) => {
    const diff = target - current;
    if (diff === 0) return <span className="text-slate-500 font-mono text-xs">Match</span>;
    if (diff > 0) return <span className="text-emerald-400 font-mono text-xs font-semibold">+{diff}</span>;
    return <span className="text-rose-400 font-mono text-xs font-semibold">{diff}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 mb-1">
              <Shield className="w-5 h-5" />
              <span className="font-mono text-xs font-semibold uppercase tracking-wider">Benchmark Matrix</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100">Pro Preset Benchmarks & Side-by-Side Delta</h2>
            <p className="text-sm text-slate-400 mt-1">
              Compare your active sensitivity numbers against competitive role benchmarks (Aggressive Entry, Anchor Sniper, Balanced 47).
            </p>
          </div>

          {/* Preset Selector Pills */}
          <div className="flex flex-wrap gap-2">
            {PRO_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setSelectedPresetId(preset.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  selectedPresetId === preset.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-md shadow-cyan-950'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/50'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preset Details Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-slate-100">{selectedPreset.name}</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              {selectedPreset.role}
            </span>
          </div>
          <p className="text-xs text-slate-400 flex items-center space-x-3">
            <span>Player: <strong className="text-slate-200">{selectedPreset.player}</strong></span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              {selectedPreset.device === 'Phone' ? <Smartphone className="w-3 h-3 text-cyan-400" /> : <Tablet className="w-3 h-3 text-cyan-400" />}
              <span>{selectedPreset.device}</span>
            </span>
            <span>•</span>
            <span>Layout: <strong className="text-slate-200">{selectedPreset.layout}</strong></span>
          </p>
          <p className="text-xs text-slate-500 italic mt-1">{selectedPreset.profile.notes}</p>
        </div>

        <button
          onClick={() => onApplyPreset(selectedPreset.profile)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold text-xs hover:shadow-lg hover:shadow-cyan-500/20 transition-all flex items-center space-x-2 shrink-0"
        >
          <Check className="w-4 h-4" />
          <span>Apply Preset Profile</span>
        </button>
      </div>

      {/* Comparison Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono text-xs">
                <th className="p-4 font-semibold">Parameter Category</th>
                <th className="p-4 font-semibold text-cyan-400">Your Active Profile</th>
                <th className="p-4 font-semibold text-teal-400">{selectedPreset.name}</th>
                <th className="p-4 font-semibold text-slate-300">Delta Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {/* Rotation */}
              <tr className="hover:bg-slate-800/30">
                <td className="p-4 text-slate-300 font-sans font-medium">Rotation Mode</td>
                <td className="p-4 text-slate-200">{currentProfile.rotationMode}</td>
                <td className="p-4 text-teal-300">{selectedPreset.profile.rotationMode}</td>
                <td className="p-4 text-slate-500">—</td>
              </tr>
              <tr className="hover:bg-slate-800/30 bg-slate-950/20">
                <td className="p-4 text-slate-300 font-sans font-medium">Acceleration Value</td>
                <td className="p-4 text-cyan-400 font-bold">{currentProfile.accelerationValue}</td>
                <td className="p-4 text-teal-400 font-bold">{selectedPreset.profile.accelerationValue}</td>
                <td className="p-4">{calculateDelta(currentProfile.accelerationValue, selectedPreset.profile.accelerationValue)}</td>
              </tr>

              {/* Camera */}
              <tr className="hover:bg-slate-800/30">
                <td className="p-4 text-slate-300 font-sans font-medium">Third Person (TPP) Camera</td>
                <td className="p-4 text-slate-200">{currentProfile.tppCamera}</td>
                <td className="p-4 text-slate-200">{selectedPreset.profile.tppCamera}</td>
                <td className="p-4">{calculateDelta(currentProfile.tppCamera, selectedPreset.profile.tppCamera)}</td>
              </tr>
              <tr className="hover:bg-slate-800/30 bg-cyan-950/20">
                <td className="p-4 text-cyan-300 font-sans font-bold">Red Dot / Holo (Anchor)</td>
                <td className="p-4 text-cyan-400 font-extrabold">{currentProfile.redDotCamera}</td>
                <td className="p-4 text-teal-400 font-extrabold">{selectedPreset.profile.redDotCamera}</td>
                <td className="p-4">{calculateDelta(currentProfile.redDotCamera, selectedPreset.profile.redDotCamera)}</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="p-4 text-slate-300 font-sans font-medium">Standard Iron ADS Camera</td>
                <td className="p-4 text-slate-200">{currentProfile.adsCamera}</td>
                <td className="p-4 text-slate-200">{selectedPreset.profile.adsCamera}</td>
                <td className="p-4">{calculateDelta(currentProfile.adsCamera, selectedPreset.profile.adsCamera)}</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="p-4 text-slate-300 font-sans font-medium">Sniper Scope Camera</td>
                <td className="p-4 text-slate-200">{currentProfile.sniperCamera}</td>
                <td className="p-4 text-slate-200">{selectedPreset.profile.sniperCamera}</td>
                <td className="p-4">{calculateDelta(currentProfile.sniperCamera, selectedPreset.profile.sniperCamera)}</td>
              </tr>

              {/* Firing */}
              <tr className="hover:bg-slate-800/30 bg-slate-950/20">
                <td className="p-4 text-emerald-400 font-sans font-medium">Red Dot Firing</td>
                <td className="p-4 text-slate-200">{currentProfile.redDotFiring}</td>
                <td className="p-4 text-slate-200">{selectedPreset.profile.redDotFiring}</td>
                <td className="p-4">{calculateDelta(currentProfile.redDotFiring, selectedPreset.profile.redDotFiring)}</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="p-4 text-emerald-400 font-sans font-medium">Standard ADS Firing</td>
                <td className="p-4 text-slate-200">{currentProfile.adsFiring}</td>
                <td className="p-4 text-slate-200">{selectedPreset.profile.adsFiring}</td>
                <td className="p-4">{calculateDelta(currentProfile.adsFiring, selectedPreset.profile.adsFiring)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
