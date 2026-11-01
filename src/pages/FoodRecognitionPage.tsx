import React, { useState, useRef } from 'react';
import { FoodRecognitionResult } from '../types';
import { GeminiService } from '../services/geminiService';
import { HistoryService } from '../services/historyService';
import { useAuth } from '../context/AuthContext';
import { SAMPLE_FOOD_ITEMS } from '../data/sampleData';
import confetti from 'canvas-confetti';
import {
  Upload,
  Camera,
  ScanLine,
  Flame,
  Dumbbell,
  Wheat,
  Droplet,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  RefreshCw,
  Share2,
  ChevronRight,
  Info,
} from 'lucide-react';

export const FoodRecognitionPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(SAMPLE_FOOD_ITEMS[0].imageUrl);
  const [mealContext, setMealContext] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FoodRecognitionResult | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // File Upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Camera capture
  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError('Unable to access camera. Please upload an image file instead.');
      setIsCameraActive(false);
    }
  };

  const captureCamera = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setSelectedImage(dataUrl);
        setResult(null);
      }
      // Stop tracks
      const stream = videoRef.current.srcObject as MediaStream;
      stream?.getTracks().forEach((track) => track.stop());
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
    setIsCameraActive(false);
  };

  // Execute Gemini AI analysis
  const runAnalysis = async () => {
    if (!selectedImage) {
      setError('Please select or upload a food image first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await GeminiService.analyzeFoodNutrition(selectedImage, mealContext);
      setResult(data);

      // Save to history
      HistoryService.saveRecord({
        userId: user?.uid || 'guest-evaluator',
        type: 'recognition',
        title: data.foodName,
        subtitle: `${data.macronutrients.calories} kcal • ${data.macronutrients.proteinGrams}g protein • Health Score: ${data.healthScore}/100`,
        imageUrl: selectedImage,
        data,
      });

      // Fire celebratory confetti on high-score or successful decomposition
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {
        // ignore
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to complete multimodal analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-200/80 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-100 text-emerald-950 text-xs font-bold uppercase tracking-wider">
          <ScanLine className="w-3.5 h-3.5 text-lime-700" />
          <span>Multimodal Vision Module 1</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#0d3822] tracking-tight">
          Food Recognition & Nutrition Analysis
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          Upload any meal, recipe, or packaged plate. Google Gemini vision segments the visual ingredients, computes portion weights, estimates macronutrients (protein, carbs, fats, fiber, sugar), and predicts glycemic impact.
        </p>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Upload & Curated Samples */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              1. Input Food Visual
            </h2>

            {/* Media Upload Area */}
            <div className="space-y-4">
              {isCameraActive ? (
                <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-black">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-3">
                    <button
                      onClick={captureCamera}
                      className="px-4 py-2 bg-lime-400 text-emerald-950 text-xs font-bold rounded-xl shadow-lg hover:bg-lime-300"
                    >
                      Capture Snapshot
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-3 py-2 bg-white/20 text-white text-xs font-semibold rounded-xl hover:bg-white/30"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : selectedImage ? (
                <div className="relative rounded-2xl overflow-hidden aspect-4/3 border border-slate-200 shadow-inner group">
                  <img
                    src={selectedImage}
                    alt="Selected Food"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-2 bg-white text-slate-800 text-xs font-bold rounded-xl shadow-md hover:bg-slate-100"
                    >
                      Change File
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-emerald-600 rounded-2xl p-8 text-center cursor-pointer transition bg-slate-50/50 hover:bg-emerald-50/30"
                >
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">Click to upload food photo</p>
                  <p className="text-[11px] text-slate-400 mt-1">JPEG, PNG, WEBP (Max 20MB)</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Local File</span>
                </button>
                <button
                  onClick={startCamera}
                  className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Camera</span>
                </button>
              </div>
            </div>

            {/* Optional Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Dietary Context / Restaurant Notes (Optional)</span>
                <span className="text-[10px] text-slate-400 font-normal">e.g. dressing on side</span>
              </label>
              <input
                type="text"
                value={mealContext}
                onChange={(e) => setMealContext(e.target.value)}
                placeholder="e.g. Prepared with olive oil, no added salt, 1 regular bowl"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Run Button */}
            <button
              onClick={runAnalysis}
              disabled={loading || !selectedImage}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-800 to-[#0d3822] hover:from-emerald-700 hover:to-emerald-900 text-white text-xs font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-lime-400" />
                  <span>Decomposing Dish with Gemini Vision...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-lime-400" />
                  <span>Run Multimodal Nutrition Analysis</span>
                </>
              )}
            </button>
          </div>

          {/* Curated Sample Test Selector */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Or Select 1-Click Capstone Demo Photo:
              </h3>
              <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                Instant Test
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {SAMPLE_FOOD_ITEMS.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedImage(item.imageUrl);
                    setMealContext(item.promptNotes || '');
                    setResult(null);
                  }}
                  className={`cursor-pointer rounded-2xl overflow-hidden border p-2 transition-all ${
                    selectedImage === item.imageUrl
                      ? 'border-emerald-600 ring-2 ring-emerald-500/30 bg-emerald-50/30'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full aspect-4/3 object-cover rounded-xl mb-1.5"
                  />
                  <p className="text-[11px] font-bold text-slate-800 line-clamp-1">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Nutritional Decomposition Results */}
        <div className="lg:col-span-7 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Analysis Error</p>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto animate-pulse">
                <ScanLine className="w-8 h-8 text-emerald-700 animate-bounce" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Segmenting Visual Food Matrix...
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Gemini 3.8 Flash is identifying specific ingredients, calculating geometric portion volumes, estimating macronutrient density, and mapping glycemic response.
              </p>
            </div>
          )}

          {!loading && !result && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Ready for Visual Analysis
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Click <strong>"Run Multimodal Nutrition Analysis"</strong> on the left or select any sample dish to see deep nutritional decomposition.
              </p>
            </div>
          )}

          {!loading && result && (
            <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm space-y-6 animate-fadeIn">
              {/* Dish Title & Meta */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900">
                      {result.cuisine || 'Identified Dish'}
                    </span>
                    <span className="text-xs text-slate-400">
                      Confidence: {Math.round(result.confidenceScore * 100)}%
                    </span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-[#0d3822] mt-1">
                    {result.foodName}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Estimated Portion: <span className="font-semibold text-slate-800">{result.portionSize}</span>
                  </p>
                </div>

                {/* Health Score Gauge */}
                <div className="flex items-center gap-3 bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200/70 shrink-0">
                  <div className="w-12 h-12 rounded-full bg-emerald-800 text-lime-300 font-extrabold text-lg flex items-center justify-center shadow-inner">
                    {result.healthScore}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-900 tracking-wider">
                      Health Score
                    </span>
                    <p className="text-xs font-semibold text-emerald-800">
                      {result.healthScore >= 80 ? 'Nutrient Dense' : result.healthScore >= 60 ? 'Moderate Balance' : 'Indulgent'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary note */}
              <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 leading-relaxed">
                {result.healthSummary}
              </p>

              {/* Macronutrient Visual Grid */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Macronutrient Breakdown (Per Portion)
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Calories */}
                  <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100 text-center">
                    <div className="flex items-center justify-center text-orange-600 mb-1">
                      <Flame className="w-4 h-4" />
                    </div>
                    <span className="text-xl font-extrabold text-orange-950">
                      {result.macronutrients.calories}
                    </span>
                    <span className="block text-[10px] font-semibold text-orange-700 uppercase">
                      Calories (kcal)
                    </span>
                  </div>

                  {/* Protein */}
                  <div className="p-4 rounded-2xl bg-lime-50 border border-lime-100 text-center">
                    <div className="flex items-center justify-center text-lime-700 mb-1">
                      <Dumbbell className="w-4 h-4" />
                    </div>
                    <span className="text-xl font-extrabold text-lime-950">
                      {result.macronutrients.proteinGrams}g
                    </span>
                    <span className="block text-[10px] font-semibold text-lime-700 uppercase">
                      Protein
                    </span>
                  </div>

                  {/* Carbs */}
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-center">
                    <div className="flex items-center justify-center text-amber-600 mb-1">
                      <Wheat className="w-4 h-4" />
                    </div>
                    <span className="text-xl font-extrabold text-amber-950">
                      {result.macronutrients.carbsGrams}g
                    </span>
                    <span className="block text-[10px] font-semibold text-amber-700 uppercase">
                      Carbohydrates
                    </span>
                  </div>

                  {/* Fats */}
                  <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100 text-center">
                    <div className="flex items-center justify-center text-teal-600 mb-1">
                      <Droplet className="w-4 h-4" />
                    </div>
                    <span className="text-xl font-extrabold text-teal-950">
                      {result.macronutrients.fatsGrams}g
                    </span>
                    <span className="block text-[10px] font-semibold text-teal-700 uppercase">
                      Total Fats
                    </span>
                  </div>
                </div>

                {/* Sub-nutrients: Fiber, Sugar, Glycemic Index */}
                <div className="grid grid-cols-3 gap-3 pt-1">
                  <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-100">
                    <span className="text-xs font-bold text-slate-800">{result.macronutrients.fiberGrams}g</span>
                    <span className="block text-[10px] text-slate-500">Dietary Fiber</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-100">
                    <span className="text-xs font-bold text-slate-800">{result.macronutrients.sugarGrams}g</span>
                    <span className="block text-[10px] text-slate-500">Natural Sugars</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-100">
                    <span className="text-xs font-bold text-emerald-800">{result.glycemicIndex}</span>
                    <span className="block text-[10px] text-slate-500">Glycemic Index</span>
                  </div>
                </div>
              </div>

              {/* Ingredients & Allergens */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Identified Ingredients & Allergens
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 ${
                        ing.isAllergen
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span>{ing.name}</span>
                      {ing.portion && <span className="text-[10px] text-slate-400">({ing.portion})</span>}
                      {ing.isAllergen && (
                        <span className="text-[10px] font-bold text-red-600 bg-red-100/80 px-1.5 py-0.2 rounded">
                          {ing.allergenType || 'Allergen'}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dietary Tags */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Dietary Classifications
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {result.dietaryTags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-lime-50 text-emerald-900 border border-lime-200 rounded-lg text-xs font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actionable Dietitian Recommendations */}
              <div className="space-y-3 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Clinical & Culinary Recommendations</span>
                </h3>
                <ul className="space-y-1.5 text-xs text-emerald-900">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
