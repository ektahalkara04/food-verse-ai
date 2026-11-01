import React, { useState } from 'react';
import { PageType } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  UtensilsCrossed,
  ScanLine,
  Apple,
  ShieldAlert,
  ChefHat,
  CalendarCheck,
  History,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onOpenAuth }) => {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modulesDropdownOpen, setModulesDropdownOpen] = useState(false);

  const navItems = [
    { id: 'landing' as PageType, label: 'Home' },
    { id: 'dashboard' as PageType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'history' as PageType, label: 'History', icon: History },
  ];

  const aiModules = [
    {
      id: 'recognition' as PageType,
      label: 'Food Recognition & Nutrition',
      desc: 'Portion sizing, macros, ingredients & glycemic index',
      icon: ScanLine,
      color: 'text-lime-600 bg-lime-50',
    },
    {
      id: 'freshness' as PageType,
      label: 'Food Freshness Detection',
      desc: 'Perishable spoilage & visual shelf life analysis',
      icon: Apple,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      id: 'hygiene' as PageType,
      label: 'Restaurant Hygiene Audit',
      desc: 'Commercial kitchen sanitation & hazard monitoring',
      icon: ShieldAlert,
      color: 'text-orange-600 bg-orange-50',
    },
    {
      id: 'cooking' as PageType,
      label: 'Smart Cooking Assistant',
      desc: 'Michelin chef conversational recipe architect',
      icon: ChefHat,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: 'meal-planner' as PageType,
      label: 'Personalized Meal Planner',
      desc: 'Goal-tailored 7-day macro meal schedules',
      icon: CalendarCheck,
      color: 'text-teal-600 bg-teal-50',
    },
  ];

  const handleNav = (page: PageType) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    setModulesDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isCurrentModule = aiModules.some(m => m.id === currentPage);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => handleNav('landing')}
              className="flex items-center gap-3 text-left group transition"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0d3822] via-[#14532d] to-[#1e7843] flex items-center justify-center text-white shadow-md shadow-emerald-950/15 group-hover:scale-105 transition-transform">
                <UtensilsCrossed className="w-5 h-5 text-lime-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#0d3822]">
                    FOOD VERSE <span className="text-lime-600">AI</span>
                  </span>
                  <span className="hidden md:inline-flex px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Multimodal
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
                  Google Cloud AI Capstone Platform
                </p>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => handleNav('landing')}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                  currentPage === 'landing'
                    ? 'text-emerald-900 bg-emerald-50'
                    : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
                }`}
              >
                Home
              </button>

              <button
                onClick={() => handleNav('dashboard')}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition ${
                  currentPage === 'dashboard'
                    ? 'text-emerald-900 bg-emerald-50'
                    : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                Dashboard
              </button>

              {/* AI Modules Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setModulesDropdownOpen(!modulesDropdownOpen)}
                  onMouseEnter={() => setModulesDropdownOpen(true)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition ${
                    isCurrentModule
                      ? 'text-emerald-900 bg-emerald-50'
                      : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span>AI Modules</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {modulesDropdownOpen && (
                  <div
                    onMouseLeave={() => setModulesDropdownOpen(false)}
                    className="absolute top-full left-0 mt-1 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-fadeIn"
                  >
                    <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Gemini 3.8 Flash Capabilities
                    </div>
                    {aiModules.map((module) => {
                      const Icon = module.icon;
                      const active = currentPage === module.id;
                      return (
                        <button
                          key={module.id}
                          onClick={() => handleNav(module.id)}
                          className={`w-full text-left p-2.5 rounded-xl flex items-start gap-3 transition ${
                            active
                              ? 'bg-emerald-50/80 text-emerald-950 font-medium'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className={`p-2 rounded-lg shrink-0 ${module.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold leading-tight">{module.label}</div>
                            <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {module.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleNav('history')}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition ${
                  currentPage === 'history'
                    ? 'text-emerald-900 bg-emerald-50'
                    : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
                }`}
              >
                <History className="w-4 h-4 text-slate-500" />
                History
              </button>
            </nav>
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">
                      {(user.displayName || user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800 leading-none">
                      {user.displayName || 'Evaluator'}
                    </p>
                    <p className="text-[10px] text-emerald-700 font-medium">Verified Session</p>
                  </div>
                </div>

                <button
                  onClick={signOut}
                  title="Sign Out"
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition hover:shadow-md hover:scale-[1.02]"
              >
                <LogIn className="w-4 h-4 text-lime-300" />
                Sign In
              </button>
            )}

            {/* Quick Action Button */}
            <button
              onClick={() => handleNav('recognition')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-sm shadow-orange-500/20 transition hover:scale-[1.02]"
            >
              <ScanLine className="w-4 h-4" />
              <span>Analyze Food</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleNav('landing')}
              className={`p-2.5 rounded-xl text-left text-xs font-bold ${
                currentPage === 'landing' ? 'bg-emerald-50 text-emerald-900' : 'bg-slate-50 text-slate-700'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('dashboard')}
              className={`p-2.5 rounded-xl text-left text-xs font-bold ${
                currentPage === 'dashboard' ? 'bg-emerald-50 text-emerald-900' : 'bg-slate-50 text-slate-700'
              }`}
            >
              Dashboard
            </button>
          </div>

          <div className="pt-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-2">
              AI Intelligence Modules
            </div>
            <div className="space-y-1">
              {aiModules.map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => handleNav(m.id)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left text-xs font-semibold ${
                      currentPage === m.id
                        ? 'bg-emerald-800 text-white'
                        : 'bg-slate-50 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => handleNav('history')}
            className={`w-full flex items-center gap-2 p-2.5 rounded-xl text-left text-xs font-semibold ${
              currentPage === 'history' ? 'bg-emerald-50 text-emerald-900' : 'bg-slate-50 text-slate-700'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Analysis History</span>
          </button>
        </div>
      )}
    </header>
  );
};
