import React from 'react';
import { ShieldCheck, Zap, Search, Trophy, Play, User, Sparkles, LayoutDashboard, Settings, HardDrive } from 'lucide-react';
import { Role, User as UserType } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: UserType;
  onOpenAuth: () => void;
  onRunDemo: () => void;
  onRoleSwitch: (role: Role) => void;
  onOpenIntegrityAudit?: () => void;
  onOpenGoogleDrive?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  onOpenAuth,
  onRunDemo,
  onRoleSwitch,
  onOpenIntegrityAudit,
  onOpenGoogleDrive
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0f0f12]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentTab('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 bg-cyan-500 rounded-sm rotate-45 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:rotate-[225deg] transition-transform duration-500">
            <div className="w-4 h-4 bg-[#0a0a0c] rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tighter text-white font-sans">SPORT<span className="text-cyan-400">SCAN</span></span>
              <span className="text-[10px] font-bold tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">AI</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium uppercase tracking-widest text-slate-400">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`transition-all py-1 cursor-pointer ${
              currentTab === 'dashboard'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-bold'
                : 'hover:text-white'
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => setCurrentTab('assessment')}
            className={`transition-all py-1 cursor-pointer ${
              currentTab === 'assessment'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-bold'
                : 'hover:text-white'
            }`}
          >
            Assessments
          </button>

          <button
            onClick={() => setCurrentTab('scout')}
            className={`transition-all py-1 cursor-pointer ${
              currentTab === 'scout'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-bold'
                : 'hover:text-white'
            }`}
          >
            Discover
          </button>

          <button
            onClick={() => setCurrentTab('leaderboard')}
            className={`transition-all py-1 cursor-pointer ${
              currentTab === 'leaderboard'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-bold'
                : 'hover:text-white'
            }`}
          >
            Rankings
          </button>

          <button
            onClick={() => setCurrentTab('admin')}
            className={`transition-all py-1 cursor-pointer ${
              currentTab === 'admin'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-bold'
                : 'hover:text-white'
            }`}
          >
            Admin
          </button>
        </nav>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2.5">
          {/* Google Drive Integration Button */}
          {onOpenGoogleDrive && (
            <button
              onClick={onOpenGoogleDrive}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              title="Google Drive Cloud Export & Backup"
            >
              <HardDrive className="w-3.5 h-3.5 text-blue-400" />
              <span>Drive Sync</span>
            </button>
          )}

          {/* Real Data Integrity Standard Audit Button */}
          {onOpenIntegrityAudit && (
            <button
              onClick={onOpenIntegrityAudit}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1c1c22] hover:bg-[#25252d] text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              title="Real Data Verification & Anti-Fake Audit"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Real Data Audit</span>
            </button>
          )}

          {/* Quick Hackathon Demo Trigger */}
          <button
            onClick={onRunDemo}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95 shadow-md shadow-cyan-500/20"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            <span>Try Demo</span>
          </button>

          {/* Quick Role Switcher Toggle */}
          <div className="hidden lg:flex items-center bg-[#1c1c22] p-0.5 rounded-lg border border-white/5 text-[11px]">
            <button
              onClick={() => onRoleSwitch('athlete')}
              className={`px-2.5 py-1 rounded font-medium transition cursor-pointer ${
                currentUser.role === 'athlete'
                  ? 'bg-[#0a0a0c] text-cyan-400 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Athlete
            </button>
            <button
              onClick={() => onRoleSwitch('scout')}
              className={`px-2.5 py-1 rounded font-medium transition cursor-pointer ${
                currentUser.role === 'scout'
                  ? 'bg-[#0a0a0c] text-cyan-400 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Scout
            </button>
          </div>

          {/* User Profile Card / Auth Button */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-3 p-1.5 px-2.5 rounded-xl hover:bg-[#141418] transition border border-white/5 text-left cursor-pointer"
          >
            <div className="hidden xl:block text-right">
              <div className="flex items-center justify-end gap-1 text-[10px] uppercase font-bold text-slate-400">
                <span className="text-cyan-400">{currentUser.accountType ? currentUser.accountType.toUpperCase() : currentUser.role.toUpperCase()}</span>
                {(currentUser.isEmailVerified || currentUser.isMobileVerified) && (
                  <span className="text-emerald-400 font-mono text-[9px] bg-emerald-500/10 px-1 py-0.2 rounded border border-emerald-500/30">
                    VERIFIED ✓
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-white leading-tight">{currentUser.name}</p>
            </div>
            <div className="relative">
              <img
                src={currentUser.profilePhoto}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full border-2 border-cyan-500 object-cover"
              />
              {(currentUser.isEmailVerified || currentUser.isMobileVerified) && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border border-slate-950 flex items-center justify-center text-[8px] text-slate-950 font-bold" title="Verified Mobile & Gmail Account">
                  ✓
                </div>
              )}
            </div>
          </button>
        </div>

      </div>

      {/* Mobile Nav Drawer Bar */}
      <div className="md:hidden flex items-center justify-around bg-[#0a0a0c] border-t border-white/10 px-2 py-2 text-[11px]">
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`flex flex-col items-center gap-1 cursor-pointer ${currentTab === 'dashboard' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Dash
        </button>
        <button
          onClick={() => setCurrentTab('assessment')}
          className={`flex flex-col items-center gap-1 cursor-pointer ${currentTab === 'assessment' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
        >
          <Zap className="w-4 h-4" />
          Assess
        </button>
        <button
          onClick={() => setCurrentTab('scout')}
          className={`flex flex-col items-center gap-1 cursor-pointer ${currentTab === 'scout' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
        >
          <Search className="w-4 h-4" />
          Discover
        </button>
        <button
          onClick={() => setCurrentTab('leaderboard')}
          className={`flex flex-col items-center gap-1 cursor-pointer ${currentTab === 'leaderboard' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
        >
          <Trophy className="w-4 h-4" />
          Rankings
        </button>
        <button
          onClick={onRunDemo}
          className="flex flex-col items-center gap-1 text-cyan-400 font-bold cursor-pointer"
        >
          <Play className="w-4 h-4" />
          Demo
        </button>
      </div>
    </header>
  );
};
