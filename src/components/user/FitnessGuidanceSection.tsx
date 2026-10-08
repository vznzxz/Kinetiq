import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FitnessContent, GenderFocus } from '../../types';
import { Modal } from '../common/Modal';
import {
  BookOpen,
  Plus,
  Flame,
  Clock,
  Dumbbell,
  CheckCircle2,
  Send,
  Sparkles,
  Layers,
  ChevronRight,
  Filter,
} from 'lucide-react';

export const FitnessGuidanceSection: React.FC = () => {
  const { currentUser, fitnessContent, submitFitnessContent } = useApp();

  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [selectedContent, setSelectedContent] = useState<FitnessContent | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Submission Form State
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [genderFocus, setGenderFocus] = useState<GenderFocus>(currentUser.fitnessFocus);
  const [muscleGroup, setMuscleGroup] = useState('Full Body');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [estimatedDurationMins, setEstimatedDurationMins] = useState(45);
  const [estimatedCalories, setEstimatedCalories] = useState(400);
  const [instructionsText, setInstructionsText] = useState('');
  const [equipmentText, setEquipmentText] = useState('Barbell, Dumbbells, Bench');

  // Filter approved content for general library (plus user's own pending items)
  const availableContent = fitnessContent.filter((c) => {
    const isApprovedOrMine = c.status === 'approved' || c.authorId === currentUser.id;
    const matchesGender = genderFilter === 'all' || c.genderFocus === genderFilter;
    return isApprovedOrMine && matchesGender;
  });

  const handleSubmitContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;

    const instructions = instructionsText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const equipment = equipmentText
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    submitFitnessContent({
      title,
      summary,
      genderFocus,
      muscleGroup,
      difficulty,
      estimatedDurationMins: Number(estimatedDurationMins),
      estimatedCalories: Number(estimatedCalories),
      instructions: instructions.length > 0 ? instructions : ['Follow standard progressive overload protocol.'],
      equipmentNeeded: equipment.length > 0 ? equipment : ['Bodyweight'],
    });

    setIsSubmitModalOpen(false);
    setTitle('');
    setSummary('');
    setInstructionsText('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight">
            Fitness Guidance & Curated Programs
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Biomechanical protocols engineered for male hypertrophy, female contouring, and athletic capacity
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Gender Filter */}
          <div className="flex items-center gap-1 text-xs">
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

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-zinc-950 bg-lime-400 hover:bg-lime-300 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Submit Routine</span>
          </button>
        </div>
      </div>

      {/* Featured Editorial Split Cards (Male vs Female Specific Focus) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Male Focus Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 overflow-hidden flex flex-col justify-between group">
          <div className="relative h-48 overflow-hidden bg-zinc-950">
            <img
              src="/src/assets/images/kinetiq_male_strength_1791473699279.jpg"
              alt="Male Hypertrophy and Strength Protocol"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4">
              <span className="text-[10px] font-mono tracking-widest text-lime-400 uppercase font-semibold">
                Male Athletic Architecture
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                V-Taper Hypertrophy & Barbell Mechanics
              </h3>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <p className="text-xs text-zinc-400 leading-relaxed">
              Targeted vertical pulling volume for lat width, deltoid lateral head micro-trauma, and heavy compound squat density to stimulate myofibrillar growth.
            </p>
            <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-800">
              <span className="font-mono text-zinc-300">4-Day Upper/Lower Split</span>
              <button
                onClick={() => {
                  const item = fitnessContent.find((c) => c.genderFocus === 'male');
                  if (item) setSelectedContent(item);
                }}
                className="text-lime-400 hover:text-lime-300 font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>Inspect Protocol</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Female Focus Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 overflow-hidden flex flex-col justify-between group">
          <div className="relative h-48 overflow-hidden bg-zinc-950">
            <img
              src="/src/assets/images/kinetiq_female_toning_1791473726457.jpg"
              alt="Female Glute Sculpt and Conditioning Protocol"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4">
              <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-semibold">
                Female Precision Contouring
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                Glute Density & Transverse Core Vacuum
              </h3>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <p className="text-xs text-zinc-400 leading-relaxed">
              Horizontal force vectors for gluteal hypertrophy with zero quadricep dominancy, paired with deep transverse abdominal vacuums to trim waistline circumference.
            </p>
            <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-800">
              <span className="font-mono text-zinc-300">3-Day Glute/Core Matrix</span>
              <button
                onClick={() => {
                  const item = fitnessContent.find((c) => c.genderFocus === 'female');
                  if (item) setSelectedContent(item);
                }}
                className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>Inspect Protocol</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Guidance Programs Directory */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-white">All Fitness Content & Community Submissions</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableContent.map((content) => (
            <div
              key={content.id}
              className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                  <span className="capitalize">{content.genderFocus} focus</span>
                  <span className={
                    content.status === 'approved'
                      ? 'text-lime-400'
                      : content.status === 'pending'
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }>
                    {content.status.toUpperCase()}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mt-2 leading-snug">
                  {content.title}
                </h4>

                <p className="text-xs text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                  {content.summary}
                </p>

                <div className="mt-4 flex items-center gap-3 text-xs text-zinc-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{content.estimatedDurationMins}m</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>{content.estimatedCalories} kcal</span>
                  </span>
                  <span className="capitalize text-zinc-300">
                    {content.difficulty}
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-zinc-800 flex items-center justify-between">
                <span className="text-[11px] text-zinc-500">By {content.authorName}</span>
                <button
                  onClick={() => setSelectedContent(content)}
                  className="px-3 py-1 text-xs font-semibold text-zinc-200 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Routine Detail Modal */}
      {selectedContent && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedContent(null)}
          title={selectedContent.title}
          subtitle={`By ${selectedContent.authorName} · ${selectedContent.genderFocus.toUpperCase()} FOCUS`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            {selectedContent.imageUrl && (
              <div className="h-44 rounded-xl overflow-hidden bg-zinc-950">
                <img
                  src={selectedContent.imageUrl}
                  alt={selectedContent.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-3 bg-zinc-950/70 rounded-xl border border-zinc-800 flex flex-wrap items-center justify-between gap-3 font-mono">
              <div>
                <span className="text-zinc-500 block text-[10px]">MUSCLE TARGET</span>
                <span className="text-white font-medium">{selectedContent.muscleGroup}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">DURATION</span>
                <span className="text-white font-medium">{selectedContent.estimatedDurationMins} min</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">ESTIMATED BURN</span>
                <span className="text-lime-400 font-medium">{selectedContent.estimatedCalories} kcal</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">DIFFICULTY</span>
                <span className="text-white font-medium capitalize">{selectedContent.difficulty}</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-zinc-200 mb-1">Overview & Biomechanical Rationale</h4>
              <p className="text-zinc-400 leading-relaxed">{selectedContent.summary}</p>
            </div>

            <div>
              <h4 className="font-semibold text-zinc-200 mb-2">Step-by-Step Exercise Execution</h4>
              <ol className="space-y-2">
                {selectedContent.instructions.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-850">
                    <span className="font-mono text-lime-400 font-bold shrink-0">{idx + 1}.</span>
                    <span className="text-zinc-300 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {selectedContent.equipmentNeeded && (
              <div>
                <h4 className="font-semibold text-zinc-200 mb-1">Equipment Needed</h4>
                <div className="flex flex-wrap gap-1.5 text-zinc-300">
                  {selectedContent.equipmentNeeded.map((eq, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-zinc-800 text-[11px] font-mono">
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-zinc-800">
              <button
                onClick={() => setSelectedContent(null)}
                className="px-4 py-1.5 text-xs font-semibold text-zinc-950 bg-lime-400 hover:bg-lime-300 rounded-lg"
              >
                Close Protocol
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Submit Routine Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Submit Fitness Routine / Guide"
        subtitle="Share your training routine with the community. Submissions will be reviewed by the administrator."
        maxWidth="lg"
      >
        <form onSubmit={handleSubmitContent} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-400 font-medium mb-1">
              Routine Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Posterior Chain & Glute Thrust Ladder"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-700"
            />
          </div>

          <div>
            <label className="block text-zinc-400 font-medium mb-1">
              Summary / Objective <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={2}
              required
              placeholder="Brief summary of target outcomes and focus areas"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Gender Focus</label>
              <select
                value={genderFocus}
                onChange={(e) => setGenderFocus(e.target.value as any)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-700"
              >
                <option value="male">Male Focus</option>
                <option value="female">Female Focus</option>
                <option value="unisex">Unisex Athletic</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 font-medium mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-700"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Target Muscle</label>
              <input
                type="text"
                value={muscleGroup}
                onChange={(e) => setMuscleGroup(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-700"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Duration (min)</label>
              <input
                type="number"
                value={estimatedDurationMins}
                onChange={(e) => setEstimatedDurationMins(Number(e.target.value))}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono focus:outline-none focus:border-zinc-700"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Est. Burn (kcal)</label>
              <input
                type="number"
                value={estimatedCalories}
                onChange={(e) => setEstimatedCalories(Number(e.target.value))}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono focus:outline-none focus:border-zinc-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 font-medium mb-1">
              Instructions (one step per line)
            </label>
            <textarea
              rows={3}
              placeholder="Step 1: Warmup with resistance band for 5 mins&#10;Step 2: 4 sets of 10 reps&#10;Step 3: Cool down stretch"
              value={instructionsText}
              onChange={(e) => setInstructionsText(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-700"
            />
          </div>

          <div>
            <label className="block text-zinc-400 font-medium mb-1">Equipment (comma separated)</label>
            <input
              type="text"
              value={equipmentText}
              onChange={(e) => setEquipmentText(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-700"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(false)}
              className="px-3 py-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-semibold text-zinc-950 bg-lime-400 hover:bg-lime-300 rounded-lg flex items-center gap-1.5 shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>Submit for Admin Approval</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
