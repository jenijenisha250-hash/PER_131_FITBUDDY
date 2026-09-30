import { useEffect, useState, useCallback } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Home } from './pages/Home.tsx';
import { Result } from './pages/Result.tsx';
import { Feedback } from './pages/Feedback.tsx';
import { Admin } from './pages/Admin.tsx';
import {
  AppPage,
  DashboardStats,
  UserProfileInput,
  UserRecord,
} from './types.ts';

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [activeUser, setActiveUser] = useState<UserRecord | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    total_users: 0,
    total_plans_generated: 0,
    updated_plans: 0,
    active_users: 0,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isUpdatingFeedback, setIsUpdatingFeedback] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchUsersAndStats = useCallback(async (selectUserId?: string) => {
    try {
      const res = await fetch('/api/users');
      if (!res.ok) return;
      const data = await res.json();
      const loadedUsers: UserRecord[] = data.users || [];
      setUsers(loadedUsers);
      if (data.stats) {
        setStats(data.stats);
      }

      if (selectUserId) {
        const match = loadedUsers.find((u) => u.user_id === selectUserId);
        if (match) setActiveUser(match);
      } else {
        setActiveUser((prev) => {
          if (prev) {
            const updatedPrev = loadedUsers.find((u) => u.user_id === prev.user_id);
            return updatedPrev || loadedUsers[0] || null;
          }
          return loadedUsers[0] || null;
        });
      }
    } catch (err) {
      console.error('Failed to load initial users:', err);
    }
  }, []);

  useEffect(() => {
    fetchUsersAndStats();
  }, [fetchUsersAndStats]);

  const handleGeneratePlan = async (profile: UserProfileInput) => {
    setIsGenerating(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/generate-workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      const data = await response.json();
      if (!response.ok || !data.user) {
        throw new Error(
          data.error || 'Something went wrong while generating your plan. Please try again.'
        );
      }
      const savedUser: UserRecord = data.user;
      setActiveUser(savedUser);
      await fetchUsersAndStats(savedUser.user_id);
      setCurrentPage('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMessage(
        err?.message || 'Something went wrong while generating your plan. Please try again.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegeneratePlan = async (userRecord: UserRecord) => {
    await handleGeneratePlan({
      user_id: userRecord.user_id,
      name: userRecord.name,
      age: userRecord.age,
      weight: userRecord.weight,
      goal: userRecord.goal,
      intensity: userRecord.intensity,
      experience: userRecord.experience,
      available_days: userRecord.available_days,
      workout_duration: userRecord.workout_duration,
      preferences: userRecord.preferences,
    });
  };

  const handleSubmitFeedback = async (userId: string, feedbackText: string) => {
    setIsUpdatingFeedback(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/submit-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          feedback: feedbackText,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.user) {
        throw new Error(
          data.error || 'Something went wrong while updating your workout plan. Please try again.'
        );
      }
      const updatedUser: UserRecord = data.user;
      setActiveUser(updatedUser);
      await fetchUsersAndStats(updatedUser.user_id);
    } catch (err: any) {
      setErrorMessage(
        err?.message || 'Something went wrong while updating your workout plan. Please try again.'
      );
    } finally {
      setIsUpdatingFeedback(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${encodeURIComponent(userId)}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchUsersAndStats();
      }
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F17] text-slate-100">
      <Navbar
        currentPage={currentPage}
        onNavigate={(page) => {
          setErrorMessage(null);
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        activeUser={activeUser}
        allUsers={users}
        onSelectUser={(u) => {
          setActiveUser(u);
          if (currentPage === 'home') {
            setCurrentPage('result');
          }
        }}
        onStartNewPlan={() => {
          setErrorMessage(null);
          setCurrentPage('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <main className="flex-1">
        {currentPage === 'home' && (
          <Home
            onGeneratePlan={handleGeneratePlan}
            isGenerating={isGenerating}
            errorMessage={errorMessage}
            onClearError={() => setErrorMessage(null)}
            hasActivePlan={Boolean(activeUser)}
            onViewExistingPlan={() => setCurrentPage('result')}
          />
        )}

        {currentPage === 'result' && (
          <Result
            user={activeUser}
            onNavigateToHome={() => setCurrentPage('home')}
            onNavigateToFeedback={() => setCurrentPage('feedback')}
            onRegeneratePlan={handleRegeneratePlan}
            onSubmitFeedback={handleSubmitFeedback}
            isGenerating={isGenerating}
            isUpdatingFeedback={isUpdatingFeedback}
            errorMessage={errorMessage}
          />
        )}

        {currentPage === 'feedback' && (
          <Feedback
            user={activeUser}
            onSubmitFeedback={handleSubmitFeedback}
            isUpdatingFeedback={isUpdatingFeedback}
            errorMessage={errorMessage}
            onClearError={() => setErrorMessage(null)}
            onNavigateToResult={() => setCurrentPage('result')}
            onNavigateToHome={() => setCurrentPage('home')}
          />
        )}

        {currentPage === 'admin' && (
          <Admin
            users={users}
            stats={stats}
            onDeleteUser={handleDeleteUser}
            onLoadUserIntoApp={(user, targetTab) => {
              setActiveUser(user);
              setCurrentPage(targetTab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      <footer className="border-t border-slate-800/80 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-400 no-print">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-display font-bold text-white">FitBuddy</span> · AI Fitness Plan Generator
          </div>
          <p className="text-center sm:text-right text-slate-400">
            “FitBuddy provides general fitness and wellness information and is not a substitute for professional medical advice.”
          </p>
        </div>
      </footer>
    </div>
  );
}
