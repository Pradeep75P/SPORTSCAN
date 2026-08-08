import { AthleteProfile, SportConfig, Assessment } from '../types';

export const SPORT_CONFIGS: SportConfig[] = [
  {
    id: 'athletics',
    name: 'Athletics & Sprinting',
    icon: 'Zap',
    description: 'Analyze acceleration biomechanics, stride frequency, knee drive angles, and maximum velocity sprint posture.',
    drills: [
      {
        id: 'sprint-30m',
        name: '30-Meter Acceleration Sprint',
        description: 'Record yourself performing a 30m maximum effort sprint from a standing start. AI detects leg extension, trunk lean, and cadence.',
        recommendedDuration: '5-8 seconds',
        keyLandmarks: ['Hip Extension', 'Knee Drive Angle', 'Trunk Inclination', 'Foot Strike Ground Time'],
        sampleVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-running-on-a-track-40248-large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'fly-10m',
        name: 'Flying 10m Velocity Drive',
        description: 'Measures peak sprinting velocity and upright stride length consistency after building up speed.',
        recommendedDuration: '4-6 seconds',
        keyLandmarks: ['Hip-Ankle Alignment', 'Upper Arm Swing Angle', 'Posture Vertical Alignment'],
        sampleVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-athlete-running-on-a-running-track-43187-large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  {
    id: 'football',
    name: 'Football / Soccer',
    icon: 'Activity',
    description: 'Assess agility shuttle turns, ball control speed, dribbling stance center of mass, and shooting follow-through.',
    drills: [
      {
        id: 'cone-agility',
        name: '5-10-5 Agility Shuttle Dribble',
        description: 'Record rapid lateral directional changes with and without the ball to measure change-of-direction balance and explosive plant angle.',
        recommendedDuration: '8-12 seconds',
        keyLandmarks: ['Lower Center of Mass', 'Plant Knee Angle', 'Torso Rotation', 'Explosive Push-Off'],
        sampleVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-football-player-dribbling-a-ball-41584-large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'shooting-technique',
        name: 'Precision Power Shot',
        description: 'Measures plant foot distance, hip rotation torque, and follow-through hip extension during power strikes.',
        recommendedDuration: '4-6 seconds',
        keyLandmarks: ['Plant Foot Placement', 'Knee Over Ball Angle', 'Follow-Through Swing'],
        sampleVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-kicking-a-soccer-ball-41585-large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  {
    id: 'cricket',
    name: 'Cricket',
    icon: 'Target',
    description: 'Track fast bowling arm speed, front-foot plant stability, batting cover drive balance, and biomechanical release point.',
    drills: [
      {
        id: 'fast-bowling',
        name: 'Fast Bowling Action & Run-Up',
        description: 'Record bowling action from side profile. AI measures front-knee plant angle, hip-shoulder separation torque, and bowling arm release height.',
        recommendedDuration: '6-10 seconds',
        keyLandmarks: ['Front Knee Flexion', 'Hip-Shoulder Separation', 'Release Arm Vertical Angle', 'Back Alignment'],
        sampleVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cricket-bowler-delivering-a-fast-ball-48130-large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'cover-drive',
        name: 'Front Foot Cover Drive Stance',
        description: 'Measures front knee flex over the ball, head posture position, and high elbow swing arc during drive strokes.',
        recommendedDuration: '5-8 seconds',
        keyLandmarks: ['Head Over Knee Line', 'High Elbow Angle', 'Weight Transfer Balance'],
        sampleVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cricket-batsman-playing-a-shot-48129-large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=600&q=80'
      }
    ]
  }
];

export const INITIAL_ASSESSMENTS: Assessment[] = [];

export const INITIAL_ATHLETES: AthleteProfile[] = [];
