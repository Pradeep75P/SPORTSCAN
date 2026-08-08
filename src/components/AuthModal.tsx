import React, { useState, useEffect, useRef } from 'react';
import { 
  X, User, Search, Lock, Mail, Phone, ShieldCheck, Zap, 
  CheckCircle2, Award, Users, ArrowRight, ArrowLeft, RefreshCw, 
  Sparkles, Smartphone, Check, AlertCircle 
} from 'lucide-react';
import { Role, User as UserType, SportType } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserType) => void;
}

export type AccountTypeOption = 'athlete' | 'scout' | 'coach' | 'parent';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('signup');
  const [signupStep, setSignupStep] = useState<number>(1); // 1: Account Type, 2: Personal Info, 3: OTP Verification, 4: Complete

  // Form Fields
  const [accountType, setAccountType] = useState<AccountTypeOption>('athlete');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [sport, setSport] = useState<SportType>('athletics');
  const [location, setLocation] = useState('Madurai, Tamil Nadu');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');

  // Verification Settings
  const [verificationChannel, setVerificationChannel] = useState<'dual' | 'email' | 'mobile'>('dual');
  
  // Gmail OTP state
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpDigits, setEmailOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [emailOtpVerified, setEmailOtpVerified] = useState(false);
  const [emailSimulatedCode, setEmailSimulatedCode] = useState<string>('');

  // Mobile OTP state
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [mobileOtpDigits, setMobileOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [mobileOtpVerified, setMobileOtpVerified] = useState(false);
  const [mobileSimulatedCode, setMobileSimulatedCode] = useState<string>('');

  // Timer & UI State
  const [resendTimer, setResendTimer] = useState<number>(0);
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Refs for OTP Input auto-focus
  const emailInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const mobileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let timer: any;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  if (!isOpen) return null;

  // Handle Login form submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mappedRole: Role = accountType === 'scout' || accountType === 'coach' ? 'scout' : 'athlete';
    const loggedUser: UserType = {
      id: `u-${Date.now()}`,
      name: name || (mappedRole === 'athlete' ? 'Arun Kumar' : 'Coach Vikram Sharma'),
      email: email || 'user@sportscan.ai',
      phone: phone ? `${countryCode} ${phone}` : '+91 9876543210',
      role: mappedRole,
      accountType,
      organization,
      isEmailVerified: true,
      isMobileVerified: true,
      profilePhoto: mappedRole === 'athlete'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
        : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      location: location || 'Madurai, India',
      sport,
      age: 18,
      gender: 'Male',
      experienceLevel: 'Grassroots',
      createdAt: new Date().toISOString()
    };
    onLoginSuccess(loggedUser);
    onClose();
  };

  // Dispatch OTP code request
  const handleSendOtps = async () => {
    setErrorMessage(null);
    setIsSendingOtp(true);
    try {
      // Send Email OTP
      if (verificationChannel === 'dual' || verificationChannel === 'email') {
        const targetEmail = email || 'user@gmail.com';
        const res = await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'email', recipient: targetEmail })
        });
        const data = await res.json();
        if (data.success) {
          setEmailOtpSent(true);
          setEmailSimulatedCode(data.simulatedCode || '784920');
        }
      }

      // Send Mobile SMS OTP
      if (verificationChannel === 'dual' || verificationChannel === 'mobile') {
        const targetMobile = `${countryCode} ${phone || '9876543210'}`;
        const res = await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'mobile', recipient: targetMobile })
        });
        const data = await res.json();
        if (data.success) {
          setMobileOtpSent(true);
          setMobileSimulatedCode(data.simulatedCode || '593814');
        }
      }

      setResendTimer(60);
    } catch (err) {
      console.error('Failed to send OTP:', err);
      // Fallback offline simulated codes if network fails
      setEmailOtpSent(true);
      setEmailSimulatedCode('784920');
      setMobileOtpSent(true);
      setMobileSimulatedCode('593814');
      setResendTimer(60);
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Auto-fill test code for convenience
  const handleQuickAutoFillOtp = () => {
    if (emailOtpSent && emailSimulatedCode) {
      setEmailOtpDigits(emailSimulatedCode.split(''));
      setEmailOtpVerified(true);
    }
    if (mobileOtpSent && mobileSimulatedCode) {
      setMobileOtpDigits(mobileSimulatedCode.split(''));
      setMobileOtpVerified(true);
    }
    setErrorMessage(null);
  };

  // Verify entered OTP digits
  const handleVerifyOtp = async (type: 'email' | 'mobile') => {
    setErrorMessage(null);
    const codeDigits = type === 'email' ? emailOtpDigits : mobileOtpDigits;
    const fullCode = codeDigits.join('');
    
    if (fullCode.length < 6) {
      setErrorMessage(`Please enter the complete 6-digit ${type === 'email' ? 'Gmail' : 'Mobile SMS'} OTP.`);
      return;
    }

    const recipient = type === 'email' 
      ? (email || 'user@gmail.com')
      : `${countryCode} ${phone || '9876543210'}`;

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient, otp: fullCode })
      });
      const data = await res.json();
      if (data.success && data.verified) {
        if (type === 'email') setEmailOtpVerified(true);
        if (type === 'mobile') setMobileOtpVerified(true);
      } else {
        setErrorMessage(data.message || 'Invalid OTP code.');
      }
    } catch (err) {
      // Local fallback check
      const expectedCode = type === 'email' ? emailSimulatedCode : mobileSimulatedCode;
      if (fullCode === expectedCode || fullCode === '123456') {
        if (type === 'email') setEmailOtpVerified(true);
        if (type === 'mobile') setMobileOtpVerified(true);
      } else {
        setErrorMessage('Invalid OTP code. Please enter the 6-digit code shown in blue.');
      }
    }
  };

  // Complete Signup Registration
  const handleCompleteAccountCreation = () => {
    const mappedRole: Role = accountType === 'scout' || accountType === 'coach' ? 'scout' : 'athlete';
    const newRegisteredUser: UserType = {
      id: `u-${Date.now()}`,
      name: name.trim() || 'Arun Kumar',
      email: email.trim() || 'arun.gmail@sportscan.ai',
      phone: `${countryCode} ${phone.trim() || '9876543210'}`,
      role: mappedRole,
      accountType,
      organization: organization.trim() || undefined,
      isEmailVerified: emailOtpVerified || verificationChannel === 'mobile',
      isMobileVerified: mobileOtpVerified || verificationChannel === 'email',
      profilePhoto: mappedRole === 'athlete'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
        : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      location: location.trim() || 'Madurai, Tamil Nadu',
      sport: sport || 'athletics',
      age: 18,
      gender: 'Male',
      experienceLevel: 'Grassroots',
      createdAt: new Date().toISOString()
    };

    onLoginSuccess(newRegisteredUser);
    onClose();
  };

  // Quick Demo presets
  const handleQuickDemoAthlete = () => {
    onLoginSuccess({
      id: 'u-001',
      name: 'Arun Kumar',
      email: 'arun.speed@sportscan.ai',
      phone: '+91 9876543210',
      role: 'athlete',
      accountType: 'athlete',
      isEmailVerified: true,
      isMobileVerified: true,
      profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      location: 'Madurai, Tamil Nadu',
      sport: 'athletics',
      age: 18,
      gender: 'Male',
      experienceLevel: 'Grassroots',
      createdAt: new Date().toISOString()
    });
    onClose();
  };

  const handleQuickDemoScout = () => {
    onLoginSuccess({
      id: 'u-scout-001',
      name: 'Coach Vikram Sharma',
      email: 'vikram.scout@sportsacademy.in',
      phone: '+91 9811223344',
      role: 'scout',
      accountType: 'scout',
      organization: 'National Athletics Federation',
      isEmailVerified: true,
      isMobileVerified: true,
      profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      location: 'New Delhi, India',
      sport: 'athletics',
      age: 42,
      gender: 'Male',
      experienceLevel: 'Advanced',
      createdAt: new Date().toISOString()
    });
    onClose();
  };

  // Handle individual digit typing for OTP
  const handleDigitChange = (
    type: 'email' | 'mobile',
    index: number,
    value: string
  ) => {
    const val = value.slice(-1);
    if (type === 'email') {
      const next = [...emailOtpDigits];
      next[index] = val;
      setEmailOtpDigits(next);
      if (val && index < 5) {
        emailInputRefs.current[index + 1]?.focus();
      }
    } else {
      const next = [...mobileOtpDigits];
      next[index] = val;
      setMobileOtpDigits(next);
      if (val && index < 5) {
        mobileInputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleDigitKeyDown = (
    type: 'email' | 'mobile',
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace') {
      const digits = type === 'email' ? emailOtpDigits : mobileOtpDigits;
      if (!digits[index] && index > 0) {
        if (type === 'email') {
          emailInputRefs.current[index - 1]?.focus();
        } else {
          mobileInputRefs.current[index - 1]?.focus();
        }
      }
    }
  };

  const isOtpStepReadyToProceed = () => {
    if (verificationChannel === 'dual') return emailOtpVerified && mobileOtpVerified;
    if (verificationChannel === 'email') return emailOtpVerified;
    if (verificationChannel === 'mobile') return mobileOtpVerified;
    return false;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a0c]/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#141418] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative overflow-hidden text-slate-100 max-h-[92vh] overflow-y-auto">
        
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1c1c22] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6 pt-2">
          <div className="w-12 h-12 rounded-xl bg-[#0a0a0c] border border-cyan-500/30 flex items-center justify-center mx-auto mb-3 text-cyan-400 shadow-lg shadow-cyan-500/10">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white uppercase tracking-wider">
            {mode === 'login' ? 'Welcome Back' : 'Create Verified Account'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login' 
              ? 'Access your AI sports talent assessments and scouting reports'
              : 'Sign up with Gmail & Mobile SMS OTP verification for instant credentialing'}
          </p>
        </div>

        {/* Mode Toggle (Login vs Signup) */}
        <div className="flex border-b border-white/10 mb-6 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => { setMode('signup'); setSignupStep(1); }}
            className={`flex-1 py-2.5 text-center transition border-b-2 cursor-pointer ${
              mode === 'signup' ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Create New Account
          </button>
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2.5 text-center transition border-b-2 cursor-pointer ${
              mode === 'login' ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Log In Existing
          </button>
        </div>

        {/* Mode = LOGIN */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            {/* Quick Demo Login Preset */}
            <div className="bg-[#0a0a0c] p-3 rounded-xl border border-white/5 space-y-2">
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 text-center">Quick One-Click Demo Access</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleQuickDemoAthlete}
                  className="px-3 py-2 bg-[#1c1c22] hover:bg-[#25252d] text-cyan-400 border border-cyan-500/30 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  Athlete Account
                </button>
                <button
                  type="button"
                  onClick={handleQuickDemoScout}
                  className="px-3 py-2 bg-[#1c1c22] hover:bg-[#25252d] text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  Scout Account
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold uppercase tracking-wider block mb-1">Email or Mobile Number</label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="athlete@gmail.com or +91 9876543210"
                className="w-full px-3.5 py-2.5 bg-[#0a0a0c] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold uppercase tracking-wider block mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-[#0a0a0c] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold uppercase tracking-wider rounded-lg text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              Sign In to SportScan AI
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Mode = SIGNUP (Step-by-Step Wizard) */}
        {mode === 'signup' && (
          <div>
            {/* Step Progress Indicators */}
            <div className="flex items-center justify-between mb-6 px-2">
              {[
                { step: 1, label: 'Account Type' },
                { step: 2, label: 'Profile Info' },
                { step: 3, label: 'OTP Verify' },
                { step: 4, label: 'Complete' }
              ].map((s) => (
                <div key={s.step} className="flex flex-col items-center flex-1 relative">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    signupStep === s.step 
                      ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-400/50' 
                      : signupStep > s.step 
                        ? 'bg-emerald-500 text-slate-950' 
                        : 'bg-[#1c1c22] text-slate-500 border border-white/10'
                  }`}>
                    {signupStep > s.step ? <Check className="w-4 h-4 stroke-[3]" /> : s.step}
                  </div>
                  <span className={`text-[10px] uppercase font-bold tracking-wider mt-1 ${
                    signupStep === s.step ? 'text-cyan-400' : signupStep > s.step ? 'text-emerald-400' : 'text-slate-500'
                  }`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* ERROR ALERT */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* STEP 1: ACCOUNT TYPE SELECTION */}
            {signupStep === 1 && (
              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Select Your Primary Account Type:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: 'athlete',
                      title: 'Athlete / Player',
                      desc: 'Record video drills, get AI biomechanical scores & scout card',
                      icon: User,
                      badge: 'For Grassroots & Pros',
                      color: 'border-cyan-500/50 bg-cyan-500/5 text-cyan-400'
                    },
                    {
                      id: 'scout',
                      title: 'Scout / Club Representative',
                      desc: 'Discover verified talent, view kinetic telemetry & send invites',
                      icon: Search,
                      badge: 'For Talent Scouts',
                      color: 'border-emerald-500/50 bg-emerald-500/5 text-emerald-400'
                    },
                    {
                      id: 'coach',
                      title: 'Coach / Academy Admin',
                      desc: 'Analyze team squad performance, stride cadence & drill logs',
                      icon: Award,
                      badge: 'For Sports Academies',
                      color: 'border-amber-500/50 bg-amber-500/5 text-amber-400'
                    },
                    {
                      id: 'parent',
                      title: 'Parent / Guardian',
                      desc: 'Manage and monitor youth sports progress & safety profiles',
                      icon: ShieldCheck,
                      badge: 'For Young Athletes',
                      color: 'border-purple-500/50 bg-purple-500/5 text-purple-400'
                    }
                  ].map((opt) => {
                    const IconComp = opt.icon;
                    const isSelected = accountType === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setAccountType(opt.id as AccountTypeOption)}
                        className={`p-4 rounded-xl border text-left transition-all relative cursor-pointer ${
                          isSelected 
                            ? `${opt.color} shadow-lg ring-1 ring-cyan-500/30` 
                            : 'border-white/10 bg-[#0a0a0c] hover:bg-[#141418] text-slate-300'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center text-[10px]">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                        <div className="flex items-center gap-2 mb-1.5">
                          <IconComp className={`w-4 h-4 ${isSelected ? '' : 'text-slate-400'}`} />
                          <span className="font-bold text-xs uppercase tracking-wider text-white">{opt.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug">{opt.desc}</p>
                        <span className="inline-block mt-2 text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">
                          {opt.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSignupStep(2)}
                    className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold uppercase tracking-wider rounded-lg text-xs flex items-center gap-2 cursor-pointer transition shadow-md shadow-cyan-500/20"
                  >
                    Continue to Details
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: PERSONAL & CONTACT INFORMATION */}
            {signupStep === 2 && (
              <form onSubmit={(e) => { e.preventDefault(); setSignupStep(3); handleSendOtps(); }} className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Step 2: Enter Account Details ({accountType.toUpperCase()})
                  </p>
                  <button
                    type="button"
                    onClick={() => setSignupStep(1)}
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3 h-3" /> Change Type
                  </button>
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 font-semibold uppercase tracking-wider block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Arun Kumar"
                    className="w-full px-3.5 py-2 bg-[#0a0a0c] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold uppercase tracking-wider block mb-1">
                      Gmail / Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="arun.kumar@gmail.com"
                        className="w-full pl-9 pr-3 py-2 bg-[#0a0a0c] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold uppercase tracking-wider block mb-1">
                      Mobile Number (SMS OTP) *
                    </label>
                    <div className="flex gap-1.5">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="px-2 py-2 bg-[#0a0a0c] border border-white/10 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                      >
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+971">🇦🇪 +971</option>
                        <option value="+61">🇦🇺 +61</option>
                      </select>
                      <div className="relative flex-1">
                        <Smartphone className="w-3.5 h-3.5 absolute left-2.5 top-3 text-slate-400" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="98765 43210"
                          className="w-full pl-8 pr-3 py-2 bg-[#0a0a0c] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold uppercase tracking-wider block mb-1">Primary Sport</label>
                    <select
                      value={sport}
                      onChange={(e) => setSport(e.target.value as SportType)}
                      className="w-full px-3 py-2 bg-[#0a0a0c] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="athletics">Athletics / Sprinting</option>
                      <option value="football">Football / Soccer</option>
                      <option value="cricket">Cricket</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold uppercase tracking-wider block mb-1">Location / State</label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Madurai, Tamil Nadu"
                      className="w-full px-3.5 py-2 bg-[#0a0a0c] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {(accountType === 'scout' || accountType === 'coach') && (
                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold uppercase tracking-wider block mb-1">Organization / Sports Club / Federation</label>
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. Tamil Nadu State Athletics Association"
                      className="w-full px-3.5 py-2 bg-[#0a0a0c] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                )}

                <div>
                  <label className="text-[11px] text-slate-300 font-semibold uppercase tracking-wider block mb-1">Account Password *</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 bg-[#0a0a0c] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSignupStep(1)}
                    className="px-4 py-2 bg-[#1c1c22] hover:bg-[#25252d] text-slate-300 font-bold uppercase tracking-wider rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold uppercase tracking-wider rounded-lg text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-cyan-500/20"
                  >
                    Proceed to OTP Verification
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: OTP VERIFICATION (GMAIL & MOBILE SMS) */}
            {signupStep === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Step 3: OTP Verification
                  </p>
                  <span className="text-[10px] uppercase font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    Security Gate
                  </span>
                </div>

                {/* Verification Mode Selector */}
                <div className="p-1 bg-[#0a0a0c] rounded-lg border border-white/10 grid grid-cols-3 gap-1 text-[11px] font-bold uppercase tracking-wider">
                  <button
                    type="button"
                    onClick={() => setVerificationChannel('dual')}
                    className={`py-1.5 rounded transition cursor-pointer ${
                      verificationChannel === 'dual' ? 'bg-[#1c1c22] text-cyan-400 border border-cyan-500/30' : 'text-slate-400'
                    }`}
                  >
                    Dual (Gmail + SMS)
                  </button>
                  <button
                    type="button"
                    onClick={() => setVerificationChannel('email')}
                    className={`py-1.5 rounded transition cursor-pointer ${
                      verificationChannel === 'email' ? 'bg-[#1c1c22] text-cyan-400 border border-cyan-500/30' : 'text-slate-400'
                    }`}
                  >
                    Gmail OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => setVerificationChannel('mobile')}
                    className={`py-1.5 rounded transition cursor-pointer ${
                      verificationChannel === 'mobile' ? 'bg-[#1c1c22] text-cyan-400 border border-cyan-500/30' : 'text-slate-400'
                    }`}
                  >
                    Mobile SMS
                  </button>
                </div>

                {/* QUICK DEMO AUTO-FILL BANNER FOR USER TESTING */}
                <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      Live Dispatched OTP Simulation
                    </span>
                    <button
                      type="button"
                      onClick={handleQuickAutoFillOtp}
                      className="px-2.5 py-1 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold uppercase tracking-wider rounded text-[10px] transition cursor-pointer"
                    >
                      Auto-Fill Verified OTPs
                    </button>
                  </div>

                  <div className="text-[11px] font-mono text-slate-300 space-y-0.5">
                    {(verificationChannel === 'dual' || verificationChannel === 'email') && (
                      <p>• Gmail OTP ({email || 'user@gmail.com'}): <span className="text-cyan-400 font-bold">{emailSimulatedCode || '784920'}</span></p>
                    )}
                    {(verificationChannel === 'dual' || verificationChannel === 'mobile') && (
                      <p>• Mobile SMS ({countryCode} {phone || '9876543210'}): <span className="text-emerald-400 font-bold">{mobileSimulatedCode || '593814'}</span></p>
                    )}
                  </div>
                </div>

                {/* GMAIL OTP INPUT BLOCK */}
                {(verificationChannel === 'dual' || verificationChannel === 'email') && (
                  <div className={`p-4 rounded-xl border transition ${
                    emailOtpVerified ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-[#0a0a0c] border-white/10'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          Gmail Verification
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">({email || 'user@gmail.com'})</span>
                      </div>
                      {emailOtpVerified ? (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" /> VERIFIED
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400">Step 1 of 2</span>
                      )}
                    </div>

                    {!emailOtpVerified && (
                      <div className="space-y-3 mt-3">
                        <p className="text-[11px] text-slate-400">Enter the 6-digit code dispatched to your Gmail account:</p>
                        <div className="flex justify-between gap-1.5">
                          {emailOtpDigits.map((digit, i) => (
                            <input
                              key={i}
                              ref={(el) => (emailInputRefs.current[i] = el)}
                              type="text"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleDigitChange('email', i, e.target.value)}
                              onKeyDown={(e) => handleDigitKeyDown('email', i, e)}
                              className="w-10 h-11 text-center font-mono text-base font-bold bg-[#141418] border border-white/20 rounded-lg text-cyan-400 focus:outline-none focus:border-cyan-400"
                            />
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <button
                            type="button"
                            onClick={handleSendOtps}
                            disabled={resendTimer > 0 || isSendingOtp}
                            className="text-[10px] uppercase font-bold text-slate-400 hover:text-white disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                          >
                            <RefreshCw className={`w-3 h-3 ${isSendingOtp ? 'animate-spin' : ''}`} />
                            {resendTimer > 0 ? `Resend Gmail Code in ${resendTimer}s` : 'Resend Gmail Code'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleVerifyOtp('email')}
                            className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold uppercase tracking-wider text-[11px] rounded transition cursor-pointer"
                          >
                            Verify Gmail
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* MOBILE SMS OTP INPUT BLOCK */}
                {(verificationChannel === 'dual' || verificationChannel === 'mobile') && (
                  <div className={`p-4 rounded-xl border transition ${
                    mobileOtpVerified ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-[#0a0a0c] border-white/10'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          Mobile SMS Verification
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">({countryCode} {phone || '9876543210'})</span>
                      </div>
                      {mobileOtpVerified ? (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" /> VERIFIED
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400">SMS Gate</span>
                      )}
                    </div>

                    {!mobileOtpVerified && (
                      <div className="space-y-3 mt-3">
                        <p className="text-[11px] text-slate-400">Enter the 6-digit SMS verification code received on mobile:</p>
                        <div className="flex justify-between gap-1.5">
                          {mobileOtpDigits.map((digit, i) => (
                            <input
                              key={i}
                              ref={(el) => (mobileInputRefs.current[i] = el)}
                              type="text"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleDigitChange('mobile', i, e.target.value)}
                              onKeyDown={(e) => handleDigitKeyDown('mobile', i, e)}
                              className="w-10 h-11 text-center font-mono text-base font-bold bg-[#141418] border border-white/20 rounded-lg text-emerald-400 focus:outline-none focus:border-emerald-400"
                            />
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <button
                            type="button"
                            onClick={handleSendOtps}
                            disabled={resendTimer > 0 || isSendingOtp}
                            className="text-[10px] uppercase font-bold text-slate-400 hover:text-white disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                          >
                            <RefreshCw className={`w-3 h-3 ${isSendingOtp ? 'animate-spin' : ''}`} />
                            {resendTimer > 0 ? `Resend SMS Code in ${resendTimer}s` : 'Resend Mobile SMS'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleVerifyOtp('mobile')}
                            className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold uppercase tracking-wider text-[11px] rounded transition cursor-pointer"
                          >
                            Verify Mobile SMS
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* FOOTER ACTIONS */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSignupStep(2)}
                    className="px-4 py-2 bg-[#1c1c22] hover:bg-[#25252d] text-slate-300 font-bold uppercase tracking-wider rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>

                  <button
                    type="button"
                    disabled={!isOtpStepReadyToProceed()}
                    onClick={() => setSignupStep(4)}
                    className={`px-5 py-2.5 font-bold uppercase tracking-wider rounded-lg text-xs flex items-center gap-2 cursor-pointer transition ${
                      isOtpStepReadyToProceed()
                        ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                    }`}
                  >
                    Complete Registration
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: REGISTRATION SUCCESSFUL */}
            {signupStep === 4 && (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/20 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h4 className="text-lg font-bold text-white uppercase tracking-wider">Account Creation Verified!</h4>
                  <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                    Welcome <span className="text-cyan-400 font-bold">{name || 'Athlete'}</span>! Your {accountType.toUpperCase()} account has been authenticated with verified credentials.
                  </p>
                </div>

                {/* Verified Badges */}
                <div className="p-3 bg-[#0a0a0c] rounded-xl border border-white/10 flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-wider text-slate-200">
                  <div className="flex items-center gap-1.5 text-cyan-400">
                    <CheckCircle2 className="w-4 h-4" /> Gmail Verified
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" /> Mobile SMS Verified
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCompleteAccountCreation}
                  className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold uppercase tracking-wider rounded-lg text-xs shadow-lg shadow-cyan-500/25 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  Enter SportScan AI Workspace
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
