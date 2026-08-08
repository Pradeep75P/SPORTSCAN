import React from 'react';
import { Zap, Plus, Trophy, Award, TrendingUp, Calendar, MapPin, Activity, ChevronRight, Share2, Sparkles, Target } from 'lucide-react';
import { AthleteProfile, Assessment } from '../types';

interface AthleteDashboardProps {
  athlete: AthleteProfile;
  assessments: Assessment[];
  onStartNewAssessment: () => void;
  onViewAssessmentDetail: (assessment: Assessment) => void;
  onViewPublicProfile: () => void;
}

export const AthleteDashboard: React.FC<AthleteDashboardProps> = ({
  athlete,
  assessments,
  onStartNewAssessment,
  onViewAssessmentDetail,
  onViewPublicProfile
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">
      
      {/* Top Banner Profile Card */}
      <div className="bg-[#141418] border border-white/5 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-center gap-5">
            <img
              src={athlete.profilePhoto}
              alt={athlete.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border-2 border-cyan-500 shadow-xl"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{athlete.name}</h1>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  {athlete.sport}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-400 mt-1.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {athlete.location}
                </span>
                <span>• {athlete.age} Yrs</span>
                <span>• {athlete.experienceLevel} Level</span>
                <span className="text-cyan-400 font-medium">• {athlete.trainingFacilityAccess}</span>
              </div>

              <p className="text-xs text-slate-300 mt-2 max-w-xl line-clamp-2">
                {athlete.bio}
              </p>
            </div>
          </div>

          {/* Scores Banner */}
          <div className="flex items-center gap-4 bg-[#0a0a0c] p-4 rounded-xl border border-white/5 w-full md:w-auto justify-around">
            <div className="text-center px-3">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Talent Score</p>
              <p className="text-3xl font-bold text-cyan-400 font-mono mt-0.5">{athlete.talentScore}<span className="text-sm font-normal text-slate-500">/100</span></p>
            </div>
            
            <div className="w-px h-10 bg-white/10" />

            <div className="text-center px-3">
              <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-1 justify-center">
                <Target className="w-3 h-3" />
                Underdog Index
              </p>
              <p className="text-3xl font-bold text-white font-mono mt-0.5">{athlete.underdogScore}<span className="text-sm font-normal text-slate-500">/100</span></p>
            </div>
          </div>

        </div>

        {/* Dashboard Actions */}
        <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 uppercase tracking-wider">Potential Status:</span>
            <span className="px-3 py-1 rounded text-xs font-bold bg-[#1c1c22] text-cyan-400 border border-cyan-500/30">
              {athlete.potentialLevel}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onViewPublicProfile}
              className="px-4 py-2 rounded-lg bg-[#1c1c22] hover:bg-[#25252d] text-slate-200 text-xs font-semibold uppercase tracking-wider border border-white/10 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              Public Card
            </button>

            <button
              onClick={onStartNewAssessment}
              className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider shadow-md shadow-cyan-500/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              New Assessment
            </button>
          </div>
        </div>

      </div>

      {/* Performance Metrics Breakdown Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Performance Breakdown
          </h2>
          <span className="text-xs text-slate-500">Computer Vision Verified Metrics</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Speed', value: athlete.metrics.speed },
            { label: 'Technique', value: athlete.metrics.technique },
            { label: 'Agility', value: athlete.metrics.agility },
            { label: 'Balance', value: athlete.metrics.balance },
            { label: 'Consistency', value: athlete.metrics.consistency },
            { label: 'Explosiveness', value: athlete.metrics.explosiveness }
          ].map((m) => (
            <div key={m.label} className="bg-[#141418] border border-white/5 p-4 rounded-xl">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{m.label}</p>
              <p className="text-2xl font-bold font-mono my-1 text-white">{m.value}</p>
              <div className="w-full bg-[#0a0a0c] h-1.5 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-cyan-400"
                  style={{ width: `${m.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Assessments Table */}
      <div className="bg-[#141418] border border-white/5 rounded-xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider">Assessment History</h3>
            <p className="text-xs text-slate-400">Smartphone computer vision analysis logs</p>
          </div>
          <button
            onClick={onStartNewAssessment}
            className="text-xs text-cyan-400 hover:underline font-bold uppercase tracking-wider cursor-pointer"
          >
            + New Assessment
          </button>
        </div>

        {assessments.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Activity className="w-10 h-10 mx-auto mb-2 text-slate-600" />
            <p className="text-sm">No assessments recorded yet.</p>
            <button
              onClick={onStartNewAssessment}
              className="mt-3 px-4 py-2 bg-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg cursor-pointer"
            >
              Take First Assessment
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[10px] uppercase tracking-widest font-bold text-slate-500 bg-[#0a0a0c] border-b border-white/5">
                <tr>
                  <th className="py-3 px-4">Drill Name</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-center">Talent Score</th>
                  <th className="py-3 px-4 text-center">Underdog Score</th>
                  <th className="py-3 px-4 text-center">Trend</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {assessments.map((ass) => (
                  <tr key={ass.id} className="hover:bg-[#1c1c22]/50 transition">
                    <td className="py-4 px-4 font-semibold text-white">
                      {ass.drillName}
                      <span className="block text-[10px] text-slate-400 uppercase tracking-wider">{ass.sport}</span>
                    </td>
                    <td className="py-4 px-4 text-slate-400">{ass.date}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-mono font-bold text-cyan-400 bg-[#0a0a0c] px-2.5 py-1 rounded border border-cyan-500/30">
                        {ass.overallScore}/100
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-mono font-bold text-white bg-[#0a0a0c] px-2.5 py-1 rounded border border-white/10">
                        {ass.underdogScore}/100
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-cyan-400 font-mono">
                      +6%
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => onViewAssessmentDetail(ass)}
                        className="px-3 py-1.5 rounded bg-[#1c1c22] hover:bg-[#25252d] text-slate-200 text-xs font-semibold uppercase tracking-wider border border-white/10 transition flex items-center gap-1 ml-auto cursor-pointer"
                      >
                        <span>View Results</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
