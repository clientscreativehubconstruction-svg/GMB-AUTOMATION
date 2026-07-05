import React, { useState } from 'react';
import { Sparkles, ToggleLeft, ToggleRight, Play, RefreshCw, Terminal, CheckCircle2, Shield, Settings, Zap } from 'lucide-react';

interface AutomationWorkflowsProps {
  pipelineRunning: boolean;
  onRunWeeklyPipeline: () => void;
  terminalLogs: string[];
  onClearLogs: () => void;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  triggerType: string;
  status: 'active' | 'inactive';
  icon: React.ComponentType<any>;
}

export default function AutomationWorkflows({
  pipelineRunning,
  onRunWeeklyPipeline,
  terminalLogs,
  onClearLogs
}: AutomationWorkflowsProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: 'wf-1',
      name: 'Auto-Reply Sentiment Trigger',
      description: 'Scans GMB review stream. Drafts or publishes AI replies instantly with custom customer sentiment tones.',
      triggerType: 'Event Triggered (New Review)',
      status: 'active',
      icon: Zap
    },
    {
      id: 'wf-2',
      name: 'Weekly AI Content Post Scheduler',
      description: 'Invokes Gemini AI Planner to compile high-relevance posts, creates visual mockups, and inserts into queue.',
      triggerType: 'Cron (Every Sunday 9:00 AM)',
      status: 'active',
      icon: Sparkles
    },
    {
      id: 'wf-3',
      name: 'Competitor Q&A Sync Agent',
      description: 'Parses nearby GMB competitor posts and customer questions to suggest strategic FAQs for your locations.',
      triggerType: 'Daily Sync',
      status: 'inactive',
      icon: Shield
    },
    {
      id: 'wf-4',
      name: 'Geo-Grid Rank Map Scanner',
      description: 'Triggers rank tracker grids on a coordinate system to monitor local indexing performance updates.',
      triggerType: 'Weekly (Monday 2:00 AM)',
      status: 'active',
      icon: Settings
    }
  ]);

  const handleToggleWorkflow = (id: string) => {
    setWorkflows(prev => prev.map(w => {
      if (w.id === id) {
        return { ...w, status: w.status === 'active' ? 'inactive' : 'active' };
      }
      return w;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter font-display">
            Automation Workflows
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Toggle automated AI routines, deploy EventBridge listeners, and check execution health.
          </p>
        </div>

        <button
          disabled={pipelineRunning}
          onClick={onRunWeeklyPipeline}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 text-white rounded-lg text-xs font-black uppercase tracking-widest transition duration-150 cursor-pointer font-mono"
        >
          {pipelineRunning ? (
            <>
              <RefreshCw size={12} className="animate-spin" />
              Executing Workflows...
            </>
          ) : (
            <>
              <Play size={12} />
              Manual Sync & Trigger
            </>
          )}
        </button>
      </div>

      {/* Grid: Toggles & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Workflows List - 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
            <h2 className="text-sm font-black text-white uppercase tracking-tighter mb-4 font-display flex items-center gap-2">
              <Zap size={14} className="text-blue-500" />
              Active Autonomous Routines
            </h2>

            <div className="space-y-3">
              {workflows.map(w => {
                const Icon = w.icon;
                const isActive = w.status === 'active';
                return (
                  <div 
                    key={w.id} 
                    className={`border rounded-2xl p-5 flex items-start justify-between gap-4 transition-colors ${
                      isActive ? 'border-blue-500/20 bg-blue-950/5' : 'border-slate-850 bg-slate-950/20'
                    }`}
                  >
                    <div className="flex gap-3 items-start">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-blue-600/10 text-blue-400' : 'bg-slate-800 text-slate-500'
                      }`}>
                        <Icon size={18} />
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-white uppercase tracking-tight">{w.name}</span>
                          <span className={`text-[8px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                            isActive ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-slate-800 text-slate-400 border-slate-750'
                          }`}>
                            {isActive ? 'ENABLED' : 'PAUSED'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                          {w.description}
                        </p>
                        <div className="text-[9px] font-black text-slate-500 font-mono uppercase tracking-wider">
                          Trigger: {w.triggerType}
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleToggleWorkflow(w.id)}
                      className="text-slate-500 hover:text-white transition cursor-pointer"
                    >
                      {isActive ? (
                        <ToggleRight size={28} className="text-blue-500" />
                      ) : (
                        <ToggleLeft size={28} className="text-slate-600" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Console / Log terminal (Sidebar style) */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 flex flex-col justify-between shadow-2xl">
          <div className="space-y-4 flex-1 flex flex-col h-full">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-xs font-black text-white uppercase tracking-tighter font-mono flex items-center gap-2">
                <Terminal size={12} className="text-slate-400" />
                Pipeline Console Log
              </h2>
              {terminalLogs.length > 0 && (
                <button 
                  onClick={onClearLogs}
                  className="text-[9px] font-bold text-slate-500 hover:text-white uppercase tracking-wider"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex-1 bg-slate-950/60 border border-slate-850 rounded-2xl p-4 font-mono text-[9px] text-slate-300 leading-relaxed space-y-2 h-72 overflow-y-auto scrollbar-thin">
              {terminalLogs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-1">
                  <Terminal size={18} />
                  <span>No executions logged in session.</span>
                  <span className="text-[8px] uppercase font-black tracking-wider text-slate-700">Trigger manual sync to build live logs.</span>
                </div>
              ) : (
                terminalLogs.map((log, i) => (
                  <div key={i} className="border-l border-slate-800 pl-2">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="border-t border-slate-850 pt-4 mt-4 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Service Status:</span>
              <span className="flex items-center gap-1 text-green-400 font-bold">
                <CheckCircle2 size={10} /> Active
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Cron Scheduler:</span>
              <span className="text-slate-200 font-bold">EventBridge Live</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
