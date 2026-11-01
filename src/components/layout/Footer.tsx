import React from 'react';
import { PageType } from '../../types';
import { UtensilsCrossed, Sparkles, Shield, Cpu, ExternalLink, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#072314] text-slate-300 border-t border-emerald-950 mt-20">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900/40 via-emerald-800/30 to-emerald-900/40 border-b border-emerald-800/40 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-emerald-200">
            <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse"></span>
            <span className="font-semibold">University Capstone Project:</span>
            <span className="text-slate-300">Generative AI with Google Cloud & Gemini Multimodal Intelligence</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-emerald-300/80">
            <span>Model: Gemini 3.8 Flash</span>
            <span>•</span>
            <span>Server-Side Secure Architecture</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-lime-400 text-emerald-950 flex items-center justify-center font-bold shadow-md shadow-lime-400/20">
                <UtensilsCrossed className="w-5 h-5 text-emerald-950" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                FOOD VERSE <span className="text-lime-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              An enterprise-grade multimodal food intelligence platform bridging computer vision, nutritional gastronomy, food spoilage detection, and kitchen regulatory compliance.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-md bg-emerald-900/80 border border-emerald-700/60 text-[11px] font-semibold text-lime-300">
                Google Cloud Run
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-900/80 border border-emerald-700/60 text-[11px] font-semibold text-lime-300">
                Firebase Firestore
              </span>
            </div>
          </div>

          {/* AI Modules Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-lime-400">
              Multimodal Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('recognition')}
                  className="hover:text-lime-300 transition-colors"
                >
                  Food Recognition & Nutrition
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('freshness')}
                  className="hover:text-lime-300 transition-colors"
                >
                  Perishable Freshness & Spoilage
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('hygiene')}
                  className="hover:text-lime-300 transition-colors"
                >
                  Commercial Hygiene Audit
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('cooking')}
                  className="hover:text-lime-300 transition-colors"
                >
                  Smart Cooking Assistant
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('meal-planner')}
                  className="hover:text-lime-300 transition-colors"
                >
                  Personalized Meal Planner
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-lime-400">
              Platform & Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-lime-300 transition-colors"
                >
                  User Dashboard & Metrics
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('history')}
                  className="hover:text-lime-300 transition-colors"
                >
                  Analysis & Report History
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('landing')}
                  className="hover:text-lime-300 transition-colors"
                >
                  Platform Architecture Overview
                </button>
              </li>
              <li>
                <span className="text-slate-400">HACCP & FDA Food Code Grounding</span>
              </li>
            </ul>
          </div>

          {/* Scientific Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Food Safety Disclaimer
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed bg-emerald-950/60 p-3 rounded-xl border border-emerald-900/50">
              Food Verse AI is an educational university research capstone project. Visual AI analysis estimates macronutrients, visible decay, and hygiene cues. It does not replace laboratory microbiological assays or certified public health inspections. Always verify food safety through certified standards.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Food Verse AI. All rights reserved. University Capstone Project.</p>
          <div className="flex items-center gap-2 text-emerald-400">
            <span>Built with Generative AI on Google Cloud</span>
            <Sparkles className="w-3.5 h-3.5 text-lime-400" />
          </div>
        </div>
      </div>
    </footer>
  );
};
