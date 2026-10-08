import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import {
  TrendingDown,
  TrendingUp,
  Award,
  Plus,
  Activity,
  Heart,
  Scale,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

export const ProgressTrackingSection: React.FC = () => {
  const { currentUser, metrics, prs, logMetric, addPersonalRecord, settings } = useApp();

  const [isLogMetricOpen, setIsLogMetricOpen] = useState(false);
  const [isAddPrOpen, setIsAddPrOpen] = useState(false);

  // Metric input form state
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [weightKg, setWeightKg] = useState<number>(currentUser.weight || 75);
  const [bodyFatPercentage, setBodyFatPercentage] = useState<number | ''>('');
  const [muscleMassPercentage, setMuscleMassPercentage] = useState<number | ''>('');
  const [waistCm, setWaistCm] = useState<number | ''>('');
  const [chestCm, setChestCm] = useState<number | ''>('');
  const [restingHeartRate, setRestingHeartRate] = useState<number | ''>('');

  // PR input form state
  const [prExercise, setPrExercise] = useState('');
  const [prMetric, setPrMetric] = useState('');
  const [prCategory, setPrCategory] = useState<'strength' | 'endurance' | 'milestone'>('strength');
  const [prDate, setPrDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Filter user metrics
  const userMetrics = metrics
    .filter((m) => m.userId === currentUser.id)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const userPrs = prs.filter((p) => p.userId === currentUser.id);

  const latestMetric = userMetrics[userMetrics.length - 1];
  const initialMetric = userMetrics[0];

  const weightDelta = latestMetric && initialMetric
    ? (latestMetric.weightKg - initialMetric.weightKg).toFixed(1)
    : '0.0';

  const bfDelta = latestMetric?.bodyFatPercentage && initialMetric?.bodyFatPercentage
    ? (latestMetric.bodyFatPercentage - initialMetric.bodyFatPercentage).toFixed(1)
    : null;

  const muscleDelta = latestMetric?.muscleMassPercentage && initialMetric?.muscleMassPercentage
    ? (latestMetric.muscleMassPercentage - initialMetric.muscleMassPercentage).toFixed(1)
    : null;

  const handleMetricSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logMetric({
      date,
      weightKg: Number(weightKg),
      bodyFatPercentage: bodyFatPercentage === '' ? undefined : Number(bodyFatPercentage),
      muscleMassPercentage: muscleMassPercentage === '' ? undefined : Number(muscleMassPercentage),
      waistCm: waistCm === '' ? undefined : Number(waistCm),
      chestCm: chestCm === '' ? undefined : Number(chestCm),
      restingHeartRate: restingHeartRate === '' ? undefined : Number(restingHeartRate),
    });
    setIsLogMetricOpen(false);
  };

  const handlePrSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prExercise.trim() || !prMetric.trim()) return;
    addPersonalRecord({
      exerciseName: prExercise,
      metric: prMetric,
      category: prCategory,
      dateAchieved: prDate,
    });
    setIsAddPrOpen(false);
    setPrExercise('');
    setPrMetric('');
  };

  // SVG Chart Computations for Weight Trend
  const chartHeight = 180;
  const chartWidth = 650;
  const paddingX = 40;
  const paddingY = 25;

  const weights = userMetrics.map((m) => m.weightKg);
  const minWeight = weights.length > 0 ? Math.min(...weights, currentUser.targetWeight) - 2 : 60;
  const maxWeight = weights.length > 0 ? Math.max(...weights, currentUser.targetWeight) + 2 : 90;

  const getX = (index: number) => {
    if (userMetrics.length <= 1) return paddingX;
    return paddingX + (index / (userMetrics.length - 1)) * (chartWidth - paddingX * 2);
  };

  const getY = (val: number) => {
    const range = maxWeight - minWeight || 1;
    return chartHeight - paddingY - ((val - minWeight) / range) * (chartHeight - paddingY * 2);
  };

  const pointsString = userMetrics
    .map((m, idx) => `${getX(idx)},${getY(m.weightKg)}`)
    .join(' ');

  const targetY = getY(currentUser.targetWeight);

  return (
    <div className="space-y-6">
      {/* Metrics Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight">
            Progress Tracking & Biometrics
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Log physical measurements, monitor weight velocity, and inspect personal best records
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddPrOpen(true)}
            className="px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Add Personal Record</span>
          </button>
          <button
            onClick={() => setIsLogMetricOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-zinc-950 bg-lime-400 hover:bg-lime-300 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Scale className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Log Biometrics</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Current Weight */}
        <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Current Weight</span>
            <Scale className="w-3.5 h-3.5 text-lime-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-white">
              {latestMetric ? latestMetric.weightKg : currentUser.weight}{' '}
              <span className="text-xs font-normal text-zinc-400">kg</span>
            </span>
            <span className={`text-xs font-mono tabular-nums flex items-center ${
              Number(weightDelta) < 0 ? 'text-lime-400' : 'text-zinc-400'
            }`}>
              {Number(weightDelta) < 0 ? <TrendingDown className="w-3 h-3 mr-0.5" /> : <TrendingUp className="w-3 h-3 mr-0.5" />}
              {weightDelta} kg
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Target: {currentUser.targetWeight} kg</p>
        </div>

        {/* Body Fat % */}
        <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Body Fat</span>
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-white">
              {latestMetric?.bodyFatPercentage ? `${latestMetric.bodyFatPercentage}%` : '--'}
            </span>
            {bfDelta && (
              <span className={`text-xs font-mono tabular-nums flex items-center ${
                Number(bfDelta) < 0 ? 'text-lime-400' : 'text-zinc-400'
              }`}>
                {Number(bfDelta) < 0 ? <TrendingDown className="w-3 h-3 mr-0.5" /> : <TrendingUp className="w-3 h-3 mr-0.5" />}
                {bfDelta}%
              </span>
            )}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">DXA Calibrated estimate</p>
        </div>

        {/* Muscle Mass */}
        <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Muscle Mass</span>
            <Activity className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-white">
              {latestMetric?.muscleMassPercentage ? `${latestMetric.muscleMassPercentage}%` : '--'}
            </span>
            {muscleDelta && (
              <span className="text-xs font-mono tabular-nums text-lime-400 flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" />
                +{muscleDelta}%
              </span>
            )}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Skeletal muscle ratio</p>
        </div>

        {/* Resting Heart Rate */}
        <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Resting Heart Rate</span>
            <Heart className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-white">
              {latestMetric?.restingHeartRate ? latestMetric.restingHeartRate : 56}{' '}
              <span className="text-xs font-normal text-zinc-400">BPM</span>
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Athletic baseline resting</p>
        </div>
      </div>

      {/* Interactive Weight Trend Graph */}
      <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-white">Weight Progression & Target Line</h3>
            <p className="text-xs text-zinc-400">
              Interactive timeline of bodyweight measurements against goal target of {currentUser.targetWeight} kg
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <span className="w-2.5 h-0.5 bg-lime-400 inline-block" />
              <span>Weight (kg)</span>
            </span>
            <span className="flex items-center gap-1.5 text-zinc-400">
              <span className="w-2.5 h-0.5 border-t border-dashed border-zinc-500 inline-block" />
              <span>Target ({currentUser.targetWeight} kg)</span>
            </span>
          </div>
        </div>

        {/* SVG Graphic */}
        <div className="w-full overflow-x-auto bg-zinc-950/50 p-4 rounded-xl border border-zinc-850">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-44 overflow-visible"
          >
            {/* Horizontal Grid lines */}
            {[minWeight, (minWeight + maxWeight) / 2, maxWeight].map((lvl, idx) => (
              <g key={idx}>
                <line
                  x1={paddingX}
                  y1={getY(lvl)}
                  x2={chartWidth - paddingX}
                  y2={getY(lvl)}
                  stroke="#27272a"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 8}
                  y={getY(lvl) + 3}
                  textAnchor="end"
                  fill="#71717a"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {lvl.toFixed(0)}
                </text>
              </g>
            ))}

            {/* Target Weight dashed line */}
            <line
              x1={paddingX}
              y1={targetY}
              x2={chartWidth - paddingX}
              y2={targetY}
              stroke="#a1a1aa"
              strokeWidth="1.5"
              strokeDasharray="5 5"
            />

            {/* Trend Polyline */}
            {userMetrics.length > 1 && (
              <polyline
                fill="none"
                stroke="#a3e635"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pointsString}
              />
            )}

            {/* Data Points */}
            {userMetrics.map((m, idx) => (
              <g key={m.id} className="group cursor-pointer">
                <circle
                  cx={getX(idx)}
                  cy={getY(m.weightKg)}
                  r="4.5"
                  fill="#09090b"
                  stroke="#a3e635"
                  strokeWidth="2.5"
                  className="transition-all hover:r-6"
                />
                {/* Date Label on bottom */}
                <text
                  x={getX(idx)}
                  y={chartHeight - 6}
                  textAnchor="middle"
                  fill="#71717a"
                  fontSize="9"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {m.date.slice(5)}
                </text>
                {/* Weight value above point */}
                <text
                  x={getX(idx)}
                  y={getY(m.weightKg) - 9}
                  textAnchor="middle"
                  fill="#f4f4f5"
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {m.weightKg}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Personal Records (PRs) Showcase */}
      <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Personal Records & Milestones</h3>
            <p className="text-xs text-zinc-400">
              Verified strength and endurance achievements for {currentUser.name}
            </p>
          </div>
          <button
            onClick={() => setIsAddPrOpen(true)}
            className="text-xs text-lime-400 hover:text-lime-300 flex items-center gap-1 font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Record</span>
          </button>
        </div>

        {userPrs.length === 0 ? (
          <p className="text-xs text-zinc-500 py-4 text-center">
            No personal records logged yet. Add your benchmark lifts or runs!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {userPrs.map((pr) => (
              <div
                key={pr.id}
                className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-850 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span className="capitalize text-[11px] font-mono text-zinc-500">
                    {pr.category}
                  </span>
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <h4 className="text-xs font-semibold text-white mt-1.5 truncate">
                  {pr.exerciseName}
                </h4>
                <p className="text-base font-bold font-mono tabular-nums text-lime-400 mt-0.5">
                  {pr.metric}
                </p>
                <p className="text-[10px] text-zinc-500 mt-1 font-mono">
                  Achieved {pr.dateAchieved}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Log Metric Modal */}
      <Modal
        isOpen={isLogMetricOpen}
        onClose={() => setIsLogMetricOpen(false)}
        title="Log Fitness & Body Biometrics"
        subtitle="Input current weight, body fat %, waist circumference and heart rate"
        maxWidth="lg"
      >
        <form onSubmit={handleMetricSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono focus:outline-none focus:border-zinc-700"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-medium mb-1">
                Body Weight (kg) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono focus:outline-none focus:border-zinc-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Body Fat %</label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 14.5"
                value={bodyFatPercentage}
                onChange={(e) => setBodyFatPercentage(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono focus:outline-none focus:border-zinc-700"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Muscle Mass %</label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 45.0"
                value={muscleMassPercentage}
                onChange={(e) => setMuscleMassPercentage(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono focus:outline-none focus:border-zinc-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Waist (cm)</label>
              <input
                type="number"
                step="0.5"
                placeholder="e.g. 82.5"
                value={waistCm}
                onChange={(e) => setWaistCm(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono focus:outline-none focus:border-zinc-700"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Chest / Hips (cm)</label>
              <input
                type="number"
                step="0.5"
                placeholder="e.g. 108"
                value={chestCm}
                onChange={(e) => setChestCm(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono focus:outline-none focus:border-zinc-700"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Resting HR (BPM)</label>
              <input
                type="number"
                placeholder="e.g. 55"
                value={restingHeartRate}
                onChange={(e) => setRestingHeartRate(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono focus:outline-none focus:border-zinc-700"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setIsLogMetricOpen(false)}
              className="px-3 py-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-semibold text-zinc-950 bg-lime-400 hover:bg-lime-300 rounded-lg flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Record Biometrics</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Add PR Modal */}
      <Modal
        isOpen={isAddPrOpen}
        onClose={() => setIsAddPrOpen(false)}
        title="Add Personal Record (PR)"
        subtitle="Log an all-time personal best lift, sprint, or endurance test"
        maxWidth="md"
      >
        <form onSubmit={handlePrSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-400 font-medium mb-1">Exercise or Test Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Barbell Squat, Deadlift, 5K Run, Plank"
              value={prExercise}
              onChange={(e) => setPrExercise(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Metric Value</label>
              <input
                type="text"
                required
                placeholder="e.g. 185 kg, 21:30 min, 100 reps"
                value={prMetric}
                onChange={(e) => setPrMetric(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono focus:outline-none focus:border-zinc-700"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Category</label>
              <select
                value={prCategory}
                onChange={(e) => setPrCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-700"
              >
                <option value="strength">Strength / 1RM</option>
                <option value="endurance">Endurance / Pacing</option>
                <option value="milestone">Milestone Test</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 font-medium mb-1">Date Achieved</label>
            <input
              type="date"
              value={prDate}
              onChange={(e) => setPrDate(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono focus:outline-none focus:border-zinc-700"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setIsAddPrOpen(false)}
              className="px-3 py-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-semibold text-zinc-950 bg-lime-400 hover:bg-lime-300 rounded-lg flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Personal Record</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
