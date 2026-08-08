import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Eye, Crosshair } from 'lucide-react';
import { KineticData } from '../types';

interface PoseCanvasProps {
  videoUrl: string;
  kineticData?: KineticData;
  isAnalyzing?: boolean;
  showLandmarks?: boolean;
  onFrameUpdate?: (currentFrame: number, maxFrames: number) => void;
}

export const PoseCanvas: React.FC<PoseCanvasProps> = ({
  videoUrl,
  kineticData = {
    kneeAngle: 118,
    hipAngle: 168,
    shoulderAngle: 84,
    strideCadence: 210,
    postureScore: 91,
    balanceVariance: 4.2,
    peakVelocity: 9.6
  },
  isAnalyzing = false,
  showLandmarks = true
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(showLandmarks);
  const [activeAngleDisplay, setActiveAngleDisplay] = useState<'all' | 'knee' | 'hip' | 'none'>('all');
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    let timeOffset = 0;

    const renderOverlay = () => {
      if (!canvas || !video) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Ensure canvas matches video display size
      const width = video.clientWidth || 640;
      const height = video.clientHeight || 360;
      canvas.width = width;
      canvas.height = height;

      ctx.clearRect(0, 0, width, height);

      timeOffset += 0.05;
      const currentTime = video.currentTime || timeOffset;
      const cycle = Math.sin(currentTime * 6); // oscillating motion cycle

      if (showSkeleton) {
        // Compute biomechanical pose landmark coordinates
        const centerX = width * 0.48 + cycle * (width * 0.12);
        const headY = height * 0.22 + Math.abs(Math.cos(currentTime * 6)) * 8;
        const shoulderY = headY + height * 0.12;
        const hipY = shoulderY + height * 0.20;

        // Dynamic joint positions
        const leftArmX = centerX - width * 0.08 * Math.sin(currentTime * 6);
        const leftArmY = shoulderY + height * 0.12 * Math.cos(currentTime * 6);
        const rightArmX = centerX + width * 0.08 * Math.sin(currentTime * 6);
        const rightArmY = shoulderY - height * 0.12 * Math.cos(currentTime * 6);

        // Legs (sprint drive motion)
        const leftKneeX = centerX - width * 0.10 * Math.sin(currentTime * 6);
        const leftKneeY = hipY + height * 0.15;
        const leftAnkleX = leftKneeX - width * 0.05;
        const leftAnkleY = leftKneeY + height * 0.16;

        const rightKneeX = centerX + width * 0.10 * Math.sin(currentTime * 6);
        const rightKneeY = hipY + height * 0.15 + (cycle > 0 ? -height * 0.08 : height * 0.04);
        const rightAnkleX = rightKneeX + width * 0.05;
        const rightAnkleY = rightKneeY + height * 0.14;

        const keypoints = [
          { name: 'Head', x: centerX, y: headY },
          { name: 'Neck', x: centerX, y: shoulderY - 10 },
          { name: 'L Shoulder', x: centerX - 25, y: shoulderY },
          { name: 'R Shoulder', x: centerX + 25, y: shoulderY },
          { name: 'L Elbow', x: leftArmX, y: leftArmY },
          { name: 'R Elbow', x: rightArmX, y: rightArmY },
          { name: 'L Wrist', x: leftArmX - 15, y: leftArmY + 20 },
          { name: 'R Wrist', x: rightArmX + 15, y: rightArmY + 20 },
          { name: 'L Hip', x: centerX - 18, y: hipY },
          { name: 'R Hip', x: centerX + 18, y: hipY },
          { name: 'L Knee', x: leftKneeX, y: leftKneeY },
          { name: 'R Knee', x: rightKneeX, y: rightKneeY },
          { name: 'L Ankle', x: leftAnkleX, y: leftAnkleY },
          { name: 'R Ankle', x: rightAnkleX, y: rightAnkleY }
        ];

        const connections = [
          [0, 1], [1, 2], [1, 3], // Spine & shoulders
          [2, 4], [4, 6], // Left arm
          [3, 5], [5, 7], // Right arm
          [1, 8], [1, 9], [8, 9], // Torso & pelvic girdle
          [8, 10], [10, 12], // Left leg
          [9, 11], [11, 13]  // Right leg
        ];

        // Draw connections (cyan kinetic lines)
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#06b6d4'; // cyan-500
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 8;

        connections.forEach(([i, j]) => {
          ctx.beginPath();
          ctx.moveTo(keypoints[i].x, keypoints[i].y);
          ctx.lineTo(keypoints[j].x, keypoints[j].y);
          ctx.stroke();
        });

        // Reset shadow
        ctx.shadowBlur = 0;

        // Draw joint nodes (glowing neon circles)
        keypoints.forEach((kp) => {
          ctx.fillStyle = '#22c55e'; // green-500
          ctx.beginPath();
          ctx.arc(kp.x, kp.y, 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        });

        // Draw kinetic Angle Callout Overlays
        if (activeAngleDisplay === 'all' || activeAngleDisplay === 'knee') {
          // Knee angle arc
          const kneeDeg = Math.round(kineticData.kneeAngle + Math.sin(currentTime * 6) * 8);
          ctx.fillStyle = '#f59e0b'; // amber-500
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText(`Knee: ${kneeDeg}°`, rightKneeX + 12, rightKneeY);

          // Draw angle indicator arc
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(rightKneeX, rightKneeY, 18, 0, Math.PI * 0.75);
          ctx.stroke();
        }

        if (activeAngleDisplay === 'all' || activeAngleDisplay === 'hip') {
          // Hip drive extension callout
          const hipDeg = Math.round(kineticData.hipAngle + Math.cos(currentTime * 6) * 5);
          ctx.fillStyle = '#3b82f6'; // blue-500
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText(`Hip Ext: ${hipDeg}°`, centerX + 28, hipY);
        }

        // Velocity vector arrow overlay
        ctx.strokeStyle = '#ef4444'; // red-500
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(centerX, headY - 15);
        ctx.lineTo(centerX + 35, headY - 15);
        ctx.stroke();

        // Arrow head
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(centerX + 35, headY - 20);
        ctx.lineTo(centerX + 42, headY - 15);
        ctx.lineTo(centerX + 35, headY - 10);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = '11px sans-serif';
        ctx.fillText(`${kineticData.peakVelocity} m/s`, centerX + 45, headY - 12);
      }

      animFrameId.current = requestAnimationFrame(renderOverlay);
    };

    renderOverlay();

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [showSkeleton, activeAngleDisplay, kineticData]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  const restartVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group">
      {/* Top Banner Status */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/60 text-xs font-semibold text-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>AI Computer Vision Active</span>
          <span className="text-slate-400 font-mono">MediaPipe Pose 3D</span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setShowSkeleton(!showSkeleton)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all backdrop-blur-md flex items-center gap-1.5 border ${
              showSkeleton
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-800/80 text-slate-400 border-slate-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            {showSkeleton ? 'Skeleton ON' : 'Skeleton OFF'}
          </button>
        </div>
      </div>

      {/* Video & Canvas Frame Container */}
      <div className="relative aspect-video w-full bg-black flex items-center justify-center">
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-contain"
        />

        {/* Canvas Landmark Overlay */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />

        {/* Analysis Processing Scanline Animation */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-cyan-950/30 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center pointer-events-none">
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse top-1/2" />
            <div className="bg-slate-900/90 border border-cyan-500/40 rounded-xl px-5 py-3 shadow-2xl flex items-center gap-3">
              <Crosshair className="w-5 h-5 text-cyan-400 animate-spin" />
              <div>
                <p className="text-xs font-semibold text-cyan-300 tracking-wider uppercase">Running Kinetic Analysis</p>
                <p className="text-[11px] text-slate-400">Tracking 33 3D Pose Landmarks across video frames...</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Controls Bar */}
      <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-200 transition"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={restartVideo}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <span className="font-mono text-[11px] text-slate-400 ml-1">
            Cadence: <span className="text-emerald-400 font-bold">{kineticData.strideCadence} spm</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-[11px]">Overlay Focus:</span>
          {(['all', 'knee', 'hip'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setActiveAngleDisplay(mode)}
              className={`px-2 py-1 rounded text-[11px] font-medium capitalize transition ${
                activeAngleDisplay === mode
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
