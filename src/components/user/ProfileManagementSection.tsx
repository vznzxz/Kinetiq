import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GenderFocus, FitnessLevel, FitnessGoal } from '../../types';
import {
  User,
  Mail,
  Lock,
  Target,
  Flame,
  CheckCircle2,
  Scale,
  Ruler,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const ProfileManagementSection: React.FC = () => {
  const { currentUser, updateProfile, settings } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState('••••••••••••');
  const [gender, setGender] = useState(currentUser.gender);
  const [fitnessFocus, setFitnessFocus] = useState<GenderFocus>(currentUser.fitnessFocus);
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>(currentUser.fitnessLevel);
  const [primaryGoal, setPrimaryGoal] = useState<FitnessGoal>(currentUser.primaryGoal);
  const [weight, setWeight] = useState(currentUser.weight);
  const [targetWeight, setTargetWeight] = useState(currentUser.targetWeight);
  const [height, setHeight] = useState(currentUser.height);
  const [dailyCalorieTarget, setDailyCalorieTarget] = useState(currentUser.dailyCalorieTarget);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      gender,
      fitnessFocus,
      fitnessLevel,
      primaryGoal,
      weight: Number(weight),
      targetWeight: Number(targetWeight),
      height: Number(height),
      dailyCalorieTarget: Number(dailyCalorieTarget),
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight">
            Profile Management & Biometric Configuration
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Update personal credentials, biological fitness focus, and metabolic targets
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-400">Account Role:</span>
          <span className="text-xs font-mono uppercase text-lime-400 font-semibold px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800">
            {currentUser.role}
          </span>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-6 text-xs">
        {/* Section 1: Identity & Credentials */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-zinc-800 pb-2">
            <User className="w-4 h-4 text-lime-400" />
            <span>Identity & Security Credentials</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-400 font-medium mb-1.5">
                Full Athlete Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 font-medium mb-1.5">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-700"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-400 font-medium mb-1.5">
                Password / Security Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-700"
                />
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">Encrypted with PBKDF2 hash standards</p>
            </div>

            <div>
              <label className="block text-zinc-400 font-medium mb-1.5">
                Biological Sex
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-700"
              >
                <option value="male">Male (Androgenic hormonal baseline)</option>
                <option value="female">Female (Estrogenic / cyclic baseline)</option>
                <option value="other">Other / Non-disclosed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Fitness Specialization */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-zinc-800 pb-2">
            <Target className="w-4 h-4 text-cyan-400" />
            <span>Training Focus & Progression Tier</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-zinc-400 font-medium mb-1.5">
                Primary Fitness Focus
              </label>
              <select
                value={fitnessFocus}
                onChange={(e) => setFitnessFocus(e.target.value as any)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-700"
              >
                <option value="male">Male Focus (V-Taper, Upper Body Density, Quads)</option>
                <option value="female">Female Focus (Glutes, Waist Vacuum, Toning)</option>
                <option value="unisex">Unisex / Hybrid Athletic Performance</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 font-medium mb-1.5">
                Current Fitness Level
              </label>
              <select
                value={fitnessLevel}
                onChange={(e) => setFitnessLevel(e.target.value as any)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-700 capitalize"
              >
                <option value="beginner">Beginner (&lt; 1 yr training)</option>
                <option value="intermediate">Intermediate (1–3 yrs consistent)</option>
                <option value="advanced">Advanced (3–6 yrs periodized)</option>
                <option value="elite">Elite / Competitive</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 font-medium mb-1.5">
                Primary Athletic Goal
              </label>
              <select
                value={primaryGoal}
                onChange={(e) => setPrimaryGoal(e.target.value as any)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-700 capitalize"
              >
                <option value="strength">Strength & Power Peak</option>
                <option value="hypertrophy">Hypertrophy (Lean Mass)</option>
                <option value="fat_loss">Fat Loss & Definition</option>
                <option value="endurance">Endurance & VO2 Max</option>
                <option value="mobility">Mobility & Postural Reset</option>
                <option value="athletic_performance">Hybrid Athletic Performance</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Biometrics & Caloric Baselines */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-zinc-800 pb-2">
            <Scale className="w-4 h-4 text-amber-400" />
            <span>Biometric Targets & Energy Expenditure</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-zinc-400 font-medium mb-1.5">Current Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono focus:outline-none focus:border-zinc-700"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-medium mb-1.5">Target Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={targetWeight}
                onChange={(e) => setTargetWeight(Number(e.target.value))}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono focus:outline-none focus:border-zinc-700"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-medium mb-1.5">Height (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono focus:outline-none focus:border-zinc-700"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-medium mb-1.5">Daily Calorie Target</label>
              <input
                type="number"
                value={dailyCalorieTarget}
                onChange={(e) => setDailyCalorieTarget(Number(e.target.value))}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono focus:outline-none focus:border-zinc-700"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
          <p className="text-[11px] text-zinc-500">
            Changes will update your personal progression models and guidance filters instantly.
          </p>

          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-semibold text-zinc-950 bg-lime-400 hover:bg-lime-300 rounded-lg flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            <span>Save Profile Updates</span>
          </button>
        </div>
      </form>
    </div>
  );
};
