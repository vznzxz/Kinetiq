/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { ToastContainer } from './components/common/ToastContainer';
import { WorkoutLogSection } from './components/user/WorkoutLogSection';
import { ProgressTrackingSection } from './components/user/ProgressTrackingSection';
import { ChallengesSection } from './components/user/ChallengesSection';
import { FitnessGuidanceSection } from './components/user/FitnessGuidanceSection';
import { ProfileManagementSection } from './components/user/ProfileManagementSection';
import { UserManagementSection } from './components/admin/UserManagementSection';
import { ContentManagementSection } from './components/admin/ContentManagementSection';
import { SystemSettingsSection } from './components/admin/SystemSettingsSection';
import { FitnessStatisticsSection } from './components/admin/FitnessStatisticsSection';
import { SystemActivityMonitoringSection } from './components/admin/SystemActivityMonitoringSection';
import {
  ShieldAlert,
  Dumbbell,
  Users,
  Activity,
  Flame,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentUser, switchUser, users, settings } = useApp();

  const isAdmin = currentUser.role === 'admin';
  const [currentView, setCurrentView] = useState<string>(
    isAdmin ? 'admin-users' : 'workouts'
  );
  const [isLogWorkoutModalOpen, setIsLogWorkoutModalOpen] = useState(false);

  // Sync view if user switches between admin & regular user
  React.useEffect(() => {
    if (isAdmin && !currentView.startsWith('admin-')) {
      setCurrentView('admin-users');
    } else if (!isAdmin && currentView.startsWith('admin-')) {
      setCurrentView('workouts');
    }
  }, [currentUser.id, isAdmin]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        onOpenLogWorkout={() => {
          if (!isAdmin) {
            setCurrentView('workouts');
            setIsLogWorkoutModalOpen(true);
          }
        }}
      />

      {/* Sub-bar / Quick Athlete Banner */}
      <div className="border-b border-zinc-850 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="text-zinc-500 font-mono text-[11px]">ACTIVE SESSION:</span>
            <span className="font-semibold text-white">{currentUser.name}</span>
            <span className="text-zinc-600">·</span>
            <span className="capitalize text-zinc-300">
              {isAdmin ? 'System Administrator' : `${currentUser.fitnessFocus} Athletic Focus`}
            </span>
            {!isAdmin && (
              <>
                <span className="text-zinc-600">·</span>
                <span className="text-lime-400 font-mono font-medium">
                  {currentUser.dailyCalorieTarget} kcal/day target
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="text-zinc-500">SWITCH ATHLETE:</span>
            {users.map((u) => (
              <button
                key={u.id}
                onClick={() => switchUser(u.id)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  u.id === currentUser.id
                    ? 'bg-zinc-800 text-lime-400 font-semibold border border-zinc-700'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
                }`}
              >
                {u.name.split(' ')[0]} {u.role === 'admin' ? '(Admin)' : u.gender === 'female' ? '(F)' : '(M)'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* User Views */}
        {currentView === 'workouts' && (
          <WorkoutLogSection
            isLogModalOpen={isLogWorkoutModalOpen}
            setIsLogModalOpen={setIsLogWorkoutModalOpen}
          />
        )}
        {currentView === 'progress' && <ProgressTrackingSection />}
        {currentView === 'challenges' && <ChallengesSection />}
        {currentView === 'guidance' && <FitnessGuidanceSection />}
        {currentView === 'profile' && <ProfileManagementSection />}

        {/* Admin Views */}
        {currentView === 'admin-users' && <UserManagementSection />}
        {currentView === 'admin-content' && <ContentManagementSection />}
        {currentView === 'admin-settings' && <SystemSettingsSection />}
        {currentView === 'admin-stats' && <FitnessStatisticsSection />}
        {currentView === 'admin-activity' && <SystemActivityMonitoringSection />}
      </main>

      {/* Minimalist Engineered Footer */}
      <footer className="border-t border-zinc-850 bg-zinc-950/80 py-6 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight text-zinc-300">KINETIQ</span>
            <span className="text-zinc-600">·</span>
            <span>Online Fitness Tracking Platform</span>
            <span className="text-zinc-600">·</span>
            <span className="font-mono text-[11px] text-zinc-600">v2.4.0 Engine</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <span>Male & Female Periodization</span>
            <span className="text-zinc-700">|</span>
            <span>Admin Control Pipeline</span>
            <span className="text-zinc-700">|</span>
            <span className="font-mono text-lime-400">All Systems Nominal</span>
          </div>
        </div>
      </footer>

      {/* Floating Global Toast Notifications Container */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
