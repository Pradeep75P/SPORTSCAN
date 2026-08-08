export type Role = 'athlete' | 'scout' | 'admin';

export type SportType = 'athletics' | 'football' | 'cricket';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  accountType?: 'athlete' | 'scout' | 'coach' | 'parent' | 'admin';
  organization?: string;
  isEmailVerified?: boolean;
  isMobileVerified?: boolean;
  profilePhoto: string;
  location: string;
  sport: SportType;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Semi-Pro' | 'Grassroots';
  bio?: string;
  achievements?: string[];
  createdAt: string;
}

export interface MetricBreakdown {
  speed: number;        // 0-100
  technique: number;    // 0-100
  agility: number;      // 0-100
  balance: number;      // 0-100
  consistency: number;  // 0-100
  explosiveness: number;// 0-100
}

export interface KineticData {
  kneeAngle: number;       // degrees
  hipAngle: number;        // degrees
  shoulderAngle: number;   // degrees
  strideCadence: number;   // steps per min / rate
  postureScore: number;    // 0-100
  balanceVariance: number; // 0-100
  peakVelocity: number;    // m/s
}

export interface AIFeedback {
  strengths: string[];
  areasToImprove: string[];
  recommendation: string;
  recommendedDrills: string[];
}

export interface Assessment {
  id: string;
  athleteId: string;
  athleteName: string;
  athleteLocation: string;
  athletePhoto?: string;
  sport: SportType;
  drillName: string;
  videoUrl: string;
  date: string;
  overallScore: number;
  underdogScore: number;
  metrics: MetricBreakdown;
  kineticData: KineticData;
  aiFeedback: AIFeedback;
  landmarkFramesCount?: number;
}

export interface AthleteProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  isEmailVerified?: boolean;
  isMobileVerified?: boolean;
  profilePhoto: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  sport: SportType;
  location: string;
  experienceLevel: string;
  talentScore: number;
  underdogScore: number;
  potentialLevel: 'Emerging Talent' | 'High Potential' | 'Elite Prospect' | 'Grassroots Gem';
  bio: string;
  achievements: string[];
  metrics: MetricBreakdown;
  assessmentsCount: number;
  trainingFacilityAccess: 'None / Open Field' | 'Basic School Ground' | 'Local Club' | 'Professional Academy';
  recentAssessments: Assessment[];
  isBookmarkedByScout?: boolean;
}

export interface SportConfig {
  id: SportType;
  name: string;
  icon: string;
  description: string;
  drills: {
    id: string;
    name: string;
    description: string;
    recommendedDuration: string;
    keyLandmarks: string[];
    sampleVideoUrl: string;
    thumbnailUrl: string;
  }[];
}
