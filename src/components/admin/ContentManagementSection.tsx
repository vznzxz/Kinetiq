import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FitnessContent, ContentStatus } from '../../types';
import { Modal } from '../common/Modal';
import {
  FileText,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  Filter,
  Search,
  Clock,
  Flame,
  AlertCircle,
} from 'lucide-react';

export const ContentManagementSection: React.FC = () => {
  const { fitnessContent, approveFitnessContent, rejectFitnessContent, deleteFitnessContent } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContent, setSelectedContent] = useState<FitnessContent | null>(null);
  const [reviewAction, setReviewAction] = useState<{ id: string; type: 'approve' | 'reject'; title: string } | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  const filteredContent = fitnessContent.filter((c) => {
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleConfirmReview = () => {
    if (!reviewAction) return;
    if (reviewAction.type === 'approve') {
      approveFitnessContent(reviewAction.id, reviewNotes);
    } else {
      rejectFitnessContent(reviewAction.id, reviewNotes);
    }
    setReviewAction(null);
    setReviewNotes('');
  };

  const pendingCount = fitnessContent.filter((c) => c.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight">
            Fitness Content Moderation Queue
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Oversee user-submitted training routines, verify exercise execution safety, and grant publication approvals
          </p>
        </div>

        {pendingCount > 0 && (
          <div className="px-3 py-1.5 rounded-lg bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="font-mono">{pendingCount} Submissions Awaiting Approval</span>
          </div>
        )}
      </div>

      {/* Content Table Card */}
      <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
        {/* Table Search & Filter Bar */}
        <div className="p-4 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search content or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 w-56 sm:w-64"
            />
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-zinc-500 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>Status:</span>
            </span>
            {(['all', 'pending', 'approved', 'rejected'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded-md uppercase font-mono text-[11px] transition-colors ${
                  statusFilter === s
                    ? 'bg-zinc-800 text-white font-medium'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 uppercase font-mono tracking-wider text-[11px] bg-zinc-950/20">
                <th className="py-3 px-5 font-semibold">Content Title</th>
                <th className="py-3 px-4 font-semibold">Author</th>
                <th className="py-3 px-4 font-semibold">Target Focus</th>
                <th className="py-3 px-4 font-semibold">Difficulty</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-5 font-semibold text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850">
              {filteredContent.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="font-semibold text-white tracking-tight">{c.title}</div>
                    <div className="text-[11px] text-zinc-400 flex items-center gap-2 mt-0.5">
                      <span>{c.muscleGroup}</span>
                      <span className="text-zinc-600">·</span>
                      <span className="font-mono text-zinc-500">{c.estimatedDurationMins} min</span>
                      <span className="text-zinc-600">·</span>
                      <span className="font-mono text-lime-400">{c.estimatedCalories} kcal</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-zinc-300">
                    {c.authorName}
                  </td>

                  <td className="py-3.5 px-4 capitalize text-zinc-300 font-medium">
                    {c.genderFocus === 'male' && <span className="text-blue-400">Male Focus</span>}
                    {c.genderFocus === 'female' && <span className="text-rose-400">Female Focus</span>}
                    {c.genderFocus === 'unisex' && <span className="text-zinc-400">Unisex</span>}
                  </td>

                  <td className="py-3.5 px-4 capitalize font-mono text-zinc-400">
                    {c.difficulty}
                  </td>

                  <td className="py-3.5 px-4 font-mono uppercase text-[11px] font-semibold">
                    {c.status === 'approved' && (
                      <span className="text-lime-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approved</span>
                      </span>
                    )}
                    {c.status === 'pending' && (
                      <span className="text-amber-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Pending Review</span>
                      </span>
                    )}
                    {c.status === 'rejected' && (
                      <span className="text-rose-400 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Rejected</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedContent(c)}
                        className="px-2.5 py-1 text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-md flex items-center gap-1 transition-colors"
                        title="Inspect full instructions"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>

                      {c.status !== 'approved' && (
                        <button
                          onClick={() => {
                            setReviewAction({ id: c.id, type: 'approve', title: c.title });
                            setReviewNotes('Approved for high biomechanical quality.');
                          }}
                          className="px-2.5 py-1 text-zinc-950 font-semibold bg-lime-400 hover:bg-lime-300 rounded-md flex items-center gap-1 transition-colors"
                          title="Approve submission"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                      )}

                      {c.status !== 'rejected' && (
                        <button
                          onClick={() => {
                            setReviewAction({ id: c.id, type: 'reject', title: c.title });
                            setReviewNotes('Rejected: Please add form safety cues.');
                          }}
                          className="px-2.5 py-1 text-rose-300 hover:text-rose-200 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/40 rounded-md flex items-center gap-1 transition-colors"
                          title="Reject submission"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      )}

                      <button
                        onClick={() => deleteFitnessContent(c.id)}
                        className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-md hover:bg-zinc-800 transition-colors"
                        title="Delete from database"
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
      </div>

      {/* Review Action Confirmation Modal */}
      {reviewAction && (
        <Modal
          isOpen={true}
          onClose={() => setReviewAction(null)}
          title={reviewAction.type === 'approve' ? 'Approve Fitness Content' : 'Reject Fitness Content'}
          subtitle={`Submission: "${reviewAction.title}"`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-400 font-medium mb-1">
                Moderator Feedback / Reason (Sent to Athlete)
              </label>
              <textarea
                rows={3}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Enter feedback notes..."
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-700"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
              <button
                onClick={() => setReviewAction(null)}
                className="px-3 py-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReview}
                className={`px-4 py-1.5 font-semibold rounded-lg flex items-center gap-1.5 shadow-sm ${
                  reviewAction.type === 'approve'
                    ? 'text-zinc-950 bg-lime-400 hover:bg-lime-300'
                    : 'text-white bg-rose-600 hover:bg-rose-500'
                }`}
              >
                {reviewAction.type === 'approve' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Approval</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    <span>Confirm Rejection</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Content Inspection Modal */}
      {selectedContent && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedContent(null)}
          title={selectedContent.title}
          subtitle={`Submitted by ${selectedContent.authorName} · Status: ${selectedContent.status.toUpperCase()}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-zinc-950/70 rounded-xl border border-zinc-800 flex flex-wrap items-center justify-between gap-3 font-mono">
              <div>
                <span className="text-zinc-500 block text-[10px]">FOCUS</span>
                <span className="text-white font-medium uppercase">{selectedContent.genderFocus}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">MUSCLE</span>
                <span className="text-white font-medium">{selectedContent.muscleGroup}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">DURATION</span>
                <span className="text-white font-medium">{selectedContent.estimatedDurationMins} min</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">EST. BURN</span>
                <span className="text-lime-400 font-medium">{selectedContent.estimatedCalories} kcal</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-zinc-200 mb-1">Summary</h4>
              <p className="text-zinc-400 leading-relaxed">{selectedContent.summary}</p>
            </div>

            <div>
              <h4 className="font-semibold text-zinc-200 mb-2">Instructions</h4>
              <ol className="space-y-2">
                {selectedContent.instructions.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-850">
                    <span className="font-mono text-lime-400 font-bold shrink-0">{idx + 1}.</span>
                    <span className="text-zinc-300">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {selectedContent.reviewerNotes && (
              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                <span className="text-zinc-500 font-mono text-[10px] block uppercase">MODERATOR NOTES:</span>
                <p className="text-zinc-300 mt-1 italic">{selectedContent.reviewerNotes}</p>
              </div>
            )}

            <div className="flex justify-between items-center pt-3 border-t border-zinc-800">
              <span className="text-zinc-500 font-mono text-[11px]">
                Submitted: {selectedContent.submittedAt.slice(0, 10)}
              </span>

              <button
                onClick={() => setSelectedContent(null)}
                className="px-4 py-1.5 font-semibold text-zinc-950 bg-lime-400 hover:bg-lime-300 rounded-lg"
              >
                Done
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
