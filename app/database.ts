import fs from 'fs';
import path from 'path';
import { DashboardStats, UserRecord, WorkoutPlanData } from './schemas.ts';
import { SAFETY_DISCLAIMER } from './models.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'fitbuddy_db.json');

interface DatabaseSchema {
  users: Record<string, UserRecord>;
}

const SEED_USERS: UserRecord[] = [
  {
    user_id: 'FB-1042',
    name: 'Elena Rostova',
    age: 29,
    weight: 64.5,
    goal: 'Strength',
    intensity: 'High',
    experience: 'Intermediate',
    available_days: 5,
    workout_duration: '60 minutes',
    preferences: 'Full gym access, prefers barbell compound lifts and kettlebell conditioning.',
    motivational_message:
      'Strength is built one controlled rep at a time. Trust your progressive overload this week, Elena.',
    nutrition_tip: {
      headline: 'Peri-Workout Protein & Creatine Saturation',
      summary:
        'Supporting compound neural and muscular strength requires steady amino acid availability and optimal phosphocreatine stores.',
      hydration_target: '2.8L – 3.2L water daily + electrolytes during 60-min high-intensity blocks',
      key_pillars: [
        'Consume 1.8g–2.0g of protein per kg of body weight (~120g–130g daily) spread across 4 meals',
        'Prioritize complex carbohydrates (oats, jasmine rice, sweet potato) 60–90 minutes pre-workout',
        'Include 3g–5g of creatine monohydrate daily with a post-workout meal',
        'Aim for 7.5–8.5 hours of uninterrupted sleep to support central nervous system recovery',
      ],
      meal_timing_advice:
        'Eat a balanced meal containing 30g protein and 45g complex carbs 90 minutes before lifting, followed by 35g protein within 60 minutes after training.',
      recovery_protocol:
        'Perform 10 minutes of thoracic spine and hip flexor mobility on active recovery days and maintain at least 48 hours between heavy lower-body sessions.',
    },
    original_plan: {
      plan_title: '5-Day Athletic Compound Strength Microcycle',
      overview:
        'A structured 7-day program featuring 5 progressive strength sessions and 2 dedicated mobility/recovery days tailored for an intermediate lifter training 60 minutes per session.',
      motivational_message:
        'Strength is built one controlled rep at a time. Trust your progressive overload this week, Elena.',
      safety_disclaimer: SAFETY_DISCLAIMER,
      weekly_consistency_target: '5 training days · 2 structured recovery days · 300 active minutes',
      nutrition_tip: {
        headline: 'Peri-Workout Protein & Creatine Saturation',
        summary:
          'Supporting compound neural and muscular strength requires steady amino acid availability and optimal phosphocreatine stores.',
        hydration_target: '2.8L – 3.2L water daily + electrolytes during 60-min high-intensity blocks',
        key_pillars: [
          'Consume 1.8g–2.0g of protein per kg of body weight (~120g–130g daily) spread across 4 meals',
          'Prioritize complex carbohydrates (oats, jasmine rice, sweet potato) 60–90 minutes pre-workout',
          'Include 3g–5g of creatine monohydrate daily with a post-workout meal',
          'Aim for 7.5–8.5 hours of uninterrupted sleep to support central nervous system recovery',
        ],
        meal_timing_advice:
          'Eat a balanced meal containing 30g protein and 45g complex carbs 90 minutes before lifting, followed by 35g protein within 60 minutes after training.',
        recovery_protocol:
          'Perform 10 minutes of thoracic spine and hip flexor mobility on active recovery days and maintain at least 48 hours between heavy lower-body sessions.',
      },
      days: [
        {
          day: 1,
          day_label: 'Day 1',
          focus: 'Lower Body Squat & Posterior Chain Strength',
          is_rest_day: false,
          duration: '60 minutes',
          warmup: [
            '5 minutes incline treadmill brisk walk or rowing ergometer',
            'World’s Greatest Stretch – 6 reps per side',
            'Banded glute bridges & goblet squat pry – 2 sets × 10 reps',
          ],
          exercises: [
            {
              name: 'Barbell Back Squat',
              sets: '4 sets',
              reps_or_duration: '6 reps @ RPE 8',
              rest: '120 seconds',
              notes: 'Brace core 360 degrees; control eccentric descent for 2 seconds.',
            },
            {
              name: 'Romanian Deadlift (Barbell)',
              sets: '3 sets',
              reps_or_duration: '8–10 reps',
              rest: '90 seconds',
              notes: 'Hinge at hips while keeping lats engaged and bar close to shins.',
            },
            {
              name: 'Bulgarian Split Squat (Dumbbells)',
              sets: '3 sets',
              reps_or_duration: '10 reps per leg',
              rest: '75 seconds',
              notes: 'Slight forward torso lean to load both quads and glutes.',
            },
            {
              name: 'Hanging Knee Raises / Ab Wheel Rollout',
              sets: '3 sets',
              reps_or_duration: '12 reps',
              rest: '60 seconds',
              notes: 'Avoid lumbar hyperextension.',
            },
          ],
          rest_guidance: '90–120 seconds between compound sets; 60–75 seconds on accessory work.',
          cooldown: [
            '5 minutes couch stretch and supine hamstring stretch',
            'Box breathing (4s inhale, 4s hold, 4s exhale) for parasympathetic shift',
          ],
          recovery: 'Hydrate with 500ml water + electrolytes immediately post-session; elevate legs for 10 mins.',
        },
        {
          day: 2,
          day_label: 'Day 2',
          focus: 'Upper Body Horizontal Push & Pull Strength',
          is_rest_day: false,
          duration: '60 minutes',
          warmup: [
            '5 minutes assault bike or arm ergometer',
            'Scapular push-ups & band pull-aparts – 2 sets × 15 reps',
            'Thoracic extensions over foam roller – 2 minutes',
          ],
          exercises: [
            {
              name: 'Barbell Bench Press',
              sets: '4 sets',
              reps_or_duration: '6 reps @ RPE 8',
              rest: '120 seconds',
              notes: 'Maintain upper back tightness and leg drive.',
            },
            {
              name: 'Pendlay Barbell Row',
              sets: '4 sets',
              reps_or_duration: '8 reps',
              rest: '90 seconds',
              notes: 'Pull explosively to lower sternum; keep torso parallel to floor.',
            },
            {
              name: 'Incline Dumbbell Press',
              sets: '3 sets',
              reps_or_duration: '10 reps',
              rest: '75 seconds',
              notes: '30-degree bench angle for upper pectoral and anterior deltoid focus.',
            },
            {
              name: 'Face Pulls (Rope Attachment)',
              sets: '3 sets',
              reps_or_duration: '15 reps',
              rest: '60 seconds',
              notes: 'External rotation at peak contraction for shoulder health.',
            },
          ],
          rest_guidance: '90–120 seconds on main lifts; 60 seconds on upper back accessories.',
          cooldown: [
            '5 minutes doorway pec stretch and lat prayers on bench',
            'Slow nasal breathing cooldown',
          ],
          recovery: 'Prioritize 35g lean protein within 1 hour; light shoulder mobility before bed.',
        },
        {
          day: 3,
          day_label: 'Day 3',
          focus: 'Active Recovery & Mobility Flow',
          is_rest_day: true,
          duration: '30 minutes',
          warmup: [
            '5 minutes easy outdoor walk',
            'Gentle neck, shoulder, and hip circles',
          ],
          exercises: [
            {
              name: 'Zone 1 Brisk Walk or Easy Cycle',
              sets: '1 session',
              reps_or_duration: '20 minutes conversational pace',
              rest: 'Continuous',
              notes: 'Keep heart rate below 125 BPM to promote blood flow without fatigue.',
            },
            {
              name: '90/90 Hip Switches & Cat-Cow Flow',
              sets: '2 sets',
              reps_or_duration: '8 reps per side',
              rest: '30 seconds',
              notes: 'Smooth, unhurried transitions.',
            },
          ],
          rest_guidance: 'Minimal rest required; move at a restorative pace.',
          cooldown: [
            '5 minutes foam rolling quads, lats, and calves',
          ],
          recovery: 'Focus on magnesium-rich foods (spinach, pumpkin seeds) and early sleep.',
        },
        {
          day: 4,
          day_label: 'Day 4',
          focus: 'Posterior Chain Hinge & Kettlebell Conditioning',
          is_rest_day: false,
          duration: '60 minutes',
          warmup: [
            '5 minutes rowing machine (progressive pace)',
            'Kettlebell deadbugs & monster walks – 2 sets × 12 reps',
          ],
          exercises: [
            {
              name: 'Trap Bar or Conventional Deadlift',
              sets: '4 sets',
              reps_or_duration: '5 reps @ RPE 8',
              rest: '120 seconds',
              notes: 'Pull slack out of the bar before initiating drive through the floor.',
            },
            {
              name: 'Front-Foot Elevated Reverse Lunge',
              sets: '3 sets',
              reps_or_duration: '10 reps per leg',
              rest: '75 seconds',
              notes: 'Controlled knee tracking over mid-foot.',
            },
            {
              name: 'Two-Hand Kettlebell Swings',
              sets: '4 sets',
              reps_or_duration: '15 reps',
              rest: '60 seconds',
              notes: 'Snap hips crisply; arms act as straps.',
            },
            {
              name: 'Farmer’s Carry (Heavy Dumbbells/Kettlebells)',
              sets: '3 sets',
              reps_or_duration: '40 meters',
              rest: '60 seconds',
              notes: 'Tall posture, depressed ribs, brisk steps.',
            },
          ],
          rest_guidance: '120 seconds on deadlifts; 60–75 seconds on kettlebell conditioning.',
          cooldown: [
            '5 minutes pigeon pose and child’s pose decompression',
          ],
          recovery: 'Contrast shower or warm Epsom salt bath to ease lower-back and hamstring tension.',
        },
        {
          day: 5,
          day_label: 'Day 5',
          focus: 'Upper Body Vertical Push/Pull & Core Stability',
          is_rest_day: false,
          duration: '60 minutes',
          warmup: [
            '5 minutes jump rope or brisk incline walk',
            'Band shoulder dislocates & dead hangs – 2 sets × 30 seconds',
          ],
          exercises: [
            {
              name: 'Overhead Barbell Press',
              sets: '4 sets',
              reps_or_duration: '6–8 reps',
              rest: '90 seconds',
              notes: 'Squeeze glutes and quads to prevent lower back arch.',
            },
            {
              name: 'Weighted or Assisted Pull-Ups / Lat Pulldown',
              sets: '4 sets',
              reps_or_duration: '8–10 reps',
              rest: '90 seconds',
              notes: 'Lead with chest toward bar; full scapular depression.',
            },
            {
              name: 'Dumbbell Lateral Raises',
              sets: '3 sets',
              reps_or_duration: '12–15 reps',
              rest: '60 seconds',
              notes: 'Raise in scapular plane (30 degrees forward).',
            },
            {
              name: 'Pallof Press (Cable or Band)',
              sets: '3 sets',
              reps_or_duration: '12 reps per side',
              rest: '60 seconds',
              notes: 'Hold 2 seconds at full extension.',
            },
          ],
          rest_guidance: '90 seconds on vertical compound movements; 60 seconds on isolation and core.',
          cooldown: [
            '5 minutes overhead tricep, lat, and upper trap stretching',
          ],
          recovery: 'Replenish glycogen with fruit and whey/plant protein shake post-workout.',
        },
        {
          day: 6,
          day_label: 'Day 6',
          focus: 'Full Body Athletic Conditioning & Work Capacity',
          is_rest_day: false,
          duration: '60 minutes',
          warmup: [
            '5 minutes dynamic turf warm-up (high knees, A-skips, inchworms)',
            'Kettlebell goblet squat + halo – 2 sets × 8 reps',
          ],
          exercises: [
            {
              name: 'Kettlebell Clean & Press',
              sets: '3 sets',
              reps_or_duration: '8 reps per arm',
              rest: '75 seconds',
              notes: 'Keep bell tight to body during rack transition.',
            },
            {
              name: 'Goblet Cyclist Squats',
              sets: '3 sets',
              reps_or_duration: '12 reps',
              rest: '60 seconds',
              notes: 'Elevate heels slightly on plates for quad emphasis.',
            },
            {
              name: 'Renegade Rows / Push-Up Combo',
              sets: '3 sets',
              reps_or_duration: '8 reps per side',
              rest: '60 seconds',
              notes: 'Wide foot stance to prevent hip rotation.',
            },
            {
              name: 'Rower Intervals (30s Work / 30s Easy)',
              sets: '6 rounds',
              reps_or_duration: '6 minutes total',
              rest: '30 seconds active recovery',
              notes: 'Maintain consistent strokes per minute.',
            },
          ],
          rest_guidance: '60–75 seconds between strength-endurance sets.',
          cooldown: [
            '8 minutes full-body static stretching and supine spinal twists',
          ],
          recovery: 'Enjoy a balanced carbohydrate-rich dinner to restore weekly muscle glycogen.',
        },
        {
          day: 7,
          day_label: 'Day 7',
          focus: 'Full Rest & Parasympathetic Restoration',
          is_rest_day: true,
          duration: '20 minutes',
          warmup: [
            '5 minutes gentle morning sunlight walk',
          ],
          exercises: [
            {
              name: 'Guided Restorative Yoga & Breathwork',
              sets: '1 session',
              reps_or_duration: '15 minutes',
              rest: 'Continuous',
              notes: 'Focus on diaphragmatic breathing and joint decompression.',
            },
          ],
          rest_guidance: 'Complete central nervous system rest day.',
          cooldown: [
            '5 minutes legs-up-the-wall relaxation',
          ],
          recovery: 'Prepare meals for the upcoming week and target 8+ hours of sleep.',
        },
      ],
    },
    feedback: 'Include a 15-minute yoga and hip mobility finisher on Day 3 and swap conventional deadlifts on Day 4 for trap-bar deadlifts to reduce lower-back fatigue.',
    updated_plan: {
      plan_title: '5-Day Athletic Strength Plan (Trap-Bar & Yoga Mobility Adapted)',
      overview:
        'Updated per your feedback: Conventional deadlifts on Day 4 have been replaced with joint-friendly Trap-Bar Deadlifts, and Day 3 now features a dedicated 25-minute Vinyasa & Deep Hip Mobility flow.',
      motivational_message:
        'Smart adjustments create sustainable strength. Your updated plan keeps intensity high while protecting your lower back, Elena!',
      safety_disclaimer: SAFETY_DISCLAIMER,
      weekly_consistency_target: '5 training days · 2 yoga/mobility recovery days · 305 active minutes',
      nutrition_tip: {
        headline: 'Peri-Workout Protein & Creatine Saturation',
        summary:
          'Supporting compound neural and muscular strength requires steady amino acid availability and optimal phosphocreatine stores.',
        hydration_target: '2.8L – 3.2L water daily + electrolytes during 60-min high-intensity blocks',
        key_pillars: [
          'Consume 1.8g–2.0g of protein per kg of body weight (~120g–130g daily) spread across 4 meals',
          'Prioritize complex carbohydrates (oats, jasmine rice, sweet potato) 60–90 minutes pre-workout',
          'Include 3g–5g of creatine monohydrate daily with a post-workout meal',
          'Aim for 7.5–8.5 hours of uninterrupted sleep to support central nervous system recovery',
        ],
        meal_timing_advice:
          'Eat a balanced meal containing 30g protein and 45g complex carbs 90 minutes before lifting, followed by 35g protein within 60 minutes after training.',
        recovery_protocol:
          'Perform 15 minutes of Vinyasa hip mobility on Day 3 and maintain 48 hours between lower-body sessions.',
      },
      days: [
        {
          day: 1,
          day_label: 'Day 1',
          focus: 'Lower Body Squat & Glute Strength',
          is_rest_day: false,
          duration: '60 minutes',
          warmup: [
            '5 minutes incline treadmill brisk walk',
            'World’s Greatest Stretch – 6 reps per side',
            'Banded glute bridges & goblet squat pry – 2 sets × 10 reps',
          ],
          exercises: [
            {
              name: 'Barbell Back Squat',
              sets: '4 sets',
              reps_or_duration: '6 reps @ RPE 8',
              rest: '120 seconds',
              notes: 'Brace core 360 degrees; controlled 2-second descent.',
            },
            {
              name: 'Barbell Hip Thrust',
              sets: '3 sets',
              reps_or_duration: '10 reps',
              rest: '90 seconds',
              notes: 'Swapped in to reduce lower-back shear while maximizing glute recruitment.',
            },
            {
              name: 'Bulgarian Split Squat (Dumbbells)',
              sets: '3 sets',
              reps_or_duration: '10 reps per leg',
              rest: '75 seconds',
              notes: 'Controlled depth with upright-to-slightly-tilted torso.',
            },
            {
              name: 'Deadbug Isometric Core Hold',
              sets: '3 sets',
              reps_or_duration: '40 seconds',
              rest: '60 seconds',
              notes: 'Press lower back firmly into floor.',
            },
          ],
          rest_guidance: '90–120 seconds between compound sets.',
          cooldown: [
            '5 minutes couch stretch and figure-4 glute stretch',
          ],
          recovery: 'Hydrate with 500ml water + electrolytes immediately post-session.',
        },
        {
          day: 2,
          day_label: 'Day 2',
          focus: 'Upper Body Horizontal Push & Pull Strength',
          is_rest_day: false,
          duration: '60 minutes',
          warmup: [
            '5 minutes assault bike',
            'Scapular push-ups & band pull-aparts – 2 sets × 15 reps',
          ],
          exercises: [
            {
              name: 'Barbell Bench Press',
              sets: '4 sets',
              reps_or_duration: '6 reps @ RPE 8',
              rest: '120 seconds',
              notes: 'Maintain upper back tightness and leg drive.',
            },
            {
              name: 'Chest-Supported Dumbbell Row',
              sets: '4 sets',
              reps_or_duration: '10 reps',
              rest: '75 seconds',
              notes: 'Chest support removes axial spinal fatigue before Day 4.',
            },
            {
              name: 'Incline Dumbbell Press',
              sets: '3 sets',
              reps_or_duration: '10 reps',
              rest: '75 seconds',
              notes: '30-degree bench angle.',
            },
            {
              name: 'Face Pulls (Rope Attachment)',
              sets: '3 sets',
              reps_or_duration: '15 reps',
              rest: '60 seconds',
              notes: 'External rotation at peak contraction.',
            },
          ],
          rest_guidance: '90–120 seconds on main lifts; 60–75 seconds on accessories.',
          cooldown: [
            '5 minutes doorway pec stretch and thoracic opener',
          ],
          recovery: 'Prioritize 35g lean protein within 1 hour.',
        },
        {
          day: 3,
          day_label: 'Day 3',
          focus: 'Dedicated Vinyasa Yoga & Deep Hip Mobility (Feedback Updated)',
          is_rest_day: true,
          duration: '35 minutes',
          warmup: [
            '5 minutes diaphragmatic nasal breathing & cat-cow spinal waves',
          ],
          exercises: [
            {
              name: 'Sun Salutation A (Slow Mobility Tempo)',
              sets: '4 rounds',
              reps_or_duration: '10 minutes',
              rest: 'Continuous flow',
              notes: 'Move with each inhale and exhale.',
            },
            {
              name: 'Lizard Pose to Half-Split Flow + 90/90 Hip Rotations',
              sets: '3 sets',
              reps_or_duration: '90 seconds per side',
              rest: '30 seconds',
              notes: 'Added per your feedback to open hip flexors and adductors.',
            },
            {
              name: 'Thread-the-Needle & Downward Dog Pedal',
              sets: '2 sets',
              reps_or_duration: '60 seconds per side',
              rest: '30 seconds',
              notes: 'Decompresses thoracic and lumbar spine.',
            },
          ],
          rest_guidance: 'Flow smoothly with zero muscular straining.',
          cooldown: [
            '5 minutes Savasana & box breathing',
          ],
          recovery: 'Focus on magnesium-rich foods and hydration.',
        },
        {
          day: 4,
          day_label: 'Day 4',
          focus: 'Trap-Bar Hinge Strength & Kettlebell Conditioning (Feedback Updated)',
          is_rest_day: false,
          duration: '60 minutes',
          warmup: [
            '5 minutes rowing machine',
            'Banded hip hinges & glute activation – 2 sets × 12 reps',
          ],
          exercises: [
            {
              name: 'High-Handle Trap-Bar Deadlift',
              sets: '4 sets',
              reps_or_duration: '6 reps @ RPE 8',
              rest: '120 seconds',
              notes: 'Updated per feedback: keeps center of mass aligned with hips to minimize lower-back shear.',
            },
            {
              name: 'Front-Foot Elevated Reverse Lunge',
              sets: '3 sets',
              reps_or_duration: '10 reps per leg',
              rest: '75 seconds',
              notes: 'Controlled knee tracking.',
            },
            {
              name: 'Two-Hand Kettlebell Swings',
              sets: '4 sets',
              reps_or_duration: '15 reps',
              rest: '60 seconds',
              notes: 'Crisp hip snap with neutral spine.',
            },
            {
              name: 'Suitcase Carry (Single Kettlebell)',
              sets: '3 sets',
              reps_or_duration: '35 meters per hand',
              rest: '60 seconds',
              notes: 'Builds lateral core stability (quadratus lumborum).',
            },
          ],
          rest_guidance: '120 seconds on trap-bar deadlifts; 60–75 seconds on accessories.',
          cooldown: [
            '5 minutes supine figure-4 stretch and child’s pose decompression',
          ],
          recovery: 'Warm shower and 10 minutes of gentle walking after dinner.',
        },
        {
          day: 5,
          day_label: 'Day 5',
          focus: 'Upper Body Vertical Push/Pull & Core Stability',
          is_rest_day: false,
          duration: '60 minutes',
          warmup: [
            '5 minutes brisk incline walk',
            'Band shoulder dislocates & scapular pull-ups – 2 sets × 10 reps',
          ],
          exercises: [
            {
              name: 'Seated Dumbbell Shoulder Press',
              sets: '4 sets',
              reps_or_duration: '8 reps',
              rest: '90 seconds',
              notes: 'Back support protects lumbar spine while targeting deltoids.',
            },
            {
              name: 'Weighted or Assisted Pull-Ups / Lat Pulldown',
              sets: '4 sets',
              reps_or_duration: '8–10 reps',
              rest: '90 seconds',
              notes: 'Full stretch at top, chest to bar.',
            },
            {
              name: 'Dumbbell Lateral Raises',
              sets: '3 sets',
              reps_or_duration: '12–15 reps',
              rest: '60 seconds',
              notes: 'Controlled tempo.',
            },
            {
              name: 'Pallof Press (Cable or Band)',
              sets: '3 sets',
              reps_or_duration: '12 reps per side',
              rest: '60 seconds',
              notes: 'Anti-rotation core stability.',
            },
          ],
          rest_guidance: '90 seconds on compound lifts; 60 seconds on accessories.',
          cooldown: [
            '5 minutes lat and shoulder cooldown stretch',
          ],
          recovery: 'Post-workout protein + carbohydrate meal.',
        },
        {
          day: 6,
          day_label: 'Day 6',
          focus: 'Full Body Athletic Conditioning & Yoga Finisher',
          is_rest_day: false,
          duration: '60 minutes',
          warmup: [
            '5 minutes dynamic warm-up',
            'Kettlebell goblet squat + halo – 2 sets × 8 reps',
          ],
          exercises: [
            {
              name: 'Kettlebell Clean & Press',
              sets: '3 sets',
              reps_or_duration: '8 reps per arm',
              rest: '75 seconds',
              notes: 'Smooth rack path.',
            },
            {
              name: 'Goblet Cyclist Squats',
              sets: '3 sets',
              reps_or_duration: '12 reps',
              rest: '60 seconds',
              notes: 'Heels elevated.',
            },
            {
              name: 'Rower Intervals (30s Work / 30s Easy)',
              sets: '6 rounds',
              reps_or_duration: '6 minutes total',
              rest: '30 seconds active recovery',
              notes: 'Smooth power strokes.',
            },
            {
              name: 'Guided Yoga Hip & Spine Finisher',
              sets: '1 flow',
              reps_or_duration: '12 minutes',
              rest: 'Continuous',
              notes: 'Pigeon pose, happy baby, and supine spinal twists.',
            },
          ],
          rest_guidance: '60–75 seconds between conditioning sets.',
          cooldown: [
            '5 minutes deep nasal breathing cooldown',
          ],
          recovery: 'Balanced carbohydrate-rich dinner and hydration.',
        },
        {
          day: 7,
          day_label: 'Day 7',
          focus: 'Full Rest & Parasympathetic Restoration',
          is_rest_day: true,
          duration: '20 minutes',
          warmup: [
            '5 minutes gentle morning walk',
          ],
          exercises: [
            {
              name: 'Restorative Mobility & Breathwork',
              sets: '1 session',
              reps_or_duration: '15 minutes',
              rest: 'Continuous',
              notes: 'Unloaded joint mobility and relaxation.',
            },
          ],
          rest_guidance: 'Complete rest day.',
          cooldown: [
            '5 minutes legs-up-the-wall relaxation',
          ],
          recovery: 'Target 8+ hours of quality sleep.',
        },
      ],
    },
    plans_generated_count: 1,
    updates_count: 1,
    feedback_history: [
      {
        id: 'fb-hist-1',
        feedback_text:
          'Include a 15-minute yoga and hip mobility finisher on Day 3 and swap conventional deadlifts on Day 4 for trap-bar deadlifts to reduce lower-back fatigue.',
        submitted_at: '2026-09-28T16:40:00.000Z',
        change_summary:
          'Replaced conventional deadlifts with high-handle trap-bar deadlifts, added chest-supported rows, and upgraded Day 3 & Day 6 with dedicated yoga/hip mobility flows.',
      },
    ],
    created_at: '2026-09-27T10:15:00.000Z',
    updated_at: '2026-09-28T16:40:00.000Z',
  },
  {
    user_id: 'FB-2089',
    name: 'Marcus Vance',
    age: 41,
    weight: 88.0,
    goal: 'Weight Loss',
    intensity: 'Low',
    experience: 'Beginner',
    available_days: 4,
    workout_duration: '30 minutes',
    preferences: 'Home workouts with dumbbells and walking; joint-friendly low-impact movements only.',
    motivational_message:
      'Consistency beats intensity every single time, Marcus. Every 30-minute low-impact session builds momentum.',
    nutrition_tip: {
      headline: 'High-Satiety Protein &Steady Hydration for Sustainable Fat Loss',
      summary:
        'Gentle, sustainable weight management focuses on preserving lean muscle with protein and fiber while maintaining a slight, comfortable caloric deficit.',
      hydration_target: '2.5L – 3.0L water daily (start the morning with 400ml water)',
      key_pillars: [
        'Build plates with 1/2 non-starchy vegetables, 1/4 lean protein, and 1/4 whole-food carbohydrates',
        'Prioritize 25g–30g of protein per meal to support satiety and muscle preservation',
        'Favor whole fruits, berries, and legumes for slow-digesting dietary fiber',
        'Avoid extreme calorie restriction; prioritize 7–8 hours of sleep to regulate hunger hormones',
      ],
      meal_timing_advice:
        'Drink a glass of water 20 minutes before meals and aim for a balanced protein-rich breakfast within 90 minutes of waking.',
      recovery_protocol:
        'Take a gentle 10-minute post-dinner walk to support digestion and keep joints mobile on non-workout days.',
    },
    original_plan: {
      plan_title: '4-Day Joint-Friendly Metabolic & Low-Impact Conditioning Plan',
      overview:
        'A beginner-friendly, zero-jumping 7-day schedule combining 4 structured 30-minute dumbbell/bodyweight circuits with 3 active walking and mobility days.',
      motivational_message:
        'Consistency beats intensity every single time, Marcus. Every 30-minute low-impact session builds momentum.',
      safety_disclaimer: SAFETY_DISCLAIMER,
      weekly_consistency_target: '4 low-impact strength days · 3 walking/recovery days · 210 active minutes',
      nutrition_tip: {
        headline: 'High-Satiety Protein & Steady Hydration for Sustainable Fat Loss',
        summary:
          'Gentle, sustainable weight management focuses on preserving lean muscle with protein and fiber while maintaining a slight, comfortable caloric deficit.',
        hydration_target: '2.5L – 3.0L water daily (start the morning with 400ml water)',
        key_pillars: [
          'Build plates with 1/2 non-starchy vegetables, 1/4 lean protein, and 1/4 whole-food carbohydrates',
          'Prioritize 25g–30g of protein per meal to support satiety and muscle preservation',
          'Favor whole fruits, berries, and legumes for slow-digesting dietary fiber',
          'Avoid extreme calorie restriction; prioritize 7–8 hours of sleep to regulate hunger hormones',
        ],
        meal_timing_advice:
          'Drink a glass of water 20 minutes before meals and aim for a balanced protein-rich breakfast within 90 minutes of waking.',
        recovery_protocol:
          'Take a gentle 10-minute post-dinner walk to support digestion and keep joints mobile on non-workout days.',
      },
      days: [
        {
          day: 1,
          day_label: 'Day 1',
          focus: 'Full Body Foundation A (Low-Impact)',
          is_rest_day: false,
          duration: '30 minutes',
          warmup: [
            '5 minutes brisk marching in place & arm circles',
            'Hip hinges and bodyweight box squats – 10 reps each',
          ],
          exercises: [
            {
              name: 'Box Squat / Chair Tap Squat',
              sets: '3 sets',
              reps_or_duration: '12 reps',
              rest: '60 seconds',
              notes: 'Lightly tap chair with hips and stand tall through heels.',
            },
            {
              name: 'Incline Push-Ups (Hands on Bench or Counter)',
              sets: '3 sets',
              reps_or_duration: '10 reps',
              rest: '60 seconds',
              notes: 'Keep body in a straight plank line from head to heels.',
            },
            {
              name: 'Single-Arm Dumbbell Row (Hand on Chair)',
              sets: '3 sets',
              reps_or_duration: '10 reps per arm',
              rest: '60 seconds',
              notes: 'Pull elbow toward hip pocket.',
            },
            {
              name: 'Modified Forearm Plank',
              sets: '3 sets',
              reps_or_duration: '25 seconds',
              rest: '45 seconds',
              notes: 'Maintain steady breathing throughout.',
            },
          ],
          rest_guidance: '60 seconds between sets; take extra water breaks whenever needed.',
          cooldown: [
            '5 minutes chest opener, seated hamstring stretch, and calf stretch',
          ],
          recovery: 'Drink 400ml water post-workout and log how your joints felt.',
        },
        {
          day: 2,
          day_label: 'Day 2',
          focus: 'Low-Impact Brisk Walk & Posture Mobility',
          is_rest_day: true,
          duration: '30 minutes',
          warmup: [
            '5 minutes easy stroll to warm up ankles and hips',
          ],
          exercises: [
            {
              name: 'Steady Brisk Neighborhood Walk',
              sets: '1 session',
              reps_or_duration: '20 minutes',
              rest: 'Continuous',
              notes: 'Maintain a pace where you can speak in full sentences.',
            },
          ],
          rest_guidance: 'Comfortable conversational pace.',
          cooldown: [
            '5 minutes standing quad and hip flexor stretch',
          ],
          recovery: 'Focus on balanced hydration and colorful vegetables at dinner.',
        },
        {
          day: 3,
          day_label: 'Day 3',
          focus: 'Lower Body & Core Stability (Knee-Friendly)',
          is_rest_day: false,
          duration: '30 minutes',
          warmup: [
            '5 minutes step-jacks (no jumping) and glute bridges',
          ],
          exercises: [
            {
              name: 'Dumbbell Romanian Deadlift',
              sets: '3 sets',
              reps_or_duration: '12 reps',
              rest: '60 seconds',
              notes: 'Soft knee bend; push hips back until mild hamstring stretch.',
            },
            {
              name: 'Supported Step-Back Reverse Lunge (Shallow Depth)',
              sets: '3 sets',
              reps_or_duration: '8 reps per leg',
              rest: '60 seconds',
              notes: 'Hold a sturdy chair for balance if helpful.',
            },
            {
              name: 'Supine Glute Bridges',
              sets: '3 sets',
              reps_or_duration: '12 reps',
              rest: '45 seconds',
              notes: 'Pause 2 seconds at top.',
            },
            {
              name: 'Bird-Dog Core Alternating Reach',
              sets: '3 sets',
              reps_or_duration: '8 reps per side',
              rest: '45 seconds',
              notes: 'Move slowly with zero lower-back arch.',
            },
          ],
          rest_guidance: '45–60 seconds between sets.',
          cooldown: [
            '5 minutes supine hamstring and lower-back stretch',
          ],
          recovery: 'Elevate feet for 10 minutes in the evening.',
        },
        {
          day: 4,
          day_label: 'Day 4',
          focus: 'Active Recovery & Joint Mobility',
          is_rest_day: true,
          duration: '20 minutes',
          warmup: [
            '3 minutes deep nasal breathing & shoulder rolls',
          ],
          exercises: [
            {
              name: 'Cat-Cow, Thoracic Rotations & Hip Circles',
              sets: '2 rounds',
              reps_or_duration: '12 minutes',
              rest: 'Continuous',
              notes: 'Gentle range of motion without forcing any stretch.',
            },
          ],
          rest_guidance: 'Relaxed restorative tempo.',
          cooldown: [
            '5 minutes child’s pose and ankle mobility',
          ],
          recovery: 'Aim for 8 hours of restful sleep tonight.',
        },
        {
          day: 5,
          day_label: 'Day 5',
          focus: 'Upper Body Posture & Dumbbell Strength',
          is_rest_day: false,
          duration: '30 minutes',
          warmup: [
            '5 minutes arm swings, wall slides, and marching',
          ],
          exercises: [
            {
              name: 'Dumbbell Floor Press',
              sets: '3 sets',
              reps_or_duration: '12 reps',
              rest: '60 seconds',
              notes: 'Floor limits shoulder extension for safe joint positioning.',
            },
            {
              name: 'Seated Dumbbell Shoulder Press (Neutral Grip)',
              sets: '3 sets',
              reps_or_duration: '10 reps',
              rest: '60 seconds',
              notes: 'Palms facing each other for shoulder comfort.',
            },
            {
              name: 'Dumbbell Bicep Curl to Hammer Lower',
              sets: '2 sets',
              reps_or_duration: '12 reps',
              rest: '45 seconds',
              notes: 'Keep elbows pinned at sides.',
            },
            {
              name: 'Standing Pallof / Anti-Rotation Hold',
              sets: '3 sets',
              reps_or_duration: '20 seconds per side',
              rest: '45 seconds',
              notes: 'Brace abs gently.',
            },
          ],
          rest_guidance: '60 seconds between upper body sets.',
          cooldown: [
            '5 minutes upper body and neck stretching',
          ],
          recovery: 'Include a protein-rich meal within 90 minutes.',
        },
        {
          day: 6,
          day_label: 'Day 6',
          focus: 'Full Body Low-Impact Metabolic Circuit',
          is_rest_day: false,
          duration: '30 minutes',
          warmup: [
            '5 minutes step-touches and bodyweight good mornings',
          ],
          exercises: [
            {
              name: 'Goblet Squat to Chair',
              sets: '3 sets',
              reps_or_duration: '10 reps',
              rest: '45 seconds',
              notes: 'Hold one dumbbell at chest height.',
            },
            {
              name: 'Dumbbell Suitcase March in Place',
              sets: '3 sets',
              reps_or_duration: '30 seconds per hand',
              rest: '45 seconds',
              notes: 'Stand tall without leaning toward the weight.',
            },
            {
              name: 'Modified Side Plank (Knees Bent)',
              sets: '2 sets',
              reps_or_duration: '20 seconds per side',
              rest: '45 seconds',
              notes: 'Lift hips in line with knees and shoulders.',
            },
          ],
          rest_guidance: '45–60 seconds between exercises.',
          cooldown: [
            '5 minutes full-body gentle cooldown stretch',
          ],
          recovery: 'Hydrate well and enjoy an outdoor walk with family.',
        },
        {
          day: 7,
          day_label: 'Day 7',
          focus: 'Complete Rest & Weekly Reset',
          is_rest_day: true,
          duration: '20 minutes',
          warmup: [
            '5 minutes morning stretching',
          ],
          exercises: [
            {
              name: 'Leisurely Walk & Meal Prep Planning',
              sets: '1 session',
              reps_or_duration: '15 minutes',
              rest: 'Continuous',
              notes: 'Reflect on the week’s wins and prepare healthy snacks.',
            },
          ],
          rest_guidance: 'Full recovery day.',
          cooldown: [
            '5 minutes evening breathing exercise',
          ],
          recovery: 'Celebrate completing all 7 days of your wellness routine!',
        },
      ],
    },
    feedback: null,
    updated_plan: null,
    plans_generated_count: 1,
    updates_count: 0,
    feedback_history: [],
    created_at: '2026-09-29T08:30:00.000Z',
    updated_at: null,
  },
];

function ensureDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initialDb: DatabaseSchema = { users: {} };
      for (const u of SEED_USERS) {
        initialDb.users[u.user_id] = u;
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
      return initialDb;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as DatabaseSchema;
    if (!parsed || typeof parsed.users !== 'object') {
      const initialDb: DatabaseSchema = { users: {} };
      for (const u of SEED_USERS) {
        initialDb.users[u.user_id] = u;
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
      return initialDb;
    }
    return parsed;
  } catch (err) {
    console.error('Database initialization fallback:', err);
    const fallbackDb: DatabaseSchema = { users: {} };
    for (const u of SEED_USERS) {
      fallbackDb.users[u.user_id] = u;
    }
    return fallbackDb;
  }
}

function saveDatabase(db: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist database to disk:', err);
  }
}

export function getAllUsers(): UserRecord[] {
  const db = ensureDatabase();
  return Object.values(db.users).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function getUserById(userId: string): UserRecord | null {
  const db = ensureDatabase();
  return db.users[userId] || null;
}

export function saveUserRecord(record: UserRecord): UserRecord {
  const db = ensureDatabase();
  db.users[record.user_id] = record;
  saveDatabase(db);
  return record;
}

export function updateUserWithFeedback(
  userId: string,
  feedbackText: string,
  updatedPlan: WorkoutPlanData,
  changeSummary: string
): UserRecord | null {
  const db = ensureDatabase();
  const existing = db.users[userId];
  if (!existing) {
    return null;
  }
  const now = new Date().toISOString();
  const entry = {
    id: `fb-${Date.now()}`,
    feedback_text: feedbackText,
    submitted_at: now,
    change_summary: changeSummary,
  };
  const updatedRecord: UserRecord = {
    ...existing,
    feedback: feedbackText,
    updated_plan: updatedPlan,
    nutrition_tip: updatedPlan.nutrition_tip || existing.nutrition_tip,
    motivational_message: updatedPlan.motivational_message || existing.motivational_message,
    updates_count: (existing.updates_count || 0) + 1,
    feedback_history: [entry, ...(existing.feedback_history || [])],
    updated_at: now,
  };
  db.users[userId] = updatedRecord;
  saveDatabase(db);
  return updatedRecord;
}

export function deleteUserById(userId: string): boolean {
  const db = ensureDatabase();
  if (!db.users[userId]) {
    return false;
  }
  delete db.users[userId];
  saveDatabase(db);
  return true;
}

export function getDashboardStats(): DashboardStats {
  const users = getAllUsers();
  const total_users = users.length;
  const total_plans_generated = users.reduce(
    (sum, u) => sum + (u.plans_generated_count || 1) + (u.updates_count || 0),
    0
  );
  const updated_plans = users.filter((u) => u.updated_plan !== null).length;
  const active_users = users.length;

  return {
    total_users,
    total_plans_generated,
    updated_plans,
    active_users,
  };
}
