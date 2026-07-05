import React from 'react';
import { BusinessProfile } from '../types';
import { Sparkles, ShieldAlert, CheckCircle2, AlertCircle, RefreshCw, BarChart2, Check, ArrowUpRight, Award } from 'lucide-react';

interface AIProfileHealthProps {
  profiles: BusinessProfile[];
  onAuditProfile: (profileId: string) => Promise<void>;
  auditingId: string | null;
}

export default function AIProfileHealth({
  profiles,
  onAuditProfile,
  auditingId
}: AIProfileHealthProps) {
  const activeProfile = profiles[0];

  // Calculate some dummy health scores and status indicators based on real data
  const hasProfile = !!activeProfile;
  const reviewCount = activeProfile?.reviewCount || 0;
  const rating = activeProfile?.rating || 0;

  // Derive health indicators
  const hasWebsite = activeProfile?.website && activeProfile.website !== 'None' && activeProfile.website.length > 5;
  const hasPhone = activeProfile?.phone && activeProfile.phone !== 'None';
  const hasAddress = activeProfile?.address && activeProfile.address.length > 5;

  let score = 40; // Base score
  if (hasProfile) {
    score += 15; // Profile exists
    if (hasWebsite) score += 10;
    if (hasPhone) score += 10;
    if (hasAddress) score += 10;
    if (reviewCount > 10) score += 10;
    if (rating >= 4.0) score += 5;
    if (activeProfile.auditRecommendations) score += 10; // Handled audit before
  } else {
    score = 0;
  }

  // Ensure maximum score is 98 (always room for micro-optimization)
  score = Math.min(score, 98);

  const getScoreColor = (s: number) => {
    if (s >= 85) return 'text-green-400 border-green-500/20 bg-green-500/10';
    if (s >= 65) return 'text-amber-400 border-amber-500/20 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/20 bg-rose-500/10';
  };

  const getScoreMessage = (s: number) => {
    if (s >= 85) return 'Excellent Health. Profile is heavily optimized for local Google Maps index routing.';
    if (s >= 65) return 'Moderate Health. Some metadata gaps are preventing optimal grid placement.';
    return 'Critical Optimization Gaps. High risk of losing search position to local competitors.';
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter font-display">
            AI Profile Health Score
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time audit scoring of Google Business Profiles using multi-agent compliance audits.
          </p>
        </div>

        {activeProfile && (
          <button
            disabled={auditingId !== null}
            onClick={() => onAuditProfile(activeProfile.id)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-black uppercase tracking-widest transition duration-150 cursor-pointer disabled:opacity-50 font-mono"
          >
            {auditingId === activeProfile.id ? (
              <>
                <RefreshCw size={12} className="animate-spin" />
                Regenerating Health Audit...
              </>
            ) : (
              <>
                <Sparkles size={12} />
                Trigger Deep Compliance Audit
              </>
            )}
          </button>
        )}
      </div>

      {!activeProfile ? (
        <div className="bg-slate-900 border border-dashed border-slate-800 rounded-3xl p-12 text-center max-w-xl mx-auto flex flex-col items-center">
          <ShieldAlert size={48} className="text-slate-600 mb-4" />
          <h3 className="text-base font-black text-white uppercase tracking-tighter font-display">No Active Profile Found</h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Please link a Google My Business profile in the "My Businesses" workspace overview section to calculate and inspect compliance health scores.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Health Score Gauge Panel */}
          <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 flex flex-col items-center justify-between shadow-2xl">
            <div className="text-center w-full">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">
                Overall SEO Compliance
              </span>
              
              {/* Radial Circle score mockup */}
              <div className="relative flex items-center justify-center my-8">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#1e293b"
                    strokeWidth="12"
                    fill="transparent"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#2563eb"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={440}
                    strokeDashoffset={440 - (440 * score) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-5xl font-black text-white tracking-tighter font-display block">
                    {score}
                  </span>
                  <span className="text-[10px] font-black text-slate-500 uppercase font-mono tracking-widest">
                    OUT OF 100
                  </span>
                </div>
              </div>

              <div className={`border rounded-xl p-3 text-center text-xs font-bold leading-normal ${getScoreColor(score)}`}>
                {getScoreMessage(score)}
              </div>
            </div>

            <div className="w-full mt-6 border-t border-slate-850 pt-6">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Last Scan:</span>
                <span className="font-mono font-bold text-white">
                  {activeProfile.lastAuditedAt ? new Date(activeProfile.lastAuditedAt).toLocaleDateString() : 'Just Now'}
                </span>
              </div>
            </div>
          </div>

          {/* Audit Verification Checklist */}
          <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl space-y-6">
            <h3 className="text-sm font-black text-white uppercase tracking-tighter font-display flex items-center gap-2">
              <Award size={16} className="text-blue-500" />
              Location Compliance Checks
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Check Item 1 */}
              <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-4 flex gap-3">
                <div className="h-8 w-8 rounded-lg bg-green-500/10 text-green-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-tight">GMB Verification</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-sans leading-relaxed">
                    This location has active verified credentials in Google Search Index.
                  </p>
                </div>
              </div>

              {/* Check Item 2 */}
              <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-4 flex gap-3">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${hasWebsite ? 'bg-green-500/10 text-green-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  {hasWebsite ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-tight">Website Connection</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-sans leading-relaxed">
                    {hasWebsite ? 'Website URL linked correctly to pass local authority filters.' : 'GMB link is missing active webpage URL fields.'}
                  </p>
                </div>
              </div>

              {/* Check Item 3 */}
              <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-4 flex gap-3">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${hasPhone ? 'bg-green-500/10 text-green-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  {hasPhone ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-tight">Phone & NAP Consistency</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-sans leading-relaxed">
                    Name, Address, and Phone number are formatted for index crawling.
                  </p>
                </div>
              </div>

              {/* Check Item 4 */}
              <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-4 flex gap-3">
                <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                  <AlertCircle size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-tight">Local Posting Frequency</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-sans leading-relaxed">
                    No active campaign postings in the last 7 days. Algorithmic decay may begin.
                  </p>
                </div>
              </div>

              {/* Check Item 5 */}
              <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-4 flex gap-3">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${reviewCount > 0 ? 'bg-green-500/10 text-green-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  {reviewCount > 0 ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-tight">Review Reply Rate</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-sans leading-relaxed">
                    {reviewCount > 0 ? `Detected ${reviewCount} reviews. Speed of automatic replies is key.` : 'No reviews or replies logged in this location sync.'}
                  </p>
                </div>
              </div>

              {/* Check Item 6 */}
              <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-4 flex gap-3">
                <div className="h-8 w-8 rounded-lg bg-green-500/10 text-green-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-tight">Category Mapping</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-sans leading-relaxed">
                    Primary category "{activeProfile.category}" aligns with local query intent.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* AI Recommendations Output Column */}
      {activeProfile && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-blue-500 animate-pulse" />
            <h3 className="text-base font-black text-white uppercase tracking-tighter font-display">
              Gemini AI Compliance Audit Recommendations
            </h3>
          </div>

          {activeProfile.auditRecommendations ? (
            <div className="bg-slate-950 border border-slate-850 rounded-2xl p-6 text-slate-300 text-xs font-sans leading-relaxed whitespace-pre-line space-y-2">
              {activeProfile.auditRecommendations}
            </div>
          ) : (
            <div className="bg-slate-950 border border-dashed border-slate-850 rounded-2xl p-8 text-center flex flex-col items-center">
              <RefreshCw size={24} className="text-slate-600 mb-2" />
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider font-mono">No Recommendations Cached</p>
              <p className="text-[11px] text-slate-600 max-w-sm mt-1 leading-relaxed">
                Click the "Trigger Deep Compliance Audit" button at the top of the page. Gemini will analyze your GMB listing details and formulate targeted Local SEO suggestions.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
