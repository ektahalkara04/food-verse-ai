import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Increase payload limit for high-resolution food images and video frames
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

// Initialize Google Gemini AI SDK on the server side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const GEMINI_PRIMARY_MODEL = 'gemini-flash-latest';
const GEMINI_FALLBACK_MODEL = 'gemini-3.8-flash';

// Resilient wrapper with fast automatic model failover
async function generateWithRetry(params: any): Promise<any> {
  const models = [GEMINI_PRIMARY_MODEL, GEMINI_FALLBACK_MODEL];
  let lastErr: any = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        ...params,
        model,
      });
      return response;
    } catch (err: any) {
      lastErr = err;
      const errMsg = err?.message || String(err);
      const isTemporary =
        errMsg.includes('503') ||
        errMsg.includes('demand') ||
        errMsg.includes('UNAVAILABLE') ||
        errMsg.includes('429') ||
        errMsg.includes('RESOURCE_EXHAUSTED');

      if (isTemporary) {
        // Failover directly to alternate model
        continue;
      }
      break;
    }
  }

  throw lastErr;
}

// Helper to sanitize base64 data URL
function extractBase64Data(dataUrl: string): { mimeType: string; data: string } {
  if (dataUrl.includes(';base64,')) {
    const parts = dataUrl.split(';base64,');
    const mimeType = parts[0].replace('data:', '') || 'image/jpeg';
    return { mimeType, data: parts[1] };
  }
  return { mimeType: 'image/jpeg', data: dataUrl };
}

// Helper to safely parse JSON from Gemini response, stripping markdown fences if present
function cleanJsonParse(text: string | undefined): any {
  if (!text) return {};
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return JSON.parse(cleaned);
}

// Helper to resolve image from either Base64 data URL or remote URL (bypassing browser CORS)
async function resolveImageInput(imageInput: string): Promise<{ mimeType: string; data: string }> {
  if (imageInput.startsWith('http://') || imageInput.startsWith('https://')) {
    try {
      const res = await fetch(imageInput);
      if (!res.ok) {
        throw new Error(`Failed to fetch image: ${res.statusText}`);
      }
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const contentType = res.headers.get('content-type') || 'image/jpeg';
      return {
        mimeType: contentType.split(';')[0].trim() || 'image/jpeg',
        data: buffer.toString('base64'),
      };
    } catch (err: any) {
      console.error('Error resolving image URL on server:', err);
      throw new Error(`Failed to fetch image: ${err.message || 'Network error'}`);
    }
  }

  return extractBase64Data(imageInput);
}

// -----------------------------------------------------------------------------
// Health Check
// -----------------------------------------------------------------------------
app.get('/api/health', (req: Request, res: Response) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    status: 'online',
    platform: 'Food Verse AI Server',
    geminiConfigured: hasKey,
    timestamp: new Date().toISOString(),
  });
});

