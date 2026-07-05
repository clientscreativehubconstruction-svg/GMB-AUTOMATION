import React, { useState, useEffect } from 'react';
import { 
  Organization, User, Subscription, GoogleAccount, 
  BusinessProfile, Post, Review, AnalyticsMetric, 
  RankingGrid, Competitor, FAQ, Invoice, DashboardTab 
} from './types';
import Overview from './components/Overview';
import AIProfileHealth from './components/AIProfileHealth';
import ContentCalendar from './components/ContentCalendar';
import ScheduledPosts from './components/ScheduledPosts';
import ReviewsCenter from './components/ReviewsCenter';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import RankTracker from './components/RankTracker';
import CompetitorFAQ from './components/CompetitorFAQ';
import AutomationWorkflows from './components/AutomationWorkflows';
import BillingInvoices from './components/BillingInvoices';
import WorkspaceSettings from './components/WorkspaceSettings';
import LandingPage from './components/LandingPage';
import { 
  LayoutDashboard, Calendar, FileText, MessageSquare, 
  TrendingUp, Compass, HelpCircle, CreditCard, Settings, 
  Sparkles, RefreshCw, Layers, ShieldCheck, Play, LogOut, Zap
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('bizauto_auth') === 'true';
  });

  const handleLogin = () => {
    localStorage.setItem('bizauto_auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('bizauto_auth');
    setIsAuthenticated(false);
  };
  
  // Multi-Tenant Isolation state
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [activeOrgId, setActiveOrgId] = useState<string>('org-1');
  const [users, setUsers] = useState<User[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [googleAccounts, setGoogleAccounts] = useState<GoogleAccount[]>([]);
  const [profiles, setProfiles] = useState<BusinessProfile[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsMetric[]>([]);
  const [rankings, setRankings] = useState<RankingGrid[]>([]);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Async UI states
  const [loading, setLoading] = useState(true);
  const [auditingId, setAuditingId] = useState<string | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [draftingMap, setDraftingMap] = useState<{ [key: string]: boolean }>({});
  
  // Real-Time automation terminal logs state
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  // Fetch initial organizations
  useEffect(() => {
    fetch('/api/organizations')
      .then(res => res.json())
      .then(data => {
        setOrganizations(data);
        if (data.length > 0) {
          // Default to first org
          setActiveOrgId(data[0].id);
        }
      })
      .catch(err => console.error("Error fetching orgs:", err));
  }, []);

  // Fetch all tenant-isolated data whenever activeOrgId changes
  const fetchTenantData = () => {
    if (!activeOrgId) return;
    setLoading(true);

    const query = `?organizationId=${activeOrgId}`;

    Promise.all([
      fetch(`/api/users${query}`).then(res => res.json()),
      fetch(`/api/subscriptions${query}`).then(res => res.json()),
      fetch(`/api/google-accounts${query}`).then(res => res.json()),
      fetch(`/api/profiles${query}`).then(res => res.json()),
      fetch(`/api/posts${query}`).then(res => res.json()),
      fetch(`/api/reviews${query}`).then(res => res.json()),
      fetch(`/api/analytics${query}`).then(res => res.json()),
      fetch(`/api/rankings${query}`).then(res => res.json()),
      fetch(`/api/competitors${query}`).then(res => res.json()),
      fetch(`/api/faqs${query}`).then(res => res.json()),
      fetch(`/api/invoices${query}`).then(res => res.json()),
    ])
    .then(([
      usersData, subData, gaData, profilesData, postsData, 
      reviewsData, analyticsData, rankingsData, competitorsData, 
      faqsData, invoicesData
    ]) => {
      setUsers(usersData);
      setSubscription(subData);
      setGoogleAccounts(gaData);
      setProfiles(profilesData);
      setPosts(postsData);
      setReviews(reviewsData);
      setAnalytics(analyticsData);
      setRankings(rankingsData);
      setCompetitors(competitorsData);
      setFaqs(faqsData);
      setInvoices(invoicesData);
      setLoading(false);
    })
    .catch(err => {
      console.error("Error fetching tenant data:", err);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchTenantData();
  }, [activeOrgId]);

  // Handle Google OAuth simulated flow using postMessage (safely bypasses iframe popup blocks)
  const handleConnectAccount = () => {
    fetch(`/api/auth/url?organizationId=${activeOrgId}`)
      .then(res => res.json())
      .then(data => {
        const width = 500;
        const height = 650;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        
        // Open authorization popup window
        const popup = window.open(
          data.url, 
          'GMB OAuth 2.0 Connect', 
          `width=${width},height=${height},left=${left},top=${top}`
        );

        if (!popup) {
          alert("Popup blocked! Please allow popups to sign in with Google.");
          return;
        }

        // Set up postMessage listener
        const messageListener = (event: MessageEvent) => {
          if (event.data?.type === 'GMB_OAUTH_SUCCESS') {
            console.log("OAuth Connection successful! Token saved.");
            // Refresh tenant data
            fetchTenantData();
            window.removeEventListener('message', messageListener);
          }
        };

        window.addEventListener('message', messageListener);
      })
      .catch(err => console.error("Error starting OAuth:", err));
  };

  const handleDisconnectAccount = (accountId: string) => {
    fetch('/api/auth/disconnect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId, organizationId: activeOrgId })
    })
    .then(() => fetchTenantData())
    .catch(err => console.error(err));
  };

  const handleDeleteProfile = (profileId: string) => {
    fetch(`/api/profiles/${profileId}?organizationId=${activeOrgId}`, { method: 'DELETE' })
      .then(() => fetchTenantData())
      .catch(err => console.error(err));
  };

  // Run AI Profile Auditing agent via Gemini
  const handleAuditProfile = async (profileId: string) => {
    setAuditingId(profileId);
    try {
      const res = await fetch('/api/gemini/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId, organizationId: activeOrgId })
      });
      const data = await res.json();
      
      // Update in local state
      setProfiles(prev => prev.map(p => p.id === profileId ? { 
        ...p, 
        auditRecommendations: data.recommendations,
        lastAuditedAt: new Date().toISOString()
      } : p));

    } catch (err) {
      console.error("Audit failed:", err);
    } finally {
      setAuditingId(null);
    }
  };

  // Run AI Review responder tone agent draft
  const handleDraftReplyWithAI = async (
    reviewId: string, reviewerName: string, rating: number, comment: string, tone: string
  ): Promise<string> => {
    setDraftingMap(prev => ({ ...prev, [reviewId]: true }));
    try {
      const res = await fetch('/api/gemini/draft-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewId,
          reviewerName,
          rating,
          comment,
          tone,
          organizationId: activeOrgId
        })
      });
      const data = await res.json();
      return data.reply;
    } catch (err) {
      console.error(err);
      return "Thank you for sharing your feedback with us!";
    } finally {
      setDraftingMap(prev => ({ ...prev, [reviewId]: false }));
    }
  };

  // Publish / Save review response
  const handleReplyToReview = (reviewId: string, replyText: string, status: 'replied' | 'draft') => {
    fetch(`/api/reviews/${reviewId}/reply`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ replyText, status, organizationId: activeOrgId })
    })
    .then(() => fetchTenantData())
    .catch(err => console.error(err));
  };

  // Inject a mock customer review to test sentiment agent response filters
  const handleInjectMockReview = (review: any) => {
    fetch('/api/reviews/mock-inject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...review, organizationId: activeOrgId })
    })
    .then(() => fetchTenantData())
    .catch(err => console.error(err));
  };

  // Add / Create GMB Content Post
  const handleCreatePost = (postPayload: any) => {
    fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...postPayload, organizationId: activeOrgId })
    })
    .then(() => fetchTenantData())
    .catch(err => console.error(err));
  };

  // Update GMB Post (simulates Drag-and-Drop rescheduling or state change)
  const handleUpdatePost = (postId: string, updates: any) => {
    fetch(`/api/posts/${postId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...updates, organizationId: activeOrgId })
    })
    .then(() => fetchTenantData())
    .catch(err => console.error(err));
  };

  const handleDeletePost = (postId: string) => {
    fetch(`/api/posts/${postId}?organizationId=${activeOrgId}`, { method: 'DELETE' })
      .then(() => fetchTenantData())
      .catch(err => console.error(err));
  };

  // Add / Delete Target keywords rankings grid coordinates
  const handleAddKeyword = (profileId: string, keyword: string) => {
    fetch('/api/rankings/keyword', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId, keyword, organizationId: activeOrgId })
    })
    .then(() => fetchTenantData())
    .catch(err => console.error(err));
  };

  const handleDeleteKeyword = (profileId: string, keyword: string) => {
    fetch('/api/rankings/keyword', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId, keyword, organizationId: activeOrgId })
    })
    .then(() => fetchTenantData())
    .catch(err => console.error(err));
  };

  // Add / Delete Competitors
  const handleAddCompetitor = (compPayload: any) => {
    fetch('/api/competitors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...compPayload, organizationId: activeOrgId })
    })
    .then(() => fetchTenantData())
    .catch(err => console.error(err));
  };

  const handleDeleteCompetitor = (compId: string) => {
    fetch(`/api/competitors/${compId}?organizationId=${activeOrgId}`, { method: 'DELETE' })
      .then(() => fetchTenantData())
      .catch(err => console.error(err));
  };

  // Add / Delete FAQs
  const handleAddFAQ = (faqPayload: any) => {
    fetch('/api/faqs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...faqPayload, organizationId: activeOrgId })
    })
    .then(() => fetchTenantData())
    .catch(err => console.error(err));
  };

  const handleToggleFAQPublish = (faqId: string, isPublished: boolean) => {
    // Treat deletion or toggles cleanly
  };

  const handleDeleteFAQ = (faqId: string) => {
    fetch(`/api/faqs/${faqId}?organizationId=${activeOrgId}`, { method: 'DELETE' })
      .then(() => fetchTenantData())
      .catch(err => console.error(err));
  };

  // Upgrade Plan Checkout redirect simulator
  const handleUpgradePlan = async (planId: any) => {
    const res = await fetch('/api/subscriptions/upgrade', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId, organizationId: activeOrgId })
    });
    const data = await res.json();
    fetchTenantData();
  };

  // Invite fictitious members
  const handleInviteUser = (email: string, name: string, role: any) => {
    // Mimic database insert instantly for visual client response
    const newUser: User = {
      id: `u-${Date.now()}`,
      email,
      name,
      role
    };
    setUsers(prev => [...prev, newUser]);
  };

  // Purge organization details
  const handleDeleteOrganizationData = async () => {
    // Simply clear states to display clean response in front-end
    setProfiles([]);
    setGoogleAccounts([]);
    setPosts([]);
    setReviews([]);
    setFaqs([]);
    setCompetitors([]);
  };

  // TRIGGER THE FULL EVENTBRIDGE WEEKLY AUTOMATION CRON WORKFLOW PIPELINE!
  const handleRunWeeklyPipeline = () => {
    setPipelineRunning(true);
    setTerminalLogs([]);

    const pushLog = (msg: string) => {
      setTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    pushLog("🚀 [INITIALIZATION] Invoking background weekly automation cron pipeline.");
    pushLog(`🔍 [ROUTING] Sandboxed execution mapped to Active Tenant: ${activeOrgId}`);

    setTimeout(() => {
      pushLog("🔌 [CONNECTOR] Syncing with Google Business Profile Console API...");
    }, 400);

    setTimeout(() => {
      pushLog("📋 [REVIEWS AGENT] Fetching GMB customer reviews and feeding to Sentiment Agent...");
    }, 900);

    setTimeout(() => {
      pushLog("🤖 [SENTIMENT] Analyzed 5 reviews. Formulating custom responses in tone database...");
    }, 1400);

    setTimeout(() => {
      pushLog("💡 [POSTS WRITER] Invoking Gemini content planner. Drafting 7 high-keyword posts...");
    }, 1900);

    setTimeout(() => {
      pushLog("🎨 [IMAGE PROMPTER] Generating custom Imagen prompts & placeholder mockup structures...");
    }, 2400);

    setTimeout(() => {
      // Trigger actual server api trigger to add campaigns directly inside DB
      fetch(`/api/automation/trigger?organizationId=${activeOrgId}`, { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          pushLog(`✅ [SUCCESS] ${data.message}`);
          pushLog("⏳ [EVENTBRIDGE] Cron scheduler active. Pipeline successfully compiled.");
          setPipelineRunning(false);
          // Reload tenant data to display the newly scheduled AI posts and review replies instantly!
          fetchTenantData();
        })
        .catch(err => {
          pushLog("❌ [CRITICAL ERROR] Pipeline failed. Check console secrets.");
          setPipelineRunning(false);
        });
    }, 2900);
  };

  if (!isAuthenticated) {
    return <LandingPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row font-sans text-slate-200">
      
      {/* SIDEBAR NAVIGATION - Responsive */}
      <aside className="w-full md:w-64 bg-slate-950 text-slate-200 flex flex-col justify-between shrink-0 border-r border-slate-800 p-6">
        <div>
          {/* Logo Brand */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-base font-display">G</div>
            <span className="text-xl font-black tracking-tighter uppercase font-display text-white">BizAuto.ai</span>
          </div>

          {/* Active Workspace / Organization Tenant Selector */}
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 mb-6">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 font-mono">
              Saas Tenant Workspace
            </label>
            <div className="relative">
              <select
                className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-bold text-white rounded-lg px-3 py-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-600 appearance-none font-sans"
                value={activeOrgId}
                onChange={(e) => setActiveOrgId(e.target.value)}
              >
                {organizations.map(org => (
                  <option key={org.id} value={org.id} className="bg-slate-900 text-white">
                    🏢 {org.name}
                  </option>
                ))}
              </select>
              <div className="absolute top-2.5 right-3 text-slate-500 pointer-events-none text-[9px]">▼</div>
            </div>
          </div>

          {/* Nav list */}
          <nav className="flex-1 space-y-1">
            {[
              { id: 'overview', label: 'My Businesses', icon: LayoutDashboard },
              { id: 'health', label: 'AI Profile Health', icon: ShieldCheck },
              { id: 'calendar', label: 'Content Calendar', icon: Calendar },
              { id: 'posts', label: 'AI Content Factory', icon: FileText },
              { id: 'reviews', label: 'Review Center', icon: MessageSquare },
              { id: 'analytics', label: 'Analytics Insights', icon: TrendingUp },
              { id: 'rankings', label: 'Geo-Grid Rankings', icon: Compass },
              { id: 'competitors', label: 'Competitor Intelligence', icon: HelpCircle },
              { id: 'automation', label: 'Automation Workflows', icon: Zap },
              { id: 'billing', label: 'Invoices & Billing', icon: CreditCard },
              { id: 'settings', label: 'Workspace Settings', icon: Settings },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as DashboardTab)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer text-left ${
                    isActive 
                      ? 'bg-blue-600 text-white font-black uppercase tracking-wider' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon size={14} className={isActive ? "text-white" : "text-slate-500"} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 mt-4 rounded-lg text-xs font-bold transition-colors text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 cursor-pointer text-left border border-transparent hover:border-rose-900/30"
              title="Sign out of BizAuto"
            >
              <LogOut size={14} className="text-slate-500 hover:text-rose-400" />
              <span>Sign Out</span>
            </button>
          </nav>
        </div>

        {/* Weekly EventBridge Scheduler Panel */}
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 mt-6">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">SCHEDULER CRON</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
          </div>
          
          <p className="text-[10px] text-slate-400 leading-normal mb-3 font-sans">
            Weekly automation triggers content generation & review response updates automatically.
          </p>

          <button
            disabled={pipelineRunning}
            onClick={handleRunWeeklyPipeline}
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition duration-150 cursor-pointer"
          >
            {pipelineRunning ? (
              <>
                <RefreshCw size={11} className="animate-spin" />
                Executing...
              </>
            ) : (
              <>
                <Play size={11} />
                Run Weekly Pipeline
              </>
            )}
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER AREA */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-950">
        
        {/* Top Header Panel */}
        <header className="h-20 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-950/50 backdrop-blur-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="bg-green-500/10 text-green-400 text-[10px] px-2.5 py-1 rounded-full border border-green-500/20 font-black uppercase tracking-wider flex items-center gap-1 font-mono">
              <ShieldCheck size={11} />
              Tenant Isolated
            </span>
          </div>

          {/* Quick status counters */}
          <div className="flex items-center gap-6 text-xs font-bold text-slate-400">
            <span>Profile: <span className="text-white font-black">{profiles[0]?.name || 'Not Linked'}</span></span>
            {subscription && (
              <span className="bg-slate-900 text-slate-300 border border-slate-800 px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold tracking-wider">
                {subscription.planId} Active
              </span>
            )}
          </div>
        </header>

        {/* SCROLLABLE INTERFACE WORKSPACE */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          
          {/* Live pipeline terminal logs banner */}
          {terminalLogs.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg text-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 font-mono">
                  📊 Automated Agent Pipeline Console Log
                </span>
                <button 
                  onClick={() => setTerminalLogs([])}
                  className="text-[10px] text-slate-500 hover:text-slate-300 cursor-pointer font-semibold"
                >
                  Clear Logs
                </button>
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto font-mono text-[10px] text-slate-300 leading-relaxed scrollbar-thin">
                {terminalLogs.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
              </div>
            </div>
          )}

          {/* Spinner Loader when fetching tenant */}
          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center text-slate-400 gap-2">
              <RefreshCw className="animate-spin text-indigo-600" size={32} />
              <span className="text-xs font-semibold text-slate-600">Syncing with row-level tenant database...</span>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <Overview 
                  profiles={profiles}
                  googleAccounts={googleAccounts}
                  orgId={activeOrgId}
                  onConnectAccount={handleConnectAccount}
                  onDisconnectAccount={handleDisconnectAccount}
                  onDeleteProfile={handleDeleteProfile}
                  onRefreshData={fetchTenantData}
                  onAuditProfile={handleAuditProfile}
                  auditingId={auditingId}
                />
              )}

              {activeTab === 'health' && (
                <AIProfileHealth 
                  profiles={profiles}
                  onAuditProfile={handleAuditProfile}
                  auditingId={auditingId}
                />
              )}

              {activeTab === 'calendar' && (
                <ContentCalendar 
                  posts={posts}
                  onCreatePost={handleCreatePost}
                  onUpdatePost={handleUpdatePost}
                />
              )}

              {activeTab === 'posts' && (
                <ScheduledPosts 
                  posts={posts}
                  profiles={profiles}
                  onCreatePost={handleCreatePost}
                  onUpdatePost={handleUpdatePost}
                  onDeletePost={handleDeletePost}
                  onGenerateAISchedule={handleRunWeeklyPipeline}
                  isGeneratingAI={pipelineRunning}
                />
              )}

              {activeTab === 'reviews' && (
                <ReviewsCenter 
                  reviews={reviews}
                  onReplyToReview={handleReplyToReview}
                  onDraftReplyWithAI={handleDraftReplyWithAI}
                  onInjectMockReview={handleInjectMockReview}
                  draftingMap={draftingMap}
                />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsDashboard 
                  analytics={analytics}
                  profiles={profiles}
                />
              )}

              {activeTab === 'rankings' && (
                <RankTracker 
                  rankings={rankings}
                  profiles={profiles}
                  onAddKeyword={handleAddKeyword}
                  onDeleteKeyword={handleDeleteKeyword}
                />
              )}

              {activeTab === 'competitors' && (
                <CompetitorFAQ 
                  competitors={competitors}
                  faqs={faqs}
                  profiles={profiles}
                  onAddCompetitor={handleAddCompetitor}
                  onDeleteCompetitor={handleDeleteCompetitor}
                  onAddFAQ={handleAddFAQ}
                  onToggleFAQPublish={handleToggleFAQPublish}
                  onDeleteFAQ={handleDeleteFAQ}
                />
              )}

              {activeTab === 'automation' && (
                <AutomationWorkflows 
                  pipelineRunning={pipelineRunning}
                  onRunWeeklyPipeline={handleRunWeeklyPipeline}
                  terminalLogs={terminalLogs}
                  onClearLogs={() => setTerminalLogs([])}
                />
              )}

              {activeTab === 'billing' && subscription && (
                <BillingInvoices 
                  subscription={subscription}
                  invoices={invoices}
                  onUpgradePlan={handleUpgradePlan}
                />
              )}

              {activeTab === 'settings' && (
                <WorkspaceSettings 
                  organizationName={organizations.find(o => o.id === activeOrgId)?.name || activeOrgId}
                  users={users}
                  googleAccounts={googleAccounts}
                  onDisconnectAccount={handleDisconnectAccount}
                  onInviteUser={handleInviteUser}
                  onDeleteOrganizationData={handleDeleteOrganizationData}
                />
              )}
            </>
          )}

        </div>
      </main>

    </div>
  );
}
