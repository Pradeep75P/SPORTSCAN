import React from 'react';
import { Zap, Play, Search, Shield, ArrowRight, Award, ChevronRight, Activity, Target, Sparkles, CheckCircle, Smartphone } from 'lucide-react';
import { PoseCanvas } from './PoseCanvas';

interface LandingPageProps {
  onStartAssessment: () => void;
  onExploreAthletes: () => void;
  onRunDemo: () => void;
  athletesCount?: number;
  assessmentsCount?: number;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartAssessment,
  onExploreAthletes,
  onRunDemo,
  athletesCount = 0,
  assessmentsCount = 0
}) => {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141418] border border-white/10 text-cyan-400 text-xs font-semibold shadow-xl">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span className="uppercase tracking-wider">AI Computer Vision Scouting</span>
                <span className="bg-cyan-500 text-slate-950 px-1.5 py-0.5 rounded text-[10px] font-bold">2026</span>
              </div>

              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight text-white font-sans leading-[1.1]">
                TALENT IS EVERYWHERE.{' '}
                <span className="text-cyan-400">
                  OPPORTUNITY SHOULD BE TOO.
                </span>
              </h1>

              <p className="text-base text-slate-300 max-w-2xl font-normal leading-relaxed">
                Perform professional biomechanical assessments using your smartphone. Measure performance, receive instant computer-vision analytics, and get discovered by top scouts worldwide.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={onStartAssessment}
                  className="px-6 py-3.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-xl shadow-cyan-500/20 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Start Assessment</span>
                </button>

                <button
                  onClick={onExploreAthletes}
                  className="px-6 py-3.5 rounded-lg bg-[#141418] hover:bg-[#1c1c22] text-slate-200 font-semibold text-xs uppercase tracking-wider border border-white/10 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
                >
                  <Search className="w-4 h-4 text-slate-400" />
                  <span>Discover Talent</span>
                </button>

                <button
                  onClick={onRunDemo}
                  className="px-6 py-3.5 rounded-lg bg-[#1c1c22] text-cyan-400 font-bold text-xs uppercase tracking-wider border border-cyan-500/30 hover:bg-cyan-500/10 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-cyan-400" />
                  <span>Try Demo Mode</span>
                </button>
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10">
                <div className="bg-[#141418] p-3.5 rounded-xl border border-white/5">
                  <p className="text-2xl font-bold text-white font-mono">98.4%</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 uppercase tracking-wider">Kinematic Accuracy</p>
                </div>
                <div className="bg-[#141418] p-3.5 rounded-xl border border-white/5">
                  <p className="text-2xl font-bold text-cyan-400 font-mono">{athletesCount}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 uppercase tracking-wider">Verified Athletes</p>
                </div>
                <div className="bg-[#141418] p-3.5 rounded-xl border border-white/5">
                  <p className="text-2xl font-bold text-emerald-400 font-mono">{assessmentsCount}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 uppercase tracking-wider">AI Assessments</p>
                </div>
              </div>

            </div>

            {/* Right Video Pose Interactive Demo Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl p-1.5 bg-[#141418] border border-white/10 shadow-2xl">
                <div className="bg-[#0a0a0c] rounded-xl overflow-hidden">
                  <PoseCanvas
                    videoUrl="https://assets.mixkit.co/videos/preview/mixkit-man-running-on-a-track-40248-large.mp4"
                    kineticData={{
                      kneeAngle: 118,
                      hipAngle: 168,
                      shoulderAngle: 84,
                      strideCadence: 210,
                      postureScore: 91,
                      balanceVariance: 4.2,
                      peakVelocity: 9.6
                    }}
                  />
                  
                  {/* Overlay live result callout */}
                  <div className="p-4 bg-[#141418] border-t border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sprint Biomechanics</p>
                      <p className="text-sm font-bold text-white mt-0.5">Arun Kumar (18y, Grassroots)</p>
                    </div>
                    <div className="bg-[#1c1c22] border border-cyan-500/30 px-3 py-1 rounded-lg text-right">
                      <p className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider">Talent Score</p>
                      <p className="text-lg font-bold text-white font-mono">89/100</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Workflow Steps Section */}
      <section className="py-16 bg-[#0a0a0c] border-y border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">How It Works</h2>
            <p className="text-2xl sm:text-3xl font-bold text-white mt-1">
              RECORD → ANALYZE → DISCOVER
            </p>
            <p className="text-sm text-slate-400 mt-2">
              Turn any smartphone camera into a FIFA/Olympic grade biomechanical analysis platform.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Record Video',
                desc: 'Capture a 10-second smartphone video of your sprint, dribble, or bowling action.',
                icon: Smartphone,
              },
              {
                step: '02',
                title: 'AI Pose Tracking',
                desc: 'Computer vision extracts 33 3D skeletal landmarks across every video frame.',
                icon: Activity,
              },
              {
                step: '03',
                title: 'Talent Scoring',
                desc: 'Get an objective 0–100 Talent Score across Speed, Technique, Agility, and Balance.',
                icon: Zap,
              },
              {
                step: '04',
                title: 'Scout Discovery',
                desc: 'Your verified athletic profile is published to elite scouts and academy directors.',
                icon: Award,
              }
            ].map((st) => (
              <div key={st.step} className="bg-[#141418] p-6 rounded-xl border border-white/5 relative hover:border-cyan-500/30 transition-all group">
                <span className="text-2xl font-bold text-slate-600 font-mono absolute top-4 right-4">{st.step}</span>
                <st.icon className="w-8 h-8 text-cyan-400 mb-4" />
                <h3 className="text-base font-bold text-white mb-2">{st.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Supported Sports Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Supported Sports</h2>
          <p className="text-3xl font-bold text-white mt-1">Multi-Sport Biomechanical Analysis</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              sport: 'Athletics & Sprinting',
              desc: '30m Sprint Acceleration, Flying 10m Velocity, Stride Frequency, Knee Drive Angle & Trunk Lean.',
              image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=600&q=80',
              metrics: ['Hip Extension', 'Cadence SPM', 'Posture Lean']
            },
            {
              sport: 'Football / Soccer',
              desc: '5-10-5 Agility Shuttle, Ball Control Speed, Center of Gravity Dribble Balance & Shot Mechanics.',
              image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80',
              metrics: ['Agility Turn Angle', 'Plant Knee Stability', 'Burst Acceleration']
            },
            {
              sport: 'Cricket',
              desc: 'Fast Bowling Run-Up & Release Point, Front-Knee Brace Angle, Cover Drive Stance & High Elbow Arc.',
              image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=600&q=80',
              metrics: ['Bowler Arm Vertical Angle', 'Front Knee Lock', 'Thoracic Torque']
            }
          ].map((sp) => (
            <div key={sp.sport} className="bg-[#141418] border border-white/5 rounded-xl overflow-hidden hover:border-cyan-500/40 transition-all group">
              <div className="h-48 relative overflow-hidden">
                <img
                  src={sp.image}
                  alt={sp.sport}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141418] via-transparent to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2">{sp.sport}</h3>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">{sp.desc}</p>
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                  {sp.metrics.map(m => (
                    <span key={m} className="text-[10px] bg-[#1c1c22] text-cyan-400 border border-white/5 px-2.5 py-1 rounded font-medium">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Underdog Potential Feature Highlight */}
      <section className="py-16 bg-[#141418] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-4">
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              <span className="uppercase tracking-wider">Equity in Scouting</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              UNDERDOG POTENTIAL INDEX
            </h2>
            <p className="text-slate-300 mt-4 text-sm leading-relaxed">
              Grassroots athletes often lack access to synthetic tracks, specialized coaching, or modern training equipment.
            </p>
            <p className="text-slate-400 mt-3 text-sm leading-relaxed">
              Our <strong className="text-cyan-400">Underdog Potential Index</strong> contextualizes kinematic velocity against environmental training factors, ensuring high-potential athletes from underserved regions get equal scouting exposure.
            </p>

            <div className="mt-6 space-y-2">
              {[
                'Contextualized for training surface (dirt vs turf vs track)',
                'Measures raw explosive power relative to training access',
                'Algorithmic decision support tool for talent scouts'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <button
                onClick={onStartAssessment}
                className="px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Test Your Index
              </button>
            </div>
          </div>

          {/* Underdog Potential Card Mockup */}
          <div className="bg-[#0a0a0c] border border-cyan-500/30 rounded-xl p-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                  alt="Arun Kumar"
                  className="w-12 h-12 rounded-lg object-cover border border-cyan-500"
                />
                <div>
                  <h4 className="text-base font-bold text-white">Arun Kumar</h4>
                  <p className="text-xs text-slate-400">Madurai, TN • Open Dirt Track Training</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">Underdog Index</span>
                <span className="text-2xl font-bold text-white font-mono">95/100</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 mt-4 italic bg-[#1c1c22] p-3.5 rounded-lg border border-white/5">
              "Self-trained sprinter clocking 10.8s on open dirt tracks with no spikes or professional coaching. Exceptional velocity relative to facility access."
            </p>
          </div>
        </div>
      </section>

      {/* Real Science & Zero Exaggeration Integrity Guarantee */}
      <section className="py-16 bg-[#0a0a0c] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#141418] border border-cyan-500/30 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Real Data Integrity Standard</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider">
                  REAL KINEMATICS. ZERO FAKE NEWS. 100% OBJECTIVE.
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  SportScan AI eliminates subjective bias and fake exaggerated claims. Every single metric is computed directly from 33 3D skeletal MediaPipe landmarks, trigonometric joint flexion formulas, and World Athletics / FIFA standard benchmarks.
                </p>

                <div className="grid sm:grid-cols-3 gap-4 pt-2">
                  <div className="bg-[#0a0a0c] p-3.5 rounded-xl border border-white/5 space-y-1">
                    <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Anti-Tamper Checking</p>
                    <p className="text-[11px] text-slate-400">Automatic frame-rate analysis and speed-up video detection ensures zero manipulated footage.</p>
                  </div>
                  <div className="bg-[#0a0a0c] p-3.5 rounded-xl border border-white/5 space-y-1">
                    <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Open Telemetry</p>
                    <p className="text-[11px] text-slate-400">Scouts can inspect raw $x, y, z$ landmark coordinates and timestamp logs for full transparency.</p>
                  </div>
                  <div className="bg-[#0a0a0c] p-3.5 rounded-xl border border-white/5 space-y-1">
                    <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Verified Badges</p>
                    <p className="text-[11px] text-slate-400">Clear distinction between AI Computer-Vision Assessments and self-reported community metrics.</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 bg-[#0a0a0c] p-6 rounded-xl border border-white/10 text-center space-y-3">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Verification Engine Status</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-lg font-bold font-mono text-cyan-400">100% Active</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  All computer vision assessments pass trigonometric joint validation before publication to scouts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-[#0a0a0c] border-t border-white/10 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 SportScan AI. Democratizing Sports Talent Scouting.</p>
          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <span>Terms of Service</span>
            <span>Privacy & Safety</span>
            <span>Technical Methodology</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