// -----------------------------------------------------------------------------
// Module 1: Food Recognition and Nutrition Analysis
// -----------------------------------------------------------------------------
app.post('/api/gemini/food-recognition', async (req: Request, res: Response) => {
  try {
    const { image, mealContext } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    const { mimeType, data } = await resolveImageInput(image);

    const promptText = `
You are an expert clinical dietitian and food computer vision scientist for the Food Verse AI platform.
Analyze this food photograph meticulously.
Identify:
1. Exact dish name and estimated cuisine type.
2. Estimated portion size (e.g. in grams or household units).
3. Detailed macronutrient and micronutrient breakdown per portion.
4. All visible and inferred ingredients with estimated individual portion sizes and allergen flags.
5. Glycemic Index estimate ('Low', 'Medium', 'High') and Glycemic Load insights.
6. Overall Health Score (1 to 100) based on nutritional density, whole-food composition, and ultra-processing level.
7. Key dietary tags (e.g., 'High Protein', 'Keto-Friendly', 'Plant-Based', 'Low Sodium').
8. Practical clinical & culinary recommendations to optimize this meal.

Additional context provided by user: ${mealContext || 'None'}.

Return the response strictly adhering to the JSON schema.
`;

    const response = await generateWithRetry({
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data,
            },
          },
          { text: promptText },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            foodName: { type: Type.STRING, description: 'Specific dish or food item name' },
            confidenceScore: { type: Type.NUMBER, description: 'Confidence from 0 to 1' },
            cuisine: { type: Type.STRING, description: 'Cuisine origin (e.g., Mediterranean, Japanese)' },
            portionSize: { type: Type.STRING, description: 'Estimated portion description' },
            healthScore: { type: Type.INTEGER, description: 'Health density rating 1-100' },
            healthSummary: { type: Type.STRING, description: 'Brief 1-2 sentence assessment' },
            glycemicIndex: { type: Type.STRING, description: 'Low, Medium, or High' },
            macronutrients: {
              type: Type.OBJECT,
              properties: {
                calories: { type: Type.NUMBER, description: 'Total kcal' },
                proteinGrams: { type: Type.NUMBER, description: 'Protein in grams' },
                carbsGrams: { type: Type.NUMBER, description: 'Carbohydrates in grams' },
                fatsGrams: { type: Type.NUMBER, description: 'Total fats in grams' },
                fiberGrams: { type: Type.NUMBER, description: 'Dietary fiber in grams' },
                sugarGrams: { type: Type.NUMBER, description: 'Sugars in grams' },
                sodiumMg: { type: Type.NUMBER, description: 'Sodium in milligrams' },
              },
              required: ['calories', 'proteinGrams', 'carbsGrams', 'fatsGrams', 'fiberGrams', 'sugarGrams'],
            },
            ingredients: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  portion: { type: Type.STRING },
                  isAllergen: { type: Type.BOOLEAN },
                  allergenType: { type: Type.STRING },
                },
                required: ['name', 'isAllergen'],
              },
            },
            dietaryTags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['foodName', 'healthScore', 'macronutrients', 'ingredients', 'dietaryTags', 'recommendations'],
        },
      },
    });

    const parsedData = cleanJsonParse(response.text);
    return res.json({ success: true, data: parsedData });
  } catch (err: any) {
    console.error('Error in food recognition:', err);
    return res.status(500).json({
      error: err.message || 'Failed to process food recognition request',
    });
  }
});

// -----------------------------------------------------------------------------
// Module 2: Food Freshness & Spoilage Detection
// -----------------------------------------------------------------------------
app.post('/api/gemini/freshness-detection', async (req: Request, res: Response) => {
  try {
    const { image, foodCategory, storageNotes } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    const { mimeType, data } = await resolveImageInput(image);

    const promptText = `
You are an expert food safety scientist and agricultural quality inspector for Food Verse AI.
Inspect this food image (category: ${foodCategory || 'produce/perishable'}).
Perform a rigorous visual analysis of:
1. Discoloration (oxidation, browning, yellowing, dark spots, bruising).
2. Mold-like or bacterial growth signs (spores, mycelial web, fuzzy patches, slime).
3. Textural deterioration (wrinkling, shriveling, wilting, sagging, dryness or liquid leakage).
4. Estimate visual freshness status:
   - 'Fresh & Peak Quality'
   - 'Good - Consume Soon'
   - 'Marginal / Early Deterioration'
   - 'Spoiled / Discard Recommended'
5. Visual Freshness Score from 1 to 100.
6. Estimated remaining shelf life under standard refrigerated vs ambient conditions.
7. Optimal storage recommendations (temperature, humidity, breathable container vs airtight, ethylene gas separation).
8. Culinary usage tips if safe but overripe (e.g. smoothies, soups, composting).
9. Note: Under no circumstance certify biological safety; include a scientific disclaimer that invisible foodborne pathogens (like Salmonella, Listeria, E. coli) can be present without visible spoilage.

User storage notes: ${storageNotes || 'None'}.
`;

    const response = await generateWithRetry({
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data,
            },
          },
          { text: promptText },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            itemName: { type: Type.STRING, description: 'Detected food item name' },
            category: { type: Type.STRING, description: 'Category e.g. Fruit, Vegetable, Meat, Dairy, Seafood' },
            freshnessStatus: { type: Type.STRING, description: 'Fresh & Peak Quality, Good - Consume Soon, Marginal / Early Deterioration, or Spoiled / Discard Recommended' },
            freshnessScore: { type: Type.INTEGER, description: '1 to 100' },
            shelfLifeEstimate: { type: Type.STRING, description: 'Remaining shelf life estimate' },
            visualIndicators: {
              type: Type.OBJECT,
              properties: {
                discoloration: { type: Type.STRING, description: 'Observations on color changes' },
                moldBacterialSigns: { type: Type.STRING, description: 'Observations on visible fungal or bacterial signs' },
                textureChanges: { type: Type.STRING, description: 'Observations on texture, wilting, bruising' },
                moistureLevels: { type: Type.STRING, description: 'Observations on pooling moisture or dehydration' },
              },
              required: ['discoloration', 'moldBacterialSigns', 'textureChanges', 'moistureLevels'],
            },
            storageRecommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            culinaryTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            scientificDisclaimer: { type: Type.STRING, description: 'Food safety disclaimer regarding microbiological limits of visual inspection' },
          },
          required: ['itemName', 'freshnessStatus', 'freshnessScore', 'visualIndicators', 'storageRecommendations', 'scientificDisclaimer'],
        },
      },
    });

    const parsedData = cleanJsonParse(response.text);
    return res.json({ success: true, data: parsedData });
  } catch (err: any) {
    console.error('Error in freshness detection:', err);
    return res.status(500).json({
      error: err.message || 'Failed to analyze food freshness',
    });
  }
});

