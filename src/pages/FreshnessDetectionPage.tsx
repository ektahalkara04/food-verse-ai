import React, { useState, useRef } from 'react';
import { FreshnessDetectionResult } from '../types';
import { GeminiService } from '../services/geminiService';
import { HistoryService } from '../services/historyService';
import { useAuth } from '../context/AuthContext';
import { SAMPLE_FRESHNESS_ITEMS } from '../data/sampleData';
import {
  Apple,
  Upload,
  RefreshCw,
  Sparkles,
  AlertTriangle,
  ShieldAlert,
  ThermometerSnowflake,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Recycle,
} from 'lucide-react';

export const FreshnessDetectionPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(SAMPLE_FRESHNESS_ITEMS[0].imageUrl);
  const [foodCategory, setFoodCategory] = useState<string>('Fruit');
  const [storageNotes, setStorageNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FreshnessDetectionResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['Fruit', 'Vegetable', 'Meat & Poultry', 'Seafood & Fish', 'Dairy', 'Bakery'];

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

  const runFreshnessInspection = async () => {
    if (!selectedImage) {
      setError('Please select or upload a food item photo.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await GeminiService.detectFreshness(selectedImage, foodCategory, storageNotes);
      setResult(data);

      HistoryService.saveRecord({
        userId: user?.uid || 'guest-evaluator',
        type: 'freshness',
        title: `${data.itemName} (${data.category})`,
        subtitle: `Status: ${data.freshnessStatus} • Score: ${data.freshnessScore}/100 • ${data.shelfLifeEstimate}`,
        imageUrl: selectedImage,
        data,
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to analyze food freshness. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    if (status.includes('Fresh') || status.includes('Peak')) return 'bg-lime-100 text-lime-900 border-lime-300';
    if (status.includes('Good') || status.includes('Soon')) return 'bg-amber-100 text-amber-900 border-amber-300';
    if (status.includes('Marginal') || status.includes('Deterioration')) return 'bg-orange-100 text-orange-950 border-orange-300';
    return 'bg-red-100 text-red-900 border-red-300';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-200/80 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-bold uppercase tracking-wider">
          <Apple className="w-3.5 h-3.5 text-amber-700" />
          <span>Multimodal Vision Module 2</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#0d3822] tracking-tight">
          Food Freshness & Spoilage Detection
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          Inspect fruit, vegetable, meat, seafood, and dairy images. Gemini multimodal vision evaluates discoloration, oxidation, mold-like spores, wilting, and moisture pooling to estimate remaining shelf-life.
        </p>
      </div>

      {/* Critical Medical/Safety Disclaimer */}
      <div className="p-4 bg-amber-50/80 border border-amber-300/80 rounded-2xl flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-amber-950 uppercase tracking-wide">
            Capstone Food Safety Disclaimer
          </p>
          <p className="text-xs text-amber-900 leading-relaxed">
            This module provides <strong>visual quality assessments only</strong>. Microbial pathogens (e.g. Salmonella, Listeria, E. coli, Clostridium botulinum) and chemical toxins are frequently invisible to cameras. <strong>Never consume perishable items that smell off, feel unusually slimy, or have experienced temperature abuse, even if they look acceptable.</strong>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Upload & Categories */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              1. Upload Perishable Item
            </h2>

            {/* Media Upload */}
            <div className="space-y-4">
              {selectedImage ? (
                <div className="relative rounded-2xl overflow-hidden aspect-4/3 border border-slate-200 shadow-inner group">
                  <img
                    src={selectedImage}
                    alt="Perishable"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-white text-slate-800 text-xs font-bold rounded-xl shadow-md hover:bg-slate-100"
                    >
                      Choose Different Photo
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-amber-600 rounded-2xl p-8 text-center cursor-pointer transition bg-slate-50/50 hover:bg-amber-50/30"
                >
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">Click to upload produce or meat photo</p>
                  <p className="text-[11px] text-slate-400 mt-1">JPEG, PNG, WEBP</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload From Device</span>
              </button>
            </div>

            {/* Category Pills */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Food Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFoodCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      foodCategory === cat
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Storage Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Storage Environment & Days Stored</label>
              <input
                type="text"
                value={storageNotes}
                onChange={(e) => setStorageNotes(e.target.value)}
                placeholder="e.g. In crisper drawer for 4 days at 38°F"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>

            {/* Inspect Button */}
            <button
              onClick={runFreshnessInspection}
              disabled={loading || !selectedImage}
              className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600 text-white text-xs font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-lime-300" />
                  <span>Scanning Spoilage Indicators with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-lime-300" />
                  <span>Analyze Freshness & Spoilage</span>
                </>
              )}
            </button>
          </div>

          {/* Sample Selector */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Or Select 1-Click Freshness Test Sample:
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {SAMPLE_FRESHNESS_ITEMS.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedImage(item.imageUrl);
                    setFoodCategory(item.category || 'Fruit');
                    setStorageNotes(item.promptNotes || '');
                    setResult(null);
                  }}
                  className={`cursor-pointer rounded-2xl overflow-hidden border p-2 transition-all ${
                    selectedImage === item.imageUrl
                      ? 'border-amber-600 ring-2 ring-amber-500/30 bg-amber-50/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full aspect-4/3 object-cover rounded-xl mb-1.5"
                  />
                  <p className="text-[11px] font-bold text-slate-800 line-clamp-1">{item.title}</p>
                  <p className="text-[10px] text-slate-400">{item.category}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Freshness Assessment Results */}
        <div className="lg:col-span-7 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Inspection Error</p>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto animate-pulse">
                <Apple className="w-8 h-8 text-amber-600 animate-bounce" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Examining Micro-Morphology & Discoloration...
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Gemini 3.8 Flash is scanning surface pixel gradients for oxidation, enzymatic browning, mycelial structures, moisture syneresis, and cell wall degradation.
              </p>
            </div>
          )}

          {!loading && !result && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Freshness Scanner Ready
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Select an image on the left and run the inspection to evaluate visible spoilage markers and storage life.
              </p>
            </div>
          )}

          {!loading && result && (
            <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm space-y-6 animate-fadeIn">
              {/* Header result */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                      {result.category}
                    </span>
                    <span
                      className={`px-3 py-0.5 rounded-full text-xs font-extrabold border ${getStatusColor(
                        result.freshnessStatus
                      )}`}
                    >
                      {result.freshnessStatus}
                    </span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-[#0d3822] mt-1">
                    {result.itemName}
                  </h2>
                </div>

                {/* Freshness Score */}
                <div className="flex items-center gap-3 bg-amber-50/70 p-3 rounded-2xl border border-amber-200/80 shrink-0">
                  <div className="w-12 h-12 rounded-full bg-amber-600 text-white font-extrabold text-lg flex items-center justify-center shadow-inner">
                    {result.freshnessScore}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-950 tracking-wider">
                      Freshness Score
                    </span>
                    <p className="text-xs font-semibold text-amber-900">
                      {result.freshnessScore >= 80 ? 'Optimal Quality' : result.freshnessScore >= 50 ? 'Consume Promptly' : 'High Deterioration'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Shelf-Life Countdown Badge */}
              <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-800 text-lime-300 rounded-xl">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-950 uppercase tracking-wider">
                      Estimated Remaining Shelf Life
                    </span>
                    <p className="text-sm font-extrabold text-emerald-900">
                      {result.shelfLifeEstimate}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-emerald-800 font-semibold bg-emerald-100 px-3 py-1 rounded-lg">
                  Refrigerated Conditions
                </span>
              </div>

              {/* Four Visual Spoilage Indicators */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Visual Spoilage & Deterioration Diagnostics
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Discoloration */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>Discoloration & Oxidation</span>
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {result.visualIndicators.discoloration}
                    </p>
                  </div>

                  {/* Mold / Bacterial */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>Mold & Bacterial Signs</span>
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {result.visualIndicators.moldBacterialSigns}
                    </p>
                  </div>

                  {/* Texture */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>Texture, Bruising & Wilting</span>
                      <span className="w-2 h-2 rounded-full bg-lime-600"></span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {result.visualIndicators.textureChanges}
                    </p>
                  </div>

                  {/* Moisture */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>Moisture & Surface Fluid</span>
                      <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {result.visualIndicators.moistureLevels}
                    </p>
                  </div>
                </div>
              </div>

              {/* Storage Recommendations */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ThermometerSnowflake className="w-4 h-4 text-emerald-700" />
                  <span>Cold Chain & Storage Protocols</span>
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {result.storageRecommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-700 font-bold">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Zero-Waste Culinary Salvage Tips */}
              {result.culinaryTips && result.culinaryTips.length > 0 && (
                <div className="space-y-3 bg-lime-50/60 p-4 rounded-2xl border border-lime-200/80">
                  <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Recycle className="w-4 h-4 text-emerald-700" />
                    <span>Zero-Waste Culinary Rescue Ideas</span>
                  </h3>
                  <ul className="space-y-1.5 text-xs text-emerald-950">
                    {result.culinaryTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-lime-700 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Scientific Disclaimer Note */}
              <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-500 leading-relaxed italic border border-slate-200">
                {result.scientificDisclaimer}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
