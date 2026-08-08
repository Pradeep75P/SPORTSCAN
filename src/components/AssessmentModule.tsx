import React, { useState, useRef, useEffect } from 'react';
import { Zap, Camera, Upload, Play, CheckCircle2, Crosshair, Sparkles, RefreshCw, AlertCircle, Video } from 'lucide-react';
import { SPORT_CONFIGS } from '../data/mockData';
import { Assessment, SportType } from '../types';
import confetti from 'canvas-confetti';

interface AssessmentModuleProps {
  onAssessmentComplete: (assessment: Assessment) => void;
  initialSport?: SportType;
}

export const AssessmentModule: React.FC<AssessmentModuleProps> = ({
  onAssessmentComplete,
  initialSport = 'athletics'
}) => {
  const [selectedSport, setSelectedSport] = useState<SportType>(initialSport);
  const [selectedDrillId, setSelectedDrillId] = useState<string>('sprint-30m');
  const [inputMode, setInputMode] = useState<'demo' | 'camera' | 'upload'>('demo');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Camera recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);

  // Analysis Pipeline Animation State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const activeSportConfig = SPORT_CONFIGS.find(s => s.id === selectedSport) || SPORT_CONFIGS[0];
  const activeDrill = activeSportConfig.drills.find(d => d.id === selectedDrillId) || activeSportConfig.drills[0];

  useEffect(() => {
    // Default preview URL from active drill sample video
    if (inputMode === 'demo') {
      setPreviewUrl(activeDrill.sampleVideoUrl);
    }
  }, [selectedDrillId, selectedSport, inputMode]);

  // Handle Camera Access
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play();
      }
    } catch (err) {
      console.warn("Camera access failed:", err);
      alert("Camera permissions denied or unavailable. Switching to Demo Video mode for testing.");
      setInputMode('demo');
    }
  };

  const startRecording = () => {
    if (!videoPreviewRef.current?.srcObject) return;
    const stream = videoPreviewRef.current.srcObject as MediaStream;
    recordedChunksRef.current = [];
    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) recordedChunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    };

    recorder.start();
    setIsRecording(true);
    setRecordTime(0);

    timerIntervalRef.current = window.setInterval(() => {
      setRecordTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

      // Stop camera track
      if (videoPreviewRef.current?.srcObject) {
        const stream = videoPreviewRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Run AI Pipeline Analysis Animation and submit to backend
  const startAIPipeline = async () => {
    setIsAnalyzing(true);
    setCurrentStep(0);

    const steps = [
      'Detecting 33 3D body landmarks',
      'Tracking movement across video frames',
      'Calculating speed & stride cadence',
      'Evaluating knee & hip joint angles',
      'Measuring balance variance & posture',
      'Generating Talent Score & AI Recommendations'
    ];

    // Step-by-step visual animation ticker (350ms per step)
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      await new Promise(r => setTimeout(r, 400));
    }

    try {
      const res = await fetch('/api/analyze-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sport: selectedSport,
          drillName: activeDrill.name,
          athleteName: 'Arun Kumar',
          athleteLocation: 'Madurai, Tamil Nadu, India',
          videoUrl: previewUrl || activeDrill.sampleVideoUrl,
          trainingFacilityAccess: 'None / Open Field'
        })
      });

      const data = await res.json();
      setIsAnalyzing(false);

      if (data.success && data.assessment) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        onAssessmentComplete(data.assessment);
      } else {
        throw new Error("Failed assessment server evaluation");
      }
    } catch (err) {
      console.error("AI Analysis error:", err);
      setIsAnalyzing(false);
      alert("Failed to analyze assessment. Please try again.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-slate-100 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-3 uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5" />
          <span>Computer Vision Analysis</span>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight uppercase">Talent Assessment Studio</h1>
        <p className="text-xs text-slate-400 mt-1">
          Select your sport, record or upload a video, and execute computer vision movement analytics.
        </p>
      </div>

      {/* Step 1: Select Sport & Drill */}
      <div className="bg-[#141418] border border-white/5 p-6 rounded-xl shadow-xl space-y-6">
        <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Step 1: Choose Sport & Drill</h3>
        
        {/* Sport Buttons */}
        <div className="grid grid-cols-3 gap-3">
          {SPORT_CONFIGS.map((sp) => (
            <button
              key={sp.id}
              onClick={() => {
                setSelectedSport(sp.id);
                setSelectedDrillId(sp.drills[0].id);
              }}
              className={`p-4 rounded-lg border text-left transition-all cursor-pointer ${
                selectedSport === sp.id
                  ? 'bg-[#1c1c22] border-cyan-400 text-cyan-400 font-bold'
                  : 'bg-[#0a0a0c] border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <span className="text-sm font-bold block text-white uppercase tracking-wider">{sp.name}</span>
              <span className="text-[10px] text-slate-400 mt-0.5 block line-clamp-1">{sp.drills.length} Drills Available</span>
            </button>
          ))}
        </div>

        {/* Drill Cards */}
        <div className="grid sm:grid-cols-2 gap-4 pt-2">
          {activeSportConfig.drills.map((drill) => (
            <div
              key={drill.id}
              onClick={() => setSelectedDrillId(drill.id)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedDrillId === drill.id
                  ? 'bg-[#1c1c22] border-cyan-400 text-white shadow-md'
                  : 'bg-[#0a0a0c] border-white/5 text-slate-400 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-bold text-white">{drill.name}</h4>
                <span className="text-[10px] font-mono text-cyan-400 bg-[#0a0a0c] px-2 py-0.5 rounded border border-cyan-500/30">
                  {drill.recommendedDuration}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3">{drill.description}</p>
              <div className="flex flex-wrap gap-1">
                {drill.keyLandmarks.map(kl => (
                  <span key={kl} className="text-[9px] bg-[#141418] text-slate-300 px-2 py-0.5 rounded border border-white/5">
                    {kl}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 2: Choose Input Mode & Video source */}
      <div className="bg-[#141418] border border-white/5 p-6 rounded-xl shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Step 2: Video Source</h3>
          <span className="text-xs text-slate-400 font-medium">Sample video loaded for quick demonstration</span>
        </div>

        {/* Input Mode Selector */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-[#0a0a0c] rounded-lg border border-white/5 text-xs uppercase tracking-wider font-semibold">
          <button
            onClick={() => setInputMode('demo')}
            className={`py-2.5 rounded font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              inputMode === 'demo' ? 'bg-[#1c1c22] text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-cyan-400" />
            Demo Video
          </button>

          <button
            onClick={() => {
              setInputMode('camera');
              startCamera();
            }}
            className={`py-2.5 rounded font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              inputMode === 'camera' ? 'bg-[#1c1c22] text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            Live Camera
          </button>

          <button
            onClick={() => setInputMode('upload')}
            className={`py-2.5 rounded font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              inputMode === 'upload' ? 'bg-[#1c1c22] text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload File
          </button>
        </div>

        {/* Video Preview Box */}
        <div className="relative aspect-video w-full rounded-xl bg-[#0a0a0c] border border-white/10 overflow-hidden flex items-center justify-center">
          
          {inputMode === 'camera' && !previewUrl ? (
            <video
              ref={videoPreviewRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              src={previewUrl || activeDrill.sampleVideoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-contain"
            />
          )}

          {/* Camera Record Overlay Controls */}
          {inputMode === 'camera' && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-[#0a0a0c]/90 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-2xl">
              {isRecording ? (
                <>
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                  <span className="font-mono text-xs font-bold text-red-400">{recordTime}s</span>
                  <button
                    onClick={stopRecording}
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider rounded-full cursor-pointer"
                  >
                    Stop Recording
                  </button>
                </>
              ) : (
                <button
                  onClick={startRecording}
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-full flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <Video className="w-4 h-4" />
                  Start Recording
                </button>
              )}
            </div>
          )}

          {/* Upload Input Overlay */}
          {inputMode === 'upload' && !uploadedFile && (
            <div className="absolute inset-0 bg-[#0a0a0c]/90 flex flex-col items-center justify-center p-6 text-center">
              <Upload className="w-10 h-10 text-cyan-400 mb-2" />
              <p className="text-sm font-bold text-white uppercase tracking-wider">Select a video file to analyze</p>
              <p className="text-xs text-slate-400 mb-4">MP4, WebM, or MOV up to 50MB</p>
              <label className="px-5 py-2.5 bg-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg cursor-pointer hover:bg-cyan-400 transition">
                Browse Video
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

        </div>

        {/* Action Trigger Button */}
        <button
          onClick={startAIPipeline}
          disabled={isAnalyzing}
          className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-widest rounded-lg shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Zap className="w-5 h-5 fill-slate-950" />
          <span>Execute AI Biomechanical Analysis</span>
        </button>

      </div>

      {/* AI Analysis Ticker Modal / Overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a0c]/90 backdrop-blur-lg animate-fadeIn">
          <div className="bg-[#141418] border border-cyan-500/40 rounded-2xl w-full max-w-lg p-8 shadow-2xl text-center space-y-6">
            
            <div className="w-16 h-16 rounded-full bg-[#1c1c22] border border-cyan-500/40 flex items-center justify-center mx-auto">
              <Crosshair className="w-8 h-8 text-cyan-400 animate-spin" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white uppercase tracking-wider">Analyzing Athlete Biomechanics</h3>
              <p className="text-xs text-slate-400 mt-1">
                Computer Vision Pose Engine + Kinematic Evaluation
              </p>
            </div>

            {/* Step Checkmarks */}
            <div className="space-y-2.5 text-left bg-[#0a0a0c] p-5 rounded-xl border border-white/5 text-xs">
              {[
                'Detecting body landmarks',
                'Tracking movement across video frames',
                'Calculating speed & stride cadence',
                'Evaluating joint angles & technique',
                'Measuring balance & posture',
                'Generating Talent Score & AI Feedback'
              ].map((stepText, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  {idx < currentStep ? (
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  ) : idx === currentStep ? (
                    <span className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin shrink-0" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                  )}
                  <span className={idx <= currentStep ? 'text-slate-200 font-medium' : 'text-slate-500'}>
                    {stepText}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
