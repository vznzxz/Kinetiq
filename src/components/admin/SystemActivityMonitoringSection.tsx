import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ActivityLog } from '../../types';
import {
  Activity,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Shield,
  User,
  Dumbbell,
  Sliders,
} from 'lucide-react';

export const SystemActivityMonitoringSection: React.FC = () => {
  const { activityLogs } = useApp();

  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = activityLogs.filter((log) => {
    const matchesFilter = filterType === 'all' || log.actionType === filterType;
    const matchesSearch =
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getActionIcon = (type: ActivityLog['actionType']) => {
    switch (type) {
      case 'user_management':
        return <User className="w-3.5 h-3.5 text-blue-400" />;
      case 'content_management':
        return <Shield className="w-3.5 h-3.5 text-amber-400" />;
      case 'workout_logged':
        return <Dumbbell className="w-3.5 h-3.5 text-lime-400" />;
      case 'challenge_joined':
      case 'challenge_completed':
        return <Activity className="w-3.5 h-3.5 text-purple-400" />;
      case 'system_settings':
        return <Sliders className="w-3.5 h-3.5 text-cyan-400" />;
      default:
        return <Info className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white tracking-tight">
              Real-Time System Activity Feed
            </h2>
            <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Audit logging trail tracking user interactions, workouts, content moderation, and setting revisions
          </p>
        </div>

        <div className="text-xs font-mono text-zinc-400">
          <span>{activityLogs.length} Events Logged in Session</span>
        </div>
      </div>

      {/* Audit Log Card */}
      <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
        {/* Controls */}
        <div className="p-4 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search activity description or actor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 w-60 sm:w-72"
            />
          </div>

          <div className="flex items-center gap-1 text-xs overflow-x-auto scrollbar-none">
            <span className="text-zinc-500 mr-1 flex items-center gap-1 shrink-0">
              <Filter className="w-3 h-3" />
              <span>Event:</span>
            </span>
            {[
              { id: 'all', label: 'All' },
              { id: 'workout_logged', label: 'Workouts' },
              { id: 'content_management', label: 'Content' },
              { id: 'user_management', label: 'Users' },
              { id: 'system_settings', label: 'Settings' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap transition-colors ${
                  filterType === f.id
                    ? 'bg-zinc-800 text-white font-medium'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Event Stream */}
        <div className="divide-y divide-zinc-850">
          {filteredLogs.length === 0 ? (
            <div className="p-12 text-center text-xs text-zinc-500">
              No matching activity events recorded.
            </div>
          ) : (
            filteredLogs.map((log) => {
              const dateObj = new Date(log.timestamp);
              const timeFormatted = dateObj.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              });
              const dateFormatted = dateObj.toLocaleDateString();

              return (
                <div
                  key={log.id}
                  className="p-4 hover:bg-zinc-800/30 transition-colors flex items-start gap-3.5 text-xs"
                >
                  <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 shrink-0 mt-0.5">
                    {getActionIcon(log.actionType)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-white">
                        {log.actorName}
                      </span>
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-zinc-950 border border-zinc-800 text-zinc-400">
                        {log.actorRole}
                      </span>
                      <span className="text-zinc-600">·</span>
                      <span className="text-[11px] font-mono text-zinc-500 capitalize">
                        {log.actionType.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-zinc-300 mt-1 leading-relaxed">
                      {log.description}
                    </p>
                  </div>

                  <div className="text-right shrink-0 font-mono text-[11px] text-zinc-500">
                    <div>{timeFormatted}</div>
                    <div className="text-[10px] text-zinc-600">{dateFormatted}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
