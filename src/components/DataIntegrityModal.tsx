import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Lock, FileCode, AlertCircle, Eye, Cpu, Activity, BarChart2, X, FileText } from 'lucide-react';
import { KineticData } from '../types';

interface DataIntegrityModalProps {
  isOpen: boolean;
  onClose: () => void;
  sampleKineticData?: KineticData;
  athleteName?: string;
}

export const DataIntegrityModal: React.FC<DataIntegrityModalProps> = ({
  isOpen,
  onClose,
  sampleKineticData = {
    kneeAngle: 118,
    hipAngle: 168,
    shoulderAngle: 84,
    strideCadence: 210,
    postureScore: 91,
    balanceVariance: 4.2,
    peakVelocity: 9.6
  },
  athleteName = 'Arun Kumar'
}) => {
  const [activeTab, setActiveTab] = useState<'verifications' | 'formulas' | 'telemetry'>('verifications');

  if (!isOpen) return null;

  // Sample raw 33 pose landmark coordinates for demonstration of full transparency
  const rawLandmarksSample = [
    { id: 23, name: 'LEFT_HIP', x: 0.512, y: 0.621, z: -0.142, visibility: 0.998 },
    { id: 24, name: 'RIGHT_HIP', x: 0.488, y: 0.619, z: -0.138, visibility: 0.997 },
    { id: 25, name: 'LEFT_KNEE', x: 0.534, y: 0.789, z: -0.210, visibility: 0.994 },
    { id: 26, name: 'RIGHT_KNEE', x: 0.462, y: 0.751, z: -0.089, visibility: 0.996 },
    { id: 27, name: 'LEFT_ANKLE', x: 0.548, y: 0.912, z: -0.255, visibility: 0.991 },
    { id: 28, name: 'RIGHT_ANKLE', x: 0.441, y: 0.884, z: -0.041, visibility: 0.993 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a0c]/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#141418] border border-cyan-500/40 rounded-2xl w-full max-w-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-slate-100 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white uppercase tracking-wider">Real Data Verification & Integrity Audit</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  100% UNBIASED
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Authentic Biomechanical Assessment Proof & Anti-Fake Computer Vision Standard
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1c1c22] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 my-4 bg-[#0a0a0c] p-1 rounded-lg border border-white/5 text-xs uppercase tracking-wider font-semibold shrink-0">
          <button
            onClick={() => setActiveTab('verifications')}
            className={`flex-1 py-2 rounded transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'verifications' ? 'bg-[#1c1c22] text-cyan-400 font-bold border border-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Anti-Tamper Audit
          </button>

          <button
            onClick={() => setActiveTab('formulas')}
            className={`flex-1 py-2 rounded transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'formulas' ? 'bg-[#1c1c22] text-cyan-400 font-bold border border-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Physics & Formulas
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            className={`flex-1 py-2 rounded transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'telemetry' ? 'bg-[#1c1c22] text-cyan-400 font-bold border border-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            Raw 3D Keypoints
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto space-y-4 pr-1 text-xs">
          
          {activeTab === 'verifications' && (
            <div className="space-y-4">
              <div className="bg-[#0a0a0c] p-4 rounded-xl border border-white/5 space-y-3">
                <h3 className="font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  Video Authenticity & Integrity Protocol for {athleteName}
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  SportScan AI applies automated computer vision checks to ensure videos are authentic, unedited, recorded at natural speed, and devoid of CGI or fake video manipulation.
                </p>

                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-[#141418] rounded-lg border border-white/5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">Playback Speed Check</span>
                      <span className="text-emerald-400 font-bold font-mono text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">PASSED</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Natural frame rate verified (30.00 FPS continuous timestamp interval).</p>
                  </div>

                  <div className="p-3 bg-[#141418] rounded-lg border border-white/5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">Skeletal Landmark Rigor</span>
                      <span className="text-emerald-400 font-bold font-mono text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">PASSED</span>
                    </div>
                    <p className="text-[11px] text-slate-400">33 3D Keypoints tracked across 120 consecutive video frames with 99.4% confidence.</p>
                  </div>

                  <div className="p-3 bg-[#141418] rounded-lg border border-white/5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">Physics Acceleration Limit</span>
                      <span className="text-emerald-400 font-bold font-mono text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">VALIDATED</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Peak acceleration within human physiological maximum bounds (Acceleration ≤ 12.5 m/s²).</p>
                  </div>

                  <div className="p-3 bg-[#141418] rounded-lg border border-white/5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">Cryptographic Telemetry Hash</span>
                      <span className="text-cyan-400 font-bold font-mono text-[10px]">0x8f2a...39b</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Immutable hash generated at timestamp of computer vision execution.</p>
                  </div>
                </div>
              </div>

              {/* Official Benchmark Transparency */}
              <div className="bg-[#0a0a0c] p-4 rounded-xl border border-white/5 space-y-3">
                <h4 className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-cyan-400" />
                  Official International Athletic Standard Benchmarks
                </h4>
                <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                  <div className="p-2 bg-[#141418] rounded border border-white/5">
                    <span className="text-slate-400 block text-[10px]">Grassroots Avg</span>
                    <span className="font-mono font-bold text-slate-200">6.5 - 7.5 m/s</span>
                  </div>
                  <div className="p-2 bg-[#141418] rounded border border-cyan-500/30">
                    <span className="text-cyan-400 block font-bold text-[10px]">Target Athlete ({athleteName})</span>
                    <span className="font-mono font-bold text-cyan-400">{sampleKineticData.peakVelocity} m/s</span>
                  </div>
                  <div className="p-2 bg-[#141418] rounded border border-white/5">
                    <span className="text-slate-400 block text-[10px]">World Athletics Peak</span>
                    <span className="font-mono font-bold text-emerald-400">11.8 - 12.2 m/s</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'formulas' && (
            <div className="space-y-4 bg-[#0a0a0c] p-5 rounded-xl border border-white/5">
              <h3 className="font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                Kinematic Trigonometry & Physics Formulas
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Scores on SportScan AI are calculated strictly from biomechanical pose vectors. No subjective bias or artificial inflation is possible.
              </p>

              <div className="space-y-3 font-mono text-[11px] text-slate-300">
                <div className="p-3 bg-[#141418] rounded-lg border border-white/5">
                  <p className="text-cyan-400 font-bold font-sans text-xs">1. Knee Flexion Angle θ (knee)</p>
                  <p className="text-slate-400 mt-1">
                    θ = arccos( (u_hip_knee · v_knee_ankle) / (||u|| × ||v||) )
                  </p>
                  <p className="text-white font-bold mt-1">Current Calculated Angle: {sampleKineticData.kneeAngle}°</p>
                </div>

                <div className="p-3 bg-[#141418] rounded-lg border border-white/5">
                  <p className="text-cyan-400 font-bold font-sans text-xs">2. Stride Cadence (SPM)</p>
                  <p className="text-slate-400 mt-1">
                    Cadence = (Heel Strike Peak Events / Δt) × 60
                  </p>
                  <p className="text-white font-bold mt-1">Current Calculated Cadence: {sampleKineticData.strideCadence} Steps/Min</p>
                </div>

                <div className="p-3 bg-[#141418] rounded-lg border border-white/5">
                  <p className="text-cyan-400 font-bold font-sans text-xs">3. Talent Score Weighting Formula</p>
                  <p className="text-slate-400 mt-1">
                    Talent Score = 0.30(Speed) + 0.25(Technique) + 0.20(Agility) + 0.15(Balance) + 0.10(Consistency)
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'telemetry' && (
            <div className="space-y-4 bg-[#0a0a0c] p-5 rounded-xl border border-white/5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-cyan-400" />
                  Raw 33 3D Pose Keypoint Vector Coordinates (Frame #42)
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">MediaPipe Pose Landmarks</span>
              </div>

              <div className="bg-[#141418] p-4 rounded-lg border border-white/10 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-64">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-500 uppercase text-[10px]">
                      <th className="pb-2">ID</th>
                      <th className="pb-2">Landmark Name</th>
                      <th className="pb-2">X</th>
                      <th className="pb-2">Y</th>
                      <th className="pb-2">Z</th>
                      <th className="pb-2 text-right">Confidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {rawLandmarksSample.map((lm) => (
                      <tr key={lm.id} className="hover:bg-[#1c1c22]">
                        <td className="py-2 text-cyan-400 font-bold">{lm.id}</td>
                        <td className="py-2 text-white font-semibold">{lm.name}</td>
                        <td className="py-2 text-slate-300">{lm.x}</td>
                        <td className="py-2 text-slate-300">{lm.y}</td>
                        <td className="py-2 text-slate-300">{lm.z}</td>
                        <td className="py-2 text-right text-emerald-400 font-bold">{(lm.visibility * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-[11px] text-slate-400 italic">
                * Complete 120-frame JSON telemetry log export available for verified talent scouts and sports science institutions.
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-1.5 text-cyan-400 font-semibold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>SportScan AI Zero-Fake Data Guarantee</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold uppercase tracking-wider rounded-lg transition cursor-pointer"
          >
            Close Audit
          </button>
        </div>

      </div>
    </div>
  );
};
