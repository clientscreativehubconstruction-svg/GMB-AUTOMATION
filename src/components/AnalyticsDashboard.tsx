import React, { useState } from 'react';
import { AnalyticsMetric, BusinessProfile } from '../types';
import { TrendingUp, BarChart2, Star, Eye, Phone, MousePointer, Navigation, Sparkles } from 'lucide-react';

interface AnalyticsDashboardProps {
  analytics: AnalyticsMetric[];
  profiles: BusinessProfile[];
}

export default function AnalyticsDashboard({ analytics, profiles }: AnalyticsDashboardProps) {
  const [metricTab, setMetricTab] = useState<'views' | 'calls' | 'clicks' | 'directions'>('views');

  const activeProfile = profiles[0];

  // Helper to calculate totals
  const totalViews = analytics.reduce((sum, item) => sum + item.views, 0);
  const totalCalls = analytics.reduce((sum, item) => sum + item.calls, 0);
  const totalClicks = analytics.reduce((sum, item) => sum + item.websiteClicks, 0);
  const totalDirections = analytics.reduce((sum, item) => sum + item.directionRequests, 0);

  // Get coordinates for beautiful SVG chart path
  const getChartCoordinates = (field: 'views' | 'calls' | 'websiteClicks' | 'directionRequests') => {
    if (analytics.length === 0) return { path: "", dots: [] };
    
    const width = 600;
    const height = 180;
    const padding = 20;

    const values = analytics.map(a => {
      if (field === 'views') return a.views;
      if (field === 'calls') return a.calls;
      if (field === 'websiteClicks') return a.websiteClicks;
      return a.directionRequests;
    });

    const maxVal = Math.max(...values, 10) * 1.1; // scale height
    const minVal = 0;

    const points = analytics.map((item, index) => {
      const x = padding + (index / (analytics.length - 1)) * (width - padding * 2);
      const val = field === 'views' ? item.views :
                  field === 'calls' ? item.calls :
                  field === 'websiteClicks' ? item.websiteClicks : item.directionRequests;
      const y = height - padding - ((val - minVal) / (maxVal - minVal)) * (height - padding * 2);
      return { x, y, value: val, date: item.date };
    });

    const path = points.reduce((acc, p, index) => {
      if (index === 0) return `M ${p.x} ${p.y}`;
      return `${acc} L ${p.x} ${p.y}`;
    }, "");

    return { path, dots: points };
  };

  const chartField = metricTab === 'views' ? 'views' :
                     metricTab === 'calls' ? 'calls' :
                     metricTab === 'clicks' ? 'websiteClicks' : 'directionRequests';

  const { path, dots } = getChartCoordinates(chartField);

  // Simulated target keywords
  const keywordsList = [
    { keyword: "Dentist Downtown SF", volume: "1,200/mo", rank: 2, trend: "up" },
    { keyword: "Cosmetic Dentist San Francisco", volume: "850/mo", rank: 3, trend: "flat" },
    { keyword: "Teeth Whitening San Francisco", volume: "640/mo", rank: 1, trend: "up" },
    { keyword: "Emergency Dentist SF", volume: "480/mo", rank: 5, trend: "down" },
    { keyword: "Invisalign Sutter St", volume: "320/mo", rank: 4, trend: "up" }
  ];

  return (
    <div className="space-y-6">
      
      {/* Stats Quick Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <button
          onClick={() => setMetricTab('views')}
          className={`bg-slate-900 rounded-2xl p-5 border text-left transition duration-150 cursor-pointer ${metricTab === 'views' ? 'border-blue-600 ring-2 ring-blue-600/20' : 'border-slate-800/80 hover:bg-slate-800/60'}`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-black tracking-widest uppercase font-mono">Profile Views</span>
            <Eye size={16} className="text-blue-400" />
          </div>
          <span className="text-2xl font-black text-white font-mono">{totalViews.toLocaleString()}</span>
          <span className="text-[9px] text-green-400 block mt-1 font-black uppercase tracking-wider font-mono">▲ +14.2%</span>
        </button>

        <button
          onClick={() => setMetricTab('clicks')}
          className={`bg-slate-900 rounded-2xl p-5 border text-left transition duration-150 cursor-pointer ${metricTab === 'clicks' ? 'border-blue-600 ring-2 ring-blue-600/20' : 'border-slate-800/80 hover:bg-slate-800/60'}`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-black tracking-widest uppercase font-mono">Website Clicks</span>
            <MousePointer size={16} className="text-blue-400" />
          </div>
          <span className="text-2xl font-black text-white font-mono">{totalClicks.toLocaleString()}</span>
          <span className="text-[9px] text-green-400 block mt-1 font-black uppercase tracking-wider font-mono">▲ +8.7%</span>
        </button>

        <button
          onClick={() => setMetricTab('calls')}
          className={`bg-slate-900 rounded-2xl p-5 border text-left transition duration-150 cursor-pointer ${metricTab === 'calls' ? 'border-blue-600 ring-2 ring-blue-600/20' : 'border-slate-800/80 hover:bg-slate-800/60'}`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-black tracking-widest uppercase font-mono">Direct Calls</span>
            <Phone size={16} className="text-green-400" />
          </div>
          <span className="text-2xl font-black text-white font-mono">{totalCalls.toLocaleString()}</span>
          <span className="text-[9px] text-green-400 block mt-1 font-black uppercase tracking-wider font-mono">▲ +24.0%</span>
        </button>

        <button
          onClick={() => setMetricTab('directions')}
          className={`bg-slate-900 rounded-2xl p-5 border text-left transition duration-150 cursor-pointer ${metricTab === 'directions' ? 'border-blue-600 ring-2 ring-blue-600/20' : 'border-slate-800/80 hover:bg-slate-800/60'}`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-black tracking-widest uppercase font-mono">Map Directions</span>
            <Navigation size={16} className="text-amber-400" />
          </div>
          <span className="text-2xl font-black text-white font-mono">{totalDirections.toLocaleString()}</span>
          <span className="text-[9px] text-green-400 block mt-1 font-black uppercase tracking-wider font-mono">▲ +12.3%</span>
        </button>

      </div>

      {/* Graphical Chart Panel */}
      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-black text-white uppercase tracking-tighter text-base font-display">
              Interaction Metrics over Time
            </h3>
            <p className="text-xs text-slate-400">
              GMB performance signals tracking customer conversions from June 28 to July 4, 2026.
            </p>
          </div>
          <span className="text-[10px] bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1 text-slate-400 font-mono font-black uppercase tracking-wider">
            Metric: <span className="text-blue-400 font-black font-mono">{metricTab}</span>
          </span>
        </div>

        {/* Visual Line Chart */}
        <div className="relative w-full overflow-x-auto">
          <svg viewBox="0 0 600 180" className="w-full min-w-[500px] h-[180px] overflow-visible">
            {/* Grid Lines */}
            <line x1="20" y1="20" x2="580" y2="20" stroke="#1e293b" strokeWidth="1" />
            <line x1="20" y1="65" x2="580" y2="65" stroke="#1e293b" strokeWidth="1" />
            <line x1="20" y1="110" x2="580" y2="110" stroke="#1e293b" strokeWidth="1" />
            <line x1="20" y1="160" x2="580" y2="160" stroke="#334155" strokeWidth="1.5" />

            {/* Path */}
            {path && (
              <path 
                d={path} 
                fill="none" 
                stroke={metricTab === 'views' ? '#3b82f6' : metricTab === 'clicks' ? '#60a5fa' : metricTab === 'calls' ? '#10b981' : '#f59e0b'} 
                strokeWidth="2.5" 
                strokeLinecap="round"
                className="animate-pulse"
              />
            )}

            {/* Dots with tooltip highlights */}
            {dots.map((d, i) => (
              <g key={i} className="group cursor-pointer">
                <circle 
                  cx={d.x} 
                  cy={d.y} 
                  r="4" 
                  fill="#ffffff" 
                  stroke={metricTab === 'views' ? '#3b82f6' : metricTab === 'clicks' ? '#60a5fa' : metricTab === 'calls' ? '#10b981' : '#f59e0b'} 
                  strokeWidth="2.5" 
                />
                <circle cx={d.x} cy={d.y} r="8" fill="transparent" className="hover:fill-blue-500/10" />
                <text 
                  x={d.x} 
                  y={d.y - 8} 
                  textAnchor="middle" 
                  className="hidden group-hover:block fill-white text-[11px] font-black font-mono"
                >
                  {d.value}
                </text>
                <text 
                  x={d.x} 
                  y="174" 
                  textAnchor="middle" 
                  className="fill-slate-500 text-[9px] font-black font-mono"
                >
                  {d.date.split('-')[2]}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Target Local Keywords Insights panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left col: Target Keywords positions */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
          <h3 className="font-black text-white uppercase tracking-tighter text-base font-display mb-4">
            Target Keywords Rankings
          </h3>

          <div className="space-y-3">
            {keywordsList.map((k, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-slate-850 pb-2">
                <span className="text-xs text-slate-300 font-bold">{k.keyword}</span>
                <div className="flex items-center gap-4 text-xs font-bold">
                  <span className="text-slate-500 text-[10px] font-mono">{k.volume}</span>
                  <span className={`h-5 w-5 rounded flex items-center justify-center text-[10px] font-black font-mono ${
                    k.rank <= 3 ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    #{k.rank}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right col: GMB query discoveries */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-base font-black text-white uppercase tracking-tighter font-display mb-3">
              <Sparkles size={16} className="text-blue-500 animate-pulse" />
              <span>GMB Search Query Discoveries</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Our AI analysis monitored active user search queries that returned your business card. We identified these emerging local services search intents:
            </p>

            <div className="space-y-3">
              <div className="bg-slate-950 border border-slate-850 rounded-lg p-3">
                <span className="font-black text-white text-xs block">"best emergency dentist Sutter St"</span>
                <p className="text-[10px] text-slate-500 mt-0.5">Capturing high commercial click intent. Add more emergency-related G&A posts.</p>
              </div>
              <div className="bg-slate-950 border border-slate-850 rounded-lg p-3">
                <span className="font-black text-white text-xs block">"painless cosmetic whitening clinic"</span>
                <p className="text-[10px] text-slate-500 mt-0.5">Recommended category expansion. Update services description meta tags.</p>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-blue-400 font-mono font-black uppercase tracking-widest pt-4">
            *Insights computed daily based on GMB API telemetry.
          </div>
        </div>

      </div>

    </div>
  );
}