// -----------------------------------------------------------------------------
// Module 3: Restaurant Hygiene & Kitchen Inspection Audit
// -----------------------------------------------------------------------------
app.post('/api/gemini/hygiene-audit', async (req: Request, res: Response) => {
  try {
    const { image, areaType, facilityNotes } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Visual media (image or video frame) is required' });
    }

    const { mimeType, data } = await resolveImageInput(image);

    const promptText = `
You are a certified senior public health inspector and HACCP kitchen auditor for Food Verse AI.
Analyze this visual inspection capture of a commercial or domestic culinary kitchen environment.
Area inspected: ${areaType || 'Kitchen Workstation & Prep Area'}.
Notes: ${facilityNotes || 'Routine compliance audit'}.

Examine systematically:
1. Preparation surface cleanliness, grease residue, sanitizer availability, wiping cloth storage.
2. Food storage practices (raw meats separated from ready-to-eat foods, elevation off floor, covered containers, labeling).
3. Cross-contamination vulnerabilities (color-coded cutting boards, shared utensil risks, hand sink accessibility).
4. Structural and equipment hygiene (ventilation hood cleanliness, floor drains, pest risk indicators).
5. Personal hygiene & PPE visibility (gloves, hair coverings, handwashing compliance where visible).

Generate:
- Hygiene Grade: 'A (Exemplary 90-100)', 'B (Satisfactory with Minor Remediations 80-89)', 'C (Critical Deficiencies 70-79)', 'Hazard Notice (<70)'
- Overall Score (1 to 100)
- Surface Cleanliness Score (1 to 10)
- Cross-Contamination Risk Level ('Low', 'Moderate', 'Elevated', 'High Alert')
- Detailed list of specific findings categorized by FDA Food Code standards with concrete corrective actions.
- List of positive hygienic practices observed.
- Actionable supervisor checklist for immediate resolution.
`;

    const response = await generateWithRetry({
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data,
            },
          },
          { text: promptText },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            facilityArea: { type: Type.STRING },
            hygieneGrade: { type: Type.STRING },
            overallScore: { type: Type.INTEGER },
            surfaceCleanlinessRating: { type: Type.INTEGER },
            crossContaminationRisk: { type: Type.STRING },
            auditSummary: { type: Type.STRING },
            findings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING, description: 'Storage, Sanitation, Cross-Contamination, Equipment, PPE, Waste' },
                  severity: { type: Type.STRING, description: 'Low, Medium, High, or Critical' },
                  observation: { type: Type.STRING },
                  regulatoryCode: { type: Type.STRING, description: 'Referenced FDA / HACCP code or standard' },
                  correctiveAction: { type: Type.STRING, description: 'Exact corrective step required' },
                },
                required: ['category', 'severity', 'observation', 'correctiveAction'],
              },
            },
            positivePractices: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            supervisorActionPlan: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            complianceDisclaimer: { type: Type.STRING },
          },
          required: [
            'facilityArea',
            'hygieneGrade',
            'overallScore',
            'surfaceCleanlinessRating',
            'crossContaminationRisk',
            'findings',
            'positivePractices',
            'supervisorActionPlan',
            'complianceDisclaimer',
          ],
        },
      },
    });

    const parsedData = cleanJsonParse(response.text);
    return res.json({ success: true, data: parsedData });
  } catch (err: any) {
    console.error('Error in hygiene audit:', err);
    return res.status(500).json({
      error: err.message || 'Failed to complete hygiene audit',
    });
  }
});

