import { Router, Request, Response } from 'express';
import {
  deleteUserById,
  getAllUsers,
  getDashboardStats,
  getUserById,
  saveUserRecord,
  updateUserWithFeedback,
} from './database.ts';
import {
  generateWorkoutPlan,
  updateWorkoutPlan,
} from './gemini_service.ts';
import { createUserRecord, validateUserProfileInput } from './models.ts';

export const apiRouter = Router();

// Health / status endpoint
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'FitBuddy – AI Fitness Plan Generator API',
    stats: getDashboardStats(),
  });
});

// POST /generate-workout (and /api/generate-workout)
const handleGenerateWorkout = async (req: Request, res: Response) => {
  try {
    const validation = validateUserProfileInput(req.body);
    if (!validation.valid || !validation.data) {
      res.status(400).json({
        error: validation.error || 'Invalid form input. Please check your details and try again.',
      });
      return;
    }

    const profile = validation.data;
    const existingUser = getUserById(profile.user_id);

    const generatedPlan = await generateWorkoutPlan(profile);
    const userRecord = createUserRecord(profile, generatedPlan, existingUser || undefined);
    const saved = saveUserRecord(userRecord);

    res.status(200).json({
      message: 'Personalized 7-day fitness plan generated successfully.',
      user: saved,
      structured_output: {
        user_profile: profile,
        days: generatedPlan.days,
        nutrition_tip: generatedPlan.nutrition_tip,
      },
    });
  } catch (err: any) {
    console.error('Error in /generate-workout:', err?.message || err);
    res.status(500).json({
      error: 'Something went wrong while generating your plan. Please try again.',
    });
  }
};

apiRouter.post('/generate-workout', handleGenerateWorkout);
apiRouter.post('/api/generate-workout', handleGenerateWorkout);

// POST /submit-feedback (and /api/submit-feedback)
const handleSubmitFeedback = async (req: Request, res: Response) => {
  try {
    const { user_id, feedback } = req.body || {};
    const cleanUserId = typeof user_id === 'string' ? user_id.trim() : '';
    const cleanFeedback = typeof feedback === 'string' ? feedback.trim() : '';

    if (!cleanUserId) {
      res.status(400).json({
        error: 'Missing User ID. Please generate or select a user plan first.',
      });
      return;
    }

    if (!cleanFeedback || cleanFeedback.length < 3) {
      res.status(400).json({
        error: 'Please enter specific feedback (at least 3 characters) so FitBuddy AI can improve your plan.',
      });
      return;
    }

    if (cleanFeedback.length > 1000) {
      res.status(400).json({
        error: 'Feedback is too long (maximum 1000 characters).',
      });
      return;
    }

    const existingUser = getUserById(cleanUserId);
    if (!existingUser || !existingUser.original_plan) {
      res.status(404).json({
        error: `No existing workout plan found for User ID "${cleanUserId}". Please generate a plan first.`,
      });
      return;
    }

    const profile = {
      user_id: existingUser.user_id,
      name: existingUser.name,
      age: existingUser.age,
      weight: existingUser.weight,
      goal: existingUser.goal,
      intensity: existingUser.intensity,
      experience: existingUser.experience,
      available_days: existingUser.available_days,
      workout_duration: existingUser.workout_duration,
      preferences: existingUser.preferences,
    };

    // Always send the existing plan + feedback + profile to Gemini while preserving original_plan
    const basePlanToModify = existingUser.updated_plan || existingUser.original_plan;
    const { updatedPlan, changeSummary } = await updateWorkoutPlan(
      profile,
      basePlanToModify,
      cleanFeedback
    );

    const updatedRecord = updateUserWithFeedback(
      cleanUserId,
      cleanFeedback,
      updatedPlan,
      changeSummary
    );

    if (!updatedRecord) {
      res.status(500).json({
        error: 'Unable to save updated workout plan. Please try again.',
      });
      return;
    }

    res.status(200).json({
      message: 'Your workout plan has been updated based on your feedback.',
      change_summary: changeSummary,
      user: updatedRecord,
    });
  } catch (err: any) {
    console.error('Error in /submit-feedback:', err?.message || err);
    res.status(500).json({
      error: 'Something went wrong while updating your workout plan. Please try again.',
    });
  }
};

apiRouter.post('/submit-feedback', handleSubmitFeedback);
apiRouter.post('/api/submit-feedback', handleSubmitFeedback);

// GET /users, /api/users, and /view-all-users
const handleGetAllUsers = (_req: Request, res: Response) => {
  try {
    const users = getAllUsers();
    const stats = getDashboardStats();
    res.status(200).json({
      users,
      stats,
    });
  } catch (err: any) {
    console.error('Error fetching users:', err?.message || err);
    res.status(500).json({
      error: 'Unable to load registered users right now.',
    });
  }
};

apiRouter.get('/users', handleGetAllUsers);
apiRouter.get('/api/users', handleGetAllUsers);
apiRouter.get('/view-all-users', handleGetAllUsers);
apiRouter.get('/api/view-all-users', handleGetAllUsers);

// GET /users/:user_id (and /api/users/:user_id)
const handleGetUserById = (req: Request, res: Response) => {
  try {
    const userId = String(req.params.user_id || '').trim();
    if (!userId) {
      res.status(400).json({ error: 'User ID is required.' });
      return;
    }
    const user = getUserById(userId);
    if (!user) {
      res.status(404).json({ error: `User "${userId}" not found.` });
      return;
    }
    res.status(200).json({ user });
  } catch (err: any) {
    console.error('Error fetching user by ID:', err?.message || err);
    res.status(500).json({ error: 'Unable to load user profile.' });
  }
};

apiRouter.get('/users/:user_id', handleGetUserById);
apiRouter.get('/api/users/:user_id', handleGetUserById);

// DELETE /users/:user_id (and /api/users/:user_id)
const handleDeleteUser = (req: Request, res: Response) => {
  try {
    const userId = String(req.params.user_id || '').trim();
    if (!userId) {
      res.status(400).json({ error: 'User ID is required.' });
      return;
    }
    const deleted = deleteUserById(userId);
    if (!deleted) {
      res.status(404).json({ error: `User "${userId}" not found.` });
      return;
    }
    res.status(200).json({
      message: `User ${userId} deleted successfully.`,
      stats: getDashboardStats(),
    });
  } catch (err: any) {
    console.error('Error deleting user:', err?.message || err);
    res.status(500).json({ error: 'Unable to delete user record.' });
  }
};

apiRouter.delete('/users/:user_id', handleDeleteUser);
apiRouter.delete('/api/users/:user_id', handleDeleteUser);
