import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { GeminiService } from '../services/geminiService';
import { HistoryService } from '../services/historyService';
import { useAuth } from '../context/AuthContext';
import { QUICK_PANTRY_INGREDIENTS, SAMPLE_CHEF_STARTERS } from '../data/sampleData';
import {
  ChefHat,
  Send,
  Sparkles,
  Flame,
  Clock,
  Dumbbell,
  BookOpen,
  Bookmark,
  RefreshCw,
  Plus,
  X,
  MessageSquare,
  Bot,
  User,
  CheckCircle2,
} from 'lucide-react';

function parseBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

const FormattedChatMessage: React.FC<{ content: string; isChef: boolean }> = ({ content, isChef }) => {
  if (!isChef) {
    return <div className="text-xs leading-relaxed whitespace-pre-wrap">{content}</div>;
  }

  const lines = content.split('\n');
  return (
    <div className="text-xs leading-relaxed space-y-1.5 font-sans">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1"></div>;
        }

        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="text-xs font-bold text-emerald-950 uppercase tracking-wide pt-1">
              {trimmed.replace('### ', '')}
            </h4>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={idx} className="text-sm font-extrabold text-[#0d3822] pt-1.5 border-b border-emerald-100 pb-0.5">
              {trimmed.replace('## ', '')}
            </h3>
          );
        }

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const itemText = trimmed.substring(2);
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1">
              <span className="text-emerald-700 font-bold shrink-0">•</span>
              <span>{parseBold(itemText)}</span>
            </div>
          );
        }

        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {numMatch[1]}
              </span>
              <span>{parseBold(numMatch[2])}</span>
            </div>
          );
        }

        return <p key={idx}>{parseBold(line)}</p>;
      })}
    </div>
  );
};

