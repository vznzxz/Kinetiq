import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  User as UserIcon,
  Plus,
  Flame,
  ChevronDown,
  Dumbbell,
  CheckCircle,
} from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenLogWorkout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenLogWorkout,
}) => {
  const { currentUser, users, switchUser, settings } = useApp();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isAdmin = currentUser.role === 'admin';

  const userNavLinks = [
    { id: 'workouts', label: 'Workout Log' },
    { id: 'progress', label: 'Progress Tracking' },
    { id: 'challenges', label: 'Fitness Challenges' },
    { id: 'guidance', label: 'Guidance & Programs' },
    { id: 'profile', label: 'Profile' },
  ];

  const adminNavLinks = [
    { id: 'admin-users', label: 'User Management' },
    { id: 'admin-content', label: 'Fitness Content' },
    { id: 'admin-settings', label: 'System Settings' },
    { id: 'admin-stats', label: 'Fitness Statistics' },
    { id: 'admin-activity', label: 'Activity Logs' },
  ];

  const activeNavLinks = isAdmin ? adminNavLinks : userNavLinks;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
      {settings.systemNotificationBanner && (
        <div className="bg-lime-950/40 border-b border-lime-500/20 px-4 py-1.5 text-center text-xs text-lime-300 font-medium tracking-wide">
          <span>{settings.systemNotificationBanner}</span>
        </div>
      )}

      {/* Top Bar Contract: Zone 1 (Brand) — Zone 2 (4-6 Nav links) — Zone 3 (Primary Actions) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate(isAdmin ? 'admin-users' : 'workouts')}
            className="text-xl font-black tracking-tight text-white hover:text-lime-400 transition-colors flex items-center gap-1.5 focus:outline-none"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-lime-400 animate-pulse" />
            <span>KINETIQ</span>
          </button>

          <span className="hidden sm:inline text-xs font-mono text-zinc-500 uppercase tracking-widest pl-2 border-l border-zinc-800">
            {isAdmin ? 'Admin Portal' : currentUser.fitnessFocus === 'male' ? 'Male Athletic' : currentUser.fitnessFocus === 'female' ? 'Female Athletic' : 'Unisex Performance'}
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {activeNavLinks.map((link) => {
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-white bg-zinc-800 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions & Active Profile Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {!isAdmin && (
            <button
              onClick={onOpenLogWorkout}
              className="px-3.5 py-1.5 text-xs font-semibold text-zinc-950 bg-lime-400 hover:bg-lime-300 transition-colors rounded-lg flex items-center gap-1.5 whitespace-nowrap shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Log Workout</span>
            </button>
          )}

          {/* Profile Switcher dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-xs font-medium text-zinc-200 transition-colors"
              aria-expanded={profileDropdownOpen}
              aria-haspopup="true"
            >
              <div className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-lime-400">
                {currentUser.name.charAt(0)}
              </div>
              <span className="hidden sm:inline max-w-[100px] truncate">{currentUser.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {profileDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setProfileDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-72 rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl py-2 z-30">
                  <div className="px-3 py-2 border-b border-zinc-800 text-xs text-zinc-400">
                    <p className="font-semibold text-zinc-200">{currentUser.name}</p>
                    <p className="text-[11px] font-mono text-zinc-500 truncate">{currentUser.email}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-[11px]">
                      <span className="text-zinc-300 capitalize">{currentUser.role} Role</span>
                      <span className="text-zinc-600">·</span>
                      <span className="text-lime-400 flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        <span className="font-mono">{currentUser.streakDays}d streak</span>
                      </span>
                    </div>
                  </div>

                  <div className="px-2 py-1.5">
                    <p className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                      Switch Active Profile
                    </p>
                    {users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setProfileDropdownOpen(false);
                          if (u.role === 'admin' && !currentView.startsWith('admin-')) {
                            onNavigate('admin-users');
                          } else if (u.role === 'user' && currentView.startsWith('admin-')) {
                            onNavigate('workouts');
                          }
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors ${
                          u.id === currentUser.id
                            ? 'bg-zinc-800 text-white font-medium'
                            : 'text-zinc-300 hover:bg-zinc-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2 text-left truncate">
                          {u.role === 'admin' ? (
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          ) : (
                            <UserIcon className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          )}
                          <div className="truncate">
                            <p className="truncate">{u.name}</p>
                            <p className="text-[10px] text-zinc-500 capitalize">
                              {u.role === 'admin' ? 'Administrator' : `${u.gender} · ${u.fitnessLevel}`}
                            </p>
                          </div>
                        </div>
                        {u.id === currentUser.id && (
                          <CheckCircle className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-zinc-800 pt-1 px-2">
                    {isAdmin ? (
                      <button
                        onClick={() => {
                          // Switch to Marcus or Elena
                          const normalUser = users.find((u) => u.role === 'user');
                          if (normalUser) {
                            switchUser(normalUser.id);
                            onNavigate('workouts');
                          }
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 text-xs text-lime-400 hover:bg-zinc-800 rounded-lg flex items-center gap-2"
                      >
                        <Dumbbell className="w-3.5 h-3.5" />
                        <span>Switch to Athlete View</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          const admin = users.find((u) => u.role === 'admin');
                          if (admin) {
                            switchUser(admin.id);
                            onNavigate('admin-users');
                          }
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 text-xs text-amber-400 hover:bg-zinc-800 rounded-lg flex items-center gap-2"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Switch to Admin Console</span>
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Secondary Tab Navigation */}
      <div className="lg:hidden border-t border-zinc-850 px-4 py-2 flex items-center gap-1 overflow-x-auto scrollbar-none">
        {activeNavLinks.map((link) => {
          const isActive = currentView === link.id;
          return (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'text-white bg-zinc-800'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {link.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
