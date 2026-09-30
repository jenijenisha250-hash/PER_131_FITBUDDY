import type {
  DashboardStats,
  DayPlan,
  ExerciseItem,
  ExperienceLevel,
  FeedbackEntry,
  FitnessGoal,
  NutritionTipData,
  UserProfileInput,
  UserRecord,
  WorkoutDuration,
  WorkoutIntensity,
  WorkoutPlanData,
} from '../app/schemas.ts';

export type {
  DashboardStats,
  DayPlan,
  ExerciseItem,
  ExperienceLevel,
  FeedbackEntry,
  FitnessGoal,
  NutritionTipData,
  UserProfileInput,
  UserRecord,
  WorkoutDuration,
  WorkoutIntensity,
  WorkoutPlanData,
};

export type AppPage = 'home' | 'result' | 'feedback' | 'admin';
