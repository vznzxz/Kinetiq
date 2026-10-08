import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  WorkoutLog,
  BodyMetricEntry,
  PersonalRecord,
  FitnessChallenge,
  ChallengeParticipation,
  ChallengeHistoryItem,
  FitnessContent,
  SystemSettings,
  ActivityLog,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_WORKOUTS,
  INITIAL_METRICS,
  INITIAL_PRS,
  INITIAL_CHALLENGES,
  INITIAL_PARTICIPATIONS,
  INITIAL_CHALLENGE_HISTORY,
  INITIAL_FITNESS_CONTENT,
  INITIAL_SETTINGS,
  INITIAL_ACTIVITY_LOGS,
} from '../data/initialData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentUser: User;
  users: User[];
  workouts: WorkoutLog[];
  metrics: BodyMetricEntry[];
  prs: PersonalRecord[];
  challenges: FitnessChallenge[];
  participations: ChallengeParticipation[];
  challengeHistory: ChallengeHistoryItem[];
  fitnessContent: FitnessContent[];
  settings: SystemSettings;
  activityLogs: ActivityLog[];
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  switchUser: (userId: string) => void;
  // Admin User Management
  createUser: (userData: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  // Admin Content Management
  approveFitnessContent: (id: string, notes?: string) => void;
  rejectFitnessContent: (id: string, notes?: string) => void;
  deleteFitnessContent: (id: string) => void;
  // Admin System Settings
  updateSettings: (updates: Partial<SystemSettings>) => void;
  // User Workout Logging
  logWorkout: (data: Omit<WorkoutLog, 'id' | 'createdAt' | 'userId' | 'userName'>) => void;
  updateWorkout: (id: string, updates: Partial<WorkoutLog>) => void;
  deleteWorkout: (id: string) => void;
  // User Progress
  logMetric: (data: Omit<BodyMetricEntry, 'id' | 'userId'>) => void;
  addPersonalRecord: (data: Omit<PersonalRecord, 'id' | 'userId'>) => void;
  // User Challenges
  joinChallenge: (challengeId: string) => void;
  toggleChallengeDay: (challengeId: string, date: string) => void;
  // User Content Submission
  submitFitnessContent: (data: Omit<FitnessContent, 'id' | 'authorId' | 'authorName' | 'status' | 'submittedAt'>) => void;
  // User Profile
  updateProfile: (updates: Partial<User>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'kinetiq_v1_';

function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to save to localStorage', err);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => getStored('users', INITIAL_USERS));
  const [currentUserId, setCurrentUserId] = useState<string>(() => getStored('currentUserId', 'user-male-1'));
  const [workouts, setWorkouts] = useState<WorkoutLog[]>(() => getStored('workouts', INITIAL_WORKOUTS));
  const [metrics, setMetrics] = useState<BodyMetricEntry[]>(() => getStored('metrics', INITIAL_METRICS));
  const [prs, setPrs] = useState<PersonalRecord[]>(() => getStored('prs', INITIAL_PRS));
  const [challenges, setChallenges] = useState<FitnessChallenge[]>(() => getStored('challenges', INITIAL_CHALLENGES));
  const [participations, setParticipations] = useState<ChallengeParticipation[]>(() => getStored('participations', INITIAL_PARTICIPATIONS));
  const [challengeHistory, setChallengeHistory] = useState<ChallengeHistoryItem[]>(() => getStored('challengeHistory', INITIAL_CHALLENGE_HISTORY));
  const [fitnessContent, setFitnessContent] = useState<FitnessContent[]>(() => getStored('fitnessContent', INITIAL_FITNESS_CONTENT));
  const [settings, setSettings] = useState<SystemSettings>(() => getStored('settings', INITIAL_SETTINGS));
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => getStored('activityLogs', INITIAL_ACTIVITY_LOGS));
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync state to storage
  useEffect(() => setStored('users', users), [users]);
  useEffect(() => setStored('currentUserId', currentUserId), [currentUserId]);
  useEffect(() => setStored('workouts', workouts), [workouts]);
  useEffect(() => setStored('metrics', metrics), [metrics]);
  useEffect(() => setStored('prs', prs), [prs]);
  useEffect(() => setStored('challenges', challenges), [challenges]);
  useEffect(() => setStored('participations', participations), [participations]);
  useEffect(() => setStored('challengeHistory', challengeHistory), [challengeHistory]);
  useEffect(() => setStored('fitnessContent', fitnessContent), [fitnessContent]);
  useEffect(() => setStored('settings', settings), [settings]);
  useEffect(() => setStored('activityLogs', activityLogs), [activityLogs]);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const logActivity = (
    actorName: string,
    actorRole: 'admin' | 'user',
    actionType: ActivityLog['actionType'],
    description: string,
    status: ActivityLog['status'] = 'info'
  ) => {
    const newLog: ActivityLog = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      actorName,
      actorRole,
      actionType,
      description,
      status,
    };
    setActivityLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  };

  const switchUser = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      setCurrentUserId(userId);
      showToast(`Switched active profile to ${found.name} (${found.role.toUpperCase()})`, 'info');
    }
  };

  // ADMIN: User Management
  const createUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
      streakDays: 0,
    };
    setUsers((prev) => [...prev, newUser]);
    logActivity(currentUser.name, currentUser.role, 'user_management', `Created new user account "${newUser.name}" (${newUser.role})`, 'success');
    showToast(`User account "${newUser.name}" created successfully.`, 'success');
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updates } : u))
    );
    const target = users.find((u) => u.id === id);
    const targetName = target ? target.name : id;
    logActivity(currentUser.name, currentUser.role, 'user_management', `Updated account credentials for "${targetName}"`, 'info');
    showToast(`User details for "${targetName}" updated successfully.`, 'success');
  };

  const deleteUser = (id: string) => {
    const target = users.find((u) => u.id === id);
    if (!target) return;
    if (users.length <= 1) {
      showToast('Cannot delete the only existing user account.', 'error');
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (currentUserId === id) {
      const remaining = users.filter((u) => u.id !== id);
      setCurrentUserId(remaining[0].id);
    }
    logActivity(currentUser.name, currentUser.role, 'user_management', `Deleted user account "${target.name}"`, 'warning');
    showToast(`User account "${target.name}" deleted successfully.`, 'success');
  };

  // ADMIN: Fitness Content Management
  const approveFitnessContent = (id: string, notes?: string) => {
    setFitnessContent((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: 'approved',
              reviewedAt: new Date().toISOString(),
              reviewerNotes: notes || 'Approved by system administrator.',
            }
          : c
      )
    );
    const target = fitnessContent.find((c) => c.id === id);
    const title = target ? target.title : 'Content';
    logActivity(currentUser.name, currentUser.role, 'content_management', `Approved fitness guide: "${title}"`, 'success');
    showToast(`Fitness content "${title}" approved and published to guidance library.`, 'success');
  };

  const rejectFitnessContent = (id: string, notes?: string) => {
    setFitnessContent((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: 'rejected',
              reviewedAt: new Date().toISOString(),
              reviewerNotes: notes || 'Rejected due to incomplete form guidelines.',
            }
          : c
      )
    );
    const target = fitnessContent.find((c) => c.id === id);
    const title = target ? target.title : 'Content';
    logActivity(currentUser.name, currentUser.role, 'content_management', `Rejected fitness guide: "${title}"`, 'warning');
    showToast(`Fitness content "${title}" rejected. Notification sent to author.`, 'info');
  };

  const deleteFitnessContent = (id: string) => {
    const target = fitnessContent.find((c) => c.id === id);
    setFitnessContent((prev) => prev.filter((c) => c.id !== id));
    if (target) {
      logActivity(currentUser.name, currentUser.role, 'content_management', `Removed fitness content "${target.title}"`, 'warning');
      showToast(`Removed "${target.title}" from repository.`, 'info');
    }
  };

  // ADMIN: System Settings
  const updateSettings = (updates: Partial<SystemSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    logActivity(currentUser.name, currentUser.role, 'system_settings', `Updated global system configuration parameters`, 'info');
    showToast('System settings updated and synchronized across all active sessions.', 'success');
  };

  // USER: Workout Logging
  const logWorkout = (data: Omit<WorkoutLog, 'id' | 'createdAt' | 'userId' | 'userName'>) => {
    const newWorkout: WorkoutLog = {
      ...data,
      id: `w-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      createdAt: new Date().toISOString(),
    };
    setWorkouts((prev) => [newWorkout, ...prev]);

    // Increment streak if logged for today
    const today = new Date().toISOString().split('T')[0];
    if (data.date === today) {
      setUsers((prev) =>
        prev.map((u) => (u.id === currentUser.id ? { ...u, streakDays: (u.streakDays || 0) + 1 } : u))
      );
    }

    logActivity(currentUser.name, currentUser.role, 'workout_logged', `Logged workout: ${newWorkout.title} (${newWorkout.durationMinutes}m, ${newWorkout.caloriesBurned} kcal)`, 'success');
    showToast(`Workout logged successfully! +${newWorkout.caloriesBurned} kcal tracked.`, 'success');
  };

  const updateWorkout = (id: string, updates: Partial<WorkoutLog>) => {
    setWorkouts((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updates } : w))
    );
    showToast('Workout entry updated successfully.', 'success');
  };

  const deleteWorkout = (id: string) => {
    const target = workouts.find((w) => w.id === id);
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
    showToast(`Workout "${target ? target.title : 'Entry'}" removed.`, 'info');
  };

  // USER: Progress Tracking
  const logMetric = (data: Omit<BodyMetricEntry, 'id' | 'userId'>) => {
    const newMetric: BodyMetricEntry = {
      ...data,
      id: `m-${Date.now()}`,
      userId: currentUser.id,
    };
    setMetrics((prev) => [...prev, newMetric]);
    // update current user weight
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, weight: data.weightKg } : u))
    );
    logActivity(currentUser.name, currentUser.role, 'workout_logged', `Logged body metrics: ${data.weightKg} kg (BF: ${data.bodyFatPercentage || '--'}%)`, 'info');
    showToast(`Fitness progress recorded: ${data.weightKg} kg logged for ${data.date}.`, 'success');
  };

  const addPersonalRecord = (data: Omit<PersonalRecord, 'id' | 'userId'>) => {
    const newPr: PersonalRecord = {
      ...data,
      id: `pr-${Date.now()}`,
      userId: currentUser.id,
    };
    setPrs((prev) => [newPr, ...prev]);
    showToast(`New Personal Record achieved: ${newPr.exerciseName} (${newPr.metric})!`, 'success');
  };

  // USER: Challenges
  const joinChallenge = (challengeId: string) => {
    const existing = participations.find(
      (p) => p.challengeId === challengeId && p.userId === currentUser.id && p.status === 'active'
    );
    if (existing) {
      showToast('You are already actively enrolled in this challenge.', 'info');
      return;
    }
    const challenge = challenges.find((c) => c.id === challengeId);
    if (!challenge) return;

    const newParticipation: ChallengeParticipation = {
      id: `part-${Date.now()}`,
      challengeId,
      userId: currentUser.id,
      joinedAt: new Date().toISOString(),
      completedDays: 0,
      totalDays: challenge.durationDays,
      status: 'active',
      checkins: {},
    };

    setParticipations((prev) => [newParticipation, ...prev]);
    setChallenges((prev) =>
      prev.map((c) => (c.id === challengeId ? { ...c, participantCount: c.participantCount + 1 } : c))
    );
    logActivity(currentUser.name, currentUser.role, 'challenge_joined', `Joined fitness challenge: "${challenge.title}"`, 'success');
    showToast(`Enrolled in "${challenge.title}"! Track your daily completion to earn the ${challenge.rewardBadge} badge.`, 'success');
  };

  const toggleChallengeDay = (challengeId: string, date: string) => {
    const challenge = challenges.find((c) => c.id === challengeId);
    if (!challenge) return;

    setParticipations((prev) =>
      prev.map((p) => {
        if (p.challengeId === challengeId && p.userId === currentUser.id) {
          const wasChecked = !!p.checkins[date];
          const newCheckins = { ...p.checkins, [date]: !wasChecked };
          if (wasChecked) {
            delete newCheckins[date];
          }
          const completedCount = Object.keys(newCheckins).length;
          const isDone = completedCount >= p.totalDays;

          if (isDone && p.status !== 'completed') {
            // award to history
            const historyItem: ChallengeHistoryItem = {
              id: `ch-hist-${Date.now()}`,
              challengeId,
              userId: currentUser.id,
              challengeTitle: challenge.title,
              completedAt: new Date().toISOString().split('T')[0],
              status: 'completed',
              badgeEarned: challenge.rewardBadge,
              completionRate: 100,
              daysCompleted: completedCount,
              totalDays: p.totalDays,
            };
            setChallengeHistory((h) => [historyItem, ...h]);
            logActivity(currentUser.name, currentUser.role, 'challenge_completed', `Completed challenge "${challenge.title}"! Badge earned: ${challenge.rewardBadge}`, 'success');
            showToast(`Challenge Completed! You earned the "${challenge.rewardBadge}" badge!`, 'success');
          }

          return {
            ...p,
            checkins: newCheckins,
            completedDays: completedCount,
            status: isDone ? 'completed' : 'active',
            lastCheckinDate: date,
          };
        }
        return p;
      })
    );
    showToast(`Updated challenge progress for ${date}.`, 'info');
  };

  // USER: Content Submission
  const submitFitnessContent = (data: Omit<FitnessContent, 'id' | 'authorId' | 'authorName' | 'status' | 'submittedAt'>) => {
    const newContent: FitnessContent = {
      ...data,
      id: `cnt-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      status: settings.requireContentApproval ? 'pending' : 'approved',
      submittedAt: new Date().toISOString(),
    };
    setFitnessContent((prev) => [newContent, ...prev]);
    logActivity(
      currentUser.name,
      currentUser.role,
      'content_management',
      `Submitted workout routine "${newContent.title}" (${newContent.status === 'pending' ? 'Queued for admin review' : 'Auto-published'})`,
      'info'
    );
    const msg = settings.requireContentApproval
      ? `Fitness content "${newContent.title}" submitted successfully! Sent to administrator for approval.`
      : `Fitness content "${newContent.title}" published to public library.`;
    showToast(msg, 'success');
  };

  // USER: Profile Management
  const updateProfile = (updates: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, ...updates } : u))
    );
    logActivity(currentUser.name, currentUser.role, 'user_management', `Updated personal profile preferences and biometrics`, 'info');
    showToast('Personal profile and training preferences updated successfully.', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        workouts,
        metrics,
        prs,
        challenges,
        participations,
        challengeHistory,
        fitnessContent,
        settings,
        activityLogs,
        toasts,
        showToast,
        removeToast,
        switchUser,
        createUser,
        updateUser,
        deleteUser,
        approveFitnessContent,
        rejectFitnessContent,
        deleteFitnessContent,
        updateSettings,
        logWorkout,
        updateWorkout,
        deleteWorkout,
        logMetric,
        addPersonalRecord,
        joinChallenge,
        toggleChallengeDay,
        submitFitnessContent,
        updateProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
