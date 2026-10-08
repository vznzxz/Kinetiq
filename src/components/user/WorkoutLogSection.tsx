import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WorkoutLog, WorkoutIntensity, GenderFocus, WorkoutExercise } from '../../types';
import { Modal } from '../common/Modal';
import {
  Dumbbell,
  Clock,
  Flame,
  Search,
  Filter,
  Trash2,
  Edit2,
  Plus,
  Minus,
  Sparkles,
  CheckCircle2,
  Download,
} from 'lucide-react';

interface WorkoutLogSectionProps {
  isLogModalOpen: boolean;
  setIsLogModalOpen: (open: boolean) => void;
}

export const WorkoutLogSection: React.FC<WorkoutLogSectionProps> = ({
  isLogModalOpen,
  setIsLogModalOpen,
}) => {
  const { currentUser, workouts, logWorkout, updateWorkout, deleteWorkout, settings } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingWorkout, setEditingWorkout] = useState<WorkoutLog | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form states for Logging / Editing
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<WorkoutLog['category']>('strength');
  const [genderTarget, setGenderTarget] = useState<GenderFocus>(currentUser.fitnessFocus);
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [intensity, setIntensity] = useState<WorkoutIntensity>('high');
  const [caloriesBurned, setCaloriesBurned] = useState(380);
  const [targetMuscleGroup, setTargetMuscleGroup] = useState('Full Body');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [exercises, setExercises] = useState<WorkoutExercise[]>([
    { id: '1', name: 'Barbell Compound Movement', sets: 4, reps: 8, weightKg: 80 },
  ]);

  const resetForm = () => {
    setTitle('');
    setCategory('strength');
    setGenderTarget(currentUser.fitnessFocus);
    setDurationMinutes(45);
    setIntensity('high');
    setCaloriesBurned(380);
    setTargetMuscleGroup('Full Body');
    setNotes('');
    setDate(new Date().toISOString().split('T')[0]);
    setExercises([{ id: '1', name: '', sets: 3, reps: 10, weightKg: 20 }]);
    setEditingWorkout(null);
  };

  const openEditModal = (w: WorkoutLog) => {
    setEditingWorkout(w);
    setTitle(w.title);
    setCategory(w.category);
    setGenderTarget(w.genderTarget);
    setDurationMinutes(w.durationMinutes);
    setIntensity(w.intensity);
    setCaloriesBurned(w.caloriesBurned);
    setTargetMuscleGroup(w.targetMuscleGroup);
    setNotes(w.notes || '');
    setDate(w.date);
    setExercises(w.exercises && w.exercises.length > 0 ? w.exercises : [{ id: '1', name: 'Movement', sets: 3, reps: 10, weightKg: 20 }]);
    setIsLogModalOpen(true);
  };

  const handleAddExerciseRow = () => {
    setExercises((prev) => [
      ...prev,
      { id: Date.now().toString(), name: '', sets: 3, reps: 10, weightKg: 0 },
    ]);
  };

  const handleRemoveExerciseRow = (id: string) => {
    if (exercises.length <= 1) return;
    setExercises((prev) => prev.filter((ex) => ex.id !== id));
  };

  const handleExerciseChange = (id: string, field: keyof WorkoutExercise, value: any) => {
    setExercises((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const filteredExercises = exercises.filter((ex) => ex.name.trim().length > 0);

    if (editingWorkout) {
      updateWorkout(editingWorkout.id, {
        title,
        category,
        genderTarget,
        durationMinutes: Number(durationMinutes),
        intensity,
        caloriesBurned: Number(caloriesBurned),
        targetMuscleGroup,
        notes,
        date,
        exercises: filteredExercises,
      });
    } else {
      logWorkout({
        title,
        category,
        genderTarget,
        durationMinutes: Number(durationMinutes),
        intensity,
        caloriesBurned: Number(caloriesBurned),
        targetMuscleGroup,
        notes,
        date,
        exercises: filteredExercises,
      });
    }

    setIsLogModalOpen(false);
    resetForm();
  };

  // Filter workouts for current user or all if looking at community
  const userWorkouts = workouts.filter((w) => w.userId === currentUser.id);

  const filteredWorkouts = userWorkouts.filter((w) => {
    const matchesCategory = categoryFilter === 'all' || w.category === categoryFilter;
    const matchesGender = genderFilter === 'all' || w.genderTarget === genderFilter;
    const matchesSearch =
      w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.targetMuscleGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.notes && w.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesGender && matchesSearch;
  });

  // Calculate totals
  const totalVolume = userWorkouts.reduce((acc, w) => acc + (w.durationMinutes || 0), 0);
  const totalCalories = userWorkouts.reduce((acc, w) => acc + (w.caloriesBurned || 0), 0);

  const exportWorkoutsJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(userWorkouts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `kinetiq_workouts_${currentUser.name.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Workouts Logged</span>
            <Dumbbell className="w-4 h-4 text-lime-400" />
          </div>
          <p className="text-3xl font-bold tracking-tight text-white mt-2 font-mono tabular-nums">
            {userWorkouts.length}
          </p>
          <p className="text-xs text-zinc-500 mt-1">Lifetime sessions</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Total Active Minutes</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-bold tracking-tight text-white mt-2 font-mono tabular-nums">
            {totalVolume}
          </p>
          <p className="text-xs text-zinc-500 mt-1">{(totalVolume / 60).toFixed(1)} hours logged</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Total Energy Expended</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-bold tracking-tight text-white mt-2 font-mono tabular-nums">
            {totalCalories.toLocaleString()} <span className="text-sm font-sans font-normal text-zinc-400">kcal</span>
          </p>
          <p className="text-xs text-zinc-500 mt-1">Metabolic output</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Consistency Streak</span>
            <Sparkles className="w-4 h-4 text-lime-400" />
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold tracking-tight text-lime-400 font-mono tabular-nums">
              {currentUser.streakDays} <span className="text-sm font-sans font-normal text-zinc-400">days</span>
            </p>
            <p className="text-xs text-zinc-500 mt-1">Active daily engagement</p>
          </div>
        </div>
      </div>

      {/* Workout Table Section */}
      <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
        {/* Table Controls */}
        <div className="p-5 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">
              Workout Log
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Comprehensive list of all logged workouts with details, exercises, and actions
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search workouts or muscles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 w-48 sm:w-60"
              />
            </div>

            <button
              onClick={exportWorkoutsJson}
              className="px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Export Workout Log to JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <button
              onClick={() => {
                resetForm();
                setIsLogModalOpen(true);
              }}
              className="px-3.5 py-1.5 text-xs font-semibold text-zinc-950 bg-lime-400 hover:bg-lime-300 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Log Workout</span>
            </button>
          </div>
        </div>

        {/* Filters Bar: Segmented controls (compliant with zero-pill rule) */}
        <div className="px-5 py-3 border-b border-zinc-800 bg-zinc-950/40 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-zinc-500 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>Category:</span>
            </span>
            {['all', 'strength', 'hypertrophy', 'hiit', 'pilates', 'cardio'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-md capitalize transition-colors ${
                  categoryFilter === cat
                    ? 'bg-zinc-800 text-white font-medium'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <span className="text-zinc-500 mr-1">Focus:</span>
            {['all', 'male', 'female', 'unisex'].map((g) => (
              <button
                key={g}
                onClick={() => setGenderFilter(g)}
                className={`px-2.5 py-1 rounded-md capitalize transition-colors ${
                  genderFilter === g
                    ? 'bg-zinc-800 text-white font-medium'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Workouts Table */}
        {filteredWorkouts.length === 0 ? (
          <div className="p-12 text-center">
            <Dumbbell className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-zinc-300">No workout records found</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
              {searchQuery || categoryFilter !== 'all' || genderFilter !== 'all'
                ? 'Try adjusting your filters or search term to see logged workouts.'
                : 'Start tracking your strength and endurance by logging your first workout session.'}
            </p>
            <button
              onClick={() => {
                resetForm();
                setIsLogModalOpen(true);
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-zinc-950 bg-lime-400 hover:bg-lime-300 rounded-lg inline-flex items-center gap-2"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Log First Workout</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 uppercase font-mono tracking-wider text-[11px] bg-zinc-950/20">
                  <th className="py-3 px-5 font-semibold">Date</th>
                  <th className="py-3 px-5 font-semibold">Workout & Muscles</th>
                  <th className="py-3 px-4 font-semibold">Focus</th>
                  <th className="py-3 px-4 font-semibold">Duration</th>
                  <th className="py-3 px-4 font-semibold">Intensity</th>
                  <th className="py-3 px-4 font-semibold text-right">Calories</th>
                  <th className="py-3 px-5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850">
                {filteredWorkouts.map((w) => (
                  <tr
                    key={w.id}
                    className="hover:bg-zinc-800/40 transition-colors group"
                  >
                    {/* Date */}
                    <td className="py-3.5 px-5 font-mono text-zinc-400 tabular-nums whitespace-nowrap">
                      {w.date}
                    </td>

                    {/* Workout & Muscles */}
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-white tracking-tight">{w.title}</div>
                      <div className="text-[11px] text-zinc-400 flex items-center gap-2 mt-0.5">
                        <span className="capitalize">{w.category}</span>
                        <span className="text-zinc-600">·</span>
                        <span>{w.targetMuscleGroup}</span>
                        {w.exercises && w.exercises.length > 0 && (
                          <>
                            <span className="text-zinc-600">·</span>
                            <span className="font-mono text-zinc-500">
                              {w.exercises.length} movements
                            </span>
                          </>
                        )}
                      </div>
                      {w.notes && (
                        <p className="text-[11px] text-zinc-500 italic mt-1 line-clamp-1">
                          "{w.notes}"
                        </p>
                      )}
                    </td>

                    {/* Gender Focus (Compliant with Zero-Pill rule: clean unboxed text) */}
                    <td className="py-3.5 px-4 capitalize font-medium text-zinc-300">
                      {w.genderTarget === 'male' && <span className="text-blue-400">Male Target</span>}
                      {w.genderTarget === 'female' && <span className="text-rose-400">Female Target</span>}
                      {w.genderTarget === 'unisex' && <span className="text-zinc-400">Unisex Athletic</span>}
                    </td>

                    {/* Duration */}
                    <td className="py-3.5 px-4 font-mono tabular-nums text-zinc-300 whitespace-nowrap">
                      {w.durationMinutes} min
                    </td>

                    {/* Intensity */}
                    <td className="py-3.5 px-4 capitalize whitespace-nowrap">
                      <span
                        className={
                          w.intensity === 'maximum'
                            ? 'text-rose-400 font-semibold'
                            : w.intensity === 'high'
                            ? 'text-amber-400 font-medium'
                            : w.intensity === 'moderate'
                            ? 'text-lime-400'
                            : 'text-zinc-400'
                        }
                      >
                        {w.intensity}
                      </span>
                    </td>

                    {/* Calories */}
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-lime-400 font-semibold whitespace-nowrap">
                      {w.caloriesBurned} kcal
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(w)}
                          className="p-1.5 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition-colors"
                          title="Edit workout"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingId(w.id)}
                          className="p-1.5 text-zinc-400 hover:text-rose-400 rounded-md hover:bg-zinc-800 transition-colors"
                          title="Delete workout"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <Modal
          isOpen={true}
          onClose={() => setDeletingId(null)}
          title="Delete Workout Entry"
          maxWidth="sm"
        >
          <div className="space-y-4">
            <p className="text-xs text-zinc-300">
              Are you sure you want to delete this workout log? This will remove the session from your lifetime stats.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteWorkout(deletingId);
                  setDeletingId(null);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Log / Edit Workout Modal */}
      <Modal
        isOpen={isLogModalOpen}
        onClose={() => {
          setIsLogModalOpen(false);
          resetForm();
        }}
        title={editingWorkout ? 'Edit Workout Entry' : 'Log New Workout'}
        subtitle="Record workout parameters, duration, energy expenditure, and exercise sets"
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Row 1: Title and Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 font-medium mb-1">
                Workout Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Heavy Deadlift & Lat Width Protocol"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-700"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-medium mb-1">Workout Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-700"
              >
                <option value="strength">Strength & Power</option>
                <option value="hypertrophy">Hypertrophy (Muscle Building)</option>
                <option value="hiit">High-Intensity Interval (HIIT)</option>
                <option value="pilates">Pilates & Core Sculpt</option>
                <option value="cardio">Cardiovascular Endurance</option>
                <option value="mobility">Mobility & Functional Recovery</option>
                <option value="calisthenics">Bodyweight / Calisthenics</option>
              </select>
            </div>
          </div>

          {/* Row 2: Gender Target Focus and Muscle Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 font-medium mb-1">
                Gender Target Focus
              </label>
              <select
                value={genderTarget}
                onChange={(e) => setGenderTarget(e.target.value as any)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-700"
              >
                <option value="male">Male Focus (V-Taper, Upper Body Density, Quads)</option>
                <option value="female">Female Focus (Glutes, Waist Vacuum, Tone)</option>
                <option value="unisex">Unisex / Athletic Conditioning</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 font-medium mb-1">Target Muscle Group</label>
              <input
                type="text"
                placeholder="e.g. Glutes & Hamstrings, Chest & Back, Legs"
                value={targetMuscleGroup}
                onChange={(e) => setTargetMuscleGroup(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-700"
              />
            </div>
          </div>

          {/* Row 3: Duration, Intensity, Calories, Date */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Duration (min)</label>
              <input
                type="number"
                min="5"
                max="360"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono focus:outline-none focus:border-zinc-700"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-medium mb-1">Intensity</label>
              <select
                value={intensity}
                onChange={(e) => setIntensity(e.target.value as any)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-700"
              >
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
                <option value="maximum">Maximum</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 font-medium mb-1">Calories (kcal)</label>
              <input
                type="number"
                min="10"
                max="3000"
                value={caloriesBurned}
                onChange={(e) => setCaloriesBurned(Number(e.target.value))}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono focus:outline-none focus:border-zinc-700"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-medium mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono focus:outline-none focus:border-zinc-700"
              />
            </div>
          </div>

          {/* Exercises breakdown */}
          <div className="pt-2 border-t border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <label className="text-zinc-300 font-medium">Exercise Breakdown</label>
              <button
                type="button"
                onClick={handleAddExerciseRow}
                className="text-xs text-lime-400 hover:text-lime-300 flex items-center gap-1 font-medium"
              >
                <Plus className="w-3 h-3" />
                <span>Add Movement</span>
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {exercises.map((ex, idx) => (
                <div
                  key={ex.id}
                  className="grid grid-cols-12 gap-2 items-center bg-zinc-950/60 p-2 rounded-lg border border-zinc-850"
                >
                  <div className="col-span-5">
                    <input
                      type="text"
                      placeholder={`Exercise ${idx + 1} name`}
                      value={ex.name}
                      onChange={(e) => handleExerciseChange(ex.id, 'name', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Sets"
                      min="1"
                      value={ex.sets}
                      onChange={(e) => handleExerciseChange(ex.id, 'sets', Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-white font-mono text-center focus:outline-none"
                      title="Sets"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Reps"
                      min="1"
                      value={ex.reps}
                      onChange={(e) => handleExerciseChange(ex.id, 'reps', Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-white font-mono text-center focus:outline-none"
                      title="Reps"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="kg"
                      min="0"
                      value={ex.weightKg}
                      onChange={(e) => handleExerciseChange(ex.id, 'weightKg', Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-white font-mono text-center focus:outline-none"
                      title={settings.measurementUnit === 'imperial' ? 'Weight (lbs)' : 'Weight (kg)'}
                    />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveExerciseRow(ex.id)}
                      className="text-zinc-500 hover:text-rose-400 p-1"
                      title="Remove exercise"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-zinc-400 font-medium mb-1">Session Notes & Biometric Feeling</label>
            <textarea
              rows={2}
              placeholder="e.g. Good mind-muscle connection, hit PR on 3rd set, zero joint pain."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-700"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => {
                setIsLogModalOpen(false);
                resetForm();
              }}
              className="px-3.5 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-zinc-950 bg-lime-400 hover:bg-lime-300 rounded-lg flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{editingWorkout ? 'Save Changes' : 'Confirm & Log Workout'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