// -----------------------------------------------------------------------------
// Module 4: Smart Cooking Assistant (Interactive Chef Chat)
// -----------------------------------------------------------------------------
app.post('/api/gemini/cooking-assistant', async (req: Request, res: Response) => {
  try {
    const { messages, ingredients, dietaryPreference, skillLevel, cookingTime } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Message history is required' });
    }

    const systemInstruction = `
You are Chef Verse, an inspiring Michelin-caliber culinary chef and smart cooking assistant for Food Verse AI.
Your expertise spans global cuisines, nutritional gastronomy, pantry-optimization cooking, and zero-waste techniques.

User cooking profile:
- Available Pantry Ingredients: ${ingredients || 'As mentioned in chat'}
- Dietary Preference: ${dietaryPreference || 'Flexible'}
- Culinary Skill Level: ${skillLevel || 'Intermediate'}
- Target Cooking Time: ${cookingTime || '30-45 minutes'}

Tone & Behavior:
- Warm, knowledgeable, encouraging, and highly practical.
- When the user asks for a recipe or recipe suggestions from ingredients, provide structured details:
  1. Recipe title and captivating flavor profile.
  2. Exact ingredient quantities (highlighting what they have vs smart substitutes).
  3. Clear prep time and cook time.
  4. Step-by-step numbered cooking instructions with pro chef tips (pan temperature, searing technique, seasoning balance).
  5. Estimated nutritional facts per serving (calories, protein, carbs, fats).
- Answer questions on substitutions, knife skills, food science (e.g. Maillard reaction, emulsification), and leftover storage.
`;

    // Format chat history for GoogleGenAI
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await generateWithRetry({
      contents,
      config: {
        systemInstruction,
      },
    });

    return res.json({
      success: true,
      message: response.text || 'I am ready to help you cook! What ingredients do you have today?',
    });
  } catch (err: any) {
    console.error('Error in cooking assistant:', err);
    return res.status(500).json({
      error: err.message || 'Failed to get cooking guidance',
    });
  }
});

