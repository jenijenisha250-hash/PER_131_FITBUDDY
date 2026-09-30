import { GoogleGenAI, Type } from '@google/genai';
import {
  NutritionTipData,
  UserProfileInput,
  WorkoutPlanData,
} from './schemas.ts';
import { SAFETY_DISCLAIMER } from './models.ts';

function getGenAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function generateStructuredJson(
  prompt: string,
  schema: any
): Promise<string> {
  const ai = getGenAIClient();
  const modelsToTry = ['gemini-3.8-flash', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction: SAFETY_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: schema,
          temperature: 0.7,
        },
      });
      const text = response.text?.trim();
      if (text) {
        return text;
      }
    } catch (err) {
      lastError = err;
      console.warn(`Model ${modelName} attempt failed, trying next if available...`);
    }
  }

  throw lastError || new Error('Gemini failed to generate a structured response.');
}

const NUTRITION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    headline: {
      type: Type.STRING,
      description: 'Concise, motivating title for the nutrition and recovery protocol.',
    },
    summary: {
      type: Type.STRING,
      description: '2-3 sentence overview tailored to the user goal, weight, and intensity.',
    },
    hydration_target: {
      type: Type.STRING,
      description: 'Specific daily hydration recommendation in liters based on weight and workout intensity.',
    },
    key_pillars: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '4 actionable nutrition and recovery pillars tailored to the user goal.',
    },
    meal_timing_advice: {
      type: Type.STRING,
      description: 'Practical pre-workout and post-workout fueling guidance.',
    },
    recovery_protocol: {
      type: Type.STRING,
      description: 'Sleep, stretching, or active recovery guidance aligned with experience level.',
    },
  },
  required: [
    'headline',
    'summary',
    'hydration_target',
    'key_pillars',
    'meal_timing_advice',
    'recovery_protocol',
  ],
};

const WORKOUT_PLAN_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    plan_title: {
      type: Type.STRING,
      description: 'Name of the personalized 7-day fitness program.',
    },
    overview: {
      type: Type.STRING,
      description: 'Concise 2-sentence summary explaining how this 7-day schedule fits the user profile.',
    },
    motivational_message: {
      type: Type.STRING,
      description: 'Short, personal motivational message addressing the user by name and goal.',
    },
    weekly_consistency_target: {
      type: Type.STRING,
      description: 'Summary string like "4 workout days · 3 recovery days · 180 active mins".',
    },
    days: {
      type: Type.ARRAY,
      description: 'Exactly 7 days, ordered Day 1 through Day 7.',
      items: {
        type: Type.OBJECT,
        properties: {
          day: {
            type: Type.INTEGER,
            description: 'Day number from 1 to 7.',
          },
          day_label: {
            type: Type.STRING,
            description: 'Day label e.g. "Day 1".',
          },
          focus: {
            type: Type.STRING,
            description: 'Workout focus for this day (e.g., "Full Body Strength", "Active Recovery & Mobility").',
          },
          is_rest_day: {
            type: Type.BOOLEAN,
            description: 'True if this is an active recovery / rest day, false if main training day.',
          },
          duration: {
            type: Type.STRING,
            description: 'Total session duration matching user preference (or 15-25 mins on rest days).',
          },
          warmup: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: '2-3 specific warm-up movements taking 5-10 minutes.',
          },
          exercises: {
            type: Type.ARRAY,
            description: 'Main workout exercises (3-5 exercises on training days; 1-2 gentle mobility/walk items on rest days).',
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: 'Exercise name.' },
                sets: { type: Type.STRING, description: 'Number of sets e.g. "3 sets".' },
                reps_or_duration: {
                  type: Type.STRING,
                  description: 'Repetitions or duration e.g. "12 reps" or "40 seconds".',
                },
                rest: {
                  type: Type.STRING,
                  description: 'Rest time between sets e.g. "60 seconds".',
                },
                notes: {
                  type: Type.STRING,
                  description: 'Coaching cue or safety tip.',
                },
              },
              required: ['name', 'sets', 'reps_or_duration', 'rest', 'notes'],
            },
          },
          rest_guidance: {
            type: Type.STRING,
            description: 'Overall rest guidance between sets and exercises.',
          },
          cooldown: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: '2-3 specific cool-down stretches taking 5 minutes.',
          },
          recovery: {
            type: Type.STRING,
            description: 'Actionable post-workout recovery suggestion for that day.',
          },
        },
        required: [
          'day',
          'day_label',
          'focus',
          'is_rest_day',
          'duration',
          'warmup',
          'exercises',
          'rest_guidance',
          'cooldown',
          'recovery',
        ],
      },
    },
  },
  required: [
    'plan_title',
    'overview',
    'motivational_message',
    'weekly_consistency_target',
    'days',
  ],
};

const SAFETY_SYSTEM_INSTRUCTION = `You are FitBuddy AI, an expert certified strength & conditioning coach and sports nutritionist.
SAFETY-FIRST FITNESS LOGIC (CRITICAL):
- This is a wellness application, not a medical diagnosis system.
- Avoid diagnosing medical conditions.
- Avoid claiming that a workout is medically safe for every person.
- Avoid extreme weight-loss recommendations or crash diets.
- Avoid dangerous exercises when inappropriate for the user's age, weight, or experience level.
- For Beginners, strictly generate beginner-friendly, joint-safe exercises with clear form cues.
- Recommend consulting a qualified healthcare or fitness professional when appropriate.
- Always tailor the exercises, sets, reps, rest intervals, and active training days to the exact user inputs.`;

/**
 * 1. generateNutritionTip()
 * Responsible for generating goal-aligned nutrition & recovery guidance.
 */