export const CookingAssistantPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content:
        "Bonjour! I am **Chef Verse**, your interactive multimodal culinary architect. Tell me what ingredients you have in your fridge or pantry, or select from the quick pantry chips below, and I will craft an unforgettable Michelin-level recipe with exact steps and nutritional estimates!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(['Eggs', 'Garlic', 'Spinach', 'Olive Oil']);
  const [dietaryPref, setDietaryPref] = useState<string>('High Protein');
  const [cookingTime, setCookingTime] = useState<string>('20-30 mins');
  const [loading, setLoading] = useState<boolean>(false);
  const [savedRecipesCount, setSavedRecipesCount] = useState<number>(0);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const addIngredient = (item: string) => {
    if (!selectedIngredients.includes(item)) {
      setSelectedIngredients([...selectedIngredients, item]);
    }
  };

  const removeIngredient = (item: string) => {
    setSelectedIngredients(selectedIngredients.filter((i) => i !== item));
  };

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim() && selectedIngredients.length === 0) return;

    const userPrompt = textToSend.trim() || `Please create a gourmet recipe using: ${selectedIngredients.join(', ')}. Target time: ${cookingTime}, Style: ${dietaryPref}.`;

    const newMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      role: 'user',
      content: userPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setInputMessage('');
    setLoading(true);

    try {
      const chefResponse = await GeminiService.askCookingAssistant(updatedMessages, {
        ingredients: selectedIngredients.join(', '),
        dietaryPreference: dietaryPref,
        cookingTime,
      });

      const assistantMsg: ChatMessage = {
        id: 'ast_' + Date.now(),
        role: 'assistant',
        content: chefResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: 'err_' + Date.now(),
        role: 'assistant',
        content: `Chef's note: I encountered a brief pause connecting to the recipe kitchen (${err.message || 'Error'}). Please try sending your question once more!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecipe = (content: string) => {
    HistoryService.saveRecord({
      userId: user?.uid || 'guest-evaluator',
      type: 'cooking',
      title: 'Chef Verse Culinary Creation',
      subtitle: `Ingredients: ${selectedIngredients.slice(0, 3).join(', ')}... • ${dietaryPref}`,
      data: { recipe: content },
    });
    setSavedRecipesCount((prev) => prev + 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-200/80 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 text-xs font-bold uppercase tracking-wider">
          <ChefHat className="w-3.5 h-3.5 text-emerald-800" />
          <span>Multimodal Intelligence Module 4</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#0d3822] tracking-tight">
          Smart Cooking Assistant (Chef Verse)
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          Interactive Michelin-trained AI chef powered by Gemini 3.8 Flash. Share your pantry items to generate zero-waste gourmet recipes, precise measurements, knife techniques, and nutritional breakdowns.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Pantry & Recipe Customizer */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Pantry Basket */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                My Pantry Basket ({selectedIngredients.length})
              </h2>
              <button
                onClick={() => setSelectedIngredients([])}
                className="text-[11px] text-slate-400 hover:text-red-600 transition"
              >
                Clear all
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 min-h-12 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              {selectedIngredients.length > 0 ? (
                selectedIngredients.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-emerald-800 text-white shadow-xs"
                  >
                    <span>{item}</span>
                    <button
                      onClick={() => removeIngredient(item)}
                      className="hover:text-red-300 transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">
                  Select ingredients below to populate your basket...
                </span>
              )}
            </div>

            {/* Quick-Pick Pantry Chips */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Quick-Add Pantry Staples</label>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                {QUICK_PANTRY_INGREDIENTS.map((item) => {
                  const isSelected = selectedIngredients.includes(item);
                  return (
                    <button
                      key={item}
                      onClick={() => (isSelected ? removeIngredient(item) : addIngredient(item))}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                        isSelected
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cooking Constraints */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Dietary Focus</label>
                <select
                  value={dietaryPref}
                  onChange={(e) => setDietaryPref(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                >
                  <option value="High Protein">High Protein</option>
                  <option value="Mediterranean">Mediterranean</option>
                  <option value="Keto / Low Carb">Keto / Low Carb</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Plant-Based / Vegan">Plant-Based / Vegan</option>
                  <option value="Gluten-Free">Gluten-Free</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Target Time</label>
                <select
                  value={cookingTime}
                  onChange={(e) => setCookingTime(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                >
                  <option value="15-20 mins (Quick)">15-20 mins (Quick)</option>
                  <option value="30-40 mins (Standard)">30-40 mins (Standard)</option>
                  <option value="45+ mins (Slow Gourmet)">45+ mins (Gourmet)</option>
                </select>
              </div>
            </div>

            {/* Create Recipe Button */}
            <button
              onClick={() => handleSend()}
              disabled={loading || selectedIngredients.length === 0}
              className="w-full py-3 bg-gradient-to-r from-emerald-800 to-[#0d3822] hover:from-emerald-700 hover:to-emerald-900 text-white text-xs font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-lime-400" />
                  <span>Chef Verse is Crafting Recipe...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-lime-400" />
                  <span>Generate Gourmet Recipe</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Questions Starter Cards */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Sample Chef Inquiries
            </h3>
            <div className="space-y-2">
              {SAMPLE_CHEF_STARTERS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200/80 text-xs text-slate-700 hover:text-emerald-950 transition flex items-center justify-between group"
                >
                  <span className="line-clamp-2">{prompt}</span>
                  <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-800 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Conversational Chat Stream */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col h-[700px] overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 px-6 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-800 to-[#0d3822] text-lime-400 flex items-center justify-center font-bold shadow-md">
                  <ChefHat className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>Chef Verse</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-lime-100 text-emerald-950 font-semibold">
                      Gemini 3.8 Flash
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500">Live Culinary Intelligence & Recipe Generation</p>
                </div>
              </div>

              {savedRecipesCount > 0 && (
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  {savedRecipesCount} Saved
                </span>
              )}
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {messages.map((msg) => {
                const isChef = msg.role === 'assistant';
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3.5 ${isChef ? 'justify-start' : 'justify-end'}`}
                  >
                    {isChef && (
                      <div className="w-8 h-8 rounded-xl bg-emerald-800 text-lime-400 flex items-center justify-center shrink-0 mt-1 shadow-xs">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-4.5 space-y-2 ${
                        isChef
                          ? 'bg-slate-50/90 text-slate-800 border border-slate-200/80'
                          : 'bg-emerald-800 text-white shadow-sm'
                      }`}
                    >
                      <FormattedChatMessage content={msg.content} isChef={isChef} />

                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/40 text-[10px] text-slate-400">
                        <span>{msg.timestamp}</span>
                        {isChef && msg.id !== 'welcome-msg' && (
                          <button
                            onClick={() => handleSaveRecipe(msg.content)}
                            className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 transition"
                          >
                            <Bookmark className="w-3 h-3" />
                            <span>Save to History</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {!isChef && (
                      <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-1">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {loading && (
                <div className="flex gap-3.5 items-start">
                  <div className="w-8 h-8 rounded-xl bg-emerald-800 text-lime-400 flex items-center justify-center shrink-0 mt-1">
                    <ChefHat className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
                    <span>Chef Verse is composing step-by-step instructions & calculating macro profiles...</span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Message Input Bar */}
            <div className="p-4 border-t border-slate-100 bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask a cooking question or specify ingredients (e.g. How to sear salmon without sticking?)..."
                  className="flex-1 text-xs py-3 px-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 transition"
                />
                <button
                  type="submit"
                  disabled={loading || (!inputMessage.trim() && selectedIngredients.length === 0)}
                  className="p-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl shadow-sm disabled:opacity-40 transition flex items-center justify-center"
                >
                  <Send className="w-4 h-4 text-lime-300" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
