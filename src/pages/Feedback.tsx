import React, { useState } from 'react';
import {
  MessageSquarePlus,
  History,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { UserRecord } from '../types.ts';

interface FeedbackProps {
  user: UserRecord | null;
  onSubmitFeedback: (userId: string, feedbackText: string) => Promise<void>;
  isUpdatingFeedback: boolean;
  errorMessage: string | null;
  onClearError: () => void;
  onNavigateToResult: () => void;
  onNavigateToHome: () => void;
}

const FEEDBACK_TEMPLATES = [
  'Add more cardio intervals and increase calorie burn on Days 2 and 5',
  'Reduce workout intensity and include more low-impact joint-friendly exercises',
  'Include more rest days and add a 20-minute restorative yoga flow',
  'Swap barbell movements for dumbbell and bodyweight exercises I can do at home',
  'Add extra core stability and posture exercises at the end of each workout',
];

export const Feedback: React.FC<FeedbackProps> = ({
  user,
  onSubmitFeedback,
  isUpdatingFeedback,
  errorMessage,
  onClearError,
  onNavigateToResult,
  onNavigateToHome,
}) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [compareDay, setCompareDay] = useState<number>(1);

  if (!user) {
    return (
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-10 text-center max-w-xl mx-auto space-y-5">
          <h2 className="font-display text-2xl font-bold text-white">
            Generate a Plan First to Submit Feedback
          </h2>
          <p className="text-sm text-slate-400">
            Once you have an active 7-day fitness plan, you can use this page to request changes from FitBuddy AI and compare your Original Plan vs. Updated Plan side by side.
          </p>
          <button
            type="button"
            onClick={onNavigateToHome}
            className="px-6 py-3 rounded-xl font-semibold text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors cursor-pointer"
          >
            Go to Profile Form
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUpdatingFeedback) return;
    setLocalError(null);
    onClearError();

    const trimmed = feedbackText.trim();
    if (!trimmed || trimmed.length < 3) {
      setLocalError(
        'Please describe how you would like to improve your plan (at least 3 characters).'
      );
      return;
    }

    await onSubmitFeedback(user.user_id, trimmed);
    setFeedbackText('');
  };

  const originalDay =
    user.original_plan.days.find((d) => d.day === compareDay) ||
    user.original_plan.days[0];
  const updatedDay = user.updated_plan
    ? user.updated_plan.days.find((d) => d.day === compareDay) ||
      user.updated_plan.days[0]
    : null;

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
            <span>Adaptive AI Coaching</span>
            <span aria-hidden="true">·</span>
            <span>
              {user.name} ({user.user_id})
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-bold text-white mt-1">
            Improve My Plan & Plan History
          </h1>
        </div>

        <button
          type="button"
          onClick={onNavigateToResult}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-200 bg-[#111827] hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors self-start cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          Back to Full 7-Day Plan
        </button>
      </div>

      {/* Feedback Submission Card */}
      <section
        aria-labelledby="improve-plan-heading"
        className="bg-[#111827] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6"
      >
        <div className="space-y-1">
          <h2
            id="improve-plan-heading"
            className="font-display text-xl sm:text-2xl font-bold text-white"
          >
            Improve My Plan
          </h2>
          <p className="text-sm text-slate-400">
            Tell Gemini what you want to adjust. FitBuddy will retrieve your existing plan, apply your feedback, and generate a new 7-day schedule while keeping your Original Plan untouched.
          </p>
        </div>

        {(localError || errorMessage) && (
          <div
            role="alert"
            className="p-4 rounded-xl bg-red-950/50 border border-red-800 text-sm text-red-200"
          >
            {localError || errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="feedback-main-textarea"
              className="block text-xs font-semibold text-slate-300 mb-2"
            >
              Your Coaching Feedback or Modification Request
            </label>
            <textarea
              id="feedback-main-textarea"
              rows={4}
              disabled={isUpdatingFeedback}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Example: Add more cardio, reduce workout intensity, include more rest days, add yoga…"
              className="w-full bg-[#0B0F17] border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          <div className="space-y-2">
            <span className="block text-xs text-slate-400">
              Click a common modification to populate:
            </span>
            <div className="flex flex-wrap gap-2">
              {FEEDBACK_TEMPLATES.map((tpl) => (
                <button
                  key={tpl}
                  type="button"
                  disabled={isUpdatingFeedback}
                  onClick={() => setFeedbackText(tpl)}
                  className="px-3 py-1.5 text-xs bg-[#0B0F17] hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  {tpl}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-1 space-y-4">
            <button
              type="submit"
              disabled={isUpdatingFeedback}
              className="w-full sm:w-auto min-w-[240px] py-3.5 px-6 rounded-xl font-display text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:bg-emerald-500/60 transition-colors flex items-center justify-center gap-2.5 cursor-pointer"
            >
              {isUpdatingFeedback ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>FitBuddy AI is updating your workout plan…</span>
                </>
              ) : (
                <>
                  <MessageSquarePlus className="w-4 h-4" />
                  <span>Update My Plan</span>
                </>
              )}
            </button>

            {isUpdatingFeedback && (
              <div
                aria-live="polite"
                className="p-4 rounded-xl bg-[#0B0F17] border border-emerald-500/30 space-y-2"
              >
                <div className="flex items-center justify-between text-xs text-emerald-300 font-medium">
                  <span>FitBuddy AI is updating your workout plan…</span>
                  <span className="font-mono-tabular">Preserving Original Plan</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full animate-pulse w-4/5" />
                </div>
              </div>
            )}
          </div>
        </form>
      </section>

      {/* Plan History: Original Plan vs Updated Plan */}
      <section aria-labelledby="plan-history-heading" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2
              id="plan-history-heading"
              className="font-display text-2xl font-bold text-white flex items-center gap-2.5"
            >
              <History className="w-6 h-6 text-emerald-400" />
              Plan History: Original Plan vs. Updated Plan
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Compare how Gemini adapted your 7-day workout schedule while preserving your original baseline plan.
            </p>
          </div>
        </div>

        {/* Feedback Log Banner (if feedback has been submitted) */}
        {user.feedback && (
          <div className="bg-[#111827] border border-emerald-500/30 rounded-2xl p-5 sm:p-6 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Latest Feedback Provided
              </span>
              {user.updated_at && (
                <span className="font-mono-tabular text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Updated on {new Date(user.updated_at).toLocaleString()}
                </span>
              )}
            </div>
            <p className="text-sm text-white font-medium">“{user.feedback}”</p>
            {user.feedback_history && user.feedback_history.length > 0 && (
              <p className="text-xs text-slate-300">
                <strong className="text-emerald-300">AI Change Summary:</strong>{' '}
                {user.feedback_history[0].change_summary}
              </p>
            )}
          </div>
        )}

        {/* Day Selector for Side-by-Side Comparison */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[1, 2, 3, 4, 5, 6, 7].map((dayNum) => (
            <button
              key={dayNum}
              type="button"
              onClick={() => setCompareDay(dayNum)}
              className={`px-3.5 py-2 text-xs font-mono-tabular font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                compareDay === dayNum
                  ? 'bg-emerald-400 text-slate-950'
                  : 'bg-[#111827] text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              Compare Day {dayNum}
            </button>
          ))}
        </div>

        {/* Side-by-Side Original Plan vs Updated Plan */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Original Plan Column */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="pb-4 border-b border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Original Plan (Preserved)</span>
                <span className="font-mono-tabular">
                  Created {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
              <h3 className="font-display text-lg font-bold text-white">
                {user.original_plan.plan_title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {user.original_plan.overview}
              </p>
            </div>

            {originalDay && (
              <div className="space-y-4">
                <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono-tabular font-semibold text-emerald-400">
                      {originalDay.day_label}
                    </span>
                    <span className="font-mono-tabular text-slate-400">
                      ⏱️ {originalDay.duration}
                    </span>
                  </div>
                  <h4 className="font-display text-base font-bold text-white">
                    🏋️ {originalDay.focus}
                  </h4>
                  <div className="pt-2 space-y-2">
                    <span className="block text-xs font-semibold text-amber-400">
                      🔥 Warm-up:
                    </span>
                    <ul className="text-xs text-slate-300 space-y-1">
                      {originalDay.warmup.map((w, i) => (
                        <li key={i}>• {w}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-2 space-y-2">
                    <span className="block text-xs font-semibold text-white">
                      💪 Exercises:
                    </span>
                    <ul className="space-y-2">
                      {originalDay.exercises.map((ex, i) => (
                        <li
                          key={i}
                          className="text-xs bg-slate-900/90 border border-slate-800/80 rounded-lg p-2.5 flex items-center justify-between gap-2"
                        >
                          <span className="font-medium text-slate-200">
                            {i + 1}. {ex.name}
                          </span>
                          <span className="font-mono-tabular text-slate-400 shrink-0">
                            {ex.sets} × {ex.reps_or_duration}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-2 text-xs text-slate-400">
                    <strong className="text-teal-400">💧 Recovery:</strong> {originalDay.recovery}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Updated Plan Column */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-5">
            {user.updated_plan && updatedDay ? (
              <>
                <div className="pb-4 border-b border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Updated Plan (Feedback Adapted)
                    </span>
                    <span className="font-mono-tabular text-slate-400">
                      {user.updated_at
                        ? `Updated ${new Date(user.updated_at).toLocaleDateString()}`
                        : 'Updated'}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-white">
                    {user.updated_plan.plan_title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {user.updated_plan.overview}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-[#0B0F17] border border-emerald-500/30 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono-tabular font-semibold text-emerald-400">
                        {updatedDay.day_label}
                      </span>
                      <span className="font-mono-tabular text-slate-400">
                        ⏱️ {updatedDay.duration}
                      </span>
                    </div>
                    <h4 className="font-display text-base font-bold text-white">
                      🏋️ {updatedDay.focus}
                    </h4>
                    <div className="pt-2 space-y-2">
                      <span className="block text-xs font-semibold text-amber-400">
                        🔥 Warm-up:
                      </span>
                      <ul className="text-xs text-slate-300 space-y-1">
                        {updatedDay.warmup.map((w, i) => (
                          <li key={i}>• {w}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-2 space-y-2">
                      <span className="block text-xs font-semibold text-white">
                        💪 Exercises:
                      </span>
                      <ul className="space-y-2">
                        {updatedDay.exercises.map((ex, i) => (
                          <li
                            key={i}
                            className="text-xs bg-slate-900/90 border border-slate-800/80 rounded-lg p-2.5 flex items-center justify-between gap-2"
                          >
                            <span className="font-medium text-white">
                              {i + 1}. {ex.name}
                            </span>
                            <span className="font-mono-tabular text-emerald-300 shrink-0">
                              {ex.sets} × {ex.reps_or_duration}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-2 text-xs text-slate-400">
                      <strong className="text-teal-400">💧 Recovery:</strong>{' '}
                      {updatedDay.recovery}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4 space-y-3">
                <MessageSquarePlus className="w-8 h-8 text-slate-500" />
                <h3 className="font-display text-lg font-bold text-white">
                  No Updated Plan Yet
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
                  Submit feedback in the form above (for example, “Add 15 minutes of yoga mobility” or “Include more cardio”) and FitBuddy AI will generate your Updated Plan here for side-by-side comparison.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
