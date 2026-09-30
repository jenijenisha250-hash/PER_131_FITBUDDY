import React, { useState } from 'react';
import { Menu, X, PlusCircle, UserCheck } from 'lucide-react';
import { AppPage, UserRecord } from '../types.ts';

interface NavbarProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  activeUser: UserRecord | null;
  allUsers: UserRecord[];
  onSelectUser: (user: UserRecord) => void;
  onStartNewPlan: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  activeUser,
  allUsers,
  onSelectUser,
  onStartNewPlan,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: AppPage; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'result', label: 'My Plan' },
    { id: 'feedback', label: 'Feedback' },
    { id: 'admin', label: 'Dashboard' },
  ];

  const handleNavClick = (page: AppPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0B0F17]/95 backdrop-blur-md border-b border-slate-800/80 no-print">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('home');
          }}
          className="font-display text-xl font-bold tracking-tight text-white hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
        >
          FitBuddy
        </a>

        {/* Zone 2: 4 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                  isActive
                    ? 'border-emerald-400 text-white font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-100 hover:border-slate-600'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {allUsers.length > 0 && (
            <div className="relative flex items-center">
              <UserCheck className="w-4 h-4 text-emerald-400 absolute left-3 pointer-events-none" />
              <select
                aria-label="Switch active athlete profile"
                value={activeUser?.user_id || ''}
                onChange={(e) => {
                  const found = allUsers.find((u) => u.user_id === e.target.value);
                  if (found) onSelectUser(found);
                }}
                className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:border-emerald-500 transition-colors max-w-[190px] truncate"
              >
                {allUsers.map((u) => (
                  <option key={u.user_id} value={u.user_id}>
                    {u.name} ({u.user_id})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="button"
            onClick={onStartNewPlan}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            New Plan
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 text-slate-300 hover:text-white rounded-lg border border-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F1623] border-b border-slate-800 px-4 pt-3 pb-5 space-y-3">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-300 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {allUsers.length > 0 && (
            <div className="pt-2 border-t border-slate-800/80">
              <label
                htmlFor="mobile-user-select"
                className="block text-xs text-slate-400 mb-1.5"
              >
                Active Athlete Profile
              </label>
              <select
                id="mobile-user-select"
                value={activeUser?.user_id || ''}
                onChange={(e) => {
                  const found = allUsers.find((u) => u.user_id === e.target.value);
                  if (found) {
                    onSelectUser(found);
                    setMobileMenuOpen(false);
                  }
                }}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2"
              >
                {allUsers.map((u) => (
                  <option key={u.user_id} value={u.user_id}>
                    {u.name} ({u.user_id}) — {u.goal}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              onStartNewPlan();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Create New Fitness Plan
          </button>
        </div>
      )}
    </header>
  );
};
