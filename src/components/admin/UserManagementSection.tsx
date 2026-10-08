import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, UserRole, GenderFocus, FitnessLevel, FitnessGoal } from '../../types';
import { Modal } from '../common/Modal';
import {
  Users,
  UserPlus,
  Search,
  ShieldCheck,
  User as UserIcon,
  Trash2,
  Edit2,
  CheckCircle2,
  Filter,
} from 'lucide-react';

export const UserManagementSection: React.FC = () => {
  const { users, currentUser, createUser, updateUser, deleteUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [fitnessFocus, setFitnessFocus] = useState<GenderFocus>('male');
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>('intermediate');
  const [primaryGoal, setPrimaryGoal] = useState<FitnessGoal>('hypertrophy');
  const [weight, setWeight] = useState(80);
  const [targetWeight, setTargetWeight] = useState(78);
  const [height, setHeight] = useState(180);
  const [dailyCalorieTarget, setDailyCalorieTarget] = useState(2500);

  const resetForm = () => {
    setName('');
    setEmail('');
    setRole('user');
    setGender('male');
    setFitnessFocus('male');
    setFitnessLevel('intermediate');
    setPrimaryGoal('hypertrophy');
    setWeight(80);
    setTargetWeight(78);
    setHeight(180);
    setDailyCalorieTarget(2500);
    setEditingUser(null);
  };

  const openEditModal = (u: User) => {
    setEditingUser(u);
    setName(u.name);
    setEmail(u.email);
    setRole(u.role);
    setGender(u.gender);
    setFitnessFocus(u.fitnessFocus);
    setFitnessLevel(u.fitnessLevel);
    setPrimaryGoal(u.primaryGoal);
    setWeight(u.weight);
    setTargetWeight(u.targetWeight);
    setHeight(u.height);
    setDailyCalorieTarget(u.dailyCalorieTarget);
    setIsCreateModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    if (editingUser) {
      updateUser(editingUser.id, {
        name,
        email,
        role,
        gender,
        fitnessFocus,
        fitnessLevel,
        primaryGoal,
        weight: Number(weight),
        targetWeight: Number(targetWeight),
        height: Number(height),
        dailyCalorieTarget: Number(dailyCalorieTarget),
      });
    } else {
      createUser({
        name,
        email,
        role,
        gender,
        fitnessFocus,
        fitnessLevel,
        primaryGoal,
        weight: Number(weight),
        targetWeight: Number(targetWeight),
        height: Number(height),
        dailyCalorieTarget: Number(dailyCalorieTarget),
        streakDays: 0,
      });
    }

    setIsCreateModalOpen(false);
    resetForm();
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight">
            User Management Console
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Admin directory for inspecting accounts, modifying user roles, and managing credentials
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsCreateModalOpen(true);
          }}
          className="px-3.5 py-1.5 text-xs font-semibold text-zinc-950 bg-lime-400 hover:bg-lime-300 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
        >
          <UserPlus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Create New User</span>
        </button>
      </div>

      {/* Users Table Card */}
      <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
        {/* Table Search & Controls */}
        <div className="p-4 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 w-56 sm:w-64"
            />
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-zinc-500 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>Role:</span>
            </span>
            {(['all', 'admin', 'user'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-2.5 py-1 rounded-md uppercase font-mono text-[11px] transition-colors ${
                  roleFilter === r
                    ? 'bg-zinc-800 text-white font-medium'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 uppercase font-mono tracking-wider text-[11px] bg-zinc-950/20">
                <th className="py-3 px-5 font-semibold">Athlete / User</th>
                <th className="py-3 px-4 font-semibold">Email</th>
                <th className="py-3 px-4 font-semibold">Role</th>
                <th className="py-3 px-4 font-semibold">Fitness Focus</th>
                <th className="py-3 px-4 font-semibold">Goal & Level</th>
                <th className="py-3 px-4 font-semibold text-center">Streak</th>
                <th className="py-3 px-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-[11px] text-lime-400 shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-white tracking-tight flex items-center gap-1.5">
                          <span>{u.name}</span>
                          {u.id === currentUser.id && (
                            <span className="text-[10px] font-mono text-lime-400 bg-lime-950/60 px-1 rounded">
                              (YOU)
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] font-mono text-zinc-500 capitalize">
                          {u.gender} · {u.weight} kg
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-zinc-400 text-[11px]">
                    {u.email}
                  </td>

                  <td className="py-3.5 px-4 font-mono uppercase text-[11px]">
                    {u.role === 'admin' ? (
                      <span className="text-amber-400 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Admin</span>
                      </span>
                    ) : (
                      <span className="text-zinc-300">User</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 capitalize font-medium text-zinc-300">
                    {u.fitnessFocus === 'male' && <span className="text-blue-400">Male Target</span>}
                    {u.fitnessFocus === 'female' && <span className="text-rose-400">Female Target</span>}
                    {u.fitnessFocus === 'unisex' && <span className="text-zinc-400">Unisex</span>}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-zinc-200 capitalize font-medium">
                      {u.primaryGoal.replace('_', ' ')}
                    </div>
                    <div className="text-[10px] text-zinc-500 capitalize font-mono">
                      {u.fitnessLevel}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono tabular-nums text-lime-400 font-semibold">
                    {u.streakDays}d
                  </td>

                  <td className="py-3.5 px-5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditModal(u)}
                        className="p-1.5 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition-colors"
                        title="Edit user details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingUserId(u.id)}
                        disabled={users.length <= 1}
                        className="p-1.5 text-zinc-400 hover:text-rose-400 rounded-md hover:bg-zinc-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Delete user"
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

      {/* Delete User Modal */}
      {deletingUserId && (
        <Modal
          isOpen={true}
          onClose={() => setDeletingUserId(null)}
          title="Delete User Account"
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs">
            <p className="text-zinc-300">
              Are you sure you want to delete this user account? All corresponding local workout entries and progression metrics will remain archived.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingUserId(null)}
                className="px-3 py-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteUser(deletingUserId);
                  setDeletingUserId(null);
                }}
                className="px-3.5 py-1.5 font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create / Edit User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        title={editingUser ? 'Edit User Credentials' : 'Create New User Account'}
        subtitle="Configure role, permissions, and initial fitness focus"
        maxWidth="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 font-medium mb-1">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Jordan Sterling"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-700"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-medium mb-1">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="jordan@kinetiq.fit"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono uppercase focus:outline-none focus:border-zinc-700"
              >
                <option value="user">USER</option>
                <option value="admin">ADMIN</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 font-medium mb-1">Biological Sex</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-700"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 font-medium mb-1">Fitness Focus</label>
              <select
                value={fitnessFocus}
                onChange={(e) => setFitnessFocus(e.target.value as any)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-700"
              >
                <option value="male">Male Focus</option>
                <option value="female">Female Focus</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Fitness Level</label>
              <select
                value={fitnessLevel}
                onChange={(e) => setFitnessLevel(e.target.value as any)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-700 capitalize"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="elite">Elite</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 font-medium mb-1">Primary Goal</label>
              <select
                value={primaryGoal}
                onChange={(e) => setPrimaryGoal(e.target.value as any)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-700 capitalize"
              >
                <option value="strength">Strength</option>
                <option value="hypertrophy">Hypertrophy</option>
                <option value="fat_loss">Fat Loss</option>
                <option value="endurance">Endurance</option>
                <option value="mobility">Mobility</option>
                <option value="athletic_performance">Athletic Performance</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Target (kg)</label>
              <input
                type="number"
                value={targetWeight}
                onChange={(e) => setTargetWeight(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Height (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Daily kcal</label>
              <input
                type="number"
                value={dailyCalorieTarget}
                onChange={(e) => setDailyCalorieTarget(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-white font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => {
                setIsCreateModalOpen(false);
                resetForm();
              }}
              className="px-3.5 py-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-semibold text-zinc-950 bg-lime-400 hover:bg-lime-300 rounded-lg flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{editingUser ? 'Save Changes' : 'Confirm & Create User'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
