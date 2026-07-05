import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, MessageSquare, TrendingUp, HelpCircle, Layers, Star, Compass, Check } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
}

export default function LandingPage({ onLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Visual background ambient grids */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(37,99,235,0.08),transparent_40%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(79,70,229,0.06),transparent_40%)] pointer-events-none" />

      {/* Header / Navbar */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white text-lg tracking-tighter">
              G
            </div>
            <span className="text-xl font-black tracking-tighter uppercase font-display text-white">
              BizAuto.ai
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-400">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#solutions" className="hover:text-white transition">Multi-Tenant Solutions</a>
            <a href="#pricing" className="hover:text-white transition">Pricing Plans</a>
          </div>

          <button
            onClick={onLogin}
            className="inline-flex items-center gap-2 px-4.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 cursor-pointer"
          >
            Launch Platform
            <ArrowRight size={13} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-20 text-center space-y-8">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] px-3.5 py-1.5 rounded-full font-black uppercase tracking-widest">
          <Sparkles size={11} className="animate-pulse" />
          Multi-Agent Google Business Profile Automation
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight uppercase font-display text-white max-w-4xl mx-auto leading-[0.95]">
          Automate Your Local <span className="text-blue-500">Google SEO</span> Rankings
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-sans font-medium">
          The ultimate multi-tenant local SEO management suite. Link client Google accounts via OAuth, sync locations, generate scheduled AI campaigns with Imagen, auto-respond to reviews, and track local maps grids.
        </p>

        {/* Google OAuth Login Button */}
        <div className="pt-4 flex flex-col items-center justify-center gap-4">
          <button
            onClick={onLogin}
            className="inline-flex items-center gap-3 px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-900 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-widest transition-all shadow-xl hover:scale-[1.02] cursor-pointer"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.62-.24-1.12-.63-1.48-1.11z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign in with Google OAuth
          </button>
          
          <div className="flex items-center gap-6 text-[10px] text-slate-500 font-black uppercase tracking-widest font-mono">
            <span className="flex items-center gap-1">
              <ShieldCheck size={12} className="text-emerald-500" />
              Multi-Tenant Isolated
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Zap size={12} className="text-blue-500" />
              Real-Time Workflows
            </span>
          </div>
        </div>

        {/* Dashboard Preview Frame Mock */}
        <div className="pt-12 max-w-5xl mx-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-3 shadow-2xl relative">
            <div className="h-6 w-full flex items-center gap-1.5 px-3 mb-3 shrink-0">
              <span className="h-2 w-2 rounded-full bg-rose-500/80" />
              <span className="h-2 w-2 rounded-full bg-amber-500/80" />
              <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
              <span className="text-[9px] font-mono text-slate-500 ml-2">https://app.bizauto.ai/dashboard</span>
            </div>
            
            {/* Visual mockup screen */}
            <div className="bg-slate-950 rounded-2xl aspect-[16/9] overflow-hidden flex border border-slate-850">
              {/* Fake navigation menu */}
              <div className="w-1/5 bg-slate-950 border-r border-slate-900 p-3 flex flex-col justify-between text-left">
                <div className="space-y-4">
                  <div className="h-3 w-3/4 bg-slate-800 rounded" />
                  <div className="space-y-2 pt-4">
                    <div className="h-2 w-full bg-blue-600 rounded" />
                    <div className="h-2 w-5/6 bg-slate-900 rounded" />
                    <div className="h-2 w-4/5 bg-slate-900 rounded" />
                    <div className="h-2 w-5/6 bg-slate-900 rounded" />
                  </div>
                </div>
                <div className="h-8 bg-slate-900 rounded-lg p-2" />
              </div>
              
              {/* Fake central cards panel */}
              <div className="flex-1 bg-slate-950 p-6 space-y-6 text-left">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="h-4 w-40 bg-slate-800 rounded" />
                    <div className="h-2 w-64 bg-slate-900 rounded" />
                  </div>
                  <div className="h-6 w-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="h-32 bg-slate-900 rounded-2xl border border-slate-850 p-4 space-y-3">
                    <div className="h-2 w-12 bg-slate-800 rounded" />
                    <div className="h-8 w-16 bg-slate-800 rounded-lg" />
                    <div className="h-2 w-20 bg-blue-500/20 rounded" />
                  </div>
                  <div className="h-32 bg-slate-900 rounded-2xl border border-slate-850 p-4 space-y-3">
                    <div className="h-2 w-16 bg-slate-800 rounded" />
                    <div className="h-8 w-10 bg-slate-800 rounded-lg" />
                    <div className="h-2 w-24 bg-green-500/20 rounded" />
                  </div>
                  <div className="h-32 bg-slate-900 rounded-2xl border border-slate-850 p-4 space-y-3">
                    <div className="h-2 w-10 bg-slate-800 rounded" />
                    <div className="h-8 w-12 bg-slate-800 rounded-lg" />
                    <div className="h-2 w-16 bg-amber-500/20 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features section */}
      <section id="features" className="border-t border-slate-900 py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter font-display">
              Autonomous Local Marketing Features
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Everything required to monitor locations, publish content, sync rankings, and optimize conversion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="bg-slate-900/50 border border-slate-900 rounded-3xl p-8 hover:border-slate-800 transition duration-150 space-y-4">
              <div className="h-10 w-10 bg-blue-600/10 text-blue-400 rounded-2xl flex items-center justify-center shrink-0">
                <Sparkles size={18} />
              </div>
              <h3 className="text-base font-black text-white uppercase tracking-tight">AI Profile Health Audit</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Automatically run deep compliance audits of individual Google My Business locations using Gemini AI agents to highlight optimization opportunities.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900/50 border border-slate-900 rounded-3xl p-8 hover:border-slate-800 transition duration-150 space-y-4">
              <div className="h-10 w-10 bg-blue-600/10 text-blue-400 rounded-2xl flex items-center justify-center shrink-0">
                <MessageSquare size={18} />
              </div>
              <h3 className="text-base font-black text-white uppercase tracking-tight">Localized Review Responder</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Analyze review sentiment instantly. Respond in multiple specialized tones (Professional, Friendly, Casual) to boost location engagement scores.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900/50 border border-slate-900 rounded-3xl p-8 hover:border-slate-800 transition duration-150 space-y-4">
              <div className="h-10 w-10 bg-blue-600/10 text-blue-400 rounded-2xl flex items-center justify-center shrink-0">
                <Layers size={18} />
              </div>
              <h3 className="text-base font-black text-white uppercase tracking-tight">AI Content Factory</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Create structured local posts, choose call-to-action triggers, and scheduled queues complete with Imagen AI concept mockup images.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-900/50 border border-slate-900 rounded-3xl p-8 hover:border-slate-800 transition duration-150 space-y-4">
              <div className="h-10 w-10 bg-blue-600/10 text-blue-400 rounded-2xl flex items-center justify-center shrink-0">
                <Compass size={18} />
              </div>
              <h3 className="text-base font-black text-white uppercase tracking-tight">3x3 Geo-Grid Rank Mapper</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Visualize how client locations rank in adjacent physical coordinates. Monitor map packs and route authority factors directly.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-900/50 border border-slate-900 rounded-3xl p-8 hover:border-slate-800 transition duration-150 space-y-4">
              <div className="h-10 w-10 bg-blue-600/10 text-blue-400 rounded-2xl flex items-center justify-center shrink-0">
                <TrendingUp size={18} />
              </div>
              <h3 className="text-base font-black text-white uppercase tracking-tight">Competitor Intelligence</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Compare location review ratings, count density, website metrics, and discover localized FAQ gaps compared to active business rivals.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-900/50 border border-slate-900 rounded-3xl p-8 hover:border-slate-800 transition duration-150 space-y-4">
              <div className="h-10 w-10 bg-blue-600/10 text-blue-400 rounded-2xl flex items-center justify-center shrink-0">
                <Zap size={18} />
              </div>
              <h3 className="text-base font-black text-white uppercase tracking-tight">Automation Workflows</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Rely on our EventBridge background schedulers. Trigger weekly campaigns and review sync streams with robust, custom-toggled routines.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Pricing section */}
      <section id="pricing" className="border-t border-slate-900 py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter font-display">
              Scalable Plans for Any Workspace
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Choose the package that aligns with your active business locations and agency tenants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            {/* Plan 1 */}
            <div className="bg-slate-900/50 border border-slate-900 rounded-3xl p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest block">STARTER</span>
                <div className="flex items-baseline gap-1 text-white">
                  <span className="text-4xl font-black tracking-tight font-display">$49</span>
                  <span className="text-slate-500 text-xs font-bold">/ MONTH</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Best suited for single business owners looking to automate a single profile.
                </p>
                <ul className="space-y-2.5 pt-4 text-[11px] text-slate-300">
                  <li className="flex items-center gap-2"><Check size={12} className="text-blue-500" /> 1 Linked Location</li>
                  <li className="flex items-center gap-2"><Check size={12} className="text-blue-500" /> AI Review Replies</li>
                  <li className="flex items-center gap-2"><Check size={12} className="text-blue-500" /> Weekly Post Queue</li>
                </ul>
              </div>
              <button onClick={onLogin} className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition cursor-pointer">
                Choose Starter
              </button>
            </div>

            {/* Plan 2 - Featured */}
            <div className="bg-slate-900 border border-blue-600/30 rounded-3xl p-8 space-y-6 flex flex-col justify-between relative shadow-2xl shadow-blue-500/5">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                RECOMMENDED
              </div>
              
              <div className="space-y-4">
                <span className="text-[10px] font-mono font-black text-blue-400 uppercase tracking-widest block">PROFESSIONAL</span>
                <div className="flex items-baseline gap-1 text-white">
                  <span className="text-4xl font-black tracking-tight font-display">$149</span>
                  <span className="text-slate-500 text-xs font-bold">/ MONTH</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Ideal for small chains and multi-location service providers.
                </p>
                <ul className="space-y-2.5 pt-4 text-[11px] text-slate-300">
                  <li className="flex items-center gap-2"><Check size={12} className="text-blue-500" /> Up to 5 Locations</li>
                  <li className="flex items-center gap-2"><Check size={12} className="text-blue-500" /> AI Review Replies (Instant)</li>
                  <li className="flex items-center gap-2"><Check size={12} className="text-blue-500" /> 3x3 Geo-Grid Maps Rank Tracker</li>
                  <li className="flex items-center gap-2"><Check size={12} className="text-blue-500" /> Unlimited Scheduled Posts</li>
                </ul>
              </div>
              
              <button onClick={onLogin} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition shadow-lg shadow-blue-500/20 cursor-pointer">
                Choose Pro
              </button>
            </div>

            {/* Plan 3 */}
            <div className="bg-slate-900/50 border border-slate-900 rounded-3xl p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest block">AGENCY</span>
                <div className="flex items-baseline gap-1 text-white">
                  <span className="text-4xl font-black tracking-tight font-display">$499</span>
                  <span className="text-slate-500 text-xs font-bold">/ MONTH</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Built for SEO marketing agencies managing unlimited client workspaces.
                </p>
                <ul className="space-y-2.5 pt-4 text-[11px] text-slate-300">
                  <li className="flex items-center gap-2"><Check size={12} className="text-blue-500" /> Unlimited Locations</li>
                  <li className="flex items-center gap-2"><Check size={12} className="text-blue-500" /> Dynamic Workspace Multi-Tenancy</li>
                  <li className="flex items-center gap-2"><Check size={12} className="text-blue-500" /> White-Label Reports & PDFs</li>
                  <li className="flex items-center gap-2"><Check size={12} className="text-blue-500" /> Dedicated EventBridge Clusters</li>
                </ul>
              </div>
              
              <button onClick={onLogin} className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition cursor-pointer">
                Choose Agency
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 text-center text-xs text-slate-500 font-mono uppercase tracking-wider">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© 2026 BizAuto.ai. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300 transition">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition">Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
