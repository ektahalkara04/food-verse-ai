import React, { useState } from 'react';
import { MealPlanResult, DayPlan } from '../types';
import { GeminiService } from '../services/geminiService';
import { HistoryService } from '../services/historyService';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import {
  CalendarCheck,
  Sparkles,
  RefreshCw,
  Flame,
  Dumbbell,
  Wheat,
  Droplet,
  ShoppingCart,
  CheckCircle2,
  Clock,
  Printer,
  ChevronRight,
  ShieldCheck,
  ListCheck,
  CheckSquare,
  Square,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const MealPlannerPage: React.FC = () => {
  const { user } = useAuth();
  const [dietaryPrefs, setDietaryPrefs] = useState<string[]>(['High Protein', 'Mediterranean']);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [ageRange, setAgeRange] = useState<string>('26-35');
  const [fitnessGoal, setFitnessGoal] = useState<string>('Muscle Gain & Definition');
  const [targetCalories, setTargetCalories] = useState<string>('2,300');
  const [planDuration, setPlanDuration] = useState<string>('7-Day Weekly Masterplan');
  const [notes, setNotes] = useState<string>('Focus on clean whole foods and high satiety meals');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MealPlanResult | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [checkedGroceries, setCheckedGroceries] = useState<Record<string, boolean>>({});

  const dietaryOptions = [
    'Balanced Whole Foods',
    'High Protein',
    'Mediterranean',
    'Keto / Low-Carb',
    'Vegetarian',
    'Plant-Based Vegan',
    'Paleo',
    'Gluten-Free',
  ];

  const allergyOptions = ['Peanuts', 'Tree Nuts', 'Dairy / Lactose', 'Gluten', 'Shellfish', 'Soy', 'Eggs'];

  const goals = [
    'Muscle Gain & Definition',
    'Fat Loss & Cutting',
    'Athletic Endurance & Performance',
    'Metabolic Health & Longevity',
    'Heart Healthy & Low Sodium',
  ];

  const toggleDiet = (pref: string) => {
    setDietaryPrefs((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const toggleAllergy = (al: string) => {
    setAllergies((prev) =>
      prev.includes(al) ? prev.filter((a) => a !== al) : [...prev, al]
    );
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      const plan = await GeminiService.generateMealPlan({
        dietaryPreferences: dietaryPrefs,
        allergies,
        ageRange,
        fitnessGoal,
        targetCalories,
        planDuration,
        additionalNotes: notes,
      });

      setResult(plan);
      setSelectedDayIndex(0);
      setCheckedGroceries({});

      HistoryService.saveRecord({
        userId: user?.uid || 'guest-evaluator',
        type: 'meal-planner',
        title: plan.planTitle,
        subtitle: `${fitnessGoal} • ${plan.dailyTargetMacros.calories} kcal/day • ${plan.schedule.length} Days Planned`,
        data: plan,
      });

      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate personalized meal plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleGroceryItem = (item: string) => {
    setCheckedGroceries((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const activeDay: DayPlan | undefined = result?.schedule[selectedDayIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-200/80 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-950 text-xs font-bold uppercase tracking-wider">
          <CalendarCheck className="w-3.5 h-3.5 text-teal-700" />
          <span>Multimodal Intelligence Module 5</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#0d3822] tracking-tight">
          Personalized Clinical Meal Planner
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          Input your metabolic profile, dietary philosophies, allergies, and fitness goals. Gemini 3.8 Flash synthesizes a complete 7-day schedule with precise macronutrients and categorized master grocery lists.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Preference Intake Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              1. Biometric & Goal Profile
            </h2>

            {/* Fitness Goal */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Fitness / Health Objective</label>
              <select
                value={fitnessGoal}
                onChange={(e) => setFitnessGoal(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                {goals.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Age Bracket & Daily Calories */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Age Range</label>
                <select
                  value={ageRange}
                  onChange={(e) => setAgeRange(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                >
                  <option value="18-25">18 - 25</option>
                  <option value="26-35">26 - 35</option>
                  <option value="36-50">36 - 50</option>
                  <option value="50+">50+</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Calories</label>
                <input
                  type="text"
                  value={targetCalories}
                  onChange={(e) => setTargetCalories(e.target.value)}
                  placeholder="e.g. 2,200 or Auto"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>
            </div>

            {/* Dietary Philosophy Chips */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Dietary Preferences</label>
              <div className="flex flex-wrap gap-1.5">
                {dietaryOptions.map((opt) => {
                  const active = dietaryPrefs.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleDiet(opt)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-medium transition ${
                        active
                          ? 'bg-teal-700 text-white shadow-xs font-semibold'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {active ? '✓ ' : '+ '}
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Allergies / Exclusions */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Allergies & Exclusions</label>
              <div className="flex flex-wrap gap-1.5">
                {allergyOptions.map((opt) => {
                  const active = allergies.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleAllergy(opt)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-medium transition ${
                        active
                          ? 'bg-red-600 text-white font-semibold'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {active ? '✕ ' : '+ '}
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Dietary Nuances (Optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. High fiber breakfast, budget-conscious ingredients"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            {/* Action button */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-teal-700 to-[#0d3822] hover:from-teal-600 hover:to-teal-900 text-white text-xs font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-lime-300" />
                  <span>Synthesizing 7-Day Masterplan with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-lime-300" />
                  <span>Generate 7-Day Meal Masterplan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Generated Plan & Groceries */}
        <div className="lg:col-span-7 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Meal Planner Error</p>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center mx-auto animate-pulse">
                <CalendarCheck className="w-8 h-8 text-teal-600 animate-bounce" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Architecting 7-Day Personalized Schedule...
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Gemini 3.8 Flash is balancing micronutrient variety, computing protein distribution curves across breakfast/lunch/dinner, and generating consolidated supermarket grocery aisles.
              </p>
            </div>
          )}

          {!loading && !result && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
                <CalendarCheck className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                No Plan Generated Yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Configure your fitness goal and dietary preferences on the left, then click <strong>"Generate 7-Day Meal Masterplan"</strong>.
              </p>
            </div>
          )}

          {!loading && result && (
            <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm space-y-6 animate-fadeIn">
              {/* Header and Print */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-900">
                    {fitnessGoal}
                  </span>
                  <h2 className="text-2xl font-extrabold text-[#0d3822] mt-1">
                    {result.planTitle}
                  </h2>
                </div>

                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 transition self-start sm:self-auto"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Plan</span>
                </button>
              </div>

              {/* Goal Rationale */}
              <p className="text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed">
                {result.goalRationale}
              </p>

              {/* Daily Target Macros Gauge */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Target Daily Macronutrients
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl text-center">
                    <span className="text-base font-extrabold text-orange-950">
                      {result.dailyTargetMacros.calories} kcal
                    </span>
                    <span className="block text-[10px] font-bold text-orange-700 uppercase">
                      Calories
                    </span>
                  </div>
                  <div className="p-3 bg-lime-50 border border-lime-100 rounded-xl text-center">
                    <span className="text-base font-extrabold text-lime-950">
                      {result.dailyTargetMacros.proteinGrams}g
                    </span>
                    <span className="block text-[10px] font-bold text-lime-700 uppercase">
                      Protein
                    </span>
                  </div>
                  <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-center">
                    <span className="text-base font-extrabold text-amber-950">
                      {result.dailyTargetMacros.carbsGrams}g
                    </span>
                    <span className="block text-[10px] font-bold text-amber-700 uppercase">
                      Carbs
                    </span>
                  </div>
                  <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl text-center">
                    <span className="text-base font-extrabold text-teal-950">
                      {result.dailyTargetMacros.fatsGrams}g
                    </span>
                    <span className="block text-[10px] font-bold text-teal-700 uppercase">
                      Fats
                    </span>
                  </div>
                </div>
              </div>

              {/* 7-Day Day Selector Tabs */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Select Day to View Meals
                </h3>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {result.schedule.map((day, idx) => (
                    <button
                      key={day.dayNumber}
                      onClick={() => setSelectedDayIndex(idx)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
                        selectedDayIndex === idx
                          ? 'bg-emerald-800 text-white shadow-md'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Day {day.dayNumber}
                    </button>
                  ))}
                </div>
              </div>

              {/* Day Meal Breakdown */}
              {activeDay && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">{activeDay.dayName}</h4>
                    {activeDay.totalDayCalories && (
                      <span className="text-xs text-slate-500 font-medium">
                        Total: {activeDay.totalDayCalories} kcal
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Breakfast */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          Breakfast
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {activeDay.breakfast.prepMinutes}m
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-900">{activeDay.breakfast.title}</h5>
                      <p className="text-[11px] text-slate-500">{activeDay.breakfast.ingredientsSummary}</p>
                      <div className="pt-2 text-[10px] font-semibold text-slate-600 flex gap-2">
                        <span>{activeDay.breakfast.calories} kcal</span>
                        <span>•</span>
                        <span>{activeDay.breakfast.proteinGrams}g Protein</span>
                      </div>
                    </div>

                    {/* Lunch */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                          Lunch
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {activeDay.lunch.prepMinutes}m
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-900">{activeDay.lunch.title}</h5>
                      <p className="text-[11px] text-slate-500">{activeDay.lunch.ingredientsSummary}</p>
                      <div className="pt-2 text-[10px] font-semibold text-slate-600 flex gap-2">
                        <span>{activeDay.lunch.calories} kcal</span>
                        <span>•</span>
                        <span>{activeDay.lunch.proteinGrams}g Protein</span>
                      </div>
                    </div>

                    {/* Dinner */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                          Dinner
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {activeDay.dinner.prepMinutes}m
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-900">{activeDay.dinner.title}</h5>
                      <p className="text-[11px] text-slate-500">{activeDay.dinner.ingredientsSummary}</p>
                      <div className="pt-2 text-[10px] font-semibold text-slate-600 flex gap-2">
                        <span>{activeDay.dinner.calories} kcal</span>
                        <span>•</span>
                        <span>{activeDay.dinner.proteinGrams}g Protein</span>
                      </div>
                    </div>

                    {/* Snack */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                          Snack
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {activeDay.snack.prepMinutes}m
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-900">{activeDay.snack.title}</h5>
                      <p className="text-[11px] text-slate-500">{activeDay.snack.ingredientsSummary}</p>
                      <div className="pt-2 text-[10px] font-semibold text-slate-600 flex gap-2">
                        <span>{activeDay.snack.calories} kcal</span>
                        <span>•</span>
                        <span>{activeDay.snack.proteinGrams}g Protein</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Categorized Grocery Checklist */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ShoppingCart className="w-4 h-4 text-emerald-700" />
                    <span>Master Supermarket Grocery Checklist</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">Click to check off</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Produce */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <h5 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                      Fresh Produce
                    </h5>
                    <div className="space-y-1.5">
                      {result.groceryList.produce.map((item) => (
                        <div
                          key={item}
                          onClick={() => toggleGroceryItem(item)}
                          className={`flex items-center gap-2 text-xs cursor-pointer select-none transition ${
                            checkedGroceries[item] ? 'text-slate-400 line-through' : 'text-slate-700'
                          }`}
                        >
                          {checkedGroceries[item] ? (
                            <CheckSquare className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          ) : (
                            <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          )}
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Proteins */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <h5 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                      Lean Proteins
                    </h5>
                    <div className="space-y-1.5">
                      {result.groceryList.proteins.map((item) => (
                        <div
                          key={item}
                          onClick={() => toggleGroceryItem(item)}
                          className={`flex items-center gap-2 text-xs cursor-pointer select-none transition ${
                            checkedGroceries[item] ? 'text-slate-400 line-through' : 'text-slate-700'
                          }`}
                        >
                          {checkedGroceries[item] ? (
                            <CheckSquare className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          ) : (
                            <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          )}
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Grains & Pantry */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <h5 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                      Grains & Healthy Fats
                    </h5>
                    <div className="space-y-1.5">
                      {result.groceryList.grainsAndPantry.map((item) => (
                        <div
                          key={item}
                          onClick={() => toggleGroceryItem(item)}
                          className={`flex items-center gap-2 text-xs cursor-pointer select-none transition ${
                            checkedGroceries[item] ? 'text-slate-400 line-through' : 'text-slate-700'
                          }`}
                        >
                          {checkedGroceries[item] ? (
                            <CheckSquare className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          ) : (
                            <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          )}
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Hydration & Meal Timing */}
              {result.hydrationAndTimingTips && (
                <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-200/80 space-y-2">
                  <h4 className="text-xs font-bold text-teal-950 uppercase tracking-wide">
                    Hydration & Nutrient Timing Protocols
                  </h4>
                  <ul className="space-y-1 text-xs text-teal-900">
                    {result.hydrationAndTimingTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-teal-600 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
