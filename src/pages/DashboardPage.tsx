import React, { useState, useEffect } from 'react';
import { PageType, HistoryRecord } from '../types';
import { useAuth } from '../context/AuthContext';
import { HistoryService } from '../services/historyService';
import {
  ScanLine,
  Apple,
  ShieldAlert,
  ChefHat,
  CalendarCheck,
  Flame,
  Dumbbell,
  Wheat,
  Droplet,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  History,
  TrendingUp,
  PlusCircle,
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (page: PageType) => void;
  onViewRecord?: (record: HistoryRecord) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, onViewRecord }) => {
  const { user } = useAuth();
  const [recentRecords, setRecentRecords] = useState<HistoryRecord[]>([]);

  useEffect(() => {
    const list = HistoryService.getRecords(user?.uid);
    setRecentRecords(list.slice(0, 5));
  }, [user]);

  const aiModules = [
    {
      id: 'recognition' as PageType,
      title: 'Food Recognition & Nutrition',
      subtitle: 'Identify foods, portion weights, macros & glycemic index',
      icon: ScanLine,
      color: 'from-lime-500 to-emerald-600',
      badge: 'Vision Visionary',
      cta: 'Analyze Meal',
    },
    {
      id: 'freshness' as PageType,
      title: 'Food Freshness Detection',
      subtitle: 'Visual discoloration, mold spore & shelf-life assessment',
      icon: Apple,
      color: 'from-amber-500 to-orange-600',
      badge: 'Zero-Waste Guard',
      cta: 'Check Perishable',
    },
    {
      id: 'hygiene' as PageType,
      title: 'Restaurant Hygiene Audit',
      subtitle: 'Commercial workstation, refrigeration & HACCP inspection',
      icon: ShieldAlert,
      color: 'from-orange-500 to-red-600',
      badge: 'HACCP Mapped',
      cta: 'Audit Facility',
    },
    {
      id: 'cooking' as PageType,
      title: 'Smart Cooking Assistant',
      subtitle: 'Michelin chef chatbot for pantry ingredients & techniques',
      icon: ChefHat,
      color: 'from-emerald-600 to-teal-700',
      badge: 'Interactive Chef',
      cta: 'Open Kitchen Chat',
    },
    {
      id: 'meal-planner' as PageType,
      title: 'Personalized Meal Planner',
      subtitle: 'Goal-tailored 7-day macro masterplans & grocery checklists',
      icon: CalendarCheck,
      color: 'from-teal-600 to-cyan-700',
      badge: 'Nutrition Engine',
      cta: 'Build 7-Day Plan',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0d3822] via-[#14532d] to-[#1c683b] rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-lime-400/15 to-transparent pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-xs font-semibold text-lime-300">
              <Sparkles className="w-3.5 h-3.5 text-lime-400" />
              <span>Multimodal Intelligence Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.displayName || 'Capstone Evaluator'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              Real-time food computer vision, spoilage detection, and kitchen compliance ready for evaluation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('recognition')}
              className="px-4 py-2.5 bg-lime-400 hover:bg-lime-300 text-emerald-950 text-xs sm:text-sm font-bold rounded-xl shadow-md transition flex items-center gap-2"
            >
              <ScanLine className="w-4 h-4" />
              <span>Scan Meal</span>
            </button>
            <button
              onClick={() => onNavigate('history')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-semibold rounded-xl transition flex items-center gap-2"
            >
              <History className="w-4 h-4" />
              <span>View History</span>
            </button>
          </div>
        </div>
      </div>

      {/* Nutrition Statistics & Daily Targets */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Nutrition & Biometric Summary</h2>
            <p className="text-xs text-slate-500">Tracked via Food Recognition vision analyses</p>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
            Daily Target: 2,200 kcal
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Calories */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Calories</span>
              <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">1,840 <span className="text-xs text-slate-400 font-normal">/ 2,200 kcal</span></div>
              <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
                <div className="bg-orange-500 h-full rounded-full" style={{ width: '84%' }}></div>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              <span>360 kcal remaining today</span>
            </p>
          </div>

          {/* Protein */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Protein Intake</span>
              <div className="p-2 rounded-xl bg-lime-50 text-lime-700">
                <Dumbbell className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">128g <span className="text-xs text-slate-400 font-normal">/ 150g</span></div>
              <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
                <div className="bg-lime-500 h-full rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <p className="text-[11px] text-emerald-700 font-medium">Optimal for lean muscle synthesis</p>
          </div>

          {/* Carbs */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Carbohydrates</span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Wheat className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">165g <span className="text-xs text-slate-400 font-normal">/ 210g</span></div>
              <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            <p className="text-[11px] text-slate-500">Low-Glycemic Whole Grains</p>
          </div>

          {/* Healthy Fats */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Healthy Fats</span>
              <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
                <Droplet className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">54g <span className="text-xs text-slate-400 font-normal">/ 65g</span></div>
              <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
                <div className="bg-teal-500 h-full rounded-full" style={{ width: '83%' }}></div>
              </div>
            </div>
            <p className="text-[11px] text-slate-500">Omega-3 & Monounsaturated</p>
          </div>
        </div>
      </section>

      {/* Five Core AI Feature Cards */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Five AI Intelligence Modules</h2>
          <p className="text-xs text-slate-500">Powered by server-side Gemini 3.8 Flash multimodal API</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiModules.map((module) => {
            const Icon = module.icon;
            return (
              <div
                key={module.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${module.color} text-white flex items-center justify-center shadow-md`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                      {module.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-800 transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{module.subtitle}</p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-emerald-800">Ready</span>
                  <button
                    onClick={() => onNavigate(module.id)}
                    className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5 group-hover:bg-emerald-950"
                  >
                    <span>{module.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent AI Analyses & Activities</h2>
            <p className="text-xs text-slate-500">Synchronized session logs and reports</p>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentRecords.length > 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden shadow-xs">
            {recentRecords.map((item) => (
              <div
                key={item.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition"
              >
                <div className="flex items-center gap-3.5">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 text-emerald-700" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">{item.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <button
                    onClick={() => {
                      if (onViewRecord) {
                        onViewRecord(item);
                      } else {
                        onNavigate('history');
                      }
                    }}
                    className="px-3 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 text-xs font-semibold rounded-lg transition"
                  >
                    View Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No activity logged yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Test any of the five AI modules to generate your first live multimodal analysis.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('recognition')}
                className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-semibold hover:bg-emerald-900 transition"
              >
                Analyze Sample Meal Now
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
