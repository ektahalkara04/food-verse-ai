export interface SampleItem {
  id: string;
  title: string;
  description: string;
  category?: string;
  imageUrl: string;
  promptNotes?: string;
}

export const SAMPLE_FOOD_ITEMS: SampleItem[] = [
  {
    id: 'food-salmon-bowl',
    title: 'Grilled Salmon Quinoa Bowl',
    description: 'Wild Atlantic salmon fillet on organic tri-color quinoa, avocado slices, steamed edamame, and sesame citrus dressing.',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    promptNotes: '1 standard bowl, rich in omega-3 fatty acids, high protein, moderate carbohydrates.',
  },
  {
    id: 'food-mediterranean-salad',
    title: 'Mediterranean Greek Salad',
    description: 'Crisp cucumbers, vine-ripened tomatoes, Kalamata olives, authentic block feta, red onion, and extra virgin olive oil.',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    promptNotes: 'Fresh low-glycemic Mediterranean salad with healthy monounsaturated fats.',
  },
  {
    id: 'food-acai-bowl',
    title: 'Superfood Berry Chia Bowl',
    description: 'Organic acai puree topped with fresh blueberries, sliced bananas, hemp hearts, chia seeds, and toasted granola.',
    imageUrl: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80',
    promptNotes: 'Antioxidant-dense breakfast bowl, natural fruit sugars, high dietary fiber.',
  },
  {
    id: 'food-steak-asparagus',
    title: 'Grass-Fed Sirloin & Roasted Greens',
    description: 'Pan-seared tender sirloin steak garnished with rosemary, charred asparagus spears, and baby roasted potatoes.',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    promptNotes: 'High-protein fitness meal with micronutrients and iron.',
  },
];

export const SAMPLE_FRESHNESS_ITEMS: SampleItem[] = [
  {
    id: 'fresh-strawberries',
    title: 'Fresh Garden Strawberries',
    description: 'Vibrant crimson berries, firm calyx, glossy skin, no fungal spores or leakage.',
    category: 'Fruit',
    imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80',
    promptNotes: 'Stored at 38°F in ventilated container. Peak harvest ripeness.',
  },
  {
    id: 'overripe-bananas',
    title: 'Bananas with Brown Sugar Spots',
    description: 'High ethylene conversion, yellow peel with prominent brown speckles, softened starch.',
    category: 'Fruit',
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80',
    promptNotes: 'Sweet stage, optimal for banana bread, smoothies, or freezing.',
  },
  {
    id: 'fresh-avocado',
    title: 'Hass Avocado Cross-Section',
    description: 'Creamy pale green pulp, no fibrous black vascular streaks or oxidation.',
    category: 'Fruit',
    imageUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80',
    promptNotes: 'Ripe and ready to eat within 24 hours.',
  },
  {
    id: 'fresh-salmon-cut',
    title: 'Wild Coho Salmon Cutlet',
    description: 'Bright coral flesh, translucent sheen, firm muscle striations, clear oceanic fresh scent.',
    category: 'Seafood',
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    promptNotes: 'Kept on crushed ice bed. Pristine sushi-grade freshness indicators.',
  },
];

export const SAMPLE_HYGIENE_ITEMS: SampleItem[] = [
  {
    id: 'kitchen-prep-clean',
    title: 'Stainless Steel Cold Prep Station',
    description: 'Commercial NSF stainless steel prep table with sanitized surfaces and enclosed refrigerated pans.',
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80',
    promptNotes: 'Main kitchen prep line during non-rush prep cycle.',
  },
  {
    id: 'kitchen-commercial-reachin',
    title: 'Walk-In Refrigeration & Storage Area',
    description: 'Multi-tier wire shelving with organized food bins and digital temperature monitoring display.',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    promptNotes: 'Cold storage compliance check for raw vs ready-to-eat separation.',
  },
  {
    id: 'kitchen-cookline',
    title: 'Commercial Range & Extraction Line',
    description: 'Commercial gas burner range, stainless splash guards, and overhead ventilation canopy.',
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
    promptNotes: 'Checking grease accumulation, flame hoods, and sanitation buckets.',
  },
];

export const QUICK_PANTRY_INGREDIENTS = [
  'Eggs',
  'Garlic',
  'Olive Oil',
  'Chicken Breast',
  'Spinach',
  'Tomatoes',
  'Avocado',
  'Brown Rice',
  'Greek Yogurt',
  'Lemon',
  'Onions',
  'Mushrooms',
  'Parmesan',
  'Bell Peppers',
  'Tofu',
  'Black Beans',
  'Sweet Potato',
  'Salmon',
];

export const SAMPLE_CHEF_STARTERS = [
  "I have 3 eggs, half an avocado, spinach, and garlic. What can I make in 15 minutes?",
  "Suggest a high-protein dinner using chicken breast, broccoli, and pantry seasonings.",
  "How do I achieve a restaurant-crispy sear on salmon without drying it out?",
  "What is a delicious low-carb vegetarian meal using tofu and seasonal greens?",
];
