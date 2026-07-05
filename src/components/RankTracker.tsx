import React, { useState } from 'react';
import { RankingGrid, BusinessProfile } from '../types';
import { Sparkles, MapPin, Target, Plus, Trash2, Shield, RefreshCw } from 'lucide-react';

interface RankTrackerProps {
  rankings: RankingGrid[];
  profiles: BusinessProfile[];
  onAddKeyword: (profileId: string, keyword: string) => void;
  onDeleteKeyword: (profileId: string, keyword: string) => void;
}

export default function RankTracker({
  rankings,
  profiles,
  onAddKeyword,
  onDeleteKeyword,
}: RankTrackerProps) {
  const [newKeyword, setNewKeyword] = useState("");
  const [selectedKeyword, setSelectedKeyword] = useState("");

  const activeProfile = profiles[0];

  // Get unique keywords
  const uniqueKeywords = Array.from(new Set(rankings.map(r => r.keyword)));

  // If selectedKeyword is empty but we have keywords, select the first
  const currentKeyword = selectedKeyword || uniqueKeywords[0] || "";

  const filteredGrids = rankings.filter(r => r.keyword === currentKeyword);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword) return;
    onAddKeyword(activeProfile?.id || "prof-1", newKeyword);
    setSelectedKeyword(newKeyword);
    setNewKeyword("");
  };

  const getRankColor = (rank: number) => {
    if (rank <= 3) return 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs shadow-emerald-500/25'; // green (3-pack)
    if (rank <= 9) return 'bg-amber-400 hover:bg-amber-500 text-slate-900 shadow-xs shadow-amber-400/25'; // amber (mid-rank)
    return 'bg-rose-500 hover:bg-rose-600 text-white shadow-xs shadow-rose-500/25'; // red (rankings leak)
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 rounded-3xl p-6 border border-slate-800">
        <div>
          <h2 className="text-lg font-black text-white uppercase tracking-tighter font-display">Geo-Grid Rank Tracker</h2>
          <p className="text-xs text-slate-400">Monitor your Map Pack visibility at custom localized coordinates around your office.</p>
        </div>

        {/* Add keyword form */}
        <form onSubmit={handleAddSubmit} className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            required
            placeholder="Add keyword, e.g. Dentist near me"
            className="text-xs bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2 w-full md:w-56 focus:ring-1 focus:ring-blue-600 focus:outline-none font-bold"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-black uppercase tracking-widest shrink-0 cursor-pointer transition"
          >
            Track Keyword
          </button>
        </form>
      </div>

      {/* Main split dashboard: Selector and grid */}
      {uniqueKeywords.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center">
          <Target size={36} className="text-slate-600 mb-4 animate-pulse" />
          <span className="text-xs font-black text-white uppercase tracking-wider block">No Keywords Tracked</span>
          <p className="text-[11px] text-slate-500 mt-2 max-w-sm uppercase font-black tracking-widest font-mono">
            Add a local keyword above to auto-provision a 3x3 coordinate map grid.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Panel: Selector and info */}
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="font-black text-white uppercase tracking-tighter text-xs font-display">Tracked local terms</h3>
            
            <div className="space-y-2">
              {uniqueKeywords.map((kw, i) => (
                <div 
                  key={i}
                  className={`flex items-center justify-between p-3 rounded-xl border transition ${
                    currentKeyword === kw ? 'bg-blue-950/20 border-blue-600 text-blue-400 font-bold' : 'border-slate-850 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <button
                    onClick={() => setSelectedKeyword(kw)}
                    className="flex-1 text-left text-xs truncate cursor-pointer font-bold"
                  >
                    {kw}
                  </button>
                  <button
                    onClick={() => onDeleteKeyword(activeProfile?.id || "prof-1", kw)}
                    className="p-1 text-slate-500 hover:text-rose-500 transition cursor-pointer"
                    title="Delete tracking term"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>

            {/* Local Rank explanation */}
            <div className="bg-slate-950 rounded-xl p-4 space-y-3 pt-4 border border-slate-850">
              <span className="text-[10px] font-black text-white uppercase tracking-widest font-mono block">Map Position Metrics</span>
              <div className="space-y-2.5 text-[10px] text-slate-400 leading-normal">
                <div className="flex items-start gap-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Rank #1-3 (Local 3-Pack)</strong>: Visible directly in main search matches. Fosters high conversions.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Rank #4-9 (Mid-Tier)</strong>: High potential. Tweak post schedules to push onto Google Page 1.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Rank #10+ (Out of view)</strong>: Requires local SEO optimization and competitor category audits.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Interactive Geo-Grid Map */}
          <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-6 border border-slate-800">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-blue-950 text-blue-400 flex items-center justify-center font-bold text-xs">
                  <MapPin size={12} />
                </div>
                <span className="text-xs font-bold text-slate-300">
                  Grid center: Bennett Dental, Sutter St SF
                </span>
              </div>
              
              <span className="text-[10px] bg-slate-950 text-slate-400 font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded border border-slate-850">
                Keyword: "{currentKeyword}"
              </span>
            </div>

            {/* Renders the grid block */}
            <div className="flex flex-col items-center justify-center py-6">
              <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-850/50 max-w-[280px] w-full">
                <div className="grid grid-cols-3 gap-4">
                  {/* Outer coordinate points */}
                  {[1, 2, 3].map(y => (
                    [1, 2, 3].map(x => {
                      const item = filteredGrids.find(g => g.gridX === x && g.gridY === y);
                      const rank = item ? item.rank : 15;

                      return (
                        <div 
                          key={`${x}-${y}`} 
                          className="flex flex-col items-center justify-center"
                        >
                          <div className={`h-14 w-14 rounded-2xl flex flex-col items-center justify-center font-black text-sm cursor-pointer transition transform hover:scale-105 ${getRankColor(rank)}`}>
                            <span>#{rank}</span>
                            <span className="text-[8px] opacity-75 font-normal">({x},{y})</span>
                          </div>
                        </div>
                      );
                    })
                  ))}
                </div>
              </div>

              <p className="text-[10px] text-slate-500 mt-4 leading-normal text-center max-w-sm uppercase font-black tracking-widest font-mono">
                Each node represents local consumer map rankings checked from coordinates spaced 1.0 km apart.
              </p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
