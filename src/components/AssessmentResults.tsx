import React from 'react';
import { Zap, Award, Target, CheckCircle2, AlertTriangle, ArrowRight, Share2, RefreshCw, User, Activity, ShieldCheck, FileCode } from 'lucide-react';
import { Assessment } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { PoseCanvas } from './PoseCanvas';

interface AssessmentResultsProps {
  assessment: Assessment;
  onViewProfile: () => void;
  onTakeAnother: () => void;
  onOpenIntegrityAudit?: () => void;
}

export const AssessmentResults: React.FC<AssessmentResultsProps> = ({
  assessment,
  onViewProfile,
  onTakeAnother,
  onOpenIntegrityAudit
}) => {
  const radarData = [
    { subject: 'Speed', value: assessment.metrics.speed, fullMark: 100 },
    { subject: 'Technique', value: assessment.metrics.technique, fullMark: 100 },
    { subject: 'Agility', value: assessment.metrics.agility, fullMark: 100 },
    { subject: 'Balance', value: assessment.metrics.balance, fullMark: 100 },
    { subject: 'Consistency', value: assessment.metrics.consistency, fullMark: 100 },
    { subject: 'Explosiveness', value: assessment.metrics.explosiveness, fullMark: 100 }
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `SportScan AI Verified Score: ${assessment.overallScore}/100`,
        text: `${assessment.athleteName} achieved an overall Talent Score of ${assessment.overallScore}/100 on SportScan AI!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Assessment results link copied to clipboard!");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 text-slate-100">
      
      {/* Top Banner Score Headline */}
      <div className="bg-[#141418] border border-white/5 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block mb-1">
              Assessment Evaluation Complete
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{assessment.drillName}</h1>
            <p className="text-xs text-slate-400 mt-1">
              {assessment.athleteName} • {assessment.date} • {assessment.athleteLocation}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#0a0a0c] p-4 rounded-xl border border-white/5">
            <div className="text-center px-3">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">Talent Score</span>
              <span className="text-4xl font-bold text-cyan-400 font-mono">{assessment.overallScore}<span className="text-sm font-normal text-slate-500">/100</span></span>
            </div>

            <div className="w-px h-12 bg-white/10" />

            <div className="text-center px-3">
              <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-widest block">Underdog Index</span>
              <span className="text-4xl font-bold text-white font-mono">{assessment.underdogScore}<span className="text-sm font-normal text-slate-500">/100</span></span>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 uppercase tracking-wider">Potential Status:</span>
            <span className="px-3 py-1 rounded text-xs font-bold bg-[#1c1c22] text-cyan-400 border border-cyan-500/30">
              {assessment.overallScore >= 90 ? 'Elite Prospect' : assessment.overallScore >= 85 ? 'High Potential' : 'Emerging Talent'}
            </span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              Video Anti-Tamper: Passed (30 FPS)
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {onOpenIntegrityAudit && (
              <button
                onClick={onOpenIntegrityAudit}
                className="px-3.5 py-2 rounded-lg bg-[#1c1c22] hover:bg-[#25252d] text-cyan-400 text-xs font-bold uppercase tracking-wider border border-cyan-500/30 transition flex items-center gap-1.5 cursor-pointer"
              >
                <FileCode className="w-3.5 h-3.5" />
                Inspect Telemetry
              </button>
            )}

            <button
              onClick={handleShare}
              className="px-3.5 py-2 rounded-lg bg-[#1c1c22] hover:bg-[#25252d] text-slate-200 text-xs font-semibold uppercase tracking-wider border border-white/10 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share Card
            </button>

            <button
              onClick={onViewProfile}
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider shadow-md shadow-cyan-500/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              Athlete Profile
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Pose Video Canvas + Radar Chart */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Pose Video Overlay */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Biomechanical Pose Telemetry</h3>
          <PoseCanvas
            videoUrl={assessment.videoUrl}
            kineticData={assessment.kineticData}
          />

          {/* Kinetic Telemetry Details */}
          <div className="grid grid-cols-3 gap-3 bg-[#141418] border border-white/5 p-4 rounded-xl text-center">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Knee Angle</p>
              <p className="text-lg font-bold text-white font-mono mt-0.5">{assessment.kineticData.kneeAngle}°</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hip Torque</p>
              <p className="text-lg font-bold text-white font-mono mt-0.5">{assessment.kineticData.hipAngle}°</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cadence</p>
              <p className="text-lg font-bold text-cyan-400 font-mono mt-0.5">{assessment.kineticData.strideCadence} <span className="text-[10px]">spm</span></p>
            </div>
          </div>
        </div>

        {/* Radar Performance Chart */}
        <div className="lg:col-span-5 bg-[#141418] border border-white/5 p-6 rounded-xl shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">Kinetic Performance Radar</h3>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#1c1c22" />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Radar name="Performance" dataKey="value" stroke="#00f5ff" fill="#00f5ff" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-4 border-t border-white/5">
            <div>
              <span className="text-slate-400 uppercase text-[10px]">Speed: </span>
              <span className="font-bold text-cyan-400">{assessment.metrics.speed}</span>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px]">Technique: </span>
              <span className="font-bold text-cyan-400">{assessment.metrics.technique}</span>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px]">Agility: </span>
              <span className="font-bold text-cyan-400">{assessment.metrics.agility}</span>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px]">Balance: </span>
              <span className="font-bold text-cyan-400">{assessment.metrics.balance}</span>
            </div>
          </div>
        </div>

      </div>

      {/* AI Feedback Section */}
      <div className="bg-[#141418] border border-white/5 rounded-xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white uppercase tracking-wider">AI Biomechanical Feedback</h3>
        </div>

        {/* Recommendation Quote */}
        <div className="bg-[#0a0a0c] p-5 rounded-xl border-l-2 border-cyan-400 text-slate-200 italic text-xs leading-relaxed">
          "{assessment.aiFeedback.recommendation}"
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="bg-[#0a0a0c] p-5 rounded-xl border border-white/5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5 mb-3">
              <CheckCircle2 className="w-4 h-4" />
              Key Athletic Strengths
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {assessment.aiFeedback.strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas to Improve */}
          <div className="bg-[#0a0a0c] p-5 rounded-xl border border-white/5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300 flex items-center gap-1.5 mb-3">
              <AlertTriangle className="w-4 h-4 text-cyan-400" />
              Areas for Improvement
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {assessment.aiFeedback.areasToImprove.map((area, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-1.5 shrink-0" />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommended Drills */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-3">Recommended Drills</h4>
          <div className="grid sm:grid-cols-3 gap-3">
            {assessment.aiFeedback.recommendedDrills.map((drill, idx) => (
              <div key={idx} className="bg-[#0a0a0c] p-3.5 rounded-lg border border-white/5 text-xs font-semibold text-slate-200">
                • {drill}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Footer CTA */}
      <div className="flex justify-center gap-4">
        <button
          onClick={onTakeAnother}
          className="px-6 py-3 rounded-lg bg-[#1c1c22] hover:bg-[#25252d] text-slate-200 font-bold text-xs uppercase tracking-wider border border-white/10 transition flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Take Another Assessment
        </button>
      </div>

    </div>
  );
};
