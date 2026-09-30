import { UserProfileInput, UserRecord, WorkoutPlanData } from './schemas.ts';

export const SAFETY_DISCLAIMER =
  'FitBuddy provides general fitness and wellness information and is not a substitute for professional medical advice.';

export function validateUserProfileInput(body: any): {
  valid: boolean;
  error?: string;
  data?: UserProfileInput;
} {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request payload.' };
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const user_id = typeof body.user_id === 'string' ? body.user_id.trim() : '';
  const age = Number(body.age);
  const weight = Number(body.weight);
  const available_days = Number(body.available_days);

  if (!name || name.length < 2 || name.length > 80) {
    return { valid: false, error: 'Please enter a valid Full Name (2–80 characters).' };
  }

  if (!user_id || !/^[a-zA-Z0-9_-]{2,40}$/.test(user_id)) {
    return {
      valid: false,
      error: 'Please enter a valid User ID (2–40 alphanumeric characters, hyphens, or underscores).',
    };
  }

  if (!Number.isFinite(age) || age < 13 || age > 100) {
    return { valid: false, error: 'Please enter a valid Age between 13 and 100 years.' };
  }

  if (!Number.isFinite(weight) || weight < 25 || weight > 300) {
    return { valid: false, error: 'Please enter a valid Weight between 25 kg and 300 kg.' };
  }

  const validGoals = [
    'Weight Loss',
    'Muscle Gain',
    'General Wellness',
    'Strength',
    'Flexibility',
    'Endurance',
  ];
  if (!validGoals.includes(body.goal)) {
    return { valid: false, error: 'Please select a valid Fitness Goal.' };
  }

  const validIntensities = ['Low', 'Medium', 'High'];
  if (!validIntensities.includes(body.intensity)) {
    return { valid: false, error: 'Please select a valid Workout Intensity.' };
  }

  const validExperiences = ['Beginner', 'Intermediate', 'Advanced'];
  if (!validExperiences.includes(body.experience)) {
    return { valid: false, error: 'Please select a valid Experience Level.' };
  }

  if (!Number.isFinite(available_days) || available_days < 1 || available_days > 7) {
    return { valid: false, error: 'Available Workout Days must be between 1 and 7 days per week.' };
  }

  const validDurations = ['20 minutes', '30 minutes', '45 minutes', '60 minutes', '90 minutes'];
  if (!validDurations.includes(body.workout_duration)) {
    return { valid: false, error: 'Please select a valid Preferred Workout Duration.' };
  }

  const preferences =
    typeof body.preferences === 'string' ? body.preferences.trim().slice(0, 500) : '';

  return {
    valid: true,
    data: {
      user_id,
      name,
      age: Math.round(age),
      weight: Number(weight.toFixed(1)),
      goal: body.goal,
      intensity: body.intensity,
      experience: body.experience,
      available_days: Math.round(available_days),
      workout_duration: body.workout_duration,
      preferences,
    },
  };
}

export function createUserRecord(
  profile: UserProfileInput,
  plan: WorkoutPlanData,
  existingRecord?: UserRecord
): UserRecord {
  const now = new Date().toISOString();
  return {
    user_id: profile.user_id,
    name: profile.name,
    age: profile.age,
    weight: profile.weight,
    goal: profile.goal,
    intensity: profile.intensity,
    experience: profile.experience,
    available_days: profile.available_days,
    workout_duration: profile.workout_duration,
    preferences: profile.preferences || '',
    original_plan: plan,
    feedback: null,
    updated_plan: null,
    nutrition_tip: plan.nutrition_tip,
    motivational_message: plan.motivational_message,
    plans_generated_count: existingRecord ? existingRecord.plans_generated_count + 1 : 1,
    updates_count: existingRecord ? existingRecord.updates_count : 0,
    feedback_history: existingRecord ? existingRecord.feedback_history : [],
    created_at: existingRecord ? existingRecord.created_at : now,
    updated_at: existingRecord ? now : null,
  };
}
