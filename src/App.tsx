import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { AthleteDashboard } from './components/AthleteDashboard';
import { AssessmentModule } from './components/AssessmentModule';
import { AssessmentResults } from './components/AssessmentResults';
import { AthleteProfile } from './components/AthleteProfile';
import { ScoutDashboard } from './components/ScoutDashboard';
import { Leaderboard } from './components/Leaderboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { DataIntegrityModal } from './components/DataIntegrityModal';
import { GoogleDriveModal } from './components/GoogleDriveModal';
import { INITIAL_ATHLETES, INITIAL_ASSESSMENTS } from './data/mockData';
import { AthleteProfile as AthleteProfileType, Assessment, Role, User } from './types';
import confetti from 'canvas-confetti';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isIntegrityModalOpen, setIsIntegrityModalOpen] = useState(false);
  const [isGoogleDriveModalOpen, setIsGoogleDriveModalOpen] = useState(false);

  // Default initial logged in user
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'u-001',
    name: 'Arun Kumar',
    email: 'arun.speed@sportscan.ai',
    role: 'athlete',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    location: 'Madurai, Tamil Nadu',
    sport: 'athletics',
    age: 18,
    gender: 'Male',
    experienceLevel: 'Grassroots',
    createdAt: new Date().toISOString()
  });

  const [athletes, setAthletes] = useState<AthleteProfileType[]>(INITIAL_ATHLETES);
  const [assessments, setAssessments] = useState<Assessment[]>(INITIAL_ASSESSMENTS);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [selectedAthleteProfile, setSelectedAthleteProfile] = useState<AthleteProfileType | null>(null);

  // Load athletes from backend on startup
  useEffect(() => {
    fetch('/api/athletes')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.athletes) {
          setAthletes(data.athletes);
        }
      })
      .catch((err) => console.warn("Using local athlete initial data", err));
  }, []);

  // Sync current user's profile object
  const activeAthleteProfile: AthleteProfileType = athletes.find(a => a.name.toLowerCase() === currentUser.name.toLowerCase()) || {
    id: currentUser.id,
    userId: currentUser.id,
    name: currentUser.name,
    email: currentUser.email,
    profilePhoto: currentUser.profilePhoto,
    age: currentUser.age,
    gender: currentUser.gender,
    sport: currentUser.sport,
    location: currentUser.location,
    experienceLevel: currentUser.experienceLevel,
    talentScore: 0,
    underdogScore: 0,
    potentialLevel: 'Emerging Talent',
    bio: 'Smartphone verified athlete profile. Perform an AI computer vision assessment to generate your verified biomechanical stats.',
    achievements: ['SportScan AI Account Created'],
    metrics: {
      speed: 0,
      technique: 0,
      agility: 0,
      balance: 0,
      consistency: 0,
      explosiveness: 0
    },
    assessmentsCount: 0,
    trainingFacilityAccess: 'None / Open Field',
    recentAssessments: [],
    isBookmarkedByScout: false
  };

  const handleRoleSwitch = (role: Role) => {
    if (role === 'scout') {
      setCurrentUser({
        id: 'u-scout-001',
        name: 'Coach Vikram Sharma',
        email: 'vikram.scout@sportsacademy.in',
        role: 'scout',
        profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
        location: 'New Delhi, India',
        sport: 'athletics',
        age: 42,
        gender: 'Male',
        experienceLevel: 'Advanced',
        createdAt: new Date().toISOString()
      });
      setCurrentTab('scout');
    } else {
      setCurrentUser({
        id: 'u-001',
        name: 'Arun Kumar',
        email: 'arun.speed@sportscan.ai',
        role: 'athlete',
        profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        location: 'Madurai, Tamil Nadu',
        sport: 'athletics',
        age: 18,
        gender: 'Male',
        experienceLevel: 'Grassroots',
        createdAt: new Date().toISOString()
      });
      setCurrentTab('dashboard');
    }
  };

  const handleAssessmentComplete = (newAssessment: Assessment) => {
    setSelectedAssessment(newAssessment);
    setAssessments(prev => [newAssessment, ...prev]);

    // Update athletes store
    setAthletes(prev => {
      const idx = prev.findIndex(a => a.name.toLowerCase() === newAssessment.athleteName.toLowerCase());
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          talentScore: newAssessment.overallScore,
          underdogScore: newAssessment.underdogScore,
          assessmentsCount: updated[idx].assessmentsCount + 1,
          recentAssessments: [newAssessment, ...updated[idx].recentAssessments]
        };
        return updated;
      } else {
        const newAthProfile: AthleteProfileType = {
          id: newAssessment.athleteId,
          userId: `u-${Date.now()}`,
          name: newAssessment.athleteName,
          email: `${newAssessment.athleteName.toLowerCase().replace(/\s+/g, '.')}@sportscan.ai`,
          profilePhoto: newAssessment.athletePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          age: 18,
          gender: 'Male',
          sport: newAssessment.sport,
          location: newAssessment.athleteLocation,
          experienceLevel: 'Grassroots',
          talentScore: newAssessment.overallScore,
          underdogScore: newAssessment.underdogScore,
          potentialLevel: newAssessment.overallScore >= 90 ? 'Elite Prospect' : 'High Potential',
          bio: `Smartphone verified talent in ${newAssessment.drillName}. Discovered via SportScan AI computer vision assessment.`,
          achievements: [`Verified Assessment Talent Score: ${newAssessment.overallScore}/100`],
          metrics: newAssessment.metrics,
          assessmentsCount: 1,
          trainingFacilityAccess: 'None / Open Field',
          recentAssessments: [newAssessment]
        };
        return [newAthProfile, ...prev];
      }
    });

    setCurrentTab('results');
  };

  // One-click Hackathon Demo Flow
  const handleRunDemo = async () => {
    setCurrentTab('assessment');
    // Trigger demo assessment simulation
    try {
      const res = await fetch('/api/analyze-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sport: currentUser.sport || 'athletics',
          drillName: '30-Meter Acceleration Sprint',
          athleteName: currentUser.name,
          athleteLocation: currentUser.location,
          videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-running-on-a-track-40248-large.mp4',
          trainingFacilityAccess: 'None / Open Field'
        })
      });
      const data = await res.json();
      if (data.success && data.assessment) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
        handleAssessmentComplete(data.assessment);
      }
    } catch (err) {
      console.error("Demo run error:", err);
    }
  };

  const handleBookmarkToggle = (athleteId: string) => {
    fetch('/api/scout/bookmark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ athleteId })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAthletes(prev => prev.map(a => a.id === athleteId ? { ...a, isBookmarkedByScout: data.isBookmarked } : a));
        }
      })
      .catch(() => {
        setAthletes(prev => prev.map(a => a.id === athleteId ? { ...a, isBookmarkedByScout: !a.isBookmarkedByScout } : a));
      });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-100 font-sans flex flex-col">
      
      {/* Header Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onRunDemo={handleRunDemo}
        onRoleSwitch={handleRoleSwitch}
        onOpenIntegrityAudit={() => setIsIntegrityModalOpen(true)}
        onOpenGoogleDrive={() => setIsGoogleDriveModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage
            onStartAssessment={() => setCurrentTab('assessment')}
            onExploreAthletes={() => setCurrentTab('scout')}
            onRunDemo={handleRunDemo}
            athletesCount={athletes.length}
            assessmentsCount={assessments.length}
          />
        )}

        {currentTab === 'dashboard' && (
          <AthleteDashboard
            athlete={activeAthleteProfile}
            assessments={assessments}
            onStartNewAssessment={() => setCurrentTab('assessment')}
            onViewAssessmentDetail={(ass) => {
              setSelectedAssessment(ass);
              setCurrentTab('results');
            }}
            onViewPublicProfile={() => {
              setSelectedAthleteProfile(activeAthleteProfile);
              setCurrentTab('profile');
            }}
          />
        )}

        {currentTab === 'assessment' && (
          <AssessmentModule
            onAssessmentComplete={handleAssessmentComplete}
          />
        )}

        {currentTab === 'results' && selectedAssessment && (
          <AssessmentResults
            assessment={selectedAssessment}
            onViewProfile={() => {
              const profile = athletes.find(a => a.name.toLowerCase() === selectedAssessment.athleteName.toLowerCase()) || activeAthleteProfile;
              setSelectedAthleteProfile(profile);
              setCurrentTab('profile');
            }}
            onTakeAnother={() => setCurrentTab('assessment')}
            onOpenIntegrityAudit={() => setIsIntegrityModalOpen(true)}
          />
        )}

        {currentTab === 'profile' && selectedAthleteProfile && (
          <AthleteProfile
            athlete={selectedAthleteProfile}
            onBack={() => setCurrentTab('dashboard')}
            onBookmarkToggle={handleBookmarkToggle}
            onOpenIntegrityAudit={() => setIsIntegrityModalOpen(true)}
          />
        )}

        {currentTab === 'scout' && (
          <ScoutDashboard
            athletes={athletes}
            onSelectAthlete={(athlete) => {
              setSelectedAthleteProfile(athlete);
              setCurrentTab('profile');
            }}
            onBookmarkToggle={handleBookmarkToggle}
          />
        )}

        {currentTab === 'leaderboard' && (
          <Leaderboard
            athletes={athletes}
            onSelectAthlete={(athlete) => {
              setSelectedAthleteProfile(athlete);
              setCurrentTab('profile');
            }}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          if (user.role === 'scout') {
            setCurrentTab('scout');
          } else {
            setCurrentTab('dashboard');
          }
        }}
      />

      {/* Real Data Integrity Audit Modal */}
      <DataIntegrityModal
        isOpen={isIntegrityModalOpen}
        onClose={() => setIsIntegrityModalOpen(false)}
        sampleKineticData={selectedAssessment?.kineticData}
        athleteName={selectedAssessment?.athleteName || currentUser.name}
      />

      {/* Google Drive Cloud Sync Modal */}
      <GoogleDriveModal
        isOpen={isGoogleDriveModalOpen}
        onClose={() => setIsGoogleDriveModalOpen(false)}
        assessmentToExport={selectedAssessment}
        athleteToExport={selectedAthleteProfile}
      />

    </div>
  );
}
