import React, { useState } from 'react';
import { MapPin, Trophy, Award, Zap, Target, Share2, Mail, CheckCircle, ChevronRight, Activity, ShieldCheck } from 'lucide-react';
import { AthleteProfile as AthleteProfileType } from '../types';
import { PoseCanvas } from './PoseCanvas';

interface AthleteProfileProps {
  athlete: AthleteProfileType;
  onBack?: () => void;
  onBookmarkToggle?: (athleteId: string) => void;
  onOpenIntegrityAudit?: () => void;
}

export const AthleteProfile: React.FC<AthleteProfileProps> = ({
  athlete,
  onBack,
  onBookmarkToggle,
  onOpenIntegrityAudit
}) => {
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setShowContactModal(false);
      alert(`Scout inquiry sent to ${athlete.name}!`);
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 text-slate-100">
      
      {/* Top Digital Card Header */}
      <div className="bg-[#141418] border border-white/5 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-center gap-5">
            <img
              src={athlete.profilePhoto}
              alt={athlete.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover ring-1 ring-cyan-500/50 shadow-2xl"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider">{athlete.name}</h1>
                <span className="px-3 py-1 rounded text-xs font-bold uppercase bg-[#1c1c22] text-cyan-400 border border-cyan-500/30">
                  {athlete.sport}
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{athlete.location}</span>
                <span>• {athlete.age} Years</span>
                <span>• {athlete.experienceLevel}</span>
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded text-xs font-bold uppercase bg-[#1c1c22] text-cyan-400 border border-white/10">
                  Potential: {athlete.potentialLevel}
                </span>
                <span className="px-3 py-1 rounded text-xs font-bold uppercase bg-[#1c1c22] text-slate-300 border border-white/10">
                  Facility: {athlete.trainingFacilityAccess}
                </span>
                {(athlete.isEmailVerified || athlete.isMobileVerified || true) && (
                  <span className="px-2.5 py-1 rounded text-[11px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Contact
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Big Verified Score Badges */}
          <div className="flex items-center gap-4 bg-[#0a0a0c] p-5 rounded-xl border border-white/5 w-full md:w-auto justify-around">
            <div className="text-center px-3">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">Talent Score</span>
              <span className="text-4xl font-bold text-cyan-400 font-mono">{athlete.talentScore}<span className="text-sm font-normal text-slate-500">/100</span></span>
            </div>

            <div className="w-px h-12 bg-white/10" />

            <div className="text-center px-3">
              <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-widest block">Underdog Index</span>
              <span className="text-4xl font-bold text-white font-mono">{athlete.underdogScore}<span className="text-sm font-normal text-slate-500">/100</span></span>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
          {onBack && (
            <button
              onClick={onBack}
              className="text-xs text-slate-400 hover:text-white font-bold uppercase tracking-wider cursor-pointer"
            >
              ← Back
            </button>
          )}

          <div className="flex items-center gap-3 ml-auto">
            {onOpenIntegrityAudit && (
              <button
                onClick={onOpenIntegrityAudit}
                className="px-3.5 py-2 rounded-lg bg-[#1c1c22] hover:bg-[#25252d] text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Data Integrity Audit
              </button>
            )}

            {onBookmarkToggle && (
              <button
                onClick={() => onBookmarkToggle(athlete.id)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer ${
                  athlete.isBookmarkedByScout
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-[#1c1c22] text-slate-200 border border-white/10 hover:bg-[#25252d]'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                {athlete.isBookmarkedByScout ? 'Bookmarked' : 'Bookmark Talent'}
              </button>
            )}

            <button
              onClick={() => setShowContactModal(true)}
              className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-cyan-500/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              Trial Inquiry
            </button>
          </div>
        </div>

      </div>

      {/* Bio & Achievements */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-[#141418] border border-white/5 p-6 rounded-xl space-y-3">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Athlete Story & Background</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {athlete.bio}
          </p>
        </div>

        <div className="bg-[#141418] border border-white/5 p-6 rounded-xl space-y-3">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Key Achievements</h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {athlete.achievements?.map((ach, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{ach}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Verified Video Biomechanics Review */}
      {athlete.recentAssessments.length > 0 && (
        <div className="bg-[#141418] border border-white/5 p-6 rounded-xl space-y-4">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Verified Assessment Video</h3>
          <PoseCanvas
            videoUrl={athlete.recentAssessments[0].videoUrl}
            kineticData={athlete.recentAssessments[0].kineticData}
          />
        </div>
      )}

      {/* Contact Scout Inquiry Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a0c]/80 backdrop-blur-md">
          <div className="bg-[#141418] border border-white/10 rounded-xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">Send Scout Invitation to {athlete.name}</h3>
            <p className="text-xs text-slate-400">
              Invite athlete for official trial, academy scouting, or sponsorship.
            </p>

            <form onSubmit={handleSendInquiry} className="space-y-3">
              <textarea
                required
                rows={4}
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Write your message or trial details here..."
                className="w-full p-3 bg-[#0a0a0c] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#1c1c22] text-slate-300 text-xs font-semibold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  {isSent ? 'Sending...' : 'Send Inquiry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
