export type PageType = 
  | 'landing'
  | 'dashboard'
  | 'recognition'
  | 'freshness'
  | 'hygiene'
  | 'cooking'
  | 'meal-planner'
  | 'history'
  | 'profile';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  isAnonymous?: boolean;
}

// Module 1: Food Recognition
export interface FoodRecognitionResult {
  foodName: string;
  confidenceScore: number;
  cuisine: string;
  portionSize: string;
  healthScore: number;
  healthSummary: string;
  glycemicIndex: 'Low' | 'Medium' | 'High' | string;
  macronutrients: {
    calories: number;
    proteinGrams: number;
    carbsGrams: number;
    fatsGrams: number;
    fiberGrams: number;
    sugarGrams: number;
    sodiumMg?: number;
  };
  ingredients: Array<{
    name: string;
    portion?: string;
    isAllergen: boolean;
    allergenType?: string;
  }>;
  dietaryTags: string[];
  recommendations: string[];
}

// Module 2: Freshness Detection
export interface FreshnessDetectionResult {
  itemName: string;
  category: string;
  freshnessStatus: 'Fresh & Peak Quality' | 'Good - Consume Soon' | 'Marginal / Early Deterioration' | 'Spoiled / Discard Recommended' | string;
  freshnessScore: number; // 1-100
  shelfLifeEstimate: string;
  visualIndicators: {
    discoloration: string;
    moldBacterialSigns: string;
    textureChanges: string;
    moistureLevels: string;
  };
  storageRecommendations: string[];
  culinaryTips: string[];
  scientificDisclaimer: string;
}

// Module 3: Restaurant Hygiene
export interface HygieneAuditFinding {
  category: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  observation: string;
  regulatoryCode?: string;
  correctiveAction: string;
}

export interface HygieneAuditResult {
  facilityArea: string;
  hygieneGrade: string;
  overallScore: number; // 1-100
  surfaceCleanlinessRating: number; // 1-10
  crossContaminationRisk: 'Low' | 'Moderate' | 'Elevated' | 'High Alert' | string;
  auditSummary: string;
  findings: HygieneAuditFinding[];
  positivePractices: string[];
  supervisorActionPlan: string[];
  complianceDisclaimer: string;
}

// Module 4: Smart Cooking Assistant
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Module 5: Personalized Meal Planner
export interface MealItem {
  title: string;
  ingredientsSummary: string;
  prepMinutes: number;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
}

export interface DayPlan {
  dayNumber: number;
  dayName: string;
  totalDayCalories?: number;
  breakfast: MealItem;
  lunch: MealItem;
  dinner: MealItem;
  snack: MealItem;
}

export interface MealPlanResult {
  planTitle: string;
  goalRationale: string;
  dailyTargetMacros: {
    calories: number;
    proteinGrams: number;
    carbsGrams: number;
    fatsGrams: number;
    fiberGrams?: number;
  };
  schedule: DayPlan[];
  groceryList: {
    produce: string[];
    proteins: string[];
    grainsAndPantry: string[];
    dairyAndAlternates?: string[];
    healthyFatsAndOils?: string[];
  };
  hydrationAndTimingTips: string[];
}

// History Entry
export interface HistoryRecord {
  id: string;
  userId: string;
  type: 'recognition' | 'freshness' | 'hygiene' | 'cooking' | 'meal-planner';
  title: string;
  subtitle: string;
  timestamp: string;
  imageUrl?: string;
  data: FoodRecognitionResult | FreshnessDetectionResult | HygieneAuditResult | { recipe: string } | MealPlanResult;
}
