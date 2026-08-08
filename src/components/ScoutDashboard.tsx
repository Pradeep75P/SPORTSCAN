import React, { useState } from 'react';
import { Search, Filter, Trophy, MapPin, Eye, Zap, Target, Bookmark, Sparkles, CheckCircle2 } from 'lucide-react';
import { AthleteProfile, SportType } from '../types';

interface ScoutDashboardProps {
  athletes: AthleteProfile[];
  onSelectAthlete: (athlete: AthleteProfile) => void;
  onBookmarkToggle: (athleteId: string) => void;
}

export const ScoutDashboard: React.FC<ScoutDashboardProps> = ({
  athletes,
  onSelectAthlete,
  onBookmarkToggle
}) => {
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [minTalentScore, setMinTalentScore] = useState<number>(75);
  const [underdogOnly, setUnderdogOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'bookmarked'>('all');

  const filteredAthletes = athletes.filter((a) => {
    if (activeTab === 'bookmarked' && !a.isBookmarkedByScout) return false;
    if (selectedSport !== 'all' && a.sport !== selectedSport) return false;
    if (a.talentScore < minTalentScore) return false;
    if (underdogOnly && a.underdogScore < 88) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = a.name.toLowerCase().includes(q);
      const matchLoc = a.location.toLowerCase().includes(q);
      const matchBio = a.bio.toLowerCase().includes(q);
      if (!matchName && !matchLoc && !matchBio) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">
      
      {/* Scout Discovery Header */}
      <div className="bg-[#141418] border border-white/5 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Search className="w-3.5 h-3.5" />
              <span>Scout Talent Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider">Grassroots Talent Discovery</h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Filter verified smartphone computer vision assessments to identify elite raw prospects before traditional scouting networks.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#0a0a0c] p-1 rounded-lg border border-white/5 text-xs uppercase tracking-wider font-semibold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded transition cursor-pointer ${
                activeTab === 'all' ? 'bg-[#1c1c22] text-cyan-400 font-bold border border-cyan-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Candidates ({athletes.length})
            </button>
            <button
              onClick={() => setActiveTab('bookmarked')}
              className={`px-4 py-2 rounded transition cursor-pointer ${
                activeTab === 'bookmarked' ? 'bg-[#1c1c22] text-cyan-400 font-bold border border-cyan-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              Bookmarks ({athletes.filter(a => a.isBookmarkedByScout).length})
            </button>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#141418] border border-white/5 p-5 rounded-xl shadow-xl space-y-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, city, state..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0c] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Sport Selector */}
          <div>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0a0a0c] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 uppercase tracking-wider"
            >
              <option value="all">All Sports</option>
              <option value="athletics">Athletics & Sprinting</option>
              <option value="football">Football / Soccer</option>
              <option value="cricket">Cricket</option>
            </select>
          </div>

          {/* Min Talent Score Range */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-400 uppercase tracking-wider">
              <span>Min Score:</span>
              <span className="font-mono font-bold text-cyan-400">{minTalentScore}/100</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              step="1"
              value={minTalentScore}
              onChange={(e) => setMinTalentScore(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Underdog Toggle */}
          <div className="flex items-center justify-between bg-[#0a0a0c] px-4 py-2 rounded-lg border border-white/10">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              Underdogs Only
            </span>
            <input
              type="checkbox"
              checked={underdogOnly}
              onChange={(e) => setUnderdogOnly(e.target.checked)}
              className="w-4 h-4 accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>

      </div>

      {/* Candidate Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAthletes.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-[#141418] border border-white/5 rounded-xl text-slate-400">
            <Search className="w-10 h-10 mx-auto mb-2 text-slate-600" />
            <p className="text-xs uppercase tracking-wider">No athletes match your search criteria.</p>
            <button
              onClick={() => {
                setSelectedSport('all');
                setMinTalentScore(50);
                setUnderdogOnly(false);
                setSearchQuery('');
              }}
              className="mt-3 px-4 py-2 bg-[#1c1c22] text-slate-200 font-bold text-xs uppercase tracking-wider rounded-lg border border-white/10 hover:bg-[#25252d] cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredAthletes.map((athlete) => (
            <div
              key={athlete.id}
              className="bg-[#141418] border border-white/5 hover:border-cyan-500/50 rounded-xl p-5 shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header Profile Info */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={athlete.profilePhoto}
                      alt={athlete.name}
                      className="w-14 h-14 rounded-lg object-cover ring-1 ring-white/10 group-hover:ring-cyan-500/50 transition"
                    />
                    <div>
                      <h3 className="text-base font-bold text-white uppercase tracking-wider leading-tight">{athlete.name}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {athlete.location}
                      </p>
                      <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider mt-1">
                        {athlete.sport} • {athlete.age}y
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onBookmarkToggle(athlete.id)}
                    className={`p-2 rounded-lg transition cursor-pointer ${
                      athlete.isBookmarkedByScout
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-[#0a0a0c] text-slate-500 hover:text-slate-200 border border-white/10'
                    }`}
                  >
                    <Trophy className="w-4 h-4" />
                  </button>
                </div>

                {/* Score Badges Row */}
                <div className="grid grid-cols-2 gap-2 bg-[#0a0a0c] p-3 rounded-lg border border-white/5 mb-4">
                  <div className="text-center">
                    <span className="text-[9px] text-slate-400 uppercase font-bold tracking-widest block">Talent Score</span>
                    <span className="text-xl font-bold text-cyan-400 font-mono">{athlete.talentScore}/100</span>
                  </div>
                  <div className="text-center border-l border-white/10">
                    <span className="text-[9px] text-cyan-400 uppercase font-bold tracking-widest block">Underdog Index</span>
                    <span className="text-xl font-bold text-white font-mono">{athlete.underdogScore}/100</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 mb-4">
                  {athlete.bio}
                </p>

                {/* Quick Metrics Bar */}
                <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-400 uppercase tracking-wider pb-4 border-b border-white/5">
                  <div>Speed: <strong className="text-slate-200 font-mono">{athlete.metrics.speed}</strong></div>
                  <div>Agility: <strong className="text-slate-200 font-mono">{athlete.metrics.agility}</strong></div>
                  <div>Tech: <strong className="text-slate-200 font-mono">{athlete.metrics.technique}</strong></div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectAthlete(athlete)}
                className="w-full mt-4 py-2.5 rounded-lg bg-[#1c1c22] hover:bg-cyan-500 hover:text-slate-950 text-slate-200 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Profile & Video</span>
              </button>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
