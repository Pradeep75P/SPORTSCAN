import React, { useState } from 'react';
import { Trophy, Award, Target, Flame, Sparkles, Filter, ChevronRight } from 'lucide-react';
import { AthleteProfile, SportType } from '../types';

interface LeaderboardProps {
  athletes: AthleteProfile[];
  onSelectAthlete: (athlete: AthleteProfile) => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ athletes, onSelectAthlete }) => {
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [category, setCategory] = useState<'top' | 'underdog' | 'speed'>('top');

  let sortedAthletes = [...athletes];
  if (selectedSport !== 'all') {
    sortedAthletes = sortedAthletes.filter(a => a.sport === selectedSport);
  }

  if (category === 'underdog') {
    sortedAthletes.sort((a, b) => b.underdogScore - a.underdogScore);
  } else if (category === 'speed') {
    sortedAthletes.sort((a, b) => b.metrics.speed - a.metrics.speed);
  } else {
    sortedAthletes.sort((a, b) => b.talentScore - a.talentScore);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">
      
      {/* Header */}
      <div className="bg-[#141418] border border-white/5 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Trophy className="w-3.5 h-3.5" />
              <span>Verified AI Leaderboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider">National Talent Rankings</h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Ranked automatically via smartphone computer vision biomechanical assessments.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#0a0a0c] p-1 rounded-lg border border-white/5 text-xs uppercase tracking-wider font-semibold">
            <button
              onClick={() => setCategory('top')}
              className={`px-3 py-1.5 rounded transition cursor-pointer ${
                category === 'top' ? 'bg-[#1c1c22] text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              Top Talent
            </button>
            <button
              onClick={() => setCategory('underdog')}
              className={`px-3 py-1.5 rounded transition cursor-pointer ${
                category === 'underdog' ? 'bg-[#1c1c22] text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              Underdog Index
            </button>
            <button
              onClick={() => setCategory('speed')}
              className={`px-3 py-1.5 rounded transition cursor-pointer ${
                category === 'speed' ? 'bg-[#1c1c22] text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              Top Velocity
            </button>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex items-center justify-between bg-[#141418] p-4 rounded-xl border border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Sport:</span>
          {['all', 'athletics', 'football', 'cricket'].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSport(s)}
              className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                selectedSport === s
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-[#0a0a0c] text-slate-400 hover:text-slate-200 border border-white/5'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-[#141418] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-[#0a0a0c] border-b border-white/5">
            <tr>
              <th className="py-3.5 px-4 text-center">Rank</th>
              <th className="py-3.5 px-4">Athlete</th>
              <th className="py-3.5 px-4">Sport</th>
              <th className="py-3.5 px-4">Location</th>
              <th className="py-3.5 px-4 text-center">Talent Score</th>
              <th className="py-3.5 px-4 text-center">Underdog Index</th>
              <th className="py-3.5 px-4 text-right">Profile</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sortedAthletes.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <Trophy className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="font-bold text-white text-sm uppercase tracking-wider">No Verified Leaderboard Rankings Yet</p>
                  <p className="text-xs text-slate-500 mt-1">Submit a computer vision video assessment to claim the #1 spot on the leaderboard!</p>
                </td>
              </tr>
            ) : (
              sortedAthletes.map((ath, idx) => (
              <tr key={ath.id} className="hover:bg-[#1c1c22]/50 transition">
                <td className="py-4 px-4 text-center font-bold font-mono">
                  {idx === 0 ? (
                    <span className="w-7 h-7 rounded bg-cyan-500 text-slate-950 flex items-center justify-center font-bold mx-auto">1</span>
                  ) : idx === 1 ? (
                    <span className="w-7 h-7 rounded bg-[#1c1c22] text-slate-200 border border-white/10 flex items-center justify-center font-bold mx-auto">2</span>
                  ) : idx === 2 ? (
                    <span className="w-7 h-7 rounded bg-[#1c1c22] text-slate-400 border border-white/5 flex items-center justify-center font-bold mx-auto">3</span>
                  ) : (
                    <span className="text-slate-500">#{idx + 1}</span>
                  )}
                </td>
                <td className="py-4 px-4 font-semibold text-white">
                  <div className="flex items-center gap-3">
                    <img
                      src={ath.profilePhoto}
                      alt={ath.name}
                      className="w-10 h-10 rounded-lg object-cover ring-1 ring-white/10"
                    />
                    <div>
                      <p className="font-bold text-white text-sm uppercase tracking-wider">{ath.name}</p>
                      <p className="text-[10px] text-slate-400">{ath.experienceLevel} • {ath.age}y</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 uppercase tracking-wider text-slate-300 font-semibold">{ath.sport}</td>
                <td className="py-4 px-4 text-slate-400">{ath.location}</td>
                <td className="py-4 px-4 text-center">
                  <span className="font-mono font-bold text-cyan-400 bg-[#0a0a0c] px-2.5 py-1 rounded border border-cyan-500/30">
                    {ath.talentScore}/100
                  </span>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="font-mono font-bold text-slate-300 bg-[#0a0a0c] px-2.5 py-1 rounded border border-white/10">
                    {ath.underdogScore}/100
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <button
                    onClick={() => onSelectAthlete(ath)}
                    className="p-2 rounded-lg bg-[#1c1c22] hover:bg-cyan-500 hover:text-slate-950 text-slate-200 transition cursor-pointer border border-white/10"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
