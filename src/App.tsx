import React, { useState, useEffect } from 'react';
import { PageType, HistoryRecord } from './types';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AuthModal } from './components/common/AuthModal';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { FoodRecognitionPage } from './pages/FoodRecognitionPage';
import { FreshnessDetectionPage } from './pages/FreshnessDetectionPage';
import { HygieneMonitoringPage } from './pages/HygieneMonitoringPage';
import { CookingAssistantPage } from './pages/CookingAssistantPage';
import { MealPlannerPage } from './pages/MealPlannerPage';
import { HistoryPage } from './pages/HistoryPage';
import { HistoryService } from './services/historyService';
import { SAMPLE_FOOD_ITEMS, SAMPLE_FRESHNESS_ITEMS } from './data/sampleData';

export function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageType>('landing');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [selectedRecordForHistory, setSelectedRecordForHistory] = useState<HistoryRecord | null>(null);

  // Seed sample initial history on first mount if totally empty
  useEffect(() => {
    const existing = HistoryService.getRecords();
    if (existing.length === 0) {
      HistoryService.saveRecord({
        userId: 'capstone-evaluator-01',
        type: 'recognition',
        title: 'Salmon & Avocado Quinoa Power Bowl',
        subtitle: '540 kcal • 42g protein • Health Score: 94/100 • Low Glycemic Index',
        imageUrl: SAMPLE_FOOD_ITEMS[0].imageUrl,
        data: {
          foodName: 'Grilled Salmon Quinoa Bowl',
          confidenceScore: 0.98,
          cuisine: 'Pacific Rim / Healthy Fusion',
          portionSize: '340g single serving bowl',
          healthScore: 94,
          healthSummary: 'High-density nutrient profile rich in long-chain Omega-3 EPA/DHA fatty acids, whole complex carbs, and clean lean proteins.',
          glycemicIndex: 'Low',
          macronutrients: {
            calories: 540,
            proteinGrams: 42,
            carbsGrams: 38,
            fatsGrams: 22,
            fiberGrams: 8,
            sugarGrams: 4,
          },
          ingredients: [
            { name: 'Wild Atlantic Salmon', portion: '160g', isAllergen: true, allergenType: 'Fish' },
            { name: 'Tri-color Organic Quinoa', portion: '100g cooked', isAllergen: false },
            { name: 'Hass Avocado', portion: '50g', isAllergen: false },
            { name: 'Steamed Edamame', portion: '40g', isAllergen: true, allergenType: 'Soy' },
          ],
          dietaryTags: ['High Protein', 'Gluten-Free', 'Omega-3 Rich', 'Clean Whole Foods'],
          recommendations: [
            'Optimal post-workout recovery or midday sustained-energy lunch.',
            'Incorporate extra lemon zest or leafy greens to further boost vitamin C and iron absorption.',
          ],
        },
      });

      HistoryService.saveRecord({
        userId: 'capstone-evaluator-01',
        type: 'freshness',
        title: 'Garden Fresh Strawberries',
        subtitle: 'Status: Fresh & Peak Quality • Score: 96/100 • 4-5 days shelf life',
        imageUrl: SAMPLE_FRESHNESS_ITEMS[0].imageUrl,
        data: {
          itemName: 'Garden Strawberries',
          category: 'Fruit',
          freshnessStatus: 'Fresh & Peak Quality',
          freshnessScore: 96,
          shelfLifeEstimate: '4 to 5 days refrigerated at 36-38°F',
          visualIndicators: {
            discoloration: 'Vibrant glossy ruby red, zero oxidation, bright green calyx.',
            moldBacterialSigns: 'Zero visible fungal mycelium or spore colonies.',
            textureChanges: 'Turgid skin, firm seed-pocket texture, no collapse.',
            moistureLevels: 'Dry surface cuticle, no watery juice leakage.',
          },
          storageRecommendations: [
            'Store in ventilated container lined with paper towel.',
            'Do not wash until immediately prior to consumption to prevent moisture-induced fungal growth.',
          ],
          culinaryTips: ['Ideal for fresh salads, parfaits, or snacking.'],
          scientificDisclaimer: 'Visual inspection only. Wash thoroughly before eating.',
        },
      });
    }
  }, []);

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewRecordFromDash = (record: HistoryRecord) => {
    setSelectedRecordForHistory(record);
    setCurrentPage('history');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf9] text-slate-800 selection:bg-lime-200 selection:text-emerald-950 font-sans">
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      <main className="flex-1">
        {currentPage === 'landing' && (
          <LandingPage onNavigate={handleNavigate} onOpenAuth={() => setIsAuthModalOpen(true)} />
        )}
        {currentPage === 'dashboard' && (
          <DashboardPage onNavigate={handleNavigate} onViewRecord={handleViewRecordFromDash} />
        )}
        {currentPage === 'recognition' && <FoodRecognitionPage />}
        {currentPage === 'freshness' && <FreshnessDetectionPage />}
        {currentPage === 'hygiene' && <HygieneMonitoringPage />}
        {currentPage === 'cooking' && <CookingAssistantPage />}
        {currentPage === 'meal-planner' && <MealPlannerPage />}
        {currentPage === 'history' && (
          <HistoryPage
            onNavigate={handleNavigate}
            selectedRecordFromDash={selectedRecordForHistory}
          />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
