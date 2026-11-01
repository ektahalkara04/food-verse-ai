import React from 'react';
import { PageType } from '../types';
import {
  ScanLine,
  Apple,
  ShieldAlert,
  ChefHat,
  CalendarCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Cpu,
  Layers,
  Database,
  ShieldCheck,
  Activity,
  Award,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: PageType) => void;
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenAuth }) => {
  const features = [
    {
      id: 'recognition' as PageType,
      title: 'Food Recognition & Nutrition Analysis',
      tagline: 'Instant Computer Vision Dietary Decomposition',
      description:
        'Upload any food photograph to automatically identify dish compositions, portion weights, detailed macronutrients (calories, protein, carbs, fats, fiber, sugar), glycemic impact, and allergen alerts.',
      icon: ScanLine,
      color: 'from-lime-500 to-emerald-600',
      badge: 'Multimodal Vision',
      stat: 'Macronutrient Accuracy',
    },
    {
      id: 'freshness' as PageType,
      title: 'Perishable Freshness & Spoilage AI',
      tagline: 'Visual Spoilage & Micro-Deterioration Detection',
      description:
        'Inspect produce, meats, seafood, and dairy. Gemini vision screens for surface discoloration, oxidation, fungal spore initiation, and textural wilting to recommend cold-chain storage and culinary rescue uses.',
      icon: Apple,
      color: 'from-amber-500 to-orange-600',
      badge: 'Zero-Waste AI',
      stat: 'Early Decay Cues',
    },
    {
      id: 'hygiene' as PageType,
      title: 'Commercial Restaurant Hygiene Audit',
      tagline: 'HACCP & FDA Food Code Computer Vision',
      description:
        'Upload kitchen workstation photos and video clips to monitor preparation surface cleanliness, food separation protocols, reach-in storage conditions, and cross-contamination hazards.',
      icon: ShieldAlert,
      color: 'from-orange-500 to-red-600',
      badge: 'Regulatory Compliance',
      stat: 'HACCP Mapped',
    },
    {
      id: 'cooking' as PageType,
      title: 'Smart Culinary Cooking Assistant',
      tagline: 'Interactive Michelin-Trained Chef Chatbot',
      description:
        'Conversational culinary agent that transforms available pantry ingredients into tailored recipes with exact measurements, cooking temperatures, timing steps, and nutritional estimates.',
      icon: ChefHat,
      color: 'from-emerald-500 to-teal-700',
      badge: 'Conversational LLM',
      stat: 'Zero-Waste Recipes',
    },
    {
      id: 'meal-planner' as PageType,
      title: 'Personalized Clinical Meal Planner',
      tagline: 'Goal-Aligned 7-Day Macro Masterplan',
      description:
        'Generate structured weekly nutritional plans based on age, allergies, metabolic preferences, and fitness goals (muscle gain, cutting, longevity) with complete categorized grocery checklists.',
      icon: CalendarCheck,
      color: 'from-teal-500 to-cyan-600',
      badge: 'Nutrition Engine',
      stat: '7-Day Schedules',
    },
  ];

  const capstonePillars = [
    {
      icon: Cpu,
      title: 'Google Gemini 3.8 Flash',
      desc: 'Multimodal reasoning across high-resolution food images, video frames, and structured dietary schemas.',
    },
    {
      icon: Database,
      title: 'Firebase & Firestore',
      desc: 'Real-time synchronization of dietary logs, hygiene audit trails, and meal history with rule-enforced security.',
    },
    {
      icon: Layers,
      title: 'Google Cloud Run',
      desc: 'Server-side microservice architecture ensuring zero client-side API key exposure and elastic scalability.',
    },
    {
      icon: ShieldCheck,
      title: 'Zero-Trust Safety Standards',
      desc: 'Hardened scientific guardrails and FDA Food Code grounding with non-hallucinatory JSON validation.',
    },
  ];

  return (
    <div className="space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#072314] via-[#0d3822] to-[#14532d] text-white pt-16 sm:pt-24 pb-20 sm:pb-32 px-4 sm:px-6 lg:px-8 rounded-b-[2.5rem] shadow-2xl">
        {/* Glow gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-700/80 text-xs font-semibold text-lime-300 shadow-inner">
                <Sparkles className="w-4 h-4 text-lime-400" />
                <span>Generative AI with Google Cloud Capstone Project</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12]">
                Multimodal AI-Powered{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-300 via-lime-400 to-emerald-200">
                  Food Intelligence
                </span>{' '}
                Platform
              </h1>

              <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl font-normal leading-relaxed">
                Harnessing Google Gemini multimodal computer vision to decompose complex dishes into macronutrients, detect perishable freshness and early spoilage, audit commercial kitchen hygiene, and generate goal-aligned nutrition schedules.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-lime-400 to-lime-500 hover:from-lime-300 hover:to-lime-400 text-emerald-950 font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-lime-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Explore Dashboard</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('recognition')}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm sm:text-base rounded-2xl transition backdrop-blur-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ScanLine className="w-4 h-4 text-lime-300" />
                  <span>Try Food Recognition</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-emerald-800/60 max-w-lg mx-auto lg:mx-0">
                <div>
                  <div className="text-2xl font-extrabold text-white">5 Modules</div>
                  <div className="text-[11px] text-emerald-300/80">Full Multimodal Suite</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-lime-400">Gemini 3.8</div>
                  <div className="text-[11px] text-emerald-300/80">State-of-the-Art Vision</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-orange-400">100% Real</div>
                  <div className="text-[11px] text-emerald-300/80">Live Multimodal API</div>
                </div>
              </div>
            </div>

            {/* Right Card Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 shadow-2xl space-y-4">
                {/* Image Preview with Floating Badges */}
                <div className="relative rounded-2xl overflow-hidden aspect-4/3 shadow-inner">
                  <img
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"
                    alt="Salmon Quinoa Bowl"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>

                  <div className="absolute top-3 left-3 bg-emerald-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-lime-300 border border-emerald-500/30 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping"></span>
                    AI Vision Active
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-left">
                    <h3 className="text-base font-bold text-white leading-tight">
                      Salmon & Avocado Quinoa Power Bowl
                    </h3>
                    <p className="text-xs text-slate-300">Portion: 340g • Health Density: 94/100</p>
                  </div>
                </div>

                {/* Macro pill summary */}
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-emerald-950/60 p-2 rounded-xl border border-emerald-800/40">
                    <span className="block text-xs font-bold text-lime-300">540</span>
                    <span className="text-[10px] text-slate-400">Calories</span>
                  </div>
                  <div className="bg-emerald-950/60 p-2 rounded-xl border border-emerald-800/40">
                    <span className="block text-xs font-bold text-white">42g</span>
                    <span className="text-[10px] text-slate-400">Protein</span>
                  </div>
                  <div className="bg-emerald-950/60 p-2 rounded-xl border border-emerald-800/40">
                    <span className="block text-xs font-bold text-white">38g</span>
                    <span className="text-[10px] text-slate-400">Carbs</span>
                  </div>
                  <div className="bg-emerald-950/60 p-2 rounded-xl border border-emerald-800/40">
                    <span className="block text-xs font-bold text-white">22g</span>
                    <span className="text-[10px] text-slate-400">Healthy Fat</span>
                  </div>
                </div>

                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-lime-400" />
                    <span className="text-emerald-100 font-medium">Glycemic Index: Low</span>
                  </div>
                  <span className="text-lime-300 font-bold">Omega-3 Rich</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capstone Architecture Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            Enterprise Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0d3822] tracking-tight">
            Built for Google Cloud Capstone Excellence
          </h2>
          <p className="text-sm text-slate-600">
            A secure full-stack platform leveraging server-side Google GenAI SDK integration with zero client API exposure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {capstonePillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow group space-y-3"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-800 group-hover:text-lime-300 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900">{p.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Five Core AI Modules Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="px-3 py-1 rounded-full bg-lime-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
            Multimodal Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0d3822] tracking-tight">
            Five Purpose-Built Food Intelligence Modules
          </h2>
          <p className="text-sm text-slate-600">
            Every module connects to live Gemini 3.8 Flash multimodal vision and reasoning endpoints with specialized structured outputs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.color} text-white flex items-center justify-center shadow-md`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                      {feat.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-700 mt-0.5">{feat.tagline}</p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{feat.description}</p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400">{feat.stat}</span>
                  <button
                    onClick={() => onNavigate(feat.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Launch Module</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Quick Start Card */}
          <div className="bg-gradient-to-br from-[#0d3822] to-[#14532d] text-white rounded-3xl p-7 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-lime-400 text-emerald-950 flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Ready to Inspect Your First Meal?</h3>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                Experience real-time visual nutritional decomposition, spoilage index screening, or kitchen hygiene audits with 1-click sample images.
              </p>
            </div>

            <div className="pt-6">
              <button
                onClick={() => onNavigate('dashboard')}
                className="w-full py-3 bg-lime-400 hover:bg-lime-300 text-emerald-950 font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Capstone Evaluation Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-950 via-[#0d3822] to-emerald-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-lime-500/10 to-transparent pointer-events-none"></div>

          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="flex items-center gap-2 text-lime-400 text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>University Capstone Demonstration</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Designed for Immediate Evaluator Verification
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Every module comes loaded with both drag-and-drop custom file uploaders and curated high-resolution test scenarios so professors, judges, and reviewers can test live multimodal inference with zero friction.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('recognition')}
                className="px-5 py-2.5 bg-lime-400 hover:bg-lime-300 text-emerald-950 text-xs font-bold rounded-xl transition"
              >
                Test Food Recognition
              </button>
              <button
                onClick={() => onNavigate('hygiene')}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold rounded-xl transition"
              >
                Inspect Commercial Kitchen
              </button>
              <button
                onClick={() => onNavigate('freshness')}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold rounded-xl transition"
              >
                Detect Spoilage
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
