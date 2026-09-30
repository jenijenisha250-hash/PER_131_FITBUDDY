export type FitnessGoal =
  | 'Weight Loss'
  | 'Muscle Gain'
  | 'General Wellness'
  | 'Strength'
  | 'Flexibility'
  | 'Endurance';

export type WorkoutIntensity = 'Low' | 'Medium' | 'High';

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type WorkoutDuration =
  | '20 minutes'
  | '30 minutes'
  | '45 minutes'
  | '60 minutes'
  | '90 minutes';

export interface UserProfileInput {
  user_id: string;
  name: string;
  age: number;
  weight: number;
  goal: FitnessGoal;
  intensity: WorkoutIntensity;
  experience: ExperienceLevel;
  available_days: number;
  workout_duration: WorkoutDuration;
  preferences?: string;
}

export interface ExerciseItem {
  name: string;
  sets: string;
  reps_or_duration: string;
  rest: string;
  notes?: string;
}

export interface DayPlan {
  day: number;
  day_label: string;
  focus: string;
  is_rest_day: boolean;
  duration: string;
  warmup: string[];
  exercises: ExerciseItem[];
  rest_guidance: string;
  cooldown: string[];
  recovery: string;
}

export interface NutritionTipData {
  headline: string;
  summary: string;
  hydration_target: string;
  key_pillars: string[];
  meal_timing_advice: string;
  recovery_protocol: string;
}

export interface WorkoutPlanData {
  plan_title: string;
  overview: string;
  motivational_message: string;
  safety_disclaimer: string;
  weekly_consistency_target: string;
  days: DayPlan[];
  nutrition_tip: NutritionTipData;
}

export interface FeedbackEntry {
  id: string;
  feedback_text: string;
  submitted_at: string;
  change_summary: string;
}

export interface UserRecord {
  user_id: string;
  name: string;
  age: number;
  weight: number;
  goal: FitnessGoal;
  intensity: WorkoutIntensity;
  experience: ExperienceLevel;
  available_days: number;
  workout_duration: WorkoutDuration;
  preferences: string;
  original_plan: WorkoutPlanData;
  feedback: string | null;
  updated_plan: WorkoutPlanData | null;
  nutrition_tip: NutritionTipData;
  motivational_message: string;
  plans_generated_count: number;
  updates_count: number;
  feedback_history: FeedbackEntry[];
  created_at: string;
  updated_at: string | null;
}

export interface DashboardStats {
  total_users: number;
  total_plans_generated: number;
  updated_plans: number;
  active_users: number;
}
