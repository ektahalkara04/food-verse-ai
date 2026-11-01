import React, { useState, useRef } from 'react';
import { HygieneAuditResult } from '../types';
import { GeminiService } from '../services/geminiService';
import { HistoryService } from '../services/historyService';
import { useAuth } from '../context/AuthContext';
import { SAMPLE_HYGIENE_ITEMS } from '../data/sampleData';
import {
  ShieldAlert,
  Upload,
  Video,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Printer,
  ClipboardList,
  ShieldCheck,
  CheckSquare,
  Square,
  AlertCircle,
} from 'lucide-react';

export const HygieneMonitoringPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedMedia, setSelectedMedia] = useState<string | null>(SAMPLE_HYGIENE_ITEMS[0].imageUrl);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [areaType, setAreaType] = useState<string>('Kitchen Workstation & Prep Counter');
  const [facilityNotes, setFacilityNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<HygieneAuditResult | null>(null);
  const [completedActions, setCompletedActions] = useState<Record<number, boolean>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const areas = [
    'Kitchen Workstation & Prep Counter',
    'Walk-in / Reach-in Refrigeration',
    'Hot Cookline & Fryer Line',
    'Dishwashing & Sanitization Area',
    'Dry Storage & Bulk Goods',
    'Handwashing & PPE Compliance Area',
  ];

  // Handle image or video upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setMediaType('video');
        const videoUrl = URL.createObjectURL(file);
        // Extract a frame from the video
        const tempVideo = document.createElement('video');
        tempVideo.src = videoUrl;
        tempVideo.muted = true;
        tempVideo.onloadedmetadata = () => {
          const seekTime = tempVideo.duration > 0 ? Math.min(1.0, tempVideo.duration / 2) : 0.1;
          tempVideo.currentTime = seekTime;
        };
        tempVideo.onerror = () => {
          setError('Unable to decode this video file in browser. Please upload an MP4 or image file.');
        };
        tempVideo.onseeked = () => {
          const canvas = document.createElement('canvas');
          canvas.width = tempVideo.videoWidth || 640;
          canvas.height = tempVideo.videoHeight || 480;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(tempVideo, 0, 0, canvas.width, canvas.height);
            setSelectedMedia(canvas.toDataURL('image/jpeg'));
            setResult(null);
            setError(null);
          }
        };
      } else {
        setMediaType('image');
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedMedia(reader.result as string);
          setResult(null);
          setError(null);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const runAudit = async () => {
    if (!selectedMedia) {
      setError('Please select or upload kitchen visual media.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await GeminiService.auditHygiene(selectedMedia, areaType, facilityNotes);
      setResult(data);
      setCompletedActions({});

      HistoryService.saveRecord({
        userId: user?.uid || 'guest-evaluator',
        type: 'hygiene',
        title: `${data.facilityArea} Audit`,
        subtitle: `Grade: ${data.hygieneGrade} • Score: ${data.overallScore}/100 • Cross-Contam: ${data.crossContaminationRisk}`,
        imageUrl: selectedMedia,
        data,
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to complete kitchen hygiene inspection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAction = (idx: number) => {
    setCompletedActions((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const getGradeBadge = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-emerald-100 text-emerald-950 border-emerald-300';
    if (grade.startsWith('B')) return 'bg-amber-100 text-amber-950 border-amber-300';
    if (grade.startsWith('C')) return 'bg-orange-100 text-orange-950 border-orange-300';
    return 'bg-red-100 text-red-950 border-red-300';
  };

  const getSeverityBadge = (sev: string) => {
    if (sev === 'Critical') return 'bg-red-100 text-red-700 border-red-200';
    if (sev === 'High') return 'bg-orange-100 text-orange-800 border-orange-200';
    if (sev === 'Medium') return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-200/80 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-950 text-xs font-bold uppercase tracking-wider">
          <ShieldAlert className="w-3.5 h-3.5 text-orange-700" />
          <span>Multimodal Vision Module 3</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#0d3822] tracking-tight">
          Restaurant Hygiene & Kitchen Safety Audit
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          Upload commercial kitchen photos or video recordings. Gemini multimodal computer vision examines food storage arrangements, surface cleanliness, grease accumulation, and cross-contamination hazards against FDA Food Code and HACCP benchmarks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Media & Parameters */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              1. Kitchen Visual Media
            </h2>

            {/* Media Upload Area */}
            <div className="space-y-4">
              {selectedMedia ? (
                <div className="relative rounded-2xl overflow-hidden aspect-4/3 border border-slate-200 shadow-inner group">
                  <img
                    src={selectedMedia}
                    alt="Kitchen Workstation"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-white text-slate-800 text-xs font-bold rounded-xl shadow-md hover:bg-slate-100"
                    >
                      Change Media
                    </button>
                  </div>
                  {mediaType === 'video' && (
                    <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] text-white flex items-center gap-1.5 font-semibold">
                      <Video className="w-3 h-3 text-orange-400" />
                      <span>Video Keyframe Sampled</span>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-orange-600 rounded-2xl p-8 text-center cursor-pointer transition bg-slate-50/50 hover:bg-orange-50/30"
                >
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">Click to upload kitchen photo or video</p>
                  <p className="text-[11px] text-slate-400 mt-1">JPEG, PNG, MP4, WEBM</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={handleFileChange}
              />

              <div className="flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition"
                >
                  <Video className="w-3.5 h-3.5 text-orange-600" />
                  <span>Upload Video Clip</span>
                </button>
              </div>
            </div>

            {/* Inspection Area */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Inspection Zone</label>
              <select
                value={areaType}
                onChange={(e) => setAreaType(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-600"
              >
                {areas.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            {/* Facility Context */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Operational Shift / Facility Notes</label>
              <input
                type="text"
                value={facilityNotes}
                onChange={(e) => setFacilityNotes(e.target.value)}
                placeholder="e.g. Mid-shift line inspection, pre-dinner rush"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
            </div>

            {/* Audit Button */}
            <button
              onClick={runAudit}
              disabled={loading || !selectedMedia}
              className="w-full py-3.5 bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-500 hover:to-red-600 text-white text-xs font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-lime-300" />
                  <span>Auditing HACCP Compliance with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-lime-300" />
                  <span>Run Kitchen Hygiene Audit</span>
                </>
              )}
            </button>
          </div>

          {/* Curated Sample Kitchen Selector */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Or Select 1-Click Commercial Sample:
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {SAMPLE_HYGIENE_ITEMS.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedMedia(item.imageUrl);
                    setMediaType('image');
                    setFacilityNotes(item.promptNotes || '');
                    setResult(null);
                  }}
                  className={`cursor-pointer rounded-2xl overflow-hidden border p-2 transition-all ${
                    selectedMedia === item.imageUrl
                      ? 'border-orange-600 ring-2 ring-orange-500/30 bg-orange-50/20'
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

        {/* Right Column: Audit Findings & Action Plan */}
        <div className="lg:col-span-7 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Audit Error</p>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-700 flex items-center justify-center mx-auto animate-pulse">
                <ShieldAlert className="w-8 h-8 text-orange-600 animate-bounce" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Evaluating HACCP Sanitation & Surface Cleanliness...
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Gemini 3.8 Flash is inspecting stainless steel tables, sanitizing wipe containers, food separation boundaries, reach-in storage heights, and personal protection protocols.
              </p>
            </div>
          )}

          {!loading && !result && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
                <ClipboardList className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Inspection Ready
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Upload a kitchen workstation photo/video or select a commercial sample to generate a regulatory compliance report.
              </p>
            </div>
          )}

          {!loading && result && (
            <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm space-y-6 animate-fadeIn">
              {/* Report Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                      {result.facilityArea}
                    </span>
                    <span
                      className={`px-3 py-0.5 rounded-full text-xs font-extrabold border ${getGradeBadge(
                        result.hygieneGrade
                      )}`}
                    >
                      {result.hygieneGrade}
                    </span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-[#0d3822] mt-1">
                    Hygiene Compliance Report
                  </h2>
                </div>

                {/* Overall Score */}
                <div className="flex items-center gap-3 bg-orange-50/70 p-3 rounded-2xl border border-orange-200/80 shrink-0">
                  <div className="w-12 h-12 rounded-full bg-orange-600 text-white font-extrabold text-lg flex items-center justify-center shadow-inner">
                    {result.overallScore}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-orange-950 tracking-wider">
                      Overall Rating
                    </span>
                    <p className="text-xs font-semibold text-orange-900">
                      Surface: {result.surfaceCleanlinessRating}/10
                    </p>
                  </div>
                </div>
              </div>

              {/* Cross Contamination Risk Alert Banner */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                  result.crossContaminationRisk === 'Low'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-orange-50 border-orange-200 text-orange-950'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Cross-Contamination Vulnerability
                    </span>
                    <p className="text-sm font-extrabold">{result.crossContaminationRisk} Risk</p>
                  </div>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg shadow-xs hover:bg-slate-50 flex items-center gap-1.5 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Report</span>
                </button>
              </div>

              {/* Summary */}
              <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 leading-relaxed">
                {result.auditSummary}
              </p>

              {/* Findings List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Detailed Findings & Corrective Mandates ({result.findings.length})
                </h3>

                <div className="space-y-2.5">
                  {result.findings.map((f, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getSeverityBadge(
                              f.severity
                            )}`}
                          >
                            {f.severity}
                          </span>
                          <span className="text-xs font-bold text-slate-800">{f.category}</span>
                        </div>
                        {f.regulatoryCode && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            {f.regulatoryCode}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600">{f.observation}</p>

                      <div className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-200/60 text-xs text-amber-950 flex items-start gap-2">
                        <span className="font-bold text-amber-800 shrink-0">Action:</span>
                        <span>{f.correctiveAction}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Positive Observations */}
              {result.positivePractices && result.positivePractices.length > 0 && (
                <div className="space-y-3 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                  <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Compliant Practices Verified</span>
                  </h3>
                  <ul className="space-y-1 text-xs text-emerald-900">
                    {result.positivePractices.map((pos, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{pos}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Supervisor Action Plan Interactive Checklist */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ClipboardList className="w-4 h-4 text-orange-600" />
                  <span>Immediate Supervisor Checklist</span>
                </h3>
                <div className="space-y-2">
                  {result.supervisorActionPlan.map((action, idx) => {
                    const isDone = Boolean(completedActions[idx]);
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleAction(idx)}
                        className={`p-2.5 rounded-xl border flex items-center gap-3 cursor-pointer transition ${
                          isDone
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-900 line-through'
                            : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                        }`}
                      >
                        {isDone ? (
                          <CheckSquare className="w-4 h-4 text-emerald-700 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span className="text-xs">{action}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-500 leading-relaxed italic border border-slate-200">
                {result.complianceDisclaimer}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