// -----------------------------------------------------------------------------
// Module 5: Personalized Meal Planner
// -----------------------------------------------------------------------------
app.post('/api/gemini/meal-planner', async (req: Request, res: Response) => {
  try {
    const {
      dietaryPreferences,
      allergies,
      ageRange,
      fitnessGoal,
      targetCalories,
      planDuration,
      additionalNotes,
    } = req.body;

    const promptText = `
You are an elite sports nutritionist, registered dietitian, and meal planning architect for Food Verse AI.
Build a comprehensive, scientifically balanced meal plan.

User Profile:
- Dietary Preferences: ${Array.isArray(dietaryPreferences) ? dietaryPreferences.join(', ') : dietaryPreferences || 'Balanced Whole Foods'}
- Allergies & Intolerances: ${Array.isArray(allergies) && allergies.length > 0 ? allergies.join(', ') : 'None'}
- Age Range: ${ageRange || '25-35'}
- Fitness Goal: ${fitnessGoal || 'Muscle Gain & Metabolic Energy'}
- Calorie Target: ${targetCalories || 'Optimal for goal'}
- Plan Scope: ${planDuration || '7-Day Weekly Masterplan'}
- Additional Notes: ${additionalNotes || 'Focus on wholesome natural foods'}

Generate a structured plan including:
1. Macro Strategy Overview explaining how this plan hits their specific fitness goal.
2. Daily Macro Targets (Calories, Protein in grams, Carbs in grams, Fats in grams, Fiber in grams).
3. Days of meals: Provide 7 distinct days (Day 1 through Day 7). Each day must include:
   - Breakfast, Lunch, Dinner, and Afternoon/Post-Workout Snack.
   - For each meal: Dish Name, Key Ingredients, Preparation Time in minutes, and estimated Macros (Calories, Protein, Carbs, Fat).
4. Master Categorized Grocery Shopping List:
   - Produce, Lean Proteins, Pantry & Grains, Healthy Fats, Spices & Condiments.
5. Hydration & Meal Timing recommendations.
`;

    const response = await generateWithRetry({
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            planTitle: { type: Type.STRING },
            goalRationale: { type: Type.STRING, description: 'Scientific explanation of why this plan fits the user goal' },
            dailyTargetMacros: {
              type: Type.OBJECT,
              properties: {
                calories: { type: Type.NUMBER },
                proteinGrams: { type: Type.NUMBER },
                carbsGrams: { type: Type.NUMBER },
                fatsGrams: { type: Type.NUMBER },
                fiberGrams: { type: Type.NUMBER },
              },
              required: ['calories', 'proteinGrams', 'carbsGrams', 'fatsGrams'],
            },
            schedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dayNumber: { type: Type.INTEGER },
                  dayName: { type: Type.STRING, description: 'e.g. Day 1: High Energy Kickoff' },
                  totalDayCalories: { type: Type.NUMBER },
                  breakfast: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      ingredientsSummary: { type: Type.STRING },
                      prepMinutes: { type: Type.INTEGER },
                      calories: { type: Type.NUMBER },
                      proteinGrams: { type: Type.NUMBER },
                      carbsGrams: { type: Type.NUMBER },
                      fatsGrams: { type: Type.NUMBER },
                    },
                    required: ['title', 'ingredientsSummary', 'calories', 'proteinGrams'],
                  },
                  lunch: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      ingredientsSummary: { type: Type.STRING },
                      prepMinutes: { type: Type.INTEGER },
                      calories: { type: Type.NUMBER },
                      proteinGrams: { type: Type.NUMBER },
                      carbsGrams: { type: Type.NUMBER },
                      fatsGrams: { type: Type.NUMBER },
                    },
                    required: ['title', 'ingredientsSummary', 'calories', 'proteinGrams'],
                  },
                  dinner: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      ingredientsSummary: { type: Type.STRING },
                      prepMinutes: { type: Type.INTEGER },
                      calories: { type: Type.NUMBER },
                      proteinGrams: { type: Type.NUMBER },
                      carbsGrams: { type: Type.NUMBER },
                      fatsGrams: { type: Type.NUMBER },
                    },
                    required: ['title', 'ingredientsSummary', 'calories', 'proteinGrams'],
                  },
                  snack: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      ingredientsSummary: { type: Type.STRING },
                      prepMinutes: { type: Type.INTEGER },
                      calories: { type: Type.NUMBER },
                      proteinGrams: { type: Type.NUMBER },
                      carbsGrams: { type: Type.NUMBER },
                      fatsGrams: { type: Type.NUMBER },
                    },
                    required: ['title', 'ingredientsSummary', 'calories', 'proteinGrams'],
                  },
                },
                required: ['dayNumber', 'dayName', 'breakfast', 'lunch', 'dinner', 'snack'],
              },
            },
            groceryList: {
              type: Type.OBJECT,
              properties: {
                produce: { type: Type.ARRAY, items: { type: Type.STRING } },
                proteins: { type: Type.ARRAY, items: { type: Type.STRING } },
                grainsAndPantry: { type: Type.ARRAY, items: { type: Type.STRING } },
                dairyAndAlternates: { type: Type.ARRAY, items: { type: Type.STRING } },
                healthyFatsAndOils: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ['produce', 'proteins', 'grainsAndPantry'],
            },
            hydrationAndTimingTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['planTitle', 'goalRationale', 'dailyTargetMacros', 'schedule', 'groceryList'],
        },
      },
    });

    const parsedData = cleanJsonParse(response.text);
    return res.json({ success: true, data: parsedData });
  } catch (err: any) {
    console.error('Error in meal planner:', err);
    return res.status(500).json({
      error: err.message || 'Failed to generate personalized meal plan',
    });
  }
});

// -----------------------------------------------------------------------------
// Vite Middlewares in Dev Mode / Static Serving in Production
// -----------------------------------------------------------------------------
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    // Dynamic import to prevent bundling vite in production
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Food Verse AI Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Food Verse AI Server:', err);
});
