import React, { useState, useEffect } from 'react';
import { HistoryRecord, PageType } from '../types';
import { HistoryService } from '../services/historyService';
import { useAuth } from '../context/AuthContext';
import {
  History,
  Search,
  Filter,
  Trash2,
  Eye,
  ScanLine,
  Apple,
  ShieldAlert,
  ChefHat,
  CalendarCheck,
  Clock,
  Sparkles,
  X,
  Printer,
  ChevronRight,
  Database,
  CloudCheck,
} from 'lucide-react';

interface HistoryPageProps {
  onNavigate: (page: PageType) => void;
  selectedRecordFromDash?: HistoryRecord | null;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onNavigate, selectedRecordFromDash }) => {
  const { user } = useAuth();
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalRecord, setActiveModalRecord] = useState<HistoryRecord | null>(null);

  useEffect(() => {
    loadRecords();
  }, [user]);

  useEffect(() => {
    if (selectedRecordFromDash) {
      setActiveModalRecord(selectedRecordFromDash);
    }
  }, [selectedRecordFromDash]);

  const loadRecords = () => {
    const list = HistoryService.getRecords(user?.uid);
    setRecords(list);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    HistoryService.deleteRecord(id);
    loadRecords();
    if (activeModalRecord?.id === id) {
      setActiveModalRecord(null);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear your entire analysis history?')) {
      HistoryService.clearAll(user?.uid);
      loadRecords();
      setActiveModalRecord(null);
    }
  };

  const filteredRecords = records.filter((r) => {
    const matchesType = filterType === 'all' || r.type === filterType;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getModuleIcon = (type: string) => {
    switch (type) {
      case 'recognition':
        return <ScanLine className="w-4 h-4 text-lime-700" />;
      case 'freshness':
        return <Apple className="w-4 h-4 text-amber-700" />;
      case 'hygiene':
        return <ShieldAlert className="w-4 h-4 text-orange-700" />;
      case 'cooking':
        return <ChefHat className="w-4 h-4 text-emerald-800" />;
      case 'meal-planner':
        return <CalendarCheck className="w-4 h-4 text-teal-700" />;
      default:
        return <Sparkles className="w-4 h-4 text-slate-500" />;
    }
  };

  const getModuleBadgeColor = (type: string) => {
    switch (type) {
      case 'recognition':
        return 'bg-lime-100 text-lime-900 border-lime-200';
      case 'freshness':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'hygiene':
        return 'bg-orange-100 text-orange-900 border-orange-200';
      case 'cooking':
        return 'bg-emerald-100 text-emerald-950 border-emerald-200';
      case 'meal-planner':
        return 'bg-teal-100 text-teal-900 border-teal-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
            <History className="w-3.5 h-3.5" />
            <span>Audit Trail & Records</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0d3822] tracking-tight">
            Analysis & Intelligence History
          </h1>
          <p className="text-sm text-slate-500">
            Stored multimodal sessions with instant report recreation.
          </p>
        </div>

        {records.length > 0 && (
          <button
            onClick={handleClearAll}
            className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-xl border border-red-200 transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search records, dishes, or findings..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 transition"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { id: 'all', label: 'All Records' },
            { id: 'recognition', label: 'Nutrition' },
            { id: 'freshness', label: 'Freshness' },
            { id: 'hygiene', label: 'Hygiene' },
            { id: 'cooking', label: 'Recipes' },
            { id: 'meal-planner', label: 'Meal Plans' },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setFilterType(pill.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                filterType === pill.id
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Record Grid */}
      {filteredRecords.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecords.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveModalRecord(item)}
              className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group hover:-translate-y-1"
            >
              <div className="space-y-4">
                {/* Image or Icon preview */}
                <div className="relative rounded-2xl overflow-hidden aspect-16/9 bg-slate-100 border border-slate-200/80">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-slate-100 to-slate-200 text-slate-500">
                      {getModuleIcon(item.type)}
                    </div>
                  )}

                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${getModuleBadgeColor(
                        item.type
                      )}`}
                    >
                      {item.type}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              {/* Bottom Card Bar */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(item.timestamp).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                  })}{' '}
                  •{' '}
                  {new Date(item.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleDelete(item.id, e)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>View</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-16 border border-slate-200 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <History className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {records.length === 0 ? 'No History Records Yet' : 'No Records Match Filter'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {records.length === 0
              ? 'Run any of the five AI modules to automatically log and persist your multimodal results.'
              : 'Try clearing your search term or switching to "All Records".'}
          </p>
          {records.length === 0 && (
            <div className="pt-2">
              <button
                onClick={() => onNavigate('recognition')}
                className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-semibold hover:bg-emerald-900 transition"
              >
                Start First Food Analysis
              </button>
            </div>
          )}
        </div>
      )}

      {/* Full Modal Report Viewer */}
      {activeModalRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-[#0d3822] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-lime-400 text-emerald-950 font-bold">
                  {getModuleIcon(activeModalRecord.type)}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-lime-300">
                    Food Verse AI Intelligence Report
                  </span>
                  <h3 className="text-lg font-bold text-white line-clamp-1">
                    {activeModalRecord.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition"
                  title="Print Report"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveModalRecord(null)}
                  className="p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Scroll Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeModalRecord.imageUrl && (
                <div className="rounded-2xl overflow-hidden aspect-16/9 max-h-72 border border-slate-200">
                  <img
                    src={activeModalRecord.imageUrl}
                    alt={activeModalRecord.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* View Toggle */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Session Intelligence Report
                </span>
                <span className="text-[11px] text-slate-400">
                  {new Date(activeModalRecord.timestamp).toLocaleString()}
                </span>
              </div>

              {/* Formatted Content */}
              <div className="text-xs text-slate-700 leading-relaxed font-sans space-y-4">
                {typeof activeModalRecord.data === 'object' && 'recipe' in activeModalRecord.data ? (
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 whitespace-pre-wrap leading-relaxed">
                    {activeModalRecord.data.recipe}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Raw formatted json viewer with clean styling */}
                    <div className="p-4 bg-slate-900 text-emerald-300 rounded-2xl overflow-x-auto text-[11px] font-mono leading-relaxed shadow-inner">
                      <pre>{JSON.stringify(activeModalRecord.data, null, 2)}</pre>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Verified Session Record</span>
              <button
                onClick={() => setActiveModalRecord(null)}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