export async function generateNutritionTip(
  profile: UserProfileInput
): Promise<NutritionTipData> {
  const prompt = `Generate a personalized, practical Nutrition & Recovery Tip for this user:
- Name: ${profile.name}
- Age: ${profile.age}
- Weight: ${profile.weight} kg
- Fitness Goal: ${profile.goal}
- Workout Intensity: ${profile.intensity}
- Experience Level: ${profile.experience}
- Available Workout Days: ${profile.available_days} days/week
- Preferred Workout Duration: ${profile.workout_duration}
- Optional Preferences/Notes: ${profile.preferences || 'None specified'}

Ensure the guidance specifically aligns with their goal (${profile.goal}), body weight (${profile.weight} kg), and training intensity (${profile.intensity}). Avoid extreme diets or medical claims.`;

  const text = await generateStructuredJson(prompt, NUTRITION_SCHEMA);
  return JSON.parse(text) as NutritionTipData;
}

/**
 * 2. generateWorkoutPlan()
 * Responsible for generating the structured 7-day workout plan and combining with nutrition tip.
 */
export async function generateWorkoutPlan(
  profile: UserProfileInput
): Promise<WorkoutPlanData> {
  const workoutPrompt = `Create a complete, personalized 7-Day Workout Plan (Day 1 through Day 7) for the following user:
- Full Name: ${profile.name}
- User ID: ${profile.user_id}
- Age: ${profile.age} years old
- Weight: ${profile.weight} kg
- Primary Fitness Goal: ${profile.goal}
- Workout Intensity: ${profile.intensity}
- Experience Level: ${profile.experience}
- Available Workout Days: ${profile.available_days} days per week (schedule ${profile.available_days} primary workout days and ${7 - profile.available_days} active recovery/rest days across the 7-day week)
- Preferred Workout Duration: ${profile.workout_duration} per workout session
- Additional Fitness Preferences / Equipment / Notes: ${profile.preferences || 'Standard gym or home fitness equipment'}

Requirements for each day (Day 1 to Day 7):
1. Provide a clear Workout Focus.
2. Include a 5-10 minute Warm-up (2-3 items).
3. Include 4-5 structured Exercises on training days (or 1-2 gentle mobility/walking activities on rest days) with exact sets, reps or duration, rest time, and a practical coaching/safety note.
4. Include a 5-minute Cool-down and a daily Recovery suggestion.
5. Make sure the exercise selection genuinely reflects ${profile.goal} at ${profile.intensity} intensity for a ${profile.experience} trainee.`;

  // Run workout plan and nutrition tip generation in parallel for speed and modularity
  const [workoutText, nutritionTip] = await Promise.all([
    generateStructuredJson(workoutPrompt, WORKOUT_PLAN_SCHEMA),
    generateNutritionTip(profile),
  ]);

  const parsedWorkout = JSON.parse(workoutText);

  return {
    plan_title: parsedWorkout.plan_title,
    overview: parsedWorkout.overview,
    motivational_message: parsedWorkout.motivational_message,
    safety_disclaimer: SAFETY_DISCLAIMER,
    weekly_consistency_target: parsedWorkout.weekly_consistency_target,
    days: parsedWorkout.days,
    nutrition_tip: nutritionTip,
  };
}

/**
 * 3. updateWorkoutPlan()
 * Responsible for modifying the existing 7-day plan based on user feedback while preserving safety.
 */
export async function updateWorkoutPlan(
  profile: UserProfileInput,
  existingPlan: WorkoutPlanData,
  feedback: string
): Promise<{ updatedPlan: WorkoutPlanData; changeSummary: string }> {
  const updateSchema = {
    type: Type.OBJECT,
    properties: {
      change_summary: {
        type: Type.STRING,
        description: 'Clear 1-2 sentence summary of how the plan was modified based on the user feedback.',
      },
      workout_plan: WORKOUT_PLAN_SCHEMA,
      nutrition_tip: NUTRITION_SCHEMA,
    },
    required: ['change_summary', 'workout_plan', 'nutrition_tip'],
  };

  const prompt = `You are updating an existing 7-Day Workout Plan for ${profile.name} based on their direct feedback.

USER PROFILE:
- Name: ${profile.name} (Age: ${profile.age}, Weight: ${profile.weight} kg)
- Goal: ${profile.goal}
- Intensity: ${profile.intensity}
- Experience: ${profile.experience}
- Available Days: ${profile.available_days} days/week
- Preferred Duration: ${profile.workout_duration}
- Preferences: ${profile.preferences || 'None'}

EXISTING 7-DAY PLAN:
${JSON.stringify(existingPlan, null, 2)}

USER FEEDBACK TO INCORPORATE:
"${feedback}"

INSTRUCTIONS:
1. Directly address the user's feedback ("${feedback}") across the 7-day plan.
2. Keep what worked well in the original plan, but clearly modify the exercises, intensity, rest days, duration, or modalities (e.g., adding yoga, cardio, joint-friendly swaps, or extra recovery) as requested.
3. Ensure all 7 days (Day 1 to Day 7) are returned in full detail with warm-up, exercises, sets, reps/duration, rest, cool-down, and recovery.
4. Also update the nutrition_tip if relevant to their feedback.
5. Maintain strict safety-first wellness principles.`;

  const text = await generateStructuredJson(prompt, updateSchema);
  const parsed = JSON.parse(text);
  const wp = parsed.workout_plan;

  const updatedPlan: WorkoutPlanData = {
    plan_title: wp.plan_title,
    overview: wp.overview,
    motivational_message: wp.motivational_message,
    safety_disclaimer: SAFETY_DISCLAIMER,
    weekly_consistency_target: wp.weekly_consistency_target,
    days: wp.days,
    nutrition_tip: parsed.nutrition_tip,
  };

  return {
    updatedPlan,
    changeSummary: parsed.change_summary,
  };
}
