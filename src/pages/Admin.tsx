import React, { useMemo, useState } from 'react';
import {
  Search,
  Trash2,
  Eye,
  FileText,
  MessageSquare,
  Sparkles,
  X,
  Users,
  Calendar,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';
import {
  DashboardStats,
  ExperienceLevel,
  FitnessGoal,
  UserRecord,
  WorkoutIntensity,
} from '../types.ts';
import coachAvatarImg from '../assets/images/coach_profile_avatar_1790742904111.jpg';

interface AdminProps {
  users: UserRecord[];
  stats: DashboardStats;
  onDeleteUser: (userId: string) => Promise<void>;
  onLoadUserIntoApp: (user: UserRecord, targetTab: 'result' | 'feedback') => void;
}

type ModalMode = 'profile' | 'original_plan' | 'updated_plan' | 'feedback';

export const Admin: React.FC<AdminProps> = ({
  users,
  stats,
  onDeleteUser,
  onLoadUserIntoApp,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [goalFilter, setGoalFilter] = useState<FitnessGoal | 'All'>('All');
  const [intensityFilter, setIntensityFilter] = useState<WorkoutIntensity | 'All'>('All');
  const [experienceFilter, setExperienceFilter] = useState<ExperienceLevel | 'All'>('All');
  const [sortBy, setSortBy] = useState<'Newest' | 'Oldest' | 'Goal'>('Newest');

  const [inspectUser, setInspectUser] = useState<UserRecord | null>(null);
  const [inspectMode, setInspectMode] = useState<ModalMode>('profile');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState(false);

  const filteredAndSortedUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = users.filter((u) => {
      const matchesSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.user_id.toLowerCase().includes(q);
      const matchesGoal = goalFilter === 'All' || u.goal === goalFilter;
      const matchesIntensity =
        intensityFilter === 'All' || u.intensity === intensityFilter;
      const matchesExperience =
        experienceFilter === 'All' || u.experience === experienceFilter;
      return (
        matchesSearch && matchesGoal && matchesIntensity && matchesExperience
      );
    });

    list.sort((a, b) => {
      if (sortBy === 'Newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === 'Oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      return a.goal.localeCompare(b.goal);
    });

    return list;
  }, [users, searchQuery, goalFilter, intensityFilter, experienceFilter, sortBy]);

  const openInspector = (user: UserRecord, mode: ModalMode) => {
    setInspectUser(user);
    setInspectMode(mode);
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Coach Dashboard Header */}
      <section className="bg-[#111827] border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden border border-slate-700 bg-slate-900 shrink-0">
            {!avatarError ? (
              <img
                src={coachAvatarImg}
                alt="Head Performance Coach"
                referrerPolicy="no-referrer"
                onError={() => setAvatarError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-emerald-400 font-bold text-sm">
                FB
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <span>Admin & Coach Console</span>
              <span aria-hidden="true">·</span>
              <span>Athlete Roster & Plan Audit</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mt-0.5">
              Admin Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Review registered users, inspect original and feedback-updated 7-day plans, and manage athlete records.
            </p>
          </div>
        </div>
      </section>

      {/* Dashboard Statistics */}
      <section
        aria-label="Dashboard Statistics"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Total Users</span>
          <p className="text-2xl sm:text-3xl font-mono-tabular font-bold text-white">
            {stats.total_users}
          </p>
          <span className="text-xs text-emerald-400">Registered athletes</span>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 space-y-1">
          <span className="text-xs text-slate-400 font-medium">
            Total Plans Generated
          </span>
          <p className="text-2xl sm:text-3xl font-mono-tabular font-bold text-white">
            {stats.total_plans_generated}
          </p>
          <span className="text-xs text-slate-400">Original + AI variations</span>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Updated Plans</span>
          <p className="text-2xl sm:text-3xl font-mono-tabular font-bold text-amber-400">
            {stats.updated_plans}
          </p>
          <span className="text-xs text-slate-400">Refined via user feedback</span>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Active Users</span>
          <p className="text-2xl sm:text-3xl font-mono-tabular font-bold text-emerald-400">
            {stats.active_users}
          </p>
          <span className="text-xs text-slate-400">Active 7-day schedules</span>
        </div>
      </section>

      {/* Search, Filter & Sort Controls */}
      <section
        aria-label="Search and Filter Users"
        className="bg-[#111827] border border-slate-800 rounded-2xl p-5 space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search by Name or User ID */}
          <div className="lg:col-span-2">
            <label
              htmlFor="admin-search"
              className="block text-xs font-medium text-slate-400 mb-1.5"
            >
              Search by Name or User ID
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="admin-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search e.g. Elena or FB-1042…"
                className="w-full bg-[#0B0F17] border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Filter by Fitness Goal */}
          <div>
            <label
              htmlFor="filter-goal"
              className="block text-xs font-medium text-slate-400 mb-1.5"
            >
              Fitness Goal
            </label>
            <select
              id="filter-goal"
              value={goalFilter}
              onChange={(e) => setGoalFilter(e.target.value as FitnessGoal | 'All')}
              className="w-full bg-[#0B0F17] border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
            >
              <option value="All">All Goals</option>
              <option value="Weight Loss">Weight Loss</option>
              <option value="Muscle Gain">Muscle Gain</option>
              <option value="General Wellness">General Wellness</option>
              <option value="Strength">Strength</option>
              <option value="Flexibility">Flexibility</option>
              <option value="Endurance">Endurance</option>
            </select>
          </div>

          {/* Filter by Workout Intensity */}
          <div>
            <label
              htmlFor="filter-intensity"
              className="block text-xs font-medium text-slate-400 mb-1.5"
            >
              Workout Intensity
            </label>
            <select
              id="filter-intensity"
              value={intensityFilter}
              onChange={(e) =>
                setIntensityFilter(e.target.value as WorkoutIntensity | 'All')
              }
              className="w-full bg-[#0B0F17] border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
            >
              <option value="All">All Intensities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Filter by Experience & Sort By */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label
                htmlFor="filter-experience"
                className="block text-xs font-medium text-slate-400 mb-1.5"
              >
                Experience
              </label>
              <select
                id="filter-experience"
                value={experienceFilter}
                onChange={(e) =>
                  setExperienceFilter(e.target.value as ExperienceLevel | 'All')
                }
                className="w-full bg-[#0B0F17] border border-slate-800 focus:border-emerald-500 rounded-xl px-2.5 py-2 text-sm text-white focus:outline-none"
              >
                <option value="All">All</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="sort-users"
                className="block text-xs font-medium text-slate-400 mb-1.5"
              >
                Sort By
              </label>
              <select
                id="sort-users"
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as 'Newest' | 'Oldest' | 'Goal')
                }
                className="w-full bg-[#0B0F17] border border-slate-800 focus:border-emerald-500 rounded-xl px-2.5 py-2 text-sm text-white focus:outline-none"
              >
                <option value="Newest">Newest</option>
                <option value="Oldest">Oldest</option>
                <option value="Goal">Goal</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Registered Users Table */}
      <section className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            Registered Athletes ({filteredAndSortedUsers.length})
          </h2>
          {(searchQuery ||
            goalFilter !== 'All' ||
            intensityFilter !== 'All' ||
            experienceFilter !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setGoalFilter('All');
                setIntensityFilter('All');
                setExperienceFilter('All');
              }}
              className="text-xs text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredAndSortedUsers.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <p className="text-sm font-semibold text-white">
              No matching user records found
            </p>
            <p className="text-xs text-slate-400">
              Try clearing your search filters or generate a new fitness plan on the Home page.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 bg-[#0B0F17]/60">
                  <th className="py-3.5 px-4">User ID</th>
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-3 text-right">Age</th>
                  <th className="py-3.5 px-3 text-right">Weight</th>
                  <th className="py-3.5 px-4">Goal</th>
                  <th className="py-3.5 px-4">Intensity</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-sm">
                {filteredAndSortedUsers.map((u) => {
                  const hasUpdate = Boolean(u.updated_plan);
                  const isConfirmingDelete = confirmDeleteId === u.user_id;
                  return (
                    <tr
                      key={u.user_id}
                      className="hover:bg-slate-900/60 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono-tabular text-xs font-semibold text-emerald-400 whitespace-nowrap">
                        {u.user_id}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-white whitespace-nowrap">
                        <div>{u.name}</div>
                        <div className="text-xs text-slate-400">
                          {u.experience} · {u.workout_duration}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono-tabular text-slate-300 whitespace-nowrap">
                        {u.age}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono-tabular text-slate-300 whitespace-nowrap">
                        {u.weight} kg
                      </td>
                      <td className="py-3.5 px-4 text-slate-200 whitespace-nowrap">
                        {u.goal}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                        {u.intensity}
                      </td>
                      <td className="py-3.5 px-4 text-xs whitespace-nowrap">
                        {hasUpdate ? (
                          <span className="text-amber-300 font-medium">
                            Updated ({u.updates_count})
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-medium">
                            Original Active
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openInspector(u, 'profile')}
                            title="View Profile"
                            className="px-2.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Profile</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => openInspector(u, 'original_plan')}
                            title="View Original Plan"
                            className="px-2.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 text-sky-400" />
                            <span>Original Plan</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => openInspector(u, 'updated_plan')}
                            title="View Updated Plan"
                            className="px-2.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>Updated Plan</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => openInspector(u, 'feedback')}
                            title="View Feedback"
                            className="px-2.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
                            <span>Feedback</span>
                          </button>

                          {isConfirmingDelete ? (
                            <div className="inline-flex items-center gap-1 bg-red-950/80 border border-red-700 rounded-lg px-2 py-1">
                              <button
                                type="button"
                                onClick={async () => {
                                  await onDeleteUser(u.user_id);
                                  setConfirmDeleteId(null);
                                  if (inspectUser?.user_id === u.user_id) {
                                    setInspectUser(null);
                                  }
                                }}
                                className="text-xs font-bold text-red-300 hover:text-white px-1.5 cursor-pointer"
                              >
                                Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="text-xs text-slate-400 hover:text-white px-1 cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(u.user_id)}
                              title="Delete User"
                              className="p-1.5 text-slate-400 hover:text-red-400 bg-slate-900 hover:bg-red-950/40 border border-slate-800 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Inspector Modal for View Profile / View Original Plan / View Updated Plan / View Feedback */}
      {inspectUser && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="inspector-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
        >
          <div className="bg-[#111827] border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono-tabular">
                  <span>{inspectUser.user_id}</span>
                  <span>·</span>
                  <span>{inspectUser.goal}</span>
                </div>
                <h3
                  id="inspector-modal-title"
                  className="font-display text-xl font-bold text-white"
                >
                  {inspectUser.name} — Coach Record Inspector
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onLoadUserIntoApp(inspectUser, 'result');
                    setInspectUser(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer"
                >
                  <span>Open in My Plan</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setInspectUser(null)}
                  aria-label="Close inspector"
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg border border-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Mode Tabs */}
            <div className="px-6 py-2.5 bg-[#0B0F17] border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
              {(
                [
                  { id: 'profile', label: 'User Profile & Nutrition' },
                  { id: 'original_plan', label: 'Original 7-Day Plan' },
                  { id: 'updated_plan', label: 'Updated 7-Day Plan' },
                  { id: 'feedback', label: 'Feedback History' },
                ] as { id: ModalMode; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setInspectMode(tab.id)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    inspectMode === tab.id
                      ? 'bg-emerald-400 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {inspectMode === 'profile' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#0B0F17] border border-slate-800 rounded-xl p-4">
                    <div>
                      <span className="block text-xs text-slate-400">Full Name</span>
                      <span className="text-sm font-semibold text-white">
                        {inspectUser.name}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-400">User ID</span>
                      <span className="text-sm font-mono-tabular font-semibold text-emerald-400">
                        {inspectUser.user_id}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-400">Age</span>
                      <span className="text-sm font-mono-tabular font-semibold text-white">
                        {inspectUser.age} years
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-400">Weight</span>
                      <span className="text-sm font-mono-tabular font-semibold text-white">
                        {inspectUser.weight} kg
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-400">Fitness Goal</span>
                      <span className="text-sm font-semibold text-white">
                        {inspectUser.goal}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-400">Intensity</span>
                      <span className="text-sm font-semibold text-white">
                        {inspectUser.intensity}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-400">Experience</span>
                      <span className="text-sm font-semibold text-white">
                        {inspectUser.experience}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-400">Schedule</span>
                      <span className="text-sm font-mono-tabular font-semibold text-white">
                        {inspectUser.available_days}d/wk · {inspectUser.workout_duration}
                      </span>
                    </div>
                  </div>

                  {inspectUser.preferences && (
                    <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 space-y-1">
                      <span className="text-xs font-semibold text-slate-400">
                        Athlete Preferences & Notes
                      </span>
                      <p className="text-sm text-slate-200">{inspectUser.preferences}</p>
                    </div>
                  )}

                  <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 space-y-3">
                    <h4 className="text-sm font-bold text-amber-400">
                      💡 AI Nutrition & Recovery Tip: {inspectUser.nutrition_tip.headline}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300">
                      {inspectUser.nutrition_tip.summary}
                    </p>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {inspectUser.nutrition_tip.key_pillars.map((p, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {inspectMode === 'original_plan' && (
                <div className="space-y-4">
                  <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4">
                    <h4 className="font-display text-base font-bold text-white">
                      {inspectUser.original_plan.plan_title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      {inspectUser.original_plan.overview}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {inspectUser.original_plan.days.map((d) => (
                      <div
                        key={d.day}
                        className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-display text-sm font-bold text-white">
                            🏋️ {d.day_label} – {d.focus}
                          </span>
                          <span className="text-xs font-mono-tabular text-slate-400">
                            {d.duration}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {d.exercises.map((ex, i) => (
                            <div
                              key={i}
                              className="text-xs bg-slate-900 border border-slate-800/80 rounded-lg px-3 py-2 flex items-center justify-between gap-2"
                            >
                              <span className="text-slate-200 font-medium">
                                {i + 1}. {ex.name}
                              </span>
                              <span className="font-mono-tabular text-emerald-400 shrink-0">
                                {ex.sets} × {ex.reps_or_duration}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {inspectMode === 'updated_plan' && (
                <div className="space-y-4">
                  {inspectUser.updated_plan ? (
                    <>
                      <div className="bg-[#0B0F17] border border-emerald-500/30 rounded-xl p-4">
                        <h4 className="font-display text-base font-bold text-white">
                          {inspectUser.updated_plan.plan_title}
                        </h4>
                        <p className="text-xs text-slate-300 mt-1">
                          {inspectUser.updated_plan.overview}
                        </p>
                      </div>

                      <div className="space-y-3">
                        {inspectUser.updated_plan.days.map((d) => (
                          <div
                            key={d.day}
                            className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-display text-sm font-bold text-white">
                                🏋️ {d.day_label} – {d.focus}
                              </span>
                              <span className="text-xs font-mono-tabular text-slate-400">
                                {d.duration}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                              {d.exercises.map((ex, i) => (
                                <div
                                  key={i}
                                  className="text-xs bg-slate-900 border border-slate-800/80 rounded-lg px-3 py-2 flex items-center justify-between gap-2"
                                >
                                  <span className="text-slate-200 font-medium">
                                    {i + 1}. {ex.name}
                                  </span>
                                  <span className="font-mono-tabular text-amber-300 shrink-0">
                                    {ex.sets} × {ex.reps_or_duration}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="p-8 text-center bg-[#0B0F17] border border-slate-800 rounded-xl space-y-3">
                      <p className="text-sm font-semibold text-white">
                        No Updated Plan Generated Yet
                      </p>
                      <p className="text-xs text-slate-400">
                        This user is currently using their Original 7-Day Plan. You can open their profile in the Feedback tab to test generating a feedback-adapted plan.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          onLoadUserIntoApp(inspectUser, 'feedback');
                          setInspectUser(null);
                        }}
                        className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer"
                      >
                        Submit Feedback for {inspectUser.name}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {inspectMode === 'feedback' && (
                <div className="space-y-4">
                  {inspectUser.feedback_history &&
                  inspectUser.feedback_history.length > 0 ? (
                    inspectUser.feedback_history.map((entry) => (
                      <div
                        key={entry.id}
                        className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="font-semibold text-emerald-400">
                            Submitted Feedback
                          </span>
                          <span className="font-mono-tabular flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(entry.submitted_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-white italic">
                          “{entry.feedback_text}”
                        </p>
                        <p className="text-xs text-slate-300 pt-1 border-t border-slate-800/80">
                          <strong className="text-amber-300">AI Modification Summary:</strong>{' '}
                          {entry.change_summary}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center bg-[#0B0F17] border border-slate-800 rounded-xl space-y-2">
                      <p className="text-sm font-semibold text-white">
                        No Feedback Submitted Yet
                      </p>
                      <p className="text-xs text-slate-400">
                        {inspectUser.name} has not requested any plan modifications yet.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
