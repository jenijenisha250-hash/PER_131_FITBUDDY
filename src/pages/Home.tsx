import React, { useState } from 'react';
import {
  Dumbbell,
  Flame,
  Clock,
  Calendar,
  User,
  Hash,
  Scale,
  Target,
  Activity,
  Sliders,
  ShieldAlert,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import {
  ExperienceLevel,
  FitnessGoal,
  UserProfileInput,
  WorkoutDuration,
  WorkoutIntensity,
} from '../types.ts';
import heroStudioImg from '../assets/images/hero_fitness_studio_1790742880817.jpg';

interface HomeProps {
  initialProfile?: Partial<UserProfileInput>;
  onGeneratePlan: (profile: UserProfileInput) => Promise<void>;
  isGenerating: boolean;
  errorMessage: string | null;
  onClearError: () => void;
  onViewExistingPlan?: () => void;
  hasActivePlan: boolean;
}

const GOALS: FitnessGoal[] = [
  'Weight Loss',
  'Muscle Gain',
  'General Wellness',
  'Strength',
  'Flexibility',
  'Endurance',
];

const INTENSITIES: WorkoutIntensity[] = ['Low', 'Medium', 'High'];

const EXPERIENCES: ExperienceLevel[] = ['Beginner', 'Intermediate', 'Advanced'];

const DURATIONS: WorkoutDuration[] = [
  '20 minutes',
  '30 minutes',
  '45 minutes',
  '60 minutes',
  '90 minutes',
];

const QUICK_PRESETS: { label: string; profile: UserProfileInput }[] = [
  {
    label: 'Beginner Weight Loss (Low Intensity)',
    profile: {
      name: 'Jordan Taylor',
      user_id: 'FB-3015',
      age: 34,
      weight: 82,
      goal: 'Weight Loss',
      intensity: 'Low',
      experience: 'Beginner',
      available_days: 4,
      workout_duration: '30 minutes',
      preferences: 'No jumping exercises, bodyweight and light dumbbells at home.',
    },
  },
  {
    label: 'Muscle Gain (Medium Intensity)',
    profile: {
      name: 'Aria Chen',
      user_id: 'FB-4120',
      age: 26,
      weight: 59,
      goal: 'Muscle Gain',
      intensity: 'Medium',
      experience: 'Beginner',
      available_days: 4,
      workout_duration: '45 minutes',
      preferences: 'Access to dumbbells, bench, and cable machine. Focus on progressive overload.',
    },
  },
  {
    label: 'Athletic Endurance (High Intensity)',
    profile: {
      name: 'Devon Brooks',
      user_id: 'FB-5098',
      age: 31,
      weight: 74,
      goal: 'Endurance',
      intensity: 'High',
      experience: 'Advanced',
      available_days: 6,
      workout_duration: '60 minutes',
      preferences: 'Rowing machine, kettlebells, running intervals, and core stability.',
    },
  },
];

export const Home: React.FC<HomeProps> = ({
  initialProfile,
  onGeneratePlan,
  isGenerating,
  errorMessage,
  onClearError,
  onViewExistingPlan,
  hasActivePlan,
}) => {
  const [name, setName] = useState(initialProfile?.name || '');
  const [userId, setUserId] = useState(
    initialProfile?.user_id || `FB-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [age, setAge] = useState<string>(
    initialProfile?.age ? String(initialProfile.age) : '28'
  );
  const [weight, setWeight] = useState<string>(
    initialProfile?.weight ? String(initialProfile.weight) : '70'
  );
  const [goal, setGoal] = useState<FitnessGoal>(
    initialProfile?.goal || 'Muscle Gain'
  );
  const [intensity, setIntensity] = useState<WorkoutIntensity>(
    initialProfile?.intensity || 'Medium'
  );
  const [experience, setExperience] = useState<ExperienceLevel>(
    initialProfile?.experience || 'Beginner'
  );
  const [availableDays, setAvailableDays] = useState<number>(
    initialProfile?.available_days || 4
  );
  const [workoutDuration, setWorkoutDuration] = useState<WorkoutDuration>(
    initialProfile?.workout_duration || '45 minutes'
  );
  const [preferences, setPreferences] = useState<string>(
    initialProfile?.preferences || ''
  );

  const [validationError, setValidationError] = useState<string | null>(null);
  const [heroImageError, setHeroImageError] = useState(false);

  const applyPreset = (preset: UserProfileInput) => {
    setName(preset.name);
    setUserId(preset.user_id);
    setAge(String(preset.age));
    setWeight(String(preset.weight));
    setGoal(preset.goal);
    setIntensity(preset.intensity);
    setExperience(preset.experience);
    setAvailableDays(preset.available_days);
    setWorkoutDuration(preset.workout_duration);
    setPreferences(preset.preferences || '');
    setValidationError(null);
    onClearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGenerating) return;

    setValidationError(null);
    onClearError();

    const trimmedName = name.trim();
    const trimmedUserId = userId.trim();
    const numAge = Number(age);
    const numWeight = Number(weight);

    if (!trimmedName || trimmedName.length < 2) {
      setValidationError('Please enter your Full Name (at least 2 characters).');
      return;
    }

    if (!trimmedUserId || !/^[a-zA-Z0-9_-]{2,40}$/.test(trimmedUserId)) {
      setValidationError(
        'Please enter a valid User ID (2–40 letters, numbers, hyphens, or underscores).'
      );
      return;
    }

    if (!age || Number.isNaN(numAge) || numAge < 13 || numAge > 100) {
      setValidationError('Please enter a valid Age between 13 and 100.');
      return;
    }

    if (!weight || Number.isNaN(numWeight) || numWeight < 25 || numWeight > 300) {
      setValidationError('Please enter a valid Weight between 25 kg and 300 kg.');
      return;
    }

    if (availableDays < 1 || availableDays > 7) {
      setValidationError('Please select between 1 and 7 Available Workout Days.');
      return;
    }

    await onGeneratePlan({
      user_id: trimmedUserId,
      name: trimmedName,
      age: Math.round(numAge),
      weight: Number(numWeight.toFixed(1)),
      goal,
      intensity,
      experience,
      available_days: availableDays,
      workout_duration: workoutDuration,
      preferences: preferences.trim(),
    });
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Hero Banner */}
      <section className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
        {!heroImageError ? (
          <img
            src={heroStudioImg}
            alt="Modern strength and conditioning athletic studio"
            referrerPolicy="no-referrer"
            onError={() => setHeroImageError(true)}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-45"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F17] via-[#0B0F17]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-transparent" />

        <div className="relative z-10 px-6 py-10 sm:px-12 sm:py-14 lg:py-16 max-w-3xl space-y-5">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-emerald-400 tracking-wide">
            <span>FitBuddy</span>
            <span aria-hidden="true">·</span>
            <span>AI Fitness Plan Generator</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-300">“Your AI-powered personal fitness companion”</span>
          </div>

          <h1
            className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight leading-[1.12]"
            style={{ textWrap: 'balance' }}
          >
            Build Better Habits With AI
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
            Get a personalized 7-day workout plan powered by Google Gemini. Tailored to your exact body metrics, experience level, training schedule, and recovery needs—with instant plan adaptation whenever you give feedback.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Structured Day 1–Day 7 Programming
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Goal-Specific Nutrition & Recovery Protocol
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Iterative Feedback Plan Regeneration
            </span>
          </div>

          {hasActivePlan && onViewExistingPlan && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onViewExistingPlan}
                className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 underline underline-offset-4 cursor-pointer"
              >
                Return to your active 7-day plan
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Main Content Grid: Form Card + How It Works / Safety Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Card (8 cols on desktop) */}
        <section
          aria-labelledby="profile-form-heading"
          className="lg:col-span-8 bg-[#111827] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
            <div>
              <h2
                id="profile-form-heading"
                className="font-display text-xl sm:text-2xl font-bold text-white"
              >
                Create Your Personalized Fitness Profile
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Complete your athlete details below or load a sample profile to test instant AI generation.
              </p>
            </div>
          </div>

          {/* Quick-Fill Sample Profiles */}
          <div className="space-y-2">
            <span className="block text-xs font-medium text-slate-400">
              Quick-Fill Sample Athlete Profiles:
            </span>
            <div className="flex flex-wrap gap-2">
              {QUICK_PRESETS.map((preset) => (
                <button
                  key={preset.profile.user_id}
                  type="button"
                  disabled={isGenerating}
                  onClick={() => applyPreset(preset.profile)}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Validation or Server Error Alert */}
          {(validationError || errorMessage) && (
            <div
              role="alert"
              className="p-4 rounded-xl bg-red-950/50 border border-red-800/80 text-red-200 text-sm flex items-start gap-3"
            >
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-red-300">Unable to generate plan</p>
                <p>{validationError || errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Row 1: Full Name & User ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="input-full-name"
                  className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2"
                >
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  Full Name <span className="text-emerald-400">*</span>
                </label>
                <input
                  id="input-full-name"
                  type="text"
                  required
                  disabled={isGenerating}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Alex Rivera"
                  className="w-full bg-[#0B0F17] border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="input-user-id"
                  className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2"
                >
                  <Hash className="w-3.5 h-3.5 text-emerald-400" />
                  User ID <span className="text-emerald-400">*</span>
                </label>
                <input
                  id="input-user-id"
                  type="text"
                  required
                  disabled={isGenerating}
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="e.g., FB-1024"
                  className="w-full bg-[#0B0F17] border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white font-mono-tabular placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Row 2: Age & Weight in kg */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="input-age"
                  className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2"
                >
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  Age (Years) <span className="text-emerald-400">*</span>
                </label>
                <input
                  id="input-age"
                  type="number"
                  min={13}
                  max={100}
                  required
                  disabled={isGenerating}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="28"
                  className="w-full bg-[#0B0F17] border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white font-mono-tabular placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="input-weight"
                  className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2"
                >
                  <Scale className="w-3.5 h-3.5 text-emerald-400" />
                  Weight in kg <span className="text-emerald-400">*</span>
                </label>
                <input
                  id="input-weight"
                  type="number"
                  min={25}
                  max={300}
                  step="0.5"
                  required
                  disabled={isGenerating}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="70"
                  className="w-full bg-[#0B0F17] border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white font-mono-tabular placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Row 3: Fitness Goal & Preferred Workout Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="select-goal"
                  className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2"
                >
                  <Target className="w-3.5 h-3.5 text-emerald-400" />
                  Fitness Goal <span className="text-emerald-400">*</span>
                </label>
                <select
                  id="select-goal"
                  disabled={isGenerating}
                  value={goal}
                  onChange={(e) => setGoal(e.target.value as FitnessGoal)}
                  className="w-full bg-[#0B0F17] border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                >
                  {GOALS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="select-duration"
                  className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2"
                >
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  Preferred Workout Duration <span className="text-emerald-400">*</span>
                </label>
                <select
                  id="select-duration"
                  disabled={isGenerating}
                  value={workoutDuration}
                  onChange={(e) => setWorkoutDuration(e.target.value as WorkoutDuration)}
                  className="w-full bg-[#0B0F17] border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                >
                  {DURATIONS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 4: Workout Intensity & Experience Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <span className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
                  <Flame className="w-3.5 h-3.5 text-emerald-400" />
                  Workout Intensity <span className="text-emerald-400">*</span>
                </span>
                <div className="grid grid-cols-3 gap-2 bg-[#0B0F17] p-1 rounded-xl border border-slate-800">
                  {INTENSITIES.map((item) => {
                    const active = intensity === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        disabled={isGenerating}
                        onClick={() => setIntensity(item)}
                        className={`py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                          active
                            ? 'bg-emerald-500 text-slate-950'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  Experience Level <span className="text-emerald-400">*</span>
                </span>
                <div className="grid grid-cols-3 gap-2 bg-[#0B0F17] p-1 rounded-xl border border-slate-800">
                  {EXPERIENCES.map((exp) => {
                    const active = experience === exp;
                    return (
                      <button
                        key={exp}
                        type="button"
                        disabled={isGenerating}
                        onClick={() => setExperience(exp)}
                        className={`py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                          active
                            ? 'bg-emerald-500 text-slate-950'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {exp}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Row 5: Available Workout Days (1 to 7) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="available-days-group"
                  className="flex items-center gap-2 text-xs font-semibold text-slate-300"
                >
                  <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
                  Available Workout Days Per Week <span className="text-emerald-400">*</span>
                </label>
                <span className="text-xs font-mono-tabular text-emerald-400">
                  {availableDays} {availableDays === 1 ? 'day' : 'days'} active · {7 - availableDays} recovery
                </span>
              </div>
              <div
                id="available-days-group"
                className="grid grid-cols-7 gap-2 bg-[#0B0F17] p-1.5 rounded-xl border border-slate-800"
              >
                {[1, 2, 3, 4, 5, 6, 7].map((dayNum) => {
                  const active = availableDays === dayNum;
                  return (
                    <button
                      key={dayNum}
                      type="button"
                      disabled={isGenerating}
                      onClick={() => setAvailableDays(dayNum)}
                      className={`py-2 text-xs font-mono-tabular font-semibold rounded-lg transition-colors cursor-pointer ${
                        active
                          ? 'bg-emerald-500 text-slate-950'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      {dayNum}d
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 6: Optional Fitness Preferences */}
            <div>
              <label
                htmlFor="textarea-preferences"
                className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2"
              >
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                Optional Fitness Preferences (Equipment, Focus Areas, or Joint Considerations)
              </label>
              <textarea
                id="textarea-preferences"
                rows={3}
                disabled={isGenerating}
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                placeholder="e.g., Home gym with adjustable dumbbells and resistance bands; prefer knee-friendly exercises; include core stability..."
                className="w-full bg-[#0B0F17] border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Submit Button & Animated Loading Experience */}
            <div className="pt-2 space-y-4">
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-4 px-6 rounded-xl font-display text-base font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:bg-emerald-500/60 transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-950/50 cursor-pointer disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                    <span>FitBuddy AI is creating your personalized plan…</span>
                  </>
                ) : (
                  <>
                    <Dumbbell className="w-5 h-5" />
                    <span>Generate My Fitness Plan</span>
                  </>
                )}
              </button>

              {isGenerating && (
                <div
                  aria-live="polite"
                  className="p-4 rounded-xl bg-[#0B0F17] border border-emerald-500/30 space-y-2.5"
                >
                  <div className="flex items-center justify-between text-xs text-emerald-300 font-medium">
                    <span>FitBuddy AI is creating your personalized plan…</span>
                    <span className="font-mono-tabular">Gemini 3.8 Flash</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full animate-pulse w-3/4" />
                  </div>
                  <p className="text-xs text-slate-400">
                    Structuring Day 1 → Day 7 warm-ups, exercises, sets/reps, cool-downs, and goal-aligned nutrition & recovery guidance for {name || 'your profile'}…
                  </p>
                </div>
              )}
            </div>
          </form>
        </section>

        {/* Sidebar: Workflow & Safety-First Commitment (4 cols on desktop) */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-5">
            <h3 className="font-display text-lg font-bold text-white">
              How FitBuddy Works
            </h3>
            <ol className="space-y-4 text-sm text-slate-300">
              <li className="flex gap-3">
                <span className="font-mono-tabular text-emerald-400 font-semibold shrink-0">
                  01.
                </span>
                <div>
                  <p className="font-semibold text-white">Profile & Goal Analysis</p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    Your age, weight, experience level, workout intensity, and weekly availability calibrate training volume and exercise selection.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-mono-tabular text-emerald-400 font-semibold shrink-0">
                  02.
                </span>
                <div>
                  <p className="font-semibold text-white">7-Day Plan + Nutrition Protocol</p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    Gemini builds a complete Day 1 to Day 7 schedule with warm-ups, sets, reps, rest intervals, cool-downs, and a daily nutrition tip.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-mono-tabular text-emerald-400 font-semibold shrink-0">
                  03.
                </span>
                <div>
                  <p className="font-semibold text-white">Adaptive Feedback Loop</p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    Want more cardio, yoga mobility, or lower intensity? Submit feedback anytime—your original plan is preserved while an updated plan is generated.
                  </p>
                </div>
              </li>
            </ol>
          </div>

          {/* Safety-First Wellness Notice */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Safety-First Fitness Logic</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              FitBuddy tailors exercise complexity to your experience level—automatically selecting joint-friendly, foundational movements for beginners and sustainable nutrition strategies without extreme restriction.
            </p>
            <p className="text-xs text-slate-400 pt-2 border-t border-slate-800/80 italic">
              “FitBuddy provides general fitness and wellness information and is not a substitute for professional medical advice.”
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};
