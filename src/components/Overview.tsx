import React, { useState } from 'react';
import { BusinessProfile, GoogleAccount } from '../types';
import { Sparkles, Building, Star, Phone, Globe, ShieldCheck, RefreshCw, KeyRound, AlertTriangle, LogOut } from 'lucide-react';

interface OverviewProps {
  profiles: BusinessProfile[];
  googleAccounts: GoogleAccount[];
  orgId: string;
  onConnectAccount: () => void;
  onDisconnectAccount: (id: string) => void;
  onDeleteProfile: (id: string) => void;
  onRefreshData: () => void;
  onAuditProfile: (profileId: string) => Promise<void>;
  auditingId: string | null;
}

export default function Overview({
  profiles,
  googleAccounts,
  orgId,
  onConnectAccount,
  onDisconnectAccount,
  onDeleteProfile,
  onRefreshData,
  onAuditProfile,
  auditingId,
}: OverviewProps) {
  const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);

  const activeAccount = googleAccounts.find(ga => ga.isConnected);
  const activeProfile = profiles[0];

  return (
    <div className="space-y-6">
      {/* Welcome Bar */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Sparkles size={120} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <span className="bg-blue-600/20 text-blue-400 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-blue-600/30">
            Tenant Isolated Workspace ({orgId})
          </span>
          <h1 className="text-2xl md:text-4xl font-black mt-4 tracking-tighter uppercase font-display">AI-Powered Local SEO Optimizer</h1>
          <p className="text-slate-400 mt-3 text-sm leading-relaxed">
            Automate daily Google Business Profile updates, reply to reviews with localized sentiment filters, and track your local map grids using our multi-agent pipeline.
          </p>
        </div>
      </div>

      {/* Integration Status & Profile Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Google OAuth Connection */}
        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-white uppercase tracking-tighter font-display">Google Integration</h2>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${activeAccount ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${activeAccount ? 'bg-green-400' : 'bg-rose-400 animate-ping'}`} />
                {activeAccount ? 'Authorized' : 'Disconnected'}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-6 font-sans">
              Connect your Google Workspace or My Business Console. We securely manage OAuth refresh tokens to maintain offline access for automated campaigns.
            </p>

            {activeAccount ? (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <KeyRound size={14} className="text-blue-500" />
                  <span className="text-xs font-bold text-slate-300 font-mono truncate">{activeAccount.email}</span>
                </div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                  Connected on {new Date(activeAccount.connectedAt).toLocaleDateString()}
                </div>
              </div>
            ) : (
              <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4 mb-4 flex gap-3">
                <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-300/80 leading-normal font-sans">
                  Connect your Google Account to automatically sync location insights, posts, and fetch real-time reviews.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4">
            {activeAccount ? (
              <button
                onClick={() => onDisconnectAccount(activeAccount.id)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-slate-800 hover:border-rose-500 hover:bg-rose-500/10 rounded-lg text-xs font-black uppercase tracking-widest text-slate-300 hover:text-rose-400 transition-colors cursor-pointer"
              >
                <LogOut size={14} />
                Disconnect Account
              </button>
            ) : (
              <button
                onClick={onConnectAccount}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.62-.24-1.12-.63-1.48-1.11z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign in with Google
              </button>
            )}
          </div>
        </div>

        {/* Right 2 Cols: My Businesses Locations */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-8 border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-white uppercase tracking-tighter font-display">Active Google Locations</h2>
            <button 
              onClick={onRefreshData}
              className="text-slate-500 hover:text-white transition p-2 rounded-lg hover:bg-slate-850 cursor-pointer"
              title="Refresh profiles"
            >
              <RefreshCw size={14} />
            </button>
          </div>

          <div className="space-y-4">
            {profiles.length === 0 ? (
              <div className="border border-dashed border-slate-800 rounded-2xl p-8 text-center flex flex-col items-center">
                <Building size={32} className="text-slate-600 mb-2" />
                <p className="text-xs text-slate-500">No Google Business Locations linked.</p>
                <p className="text-[10px] text-slate-600 mt-1 uppercase font-black tracking-widest font-mono">Connect your Google account above to auto-provision locations.</p>
              </div>
            ) : (
              profiles.map(p => (
                <div key={p.id} className="border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition duration-150 bg-slate-950/40">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-white text-base">{p.name}</span>
                        <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider font-mono">
                          {p.category}
                        </span>
                        <span className="bg-green-500/10 text-green-400 text-[10px] px-2 py-0.5 rounded-full font-black border border-green-500/20 uppercase tracking-wider flex items-center gap-1 font-mono">
                          <ShieldCheck size={10} /> Verified
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-slate-400">
                        <div className="flex items-center gap-2">
                          <Globe size={13} className="text-slate-600" />
                          <span className="truncate max-w-[200px]">{p.website}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={13} className="text-slate-600" />
                          <span>{p.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 md:col-span-2">
                          <Building size={13} className="text-slate-600 shrink-0" />
                          <span>{p.address}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-300 font-bold font-mono">
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                        <span>{p.rating} / 5</span>
                        <span className="text-slate-500 uppercase tracking-wider text-[10px]">({p.reviewCount} customer reviews)</span>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col gap-2 shrink-0 md:items-end">
                      <button
                        disabled={auditingId !== null}
                        onClick={() => onAuditProfile(p.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-black uppercase tracking-widest transition duration-150 cursor-pointer disabled:opacity-50 font-mono"
                      >
                        {auditingId === p.id ? (
                          <>
                            <RefreshCw size={12} className="animate-spin" />
                            Auditing...
                          </>
                        ) : (
                          <>
                            <Sparkles size={12} />
                            AI Audit Gaps
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => onDeleteProfile(p.id)}
                        className="px-3 py-1.5 text-xs font-bold text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                      >
                        Detach
                      </button>
                    </div>
                  </div>

                  {/* Audit recommendations preview panel */}
                  {p.auditRecommendations && (
                    <div className="mt-6 border-t border-slate-800 pt-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-black text-blue-400 flex items-center gap-1.5 uppercase tracking-widest font-mono">
                          <Sparkles size={13} className="text-blue-500 animate-pulse" />
                          GMB Local SEO Audit Report
                        </span>
                        <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider font-mono">
                          Last Audited: {new Date(p.lastAuditedAt || "").toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 max-h-64 overflow-y-auto text-xs text-slate-300 leading-relaxed font-sans space-y-2 whitespace-pre-line">
                        {p.auditRecommendations}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Brief Multi-Agent Architecture Summary */}
      <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 flex items-start gap-3">
        <Sparkles size={18} className="text-blue-500 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-400 leading-relaxed">
          <span className="font-black text-white uppercase tracking-wider text-[10px] mr-1">Local SEO Best Practice:</span> Regular postings of high-relevance posts, optimized categorizations, prompt review management response signals, and direct localized keyword integrations build authority in Google's local indexing algorithm.
        </div>
      </div>
    </div>
  );
}
