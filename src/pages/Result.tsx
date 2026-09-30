import React, { useState } from 'react';
import {
  Printer,
  Download,
  RefreshCw,
  MessageSquarePlus,
  PlusCircle,
  Loader2,
  CheckCircle2,
  History,
  ShieldAlert,
} from 'lucide-react';
import { DayPlan, UserRecord, WorkoutPlanData } from '../types.ts';
import nutritionGuideImg from '../assets/images/nutrition_recovery_guide_1790742892442.jpg';

interface ResultProps {
  user: UserRecord | null;
  onNavigateToHome: () => void;
  onNavigateToFeedback: () => void;
  onRegeneratePlan: (user: UserRecord) => Promise<void>;
  onSubmitFeedback: (userId: string, feedbackText: string) => Promise<void>;
  isGenerating: boolean;
  isUpdatingFeedback: boolean;
  errorMessage: string | null;
}

export const Result: React.FC<ResultProps> = ({
  user,
  onNavigateToHome,
  onNavigateToFeedback,
  onRegeneratePlan,
  onSubmitFeedback,
  isGenerating,
  isUpdatingFeedback,
  errorMessage,
}) => {
  const [selectedPlanVersion, setSelectedPlanVersion] = useState<'active' | 'original'>('active');
  const [selectedDayFilter, setSelectedDayFilter] = useState<number | 'all'>('all');
  const [quickFeedback, setQuickFeedback] = useState('');
  const [quickFeedbackError, setQuickFeedbackError] = useState<string | null>(null);
  const [nutritionImgError, setNutritionImgError] = useState(false);

  if (!user) {
    return (
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-10 text-center max-w-xl mx-auto space-y-5">
          <h2 className="font-display text-2xl font-bold text-white">
            No Fitness Plan Selected
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Create your personalized 7-day workout plan and nutrition protocol on the Home page to view your daily schedule here.
          </p>
          <button
            type="button"
            onClick={onNavigateToHome}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Generate My Fitness Plan
          </button>
        </div>
      </div>
    );
  }

  const hasUpdatedPlan = Boolean(user.updated_plan);
  const displayedPlan: WorkoutPlanData =
    selectedPlanVersion === 'active' && user.updated_plan
      ? user.updated_plan
      : user.original_plan;

  const daysToDisplay: DayPlan[] =
    selectedDayFilter === 'all'
      ? displayedPlan.days
      : displayedPlan.days.filter((d) => d.day === selectedDayFilter);

  const handlePrintPlan = () => {
    window.print();
  };

  const handleDownloadPlan = () => {
    const lines: string[] = [
      '============================================================',
      'FITBUDDY – AI FITNESS PLAN GENERATOR',
      '“Your AI-powered personal fitness companion”',
      '============================================================',
      '',
      'USER PROFILE',
      `Name: ${user.name}`,
      `User ID: ${user.user_id}`,
      `Age: ${user.age} years`,
      `Weight: ${user.weight} kg`,
      `Goal: ${user.goal}`,
      `Intensity: ${user.intensity}`,
      `Experience: ${user.experience}`,
      `Available Workout Days: ${user.available_days} days/week`,
      `Preferred Duration: ${user.workout_duration}`,
      `Plan Version: ${
        selectedPlanVersion === 'active' && user.updated_plan
          ? 'Updated Plan (Feedback Adapted)'
          : 'Original Plan'
      }`,
      '',
      `MOTIVATIONAL MESSAGE: "${displayedPlan.motivational_message}"`,
      '',
      '------------------------------------------------------------',
      `PLAN TITLE: ${displayedPlan.plan_title}`,
      `OVERVIEW: ${displayedPlan.overview}`,
      `CONSISTENCY TARGET: ${displayedPlan.weekly_consistency_target}`,
      '------------------------------------------------------------',
      '',
    ];

    for (const day of displayedPlan.days) {
      lines.push(
        `${day.day_label.toUpperCase()} – ${day.focus} (${day.duration})${
          day.is_rest_day ? ' [Recovery / Mobility]' : ''
        }`
      );
      lines.push(`Warm-up:`);
      day.warmup.forEach((w) => lines.push(`  - ${w}`));
      lines.push(`Main Workout:`);
      day.exercises.forEach((ex, idx) => {
        lines.push(
          `  ${idx + 1}. ${ex.name} – ${ex.sets} × ${ex.reps_or_duration} (Rest: ${ex.rest})`
        );
        if (ex.notes) lines.push(`     Note: ${ex.notes}`);
      });
      lines.push(`Rest Guidance: ${day.rest_guidance}`);
      lines.push(`Cool-down:`);
      day.cooldown.forEach((c) => lines.push(`  - ${c}`));
      lines.push(`Recovery Suggestion: ${day.recovery}`);
      lines.push('');
    }

    lines.push('------------------------------------------------------------');
    lines.push('💡 AI NUTRITION & RECOVERY TIP');
    lines.push(`Headline: ${displayedPlan.nutrition_tip.headline}`);
    lines.push(`Summary: ${displayedPlan.nutrition_tip.summary}`);
    lines.push(`Hydration Target: ${displayedPlan.nutrition_tip.hydration_target}`);
    lines.push('Key Pillars:');
    displayedPlan.nutrition_tip.key_pillars.forEach((p) => lines.push(`  - ${p}`));
    lines.push(`Meal Timing: ${displayedPlan.nutrition_tip.meal_timing_advice}`);
    lines.push(`Recovery Protocol: ${displayedPlan.nutrition_tip.recovery_protocol}`);
    lines.push('------------------------------------------------------------');
    lines.push(`Disclaimer: ${displayedPlan.safety_disclaimer}`);

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FitBuddy_${user.user_id}_7Day_Plan.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleQuickFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUpdatingFeedback) return;
    const trimmed = quickFeedback.trim();
    if (trimmed.length < 3) {
      setQuickFeedbackError('Please enter at least 3 characters of feedback.');
      return;
    }
    setQuickFeedbackError(null);
    await onSubmitFeedback(user.user_id, trimmed);
    setQuickFeedback('');
    setSelectedPlanVersion('active');
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
      {/* Top Action Bar & Motivational Banner */}
      <section className="bg-[#111827] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 print-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-400 font-medium">
              <span>FitBuddy Personalized Program</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular">User ID: {user.user_id}</span>
              {hasUpdatedPlan && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-amber-300">
                    Feedback-Updated Plan Available ({user.updates_count} update{user.updates_count === 1 ? '' : 's'})
                  </span>
                </>
              )}
            </div>
            <h1 className="font-display text-2xl sm:text-4xl font-bold text-white tracking-tight">
              {displayedPlan.plan_title}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              {displayedPlan.overview}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 no-print shrink-0">
            <button
              type="button"
              onClick={onNavigateToHome}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Generate New Plan
            </button>

            <button
              type="button"
              disabled={isGenerating}
              onClick={() => onRegeneratePlan(user)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              ) : (
                <RefreshCw className="w-4 h-4 text-emerald-400" />
              )}
              Regenerate Variation
            </button>

            <button
              type="button"
              onClick={onNavigateToFeedback}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4 text-amber-400" />
              Give Feedback
            </button>

            <button
              type="button"
              onClick={handlePrintPlan}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print Plan
            </button>

            <button
              type="button"
              onClick={handleDownloadPlan}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download Plan
            </button>
          </div>
        </div>

        {/* User Profile & Progress Summary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* User Profile Details */}
          <div className="lg:col-span-7 space-y-3">
            <h2 className="text-xs font-semibold text-slate-400 tracking-wide">
              User Profile
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#0B0F17] border border-slate-800/90 rounded-xl p-4">
              <div>
                <span className="block text-xs text-slate-400">Name</span>
                <span className="text-sm font-semibold text-white">{user.name}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-400">User ID</span>
                <span className="text-sm font-mono-tabular font-semibold text-emerald-400">
                  {user.user_id}
                </span>
              </div>
              <div>
                <span className="block text-xs text-slate-400">Age & Weight</span>
                <span className="text-sm font-mono-tabular font-semibold text-white">
                  {user.age} yrs · {user.weight} kg
                </span>
              </div>
              <div>
                <span className="block text-xs text-slate-400">Goal</span>
                <span className="text-sm font-semibold text-white">{user.goal}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-400">Intensity</span>
                <span className="text-sm font-semibold text-white">{user.intensity}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-400">Experience</span>
                <span className="text-sm font-semibold text-white">{user.experience}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-400">Available Days</span>
                <span className="text-sm font-mono-tabular font-semibold text-white">
                  {user.available_days} days/wk
                </span>
              </div>
              <div>
                <span className="block text-xs text-slate-400">Session Duration</span>
                <span className="text-sm font-mono-tabular font-semibold text-white">
                  {user.workout_duration}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Summary & Motivational Message */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[#0B0F17] border border-slate-800/90 rounded-xl p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold">Progress Summary</span>
                <span className="font-mono-tabular text-emerald-400">
                  {displayedPlan.weekly_consistency_target}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-1">
                <div>
                  <span className="block text-xs text-slate-400">Current Goal</span>
                  <span className="text-xs sm:text-sm font-semibold text-white">
                    {user.goal}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-slate-400">Plans Generated</span>
                  <span className="text-sm font-mono-tabular font-semibold text-white">
                    {user.plans_generated_count || 1}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-slate-400">Plan Updates</span>
                  <span className="text-sm font-mono-tabular font-semibold text-amber-400">
                    {user.updates_count || 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80">
              <p className="text-xs text-emerald-300 font-medium leading-relaxed">
                “{displayedPlan.motivational_message}”
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 💡 AI Nutrition & Recovery Tip Card */}
      <section
        aria-labelledby="nutrition-card-heading"
        className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden print-card"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-8 p-6 sm:p-8 space-y-5">
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-amber-400 tracking-wide">
                Complementary Goal Guidance · {user.goal}
              </span>
              <h2
                id="nutrition-card-heading"
                className="font-display text-xl sm:text-2xl font-bold text-white"
              >
                💡 AI Nutrition & Recovery Tip: {displayedPlan.nutrition_tip.headline}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                {displayedPlan.nutrition_tip.summary}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="bg-[#0B0F17] border border-slate-800/90 rounded-xl p-4 space-y-2">
                <h3 className="text-xs font-semibold text-emerald-400">
                  Key Nutrition & Recovery Pillars
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                  {displayedPlan.nutrition_tip.key_pillars.map((pillar, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{pillar}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#0B0F17] border border-slate-800/90 rounded-xl p-4 space-y-3">
                <div>
                  <span className="block text-xs font-semibold text-sky-400">
                    💧 Daily Hydration Target
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200 mt-0.5 font-mono-tabular">
                    {displayedPlan.nutrition_tip.hydration_target}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800/80">
                  <span className="block text-xs font-semibold text-amber-400">
                    ⏱️ Peri-Workout Meal Timing
                  </span>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    {displayedPlan.nutrition_tip.meal_timing_advice}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800/80">
                  <span className="block text-xs font-semibold text-emerald-400">
                    😴 Recovery Protocol
                  </span>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    {displayedPlan.nutrition_tip.recovery_protocol}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 relative min-h-[220px] bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800 no-print">
            {!nutritionImgError ? (
              <img
                src={nutritionGuideImg}
                alt="Healthy athletic nutrition and recovery essentials"
                referrerPolicy="no-referrer"
                onError={() => setNutritionImgError(true)}
                className="w-full h-full object-cover object-center opacity-85"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center p-6 bg-gradient-to-br from-slate-900 to-emerald-950/30 text-center">
                <p className="text-xs text-slate-400">
                  Balanced Whole-Food Nutrition & Hydration Protocol
                </p>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#111827] lg:via-transparent lg:to-transparent" />
          </div>
        </div>
      </section>

      {/* Your 7-Day Fitness Plan Section */}
      <section aria-labelledby="seven-day-plan-heading" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2
              id="seven-day-plan-heading"
              className="font-display text-2xl sm:text-3xl font-bold text-white"
            >
              Your 7-Day Fitness Plan
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Structured Day 1 through Day 7 schedule with warm-ups, main exercises, sets/reps, rest intervals, cool-downs, and daily recovery.
            </p>
          </div>

          {/* Version Toggle (Original vs Updated Plan) */}
          {hasUpdatedPlan && (
            <div className="flex items-center gap-1 p-1 bg-[#111827] border border-slate-800 rounded-xl no-print self-start">
              <button
                type="button"
                onClick={() => setSelectedPlanVersion('active')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedPlanVersion === 'active'
                    ? 'bg-emerald-400 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Updated Plan (Latest)
              </button>
              <button
                type="button"
                onClick={() => setSelectedPlanVersion('original')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedPlanVersion === 'original'
                    ? 'bg-emerald-400 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Original Plan
              </button>
            </div>
          )}
        </div>

        {/* Interactive Day Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-print">
          <button
            type="button"
            onClick={() => setSelectedDayFilter('all')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              selectedDayFilter === 'all'
                ? 'bg-emerald-400 text-slate-950'
                : 'bg-[#111827] text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            All 7 Days
          </button>
          {displayedPlan.days.map((d) => (
            <button
              key={d.day}
              type="button"
              onClick={() => setSelectedDayFilter(d.day)}
              className={`px-3.5 py-2 text-xs font-mono-tabular font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedDayFilter === d.day
                  ? 'bg-emerald-400 text-slate-950'
                  : 'bg-[#111827] text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              Day {d.day}
            </button>
          ))}
        </div>

        {/* 7-Day Cards Grid */}
        <div className="grid grid-cols-1 gap-6">
          {daysToDisplay.map((dayPlan) => (
            <article
              key={dayPlan.day}
              className="bg-[#111827] border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-6 print-card"
            >
              {/* Day Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span className="font-mono-tabular font-semibold text-emerald-400">
                      {dayPlan.day_label}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {dayPlan.is_rest_day ? 'Active Recovery & Mobility' : 'Primary Training Session'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-tabular">⏱️ Duration: {dayPlan.duration}</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-white">
                    🏋️ {dayPlan.day_label} – {dayPlan.focus}
                  </h3>
                </div>
              </div>

              {/* Warm-Up & Cool-Down + Exercises Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Warm-up, Rest, Cool-down, Recovery (4 cols) */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-[#0B0F17] border border-slate-800/80 rounded-xl p-4 space-y-2">
                    <h4 className="text-xs font-semibold text-amber-400">
                      🔥 Warm-up (5–10 minutes)
                    </h4>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-slate-300">
                      {dayPlan.warmup.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-400 font-mono-tabular">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#0B0F17] border border-slate-800/80 rounded-xl p-4 space-y-1.5">
                    <h4 className="text-xs font-semibold text-sky-400">
                      😴 Rest Guidance
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {dayPlan.rest_guidance}
                    </p>
                  </div>

                  <div className="bg-[#0B0F17] border border-slate-800/80 rounded-xl p-4 space-y-2">
                    <h4 className="text-xs font-semibold text-emerald-400">
                      🧘 Cool-down
                    </h4>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-slate-300">
                      {dayPlan.cooldown.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-400 font-mono-tabular">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#0B0F17] border border-slate-800/80 rounded-xl p-4 space-y-1.5">
                    <h4 className="text-xs font-semibold text-teal-400">
                      💧 Daily Recovery Suggestion
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {dayPlan.recovery}
                    </p>
                  </div>
                </div>

                {/* Right Column: Main Workout Exercises Table/List (8 cols) */}
                <div className="lg:col-span-8 bg-[#0B0F17] border border-slate-800/80 rounded-xl p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-white">
                      💪 Main Workout Exercises
                    </h4>
                    <span className="text-xs font-mono-tabular text-slate-400">
                      {dayPlan.exercises.length} movement{dayPlan.exercises.length === 1 ? '' : 's'}
                    </span>
                  </div>

                  <div className="divide-y divide-slate-800/80">
                    {dayPlan.exercises.map((exercise, index) => (
                      <div
                        key={index}
                        className="py-3.5 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1 pr-2">
                          <div className="flex items-baseline gap-2.5">
                            <span className="font-mono-tabular text-xs font-semibold text-emerald-400">
                              {index + 1}.
                            </span>
                            <span className="text-sm font-semibold text-white">
                              {exercise.name}
                            </span>
                          </div>
                          {exercise.notes && (
                            <p className="text-xs text-slate-400 pl-5 leading-relaxed">
                              {exercise.notes}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 pl-5 sm:pl-0 shrink-0 text-xs font-mono-tabular">
                          <div className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-200">
                            {exercise.sets} × {exercise.reps_or_duration}
                          </div>
                          <div className="text-slate-400">
                            Rest: <span className="text-slate-200">{exercise.rest}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Quick Improve My Plan (Feedback) & Plan History Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 no-print">
        {/* Feedback Card */}
        <div className="lg:col-span-6 bg-[#111827] border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-5">
          <div>
            <h3 className="font-display text-xl font-bold text-white">
              Improve My Plan
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Want to adjust exercises, add yoga/cardio, or change intensity? Tell FitBuddy AI below—your Original Plan will be safely preserved in Plan History.
            </p>
          </div>

          {(quickFeedbackError || errorMessage) && (
            <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-800 text-xs text-red-200">
              {quickFeedbackError || errorMessage}
            </div>
          )}

          <form onSubmit={handleQuickFeedbackSubmit} className="space-y-4">
            <div>
              <label htmlFor="quick-feedback-textarea" className="sr-only">
                Workout Plan Feedback
              </label>
              <textarea
                id="quick-feedback-textarea"
                rows={3}
                disabled={isUpdatingFeedback}
                value={quickFeedback}
                onChange={(e) => setQuickFeedback(e.target.value)}
                placeholder="Example: Add more cardio, reduce workout intensity, include more rest days, add yoga…"
                className="w-full bg-[#0B0F17] border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors resize-none"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                'Add more low-impact cardio intervals',
                'Include 15 minutes of yoga mobility',
                'Reduce workout intensity & add an extra rest day',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  disabled={isUpdatingFeedback}
                  onClick={() => setQuickFeedback(suggestion)}
                  className="px-2.5 py-1 text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  + {suggestion}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={isUpdatingFeedback}
              className="w-full py-3 px-5 rounded-xl font-display text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:bg-emerald-500/60 transition-colors flex items-center justify-center gap-2 cursor-pointer"
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
          </form>
        </div>

        {/* Plan History Summary Card */}
        <div className="lg:col-span-6 bg-[#111827] border border-slate-800 rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-400" />
                Plan History (Original vs Updated)
              </h3>
              <button
                type="button"
                onClick={onNavigateToFeedback}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 underline underline-offset-4 cursor-pointer"
              >
                Open Full Comparison
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 space-y-1.5">
                <span className="text-xs font-semibold text-slate-400">Original Plan</span>
                <p className="text-sm font-semibold text-white">
                  {user.original_plan.plan_title}
                </p>
                <p className="text-xs text-slate-400 font-mono-tabular">
                  Created: {new Date(user.created_at).toLocaleString()}
                </p>
              </div>

              <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 space-y-1.5">
                <span className="text-xs font-semibold text-amber-400">Updated Plan</span>
                {user.updated_plan ? (
                  <>
                    <p className="text-sm font-semibold text-white">
                      {user.updated_plan.plan_title}
                    </p>
                    <p className="text-xs text-slate-400 font-mono-tabular">
                      Updated: {user.updated_at ? new Date(user.updated_at).toLocaleString() : 'Recently'}
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-slate-400 pt-1">
                    No updates submitted yet. Submit feedback to generate an adapted 7-day plan while preserving your original plan.
                  </p>
                )}
              </div>
            </div>

            {user.feedback && (
              <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 space-y-1">
                <span className="text-xs font-semibold text-emerald-400">
                  Latest Feedback Applied:
                </span>
                <p className="text-xs text-slate-300 italic">“{user.feedback}”</p>
              </div>
            )}
          </div>

          {/* Safety Disclaimer Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-400">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{displayedPlan.safety_disclaimer}</span>
          </div>
        </div>
      </section>
    </div>
  );
};
