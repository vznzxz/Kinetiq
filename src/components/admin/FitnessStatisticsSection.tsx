import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Users,
  Activity,
  Flame,
  Trophy,
  PieChart,
  Calendar,
  Clock,
  Dumbbell,
} from 'lucide-react';

export const FitnessStatisticsSection: React.FC = () => {
  const { users, workouts, challenges, participations } = useApp();

  const [timeRange, setTimeRange] = useState<'all' | '30d' | '7d'>('all');

  // Aggregates
  const totalUsers = users.length;
  const maleUsers = users.filter((u) => u.fitnessFocus === 'male' || u.gender === 'male').length;
  const femaleUsers = users.filter((u) => u.fitnessFocus === 'female' || u.gender === 'female').length;
  const unisexUsers = totalUsers - (maleUsers + femaleUsers);

  const totalWorkouts = workouts.length;
  const totalMinutes = workouts.reduce((sum, w) => sum + (w.durationMinutes || 0), 0);
  const totalCalories = workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);

  // Category breakdown
  const categoryCounts: Record<string, number> = {};
  workouts.forEach((w) => {
    categoryCounts[w.category] = (categoryCounts[w.category] || 0) + 1;
  });

  // Focus breakdown
  const focusCounts: Record<string, number> = { male: 0, female: 0, unisex: 0 };
  workouts.forEach((w) => {
    focusCounts[w.genderTarget] = (focusCounts[w.genderTarget] || 0) + 1;
  });

  // Challenge enrollment metrics
  const totalEnrollments = participations.length;
  const completedChallenges = participations.filter((p) => p.status === 'completed').length;
  const completionRate = totalEnrollments > 0 ? Math.round((completedChallenges / totalEnrollments) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight">
            Fitness Statistics & Analytics Console
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Graphs and tables evaluating user cohort engagement, workout distributions, and challenge completion
          </p>
        </div>

        <div className="flex items-center gap-1 text-xs">
          {(['all', '30d', '7d'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeRange(t)}
              className={`px-3 py-1 rounded-md uppercase font-mono text-[11px] transition-colors ${
                timeRange === t
                  ? 'bg-zinc-800 text-white font-medium'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {t === 'all' ? 'All Time' : `Last ${t}`}
            </button>
          ))}
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Active Athletes</span>
            <Users className="w-3.5 h-3.5 text-lime-400" />
          </div>
          <p className="text-2xl font-bold font-mono tabular-nums text-white mt-1.5">
            {totalUsers}
          </p>
          <p className="text-[11px] text-zinc-500 mt-0.5 font-mono">
            {maleUsers} Male · {femaleUsers} Female
          </p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Cumulative Sessions</span>
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold font-mono tabular-nums text-white mt-1.5">
            {totalWorkouts}
          </p>
          <p className="text-[11px] text-zinc-500 mt-0.5 font-mono">
            {(totalMinutes / 60).toFixed(1)} total hours
          </p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Gross Energy Output</span>
            <Flame className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold font-mono tabular-nums text-white mt-1.5">
            {totalCalories.toLocaleString()} <span className="text-xs font-normal text-zinc-400 font-sans">kcal</span>
          </p>
          <p className="text-[11px] text-zinc-500 mt-0.5 font-mono">
            Avg {totalWorkouts > 0 ? Math.round(totalCalories / totalWorkouts) : 0} kcal/workout
          </p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Arena Completion</span>
            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold font-mono tabular-nums text-white mt-1.5">
            {completionRate}%
          </p>
          <p className="text-[11px] text-zinc-500 mt-0.5 font-mono">
            {totalEnrollments} active enrollments
          </p>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Workout Category Breakdown Graph */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Workout Category Distribution</h3>
            <span className="text-xs font-mono text-zinc-400">{totalWorkouts} total</span>
          </div>

          <div className="space-y-3 pt-1">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = totalWorkouts > 0 ? Math.round((count / totalWorkouts) * 100) : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="capitalize text-zinc-300">{cat}</span>
                    <span className="text-zinc-400">
                      {count} logs ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-950 overflow-hidden border border-zinc-850">
                    <div
                      className="h-full bg-lime-400 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gender Focus Distribution */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Target Focus Cohort Share</h3>
            <span className="text-xs font-mono text-zinc-400">Male vs Female vs Unisex</span>
          </div>

          <div className="space-y-4 pt-1 text-xs">
            {/* Male Focus */}
            <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-850 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                <div>
                  <p className="font-semibold text-white">Male Hypertrophy & Power</p>
                  <p className="text-[11px] text-zinc-500 font-mono">V-Taper, Upper Body, Barbell Squats</p>
                </div>
              </div>
              <span className="font-mono text-base font-bold text-white tabular-nums">
                {focusCounts.male || 0} <span className="text-xs text-zinc-500 font-normal">logs</span>
              </span>
            </div>

            {/* Female Focus */}
            <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-850 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <div>
                  <p className="font-semibold text-white">Female Sculpt & Conditioning</p>
                  <p className="text-[11px] text-zinc-500 font-mono">Glute Hypertrophy, Transverse Vacuum, Tone</p>
                </div>
              </div>
              <span className="font-mono text-base font-bold text-white tabular-nums">
                {focusCounts.female || 0} <span className="text-xs text-zinc-500 font-normal">logs</span>
              </span>
            </div>

            {/* Unisex Athletic Focus */}
            <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-850 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-400" />
                <div>
                  <p className="font-semibold text-white">Unisex Performance & Mobility</p>
                  <p className="text-[11px] text-zinc-500 font-mono">Cardio Velocity, Functional Density</p>
                </div>
              </div>
              <span className="font-mono text-base font-bold text-white tabular-nums">
                {focusCounts.unisex || 0} <span className="text-xs text-zinc-500 font-normal">logs</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Challenge Participation Table */}
      <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
        <div className="p-4 border-b border-zinc-800">
          <h3 className="text-sm font-semibold text-white">Challenge Participation Matrix</h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Engagement and enrollment numbers across all active fitness challenges
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 uppercase font-mono tracking-wider text-[11px] bg-zinc-950/20">
                <th className="py-2.5 px-5 font-semibold">Challenge Title</th>
                <th className="py-2.5 px-4 font-semibold">Target Cohort</th>
                <th className="py-2.5 px-4 font-semibold">Duration</th>
                <th className="py-2.5 px-4 font-semibold">Difficulty</th>
                <th className="py-2.5 px-5 font-semibold text-right">Participants Enrolled</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850">
              {challenges.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3 px-5 font-semibold text-white">
                    {c.title}
                  </td>
                  <td className="py-3 px-4 capitalize font-mono text-zinc-300">
                    {c.genderFocus}
                  </td>
                  <td className="py-3 px-4 font-mono text-zinc-300">
                    {c.durationDays} days
                  </td>
                  <td className="py-3 px-4 capitalize font-mono text-zinc-400">
                    {c.difficulty}
                  </td>
                  <td className="py-3 px-5 text-right font-mono tabular-nums text-lime-400 font-bold">
                    {c.participantCount} athletes
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
