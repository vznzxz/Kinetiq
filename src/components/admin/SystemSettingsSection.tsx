import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Sliders,
  CheckCircle2,
  Shield,
  Bell,
  Scale,
  Calendar,
  Zap,
} from 'lucide-react';

export const SystemSettingsSection: React.FC = () => {
  const { settings, updateSettings } = useApp();

  const [systemName, setSystemName] = useState(settings.systemName);
  const [measurementUnit, setMeasurementUnit] = useState<'metric' | 'imperial'>(settings.measurementUnit);
  const [requireContentApproval, setRequireContentApproval] = useState(settings.requireContentApproval);
  const [defaultChallengeDurationDays, setDefaultChallengeDurationDays] = useState(settings.defaultChallengeDurationDays);
  const [maintenanceMode, setMaintenanceMode] = useState(settings.maintenanceMode);
  const [allowPublicRegistrations, setAllowPublicRegistrations] = useState(settings.allowPublicRegistrations);
  const [dailyStreakThresholdMins, setDailyStreakThresholdMins] = useState(settings.dailyStreakThresholdMins);
  const [defaultCalorieTarget, setDefaultCalorieTarget] = useState(settings.defaultCalorieTarget);
  const [systemNotificationBanner, setSystemNotificationBanner] = useState(settings.systemNotificationBanner || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      systemName,
      measurementUnit,
      requireContentApproval,
      defaultChallengeDurationDays: Number(defaultChallengeDurationDays),
      maintenanceMode,
      allowPublicRegistrations,
      dailyStreakThresholdMins: Number(dailyStreakThresholdMins),
      defaultCalorieTarget: Number(defaultCalorieTarget),
      systemNotificationBanner,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight">
            System Settings & Global Configurations
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Configure platform policies, measurement standards, moderation pipelines, and maintenance flags
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-400">Environment:</span>
          <span className="text-xs font-mono text-lime-400 bg-lime-950/60 border border-lime-500/30 px-2 py-0.5 rounded">
            PRODUCTION RUNTIME
          </span>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-6 text-xs">
        {/* Section 1: Platform Branding & Units */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-zinc-800 pb-2">
            <Sliders className="w-4 h-4 text-lime-400" />
            <span>Platform Core & Measurement Calibration</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-400 font-medium mb-1.5">Platform Title</label>
              <input
                type="text"
                value={systemName}
                onChange={(e) => setSystemName(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-700"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-medium mb-1.5">
                Standard Measurement System
              </label>
              <select
                value={measurementUnit}
                onChange={(e) => setMeasurementUnit(e.target.value as any)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono focus:outline-none focus:border-zinc-700"
              >
                <option value="metric">Metric (Kilograms, Centimeters, Kilocalories)</option>
                <option value="imperial">Imperial (Pounds, Inches, Kilocalories)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Moderation & Challenges */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-zinc-800 pb-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Moderation & Arena Policies</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-850 flex items-center justify-between">
              <div>
                <p className="font-semibold text-zinc-200">Require Admin Approval</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  User submitted workouts remain in moderation queue until approved
                </p>
              </div>
              <input
                type="checkbox"
                checked={requireContentApproval}
                onChange={(e) => setRequireContentApproval(e.target.checked)}
                className="w-4 h-4 accent-lime-400 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-850 flex items-center justify-between">
              <div>
                <p className="font-semibold text-zinc-200">Allow Public Account Registration</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Permit new athletes to enroll self-service
                </p>
              </div>
              <input
                type="checkbox"
                checked={allowPublicRegistrations}
                onChange={(e) => setAllowPublicRegistrations(e.target.checked)}
                className="w-4 h-4 accent-lime-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-zinc-400 font-medium mb-1.5">
                Default Challenge Duration (Days)
              </label>
              <input
                type="number"
                min="7"
                max="90"
                value={defaultChallengeDurationDays}
                onChange={(e) => setDefaultChallengeDurationDays(Number(e.target.value))}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-medium mb-1.5">
                Daily Streak Min Duration (min)
              </label>
              <input
                type="number"
                min="5"
                max="60"
                value={dailyStreakThresholdMins}
                onChange={(e) => setDailyStreakThresholdMins(Number(e.target.value))}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-medium mb-1.5">
                Default Calorie Target (kcal)
              </label>
              <input
                type="number"
                min="1000"
                max="5000"
                value={defaultCalorieTarget}
                onChange={(e) => setDefaultCalorieTarget(Number(e.target.value))}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 3: System Broadcast & Maintenance */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-zinc-800 pb-2">
            <Bell className="w-4 h-4 text-amber-400" />
            <span>Broadcast Banner & Maintenance Protocol</span>
          </h3>

          <div>
            <label className="block text-zinc-400 font-medium mb-1.5">
              Top System Broadcast Banner (Visible to all users)
            </label>
            <input
              type="text"
              placeholder="e.g. Kinetiq Autumn Championship is live. Join active challenges today."
              value={systemNotificationBanner}
              onChange={(e) => setSystemNotificationBanner(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-700"
            />
          </div>

          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 flex items-center justify-between">
            <div>
              <p className="font-semibold text-rose-300">System Maintenance Mode</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Restricts non-admin logging access while database updates are executing
              </p>
            </div>
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="w-4 h-4 accent-rose-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
          <p className="text-[11px] text-zinc-500">
            Output: Confirmation message for successful settings update will be generated.
          </p>

          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-semibold text-zinc-950 bg-lime-400 hover:bg-lime-300 rounded-lg flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            <span>Save & Synchronize Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
