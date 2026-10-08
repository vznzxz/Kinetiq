import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FitnessChallenge } from '../../types';
import {
  Trophy,
  Users,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  Sparkles,
  Award,
  Filter,
} from 'lucide-react';

export const ChallengesSection: React.FC = () => {
  const { currentUser, challenges, participations, challengeHistory, joinChallenge, toggleChallengeDay } = useApp();

  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female' | 'unisex'>('all');
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);

  const activeParticipations = participations.filter((p) => p.userId === currentUser.id);

  const filteredChallenges = challenges.filter((c) => {
    return genderFilter === 'all' || c.genderFocus === genderFilter;
  });

  const getParticipation = (challengeId: string) => {
    return activeParticipations.find((p) => p.challengeId === challengeId);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight">
            Fitness Challenges & Arena
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Join structured male, female, and unisex training challenges, log daily tasks, and earn sovereign badges
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-zinc-500 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>Target:</span>
          </span>
          {(['all', 'male', 'female', 'unisex'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setGenderFilter(filter)}
              className={`px-2.5 py-1 rounded-md capitalize transition-colors ${
                genderFilter === filter
                  ? 'bg-zinc-800 text-white font-medium'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Active Enrolled Challenges Spotlight */}
      {activeParticipations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-lime-400" />
            <span>Your Active Enrolled Challenges</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeParticipations.map((part) => {
              const ch = challenges.find((c) => c.id === part.challengeId);
              if (!ch) return null;

              const percent = Math.min(100, Math.round((part.completedDays / part.totalDays) * 100));
              const isCheckedToday = !!part.checkins[todayStr];

              return (
                <div
                  key={part.id}
                  className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-750 hover:border-zinc-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-2">
                          <span className="capitalize">{ch.genderFocus} focus</span>
                          <span>·</span>
                          <span className="capitalize">{ch.category}</span>
                          <span>·</span>
                          <span className="text-lime-400 font-semibold">{ch.difficulty}</span>
                        </div>
                        <h4 className="text-base font-bold text-white mt-1">{ch.title}</h4>
                      </div>
                      <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 shrink-0 text-center">
                        <Trophy className="w-4 h-4 text-amber-400 mx-auto" />
                        <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">
                          {ch.rewardBadge}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-400 mt-2 line-clamp-2">
                      {ch.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-4 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-zinc-400">
                          {part.completedDays} / {part.totalDays} Days Completed
                        </span>
                        <span className="text-lime-400 font-semibold">{percent}%</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                        <div
                          className="h-full bg-lime-400 transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    {/* Daily Checklist */}
                    <div className="mt-4 pt-4 border-t border-zinc-800">
                      <p className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                        Today's Protocol Checklist
                      </p>
                      <div className="space-y-1.5">
                        {ch.dailyTasks.map((task, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 text-xs text-zinc-400"
                          >
                            <span className="text-lime-400 font-mono text-[10px] mt-0.5">0{idx + 1}.</span>
                            <span>{task}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Daily Check-in Button */}
                  <div className="mt-5 pt-3 border-t border-zinc-800 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-zinc-500">
                      Status: {part.status.toUpperCase()}
                    </span>
                    <button
                      onClick={() => toggleChallengeDay(ch.id, todayStr)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                        isCheckedToday
                          ? 'bg-zinc-800 text-lime-400 border border-lime-400/30'
                          : 'bg-lime-400 hover:bg-lime-300 text-zinc-950 shadow-sm'
                      }`}
                    >
                      {isCheckedToday ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Logged Today (Completed)</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-3.5 h-3.5" />
                          <span>Log Today's Completion</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Challenges Directory */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-white">
          All Available Fitness Challenges
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChallenges.map((ch) => {
            const participation = getParticipation(ch.id);
            const isEnrolled = !!participation;

            return (
              <div
                key={ch.id}
                className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="font-mono text-[11px] text-zinc-400 capitalize">
                      {ch.genderFocus} focus · {ch.durationDays} Days
                    </span>
                    <span className="text-zinc-500 flex items-center gap-1 font-mono text-[11px]">
                      <Users className="w-3 h-3" />
                      <span>{ch.participantCount} enrolled</span>
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mt-2 leading-snug">
                    {ch.title}
                  </h4>

                  <p className="text-xs text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                    {ch.description}
                  </p>

                  <div className="mt-4 p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-850 text-xs">
                    <span className="text-zinc-500 font-mono text-[10px] block uppercase">
                      Target Benchmark:
                    </span>
                    <span className="text-zinc-200 font-medium mt-0.5 block">
                      {ch.targetGoal}
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-amber-400">
                    <Trophy className="w-3.5 h-3.5" />
                    <span className="font-mono text-[11px] text-zinc-300 truncate max-w-[120px]">
                      {ch.rewardBadge}
                    </span>
                  </div>

                  {isEnrolled ? (
                    <span className="text-xs font-mono text-lime-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Active</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => joinChallenge(ch.id)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-zinc-950 bg-lime-400 hover:bg-lime-300 rounded-lg flex items-center gap-1 transition-colors shadow-sm cursor-pointer"
                    >
                      <span>Join Challenge</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Challenge History (Past Completed & Results) */}
      <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Challenge History & Badges</h3>
          <p className="text-xs text-zinc-400">
            Official record of past challenge completions and earned athletic accolades
          </p>
        </div>

        {challengeHistory.length === 0 ? (
          <p className="text-xs text-zinc-500 py-6 text-center">
            No past challenges recorded. Complete an active challenge to unlock history and badges.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 uppercase font-mono tracking-wider text-[11px] bg-zinc-950/20">
                  <th className="py-2.5 px-4 font-semibold">Challenge</th>
                  <th className="py-2.5 px-4 font-semibold">Completed Date</th>
                  <th className="py-2.5 px-4 font-semibold">Completion Rate</th>
                  <th className="py-2.5 px-4 font-semibold">Days Logged</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Badge Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850">
                {challengeHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-800/30">
                    <td className="py-3 px-4 font-semibold text-white">
                      {item.challengeTitle}
                    </td>
                    <td className="py-3 px-4 font-mono text-zinc-400 tabular-nums">
                      {item.completedAt}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-lime-400 font-medium">
                      {item.completionRate}%
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-zinc-300">
                      {item.daysCompleted} / {item.totalDays} days
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1.5 font-mono text-amber-400 font-semibold">
                        <Award className="w-3.5 h-3.5" />
                        <span>{item.badgeEarned}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
