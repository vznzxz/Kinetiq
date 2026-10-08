export type UserRole = 'admin' | 'user';

export type GenderFocus = 'male' | 'female' | 'unisex';

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced' | 'elite';

export type FitnessGoal = 'strength' | 'hypertrophy' | 'fat_loss' | 'endurance' | 'mobility' | 'athletic_performance';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  gender: 'male' | 'female' | 'other';
  fitnessFocus: GenderFocus;
  fitnessLevel: FitnessLevel;
  primaryGoal: FitnessGoal;
  weight: number; // in kg
  targetWeight: number; // in kg
  height: number; // in cm
  dailyCalorieTarget: number;
  streakDays: number;
  avatarUrl?: string;
  createdAt: string;
}

export type WorkoutIntensity = 'low' | 'moderate' | 'high' | 'maximum';

export interface WorkoutExercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weightKg: number;
}

export interface WorkoutLog {
  id: string;
  userId: string;
  userName: string;
  title: string;
  category: 'strength' | 'hypertrophy' | 'hiit' | 'cardio' | 'pilates' | 'mobility' | 'calisthenics' | 'recovery';
  genderTarget: GenderFocus;
  durationMinutes: number;
  intensity: WorkoutIntensity;
  caloriesBurned: number;
  targetMuscleGroup: string;
  exercises: WorkoutExercise[];
  notes?: string;
  date: string; // ISO date string (YYYY-MM-DD)
  createdAt: string;
}

export interface BodyMetricEntry {
  id: string;
  userId: string;
  date: string;
  weightKg: number;
  bodyFatPercentage?: number;
  muscleMassPercentage?: number;
  waistCm?: number;
  chestCm?: number;
  hipsCm?: number;
  restingHeartRate?: number;
}

export interface PersonalRecord {
  id: string;
  userId: string;
  exerciseName: string;
  metric: string; // e.g. "140 kg", "22 mins 5k"
  dateAchieved: string;
  category: 'strength' | 'endurance' | 'milestone';
}

export interface FitnessChallenge {
  id: string;
  title: string;
  description: string;
  genderFocus: GenderFocus;
  category: 'strength' | 'hypertrophy' | 'fat_loss' | 'conditioning' | 'consistency';
  durationDays: number;
  targetGoal: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rewardBadge: string;
  participantCount: number;
  startsAt: string;
  endsAt: string;
  dailyTasks: string[];
}

export interface ChallengeParticipation {
  id: string;
  challengeId: string;
  userId: string;
  joinedAt: string;
  completedDays: number;
  totalDays: number;
  status: 'active' | 'completed' | 'abandoned';
  lastCheckinDate?: string;
  checkins: Record<string, boolean>; // 'YYYY-MM-DD': true
}

export interface ChallengeHistoryItem {
  id: string;
  challengeId: string;
  userId: string;
  challengeTitle: string;
  completedAt: string;
  status: 'completed' | 'withdrawn';
  badgeEarned: string;
  completionRate: number; // percentage
  daysCompleted: number;
  totalDays: number;
}

export type ContentStatus = 'pending' | 'approved' | 'rejected';

export interface FitnessContent {
  id: string;
  title: string;
  summary: string;
  authorId: string;
  authorName: string;
  genderFocus: GenderFocus;
  muscleGroup: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDurationMins: number;
  estimatedCalories: number;
  instructions: string[];
  equipmentNeeded: string[];
  status: ContentStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewerNotes?: string;
  imageUrl?: string;
}

export interface SystemSettings {
  systemName: string;
  measurementUnit: 'metric' | 'imperial';
  requireContentApproval: boolean;
  defaultChallengeDurationDays: number;
  maintenanceMode: boolean;
  allowPublicRegistrations: boolean;
  dailyStreakThresholdMins: number;
  defaultCalorieTarget: number;
  systemNotificationBanner?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  actionType: 'user_management' | 'content_management' | 'workout_logged' | 'challenge_joined' | 'challenge_completed' | 'system_settings';
  description: string;
  status: 'success' | 'warning' | 'info';
}
