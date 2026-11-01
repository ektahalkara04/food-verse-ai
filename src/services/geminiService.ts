import {
  FoodRecognitionResult,
  FreshnessDetectionResult,
  HygieneAuditResult,
  ChatMessage,
  MealPlanResult,
} from '../types';

export class GeminiService {
  /**
   * Helper to convert an image URL or Blob/File to Base64 data URL
   */
  static async fileOrUrlToBase64(input: File | Blob | string): Promise<string> {
    if (typeof input === 'string') {
      return input;
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(input);
    });
  }

  /**
   * Module 1: Food Recognition & Nutrition
   */
  static async analyzeFoodNutrition(
    image: File | Blob | string,
    mealContext?: string
  ): Promise<FoodRecognitionResult> {
    const base64Data = await this.fileOrUrlToBase64(image);

    const response = await fetch('/api/gemini/food-recognition', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: base64Data,
        mealContext,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `Server responded with status ${response.status}`);
    }

    const json = await response.json();
    return json.data as FoodRecognitionResult;
  }

  /**
   * Module 2: Food Freshness & Spoilage Detection
   */
  static async detectFreshness(
    image: File | Blob | string,
    foodCategory: string,
    storageNotes?: string
  ): Promise<FreshnessDetectionResult> {
    const base64Data = await this.fileOrUrlToBase64(image);

    const response = await fetch('/api/gemini/freshness-detection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: base64Data,
        foodCategory,
        storageNotes,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `Server responded with status ${response.status}`);
    }

    const json = await response.json();
    return json.data as FreshnessDetectionResult;
  }

  /**
   * Module 3: Restaurant Hygiene Audit
   */
  static async auditHygiene(
    visualMedia: File | Blob | string,
    areaType: string,
    facilityNotes?: string
  ): Promise<HygieneAuditResult> {
    const base64Data = await this.fileOrUrlToBase64(visualMedia);

    const response = await fetch('/api/gemini/hygiene-audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: base64Data,
        areaType,
        facilityNotes,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `Server responded with status ${response.status}`);
    }

    const json = await response.json();
    return json.data as HygieneAuditResult;
  }

  /**
   * Module 4: Smart Cooking Assistant
   */
  static async askCookingAssistant(
    messages: ChatMessage[],
    options?: {
      ingredients?: string;
      dietaryPreference?: string;
      skillLevel?: string;
      cookingTime?: string;
    }
  ): Promise<string> {
    const response = await fetch('/api/gemini/cooking-assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        ...options,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `Server responded with status ${response.status}`);
    }

    const json = await response.json();
    return json.message;
  }

  /**
   * Module 5: Personalized Meal Planner
   */
  static async generateMealPlan(params: {
    dietaryPreferences: string[];
    allergies: string[];
    ageRange: string;
    fitnessGoal: string;
    targetCalories?: string | number;
    planDuration: string;
    additionalNotes?: string;
  }): Promise<MealPlanResult> {
    const response = await fetch('/api/gemini/meal-planner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `Server responded with status ${response.status}`);
    }

    const json = await response.json();
    return json.data as MealPlanResult;
  }
}
