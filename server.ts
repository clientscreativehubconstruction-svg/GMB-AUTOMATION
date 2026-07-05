import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { db } from "./server/db.js";
import { runProfileAudit, generateWeeklyContentSchedule, generateReviewReply } from "./server/gemini.js";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON parsing
app.use(express.json());

// Helper middleware to extract organization ID from headers or query params
const getTenantOrgId = (req: express.Request): string => {
  const orgIdHeader = req.headers["x-organization-id"];
  if (orgIdHeader && typeof orgIdHeader === "string") {
    return orgIdHeader;
  }
  const orgIdQuery = req.query.orgId || req.query.organizationId;
  if (orgIdQuery && typeof orgIdQuery === "string") {
    return orgIdQuery;
  }
  return "org-1"; // Default seed tenant
};

// ==========================================
// 1. Google OAuth 2.0 & Consent Simulation Routes
// ==========================================

// Get actual/simulated OAuth URL for Google Business Profile
app.get("/api/auth/url", (req, res) => {
  const orgId = getTenantOrgId(req);
  const clientId = process.env.OAUTH_CLIENT_ID || process.env.CLIENT_ID;
  const redirectUri = `${req.protocol}://${req.get("host")}/auth/callback`;

  if (clientId) {
    // If user has configured actual credentials, construct real Google OAuth URL
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "https://www.googleapis.com/auth/business.manage",
      access_type: "offline",
      prompt: "consent",
      state: orgId
    });
    res.json({ url: `https://accounts.google.com/o/oauth2/v2/auth?${params}` });
  } else {
    // Elegant simulation URL to allow testing instantly in AI Studio preview
    res.json({ url: `/auth/simulated-consent?orgId=${orgId}` });
  }
});

// Render simulated Google authorization screen
app.get("/auth/simulated-consent", (req, res) => {
  const orgId = (req.query.orgId as string) || "org-1";
  const organization = db.getOrganizationById(orgId);
  const orgName = organization ? organization.name : "Your Organization";

  res.send(`
    <html>
      <head>
        <title>Sign in with Google - Google Business Profile</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
        <style>body { font-family: 'Inter', sans-serif; }</style>
      </head>
      <body class="bg-slate-50 flex items-center justify-center min-h-screen">
        <div class="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full border border-slate-100">
          <div class="flex flex-col items-center mb-6">
            <svg class="h-10 w-10 mb-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.62-.24-1.12-.63-1.48-1.11z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <h1 class="text-xl font-semibold text-slate-800">Choose Google Account</h1>
            <p class="text-xs text-slate-400 mt-1">to connect to <strong>GBP Manager AI</strong></p>
          </div>

          <div class="border-y border-slate-100 py-4 mb-6 space-y-3">
            <p class="text-xs text-slate-500 font-medium px-1">Connecting to tenant: <span class="text-indigo-600">${orgName}</span></p>
            
            <a href="/auth/callback?code=sim_code_dental&state=${orgId}&email=dentist.care@gmail.com" class="flex items-center p-3 rounded-lg hover:bg-slate-50 transition border border-slate-100">
              <div class="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">D</div>
              <div class="ml-3 text-left">
                <p class="text-sm font-medium text-slate-700">dentist.care@gmail.com</p>
                <p class="text-xs text-slate-400">Dr. Catherine Bennett</p>
              </div>
            </a>

            <a href="/auth/callback?code=sim_code_pizza&state=${orgId}&email=pizza.owner@example.com" class="flex items-center p-3 rounded-lg hover:bg-slate-50 transition border border-slate-100">
              <div class="h-8 w-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">M</div>
              <div class="ml-3 text-left">
                <p class="text-sm font-medium text-slate-700">pizza.owner@example.com</p>
                <p class="text-xs text-slate-400">Marco Rossi</p>
              </div>
            </a>
          </div>

          <div class="space-y-4">
            <p class="text-[10px] text-slate-400 leading-relaxed text-center">
              By continuing, Google will share your name, email, language preference, and profile picture with GBP Manager AI. Your GMB location and post management will be authorized.
            </p>
            <div class="flex justify-center">
              <a href="/" class="text-xs font-medium text-slate-500 hover:text-slate-800">Cancel</a>
            </div>
          </div>
        </div>
      </body>
    </html>
  `);
});

// OAuth Callback Handler (Handles real redirects or our simulated flow redirects)
app.get(["/auth/callback", "/auth/callback/"], async (req, res) => {
  const code = (req.query.code as string) || "";
  const orgId = (req.query.state as string) || "org-1";
  const email = (req.query.email as string) || "user@example.com";
  const googleAccountId = `g-${Math.floor(Math.random() * 900) + 100}`;

  // In real life, exchange 'code' for tokens here using oauth2 client.
  // We'll write the store operation using our db manager!
  db.connectGoogleAccount(orgId, email, googleAccountId);

  // Send success message and close popup in a beautifully aligned container
  res.send(`
    <html>
      <head>
        <title>Google Account Connected</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
        <style>body { font-family: 'Inter', sans-serif; }</style>
      </head>
      <body class="bg-indigo-50/30 flex items-center justify-center min-h-screen p-4">
        <div class="bg-white shadow-2xl rounded-3xl p-8 max-w-md w-full border border-indigo-100 text-center flex flex-col items-center">
          <div class="h-16 w-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-slate-800 mb-2">Account Authorized</h1>
          <p class="text-sm text-slate-500 mb-6 leading-relaxed">
            Your Google Business Profile integration is successfully authorized for organization <strong>${orgId}</strong>.
          </p>
          <div class="bg-indigo-50/50 rounded-xl p-4 w-full mb-6">
            <p class="text-xs text-indigo-700 font-mono">Connected: ${email}</p>
          </div>
          <p class="text-xs text-slate-400">Closing window automatically...</p>
          <script>
            setTimeout(() => {
              if (window.opener) {
                window.opener.postMessage({ type: "OAUTH_AUTH_SUCCESS" }, "*");
                window.close();
              } else {
                window.location.href = "/";
              }
            }, 1500);
          </script>
        </div>
      </body>
    </html>
  `);
});

// ==========================================
// 2. SaaS Multi-Tenant Database REST APIs
// ==========================================

// Current logged in user details
app.get("/api/current-user", (req, res) => {
  const orgId = getTenantOrgId(req);
  const users = db.getUsers(orgId);
  const defaultUser = users[0] || { id: "usr-guest", email: "guest@example.com", name: "Guest Developer", role: "member" };
  res.json(defaultUser);
});

// Get current organization and list of all organizations
app.get("/api/organizations", (req, res) => {
  const list = db.getOrganizations();
  res.json(list);
});

// Create new tenant organization
app.post("/api/organizations", (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Organization name is required" });
  }
  const org = db.createOrganization(name);
  res.status(201).json(org);
});

// Get tenant-isolated user roles
app.get("/api/users", (req, res) => {
  const orgId = getTenantOrgId(req);
  res.json(db.getUsers(orgId));
});

// Connected Google Accounts list
app.get(["/api/gmb/accounts", "/api/google-accounts"], (req, res) => {
  const orgId = getTenantOrgId(req);
  res.json(db.getGoogleAccounts(orgId));
});

// Disconnect/Revoke connected account POST route (as called by App.tsx)
app.post("/api/auth/disconnect", (req, res) => {
  const { accountId, organizationId } = req.body;
  db.disconnectGoogleAccount(organizationId || "org-1", accountId);
  res.json({ success: true });
});

// Disconnect/Revoke connected account DELETE route
app.delete("/api/gmb/accounts/:id", (req, res) => {
  const orgId = getTenantOrgId(req);
  const { id } = req.params;
  db.disconnectGoogleAccount(orgId, id);
  res.json({ success: true, message: "Google Account and all associated profiles deleted within 7 days compliance policy" });
});

// Business profiles
app.get("/api/profiles", (req, res) => {
  const orgId = getTenantOrgId(req);
  res.json(db.getBusinessProfiles(orgId));
});

app.delete("/api/profiles/:id", (req, res) => {
  const orgId = getTenantOrgId(req);
  const { id } = req.params;
  db.deleteBusinessProfile(orgId, id);
  res.json({ success: true, message: "Location profile detached and deleted." });
});

// Content Calendar & Posts API
app.get("/api/posts", (req, res) => {
  const orgId = getTenantOrgId(req);
  res.json(db.getPosts(orgId));
});

app.post("/api/posts", (req, res) => {
  const orgId = getTenantOrgId(req);
  const postData = req.body;
  const post = db.createPost(orgId, postData);
  res.status(201).json(post);
});

app.patch("/api/posts/:id", (req, res) => {
  const orgId = getTenantOrgId(req);
  const { id } = req.params;
  const updates = req.body;
  const post = db.updatePost(orgId, id, updates);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  res.json(post);
});

app.put("/api/posts/:id", (req, res) => {
  const orgId = getTenantOrgId(req);
  const { id } = req.params;
  const updates = req.body;
  const post = db.updatePost(orgId, id, updates);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  res.json(post);
});

app.delete("/api/posts/:id", (req, res) => {
  const orgId = getTenantOrgId(req);
  const { id } = req.params;
  db.deletePost(orgId, id);
  res.json({ success: true });
});

// Customer Reviews API
app.get("/api/reviews", (req, res) => {
  const orgId = getTenantOrgId(req);
  res.json(db.getReviews(orgId));
});

app.post("/api/reviews", (req, res) => {
  const orgId = getTenantOrgId(req);
  const reviewData = req.body;
  const review = db.createReview(orgId, reviewData);
  res.status(201).json(review);
});

app.post("/api/reviews/mock-inject", (req, res) => {
  const orgId = getTenantOrgId(req);
  const reviewData = req.body;
  const review = db.createReview(orgId, reviewData);
  res.status(201).json(review);
});

app.patch("/api/reviews/:id/reply", (req, res) => {
  const orgId = getTenantOrgId(req);
  const { id } = req.params;
  const { replyText, status } = req.body;
  const review = db.replyToReview(orgId, id, replyText, status);
  if (!review) {
    return res.status(404).json({ error: "Review not found" });
  }
  res.json(review);
});

app.put("/api/reviews/:id/reply", (req, res) => {
  const orgId = getTenantOrgId(req);
  const { id } = req.params;
  const { replyText, status } = req.body;
  const review = db.replyToReview(orgId, id, replyText, status);
  if (!review) {
    return res.status(404).json({ error: "Review not found" });
  }
  res.json(review);
});

// Analytics Dashboard Endpoint
app.get("/api/analytics", (req, res) => {
  const orgId = getTenantOrgId(req);
  res.json(db.getAnalytics(orgId));
});

// Rankings Geo-Grid Endpoint
app.get("/api/rankings", (req, res) => {
  const orgId = getTenantOrgId(req);
  res.json(db.getRankings(orgId));
});

app.post(["/api/rankings", "/api/rankings/keyword"], (req, res) => {
  const orgId = getTenantOrgId(req);
  const { profileId, keyword } = req.body;
  if (!profileId || !keyword) {
    return res.status(400).json({ error: "profileId and keyword are required" });
  }
  db.addRankKeyword(orgId, profileId, keyword);
  res.status(201).json({ success: true });
});

app.delete("/api/rankings/keyword", (req, res) => {
  const orgId = getTenantOrgId(req);
  const { profileId, keyword } = req.body;
  if (!profileId || !keyword) {
    return res.status(400).json({ error: "profileId and keyword are required" });
  }
  db.deleteRankKeyword(orgId, profileId, keyword);
  res.json({ success: true });
});

app.delete("/api/rankings/keyword/:keyword", (req, res) => {
  const orgId = getTenantOrgId(req);
  const { keyword } = req.params;
  const profileId = req.query.profileId as string;
  db.deleteRankKeyword(orgId, profileId, keyword);
  res.json({ success: true });
});

// Competitors Benchmarking API
app.get("/api/competitors", (req, res) => {
  const orgId = getTenantOrgId(req);
  res.json(db.getCompetitors(orgId));
});

app.post("/api/competitors", (req, res) => {
  const orgId = getTenantOrgId(req);
  const competitor = req.body;
  const comp = db.createCompetitor(orgId, competitor);
  res.status(201).json(comp);
});

app.delete("/api/competitors/:id", (req, res) => {
  const orgId = getTenantOrgId(req);
  const { id } = req.params;
  db.deleteCompetitor(orgId, id);
  res.json({ success: true });
});

// FAQ GMB Section API
app.get("/api/faqs", (req, res) => {
  const orgId = getTenantOrgId(req);
  res.json(db.getFaqs(orgId));
});

app.post("/api/faqs", (req, res) => {
  const orgId = getTenantOrgId(req);
  const faqData = req.body;
  const faq = db.createFAQ(orgId, faqData);
  res.status(201).json(faq);
});

app.put("/api/faqs/:id", (req, res) => {
  const orgId = getTenantOrgId(req);
  const { id } = req.params;
  const updates = req.body;
  const faq = db.updateFAQ(orgId, id, updates);
  if (!faq) {
    return res.status(404).json({ error: "FAQ not found" });
  }
  res.json(faq);
});

app.delete("/api/faqs/:id", (req, res) => {
  const orgId = getTenantOrgId(req);
  const { id } = req.params;
  db.deleteFAQ(orgId, id);
  res.json({ success: true });
});

// Invoices API
app.get("/api/invoices", (req, res) => {
  const orgId = getTenantOrgId(req);
  res.json(db.getInvoices(orgId));
});

// Billing Subscriptions
app.get(["/api/subscription", "/api/subscriptions"], (req, res) => {
  const orgId = getTenantOrgId(req);
  res.json(db.getSubscription(orgId) || { planId: "free", status: "active", periodStart: "", periodEnd: "", amount: 0 });
});

app.post(["/api/subscription", "/api/subscriptions"], (req, res) => {
  const orgId = getTenantOrgId(req);
  const { planId, status } = req.body;
  db.updateSubscription(orgId, planId, status || "active");
  res.json({ success: true, subscription: db.getSubscription(orgId) });
});

app.patch(["/api/subscription/upgrade", "/api/subscriptions/upgrade"], (req, res) => {
  const orgId = getTenantOrgId(req);
  const { planId } = req.body;
  db.updateSubscription(orgId, planId, "active");
  res.json({ success: true, subscription: db.getSubscription(orgId) });
});

// ==========================================
// 3. AI-Driven Content & Optimization Agents Routes
// ==========================================

// GMB Profile Audit Agent Route
app.post("/api/gemini/audit", async (req, res) => {
  const orgId = getTenantOrgId(req);
  const { profileId } = req.body;
  const profiles = db.getBusinessProfiles(orgId);
  const profile = profiles.find(p => p.id === profileId);

  if (!profile) {
    return res.status(404).json({ error: "Profile not found" });
  }

  try {
    const report = await runProfileAudit({
      name: profile.name,
      category: profile.category,
      address: profile.address,
      phone: profile.phone,
      website: profile.website,
      description: profile.auditRecommendations ? "Optimized clinic description for downtown San Francisco dentistry" : ""
    });
    db.updateBusinessProfileAudit(orgId, profileId, report);
    res.json({ report });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to audit profile" });
  }
});

// Drafting review reply
app.post("/api/gemini/draft-reply", async (req, res) => {
  const { reviewerName, rating, comment, tone } = req.body;
  try {
    const draft = await generateReviewReply({ reviewerName, rating, comment }, tone || "grateful");
    res.json({ draft });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to generate reply" });
  }
});

// ==========================================
// 4. Weekly Automation Cron pipeline simulator
// ==========================================
app.post("/api/automation/trigger", async (req, res) => {
  const orgId = getTenantOrgId(req);
  const logs: string[] = [];
  logs.push(`[${new Date().toISOString()}] Initiating Scheduled Weekly automation...`);
  
  try {
    const profiles = db.getBusinessProfiles(orgId);
    if (profiles.length === 0) {
      logs.push(`[WARN] No connected GMB locations found. Add or connect an account to automate.`);
      return res.json({ success: false, logs });
    }

    const activeProfile = profiles[0];
    logs.push(`[INFO] Found active Google Business profile: "${activeProfile.name}"`);

    // 1. Audit check
    logs.push(`[AGENT] Deploying 'Profile Analysis Agent' (Local SEO Expert)...`);
    if (!activeProfile.auditRecommendations) {
      const report = await runProfileAudit({
        name: activeProfile.name,
        category: activeProfile.category,
        address: activeProfile.address,
        phone: activeProfile.phone,
        website: activeProfile.website,
        description: ""
      });
      db.updateBusinessProfileAudit(orgId, activeProfile.id, report);
      logs.push(`[SUCCESS] Profile Analysis completed and GMB category/description suggestions updated.`);
    } else {
      logs.push(`[INFO] Profile Audit is already fresh. Skipping regeneration.`);
    }

    // 2. Draft 7 daily posts
    logs.push(`[AGENT] Deploying 'Post Writer' & 'Image Prompt' Content Agents...`);
    logs.push(`[INFO] Drafting 7 unique daily social posts for Content Calendar rotating categories...`);
    const posts = await generateWeeklyContentSchedule({
      name: activeProfile.name,
      category: activeProfile.category,
      address: activeProfile.address
    });

    let draftedCount = 0;
    posts.forEach((p, idx) => {
      const scheduledTime = new Date(Date.now() + (idx + 1) * 24 * 3600 * 1000).toISOString();
      db.createPost(orgId, {
        profileId: activeProfile.id,
        headline: p.headline,
        content: p.content,
        imageUrl: `https://images.unsplash.com/photo-${1580000000000 + idx}?auto=format&fit=crop&q=80&w=600`, // Placeholder for our generated prompt
        ctaType: p.ctaType,
        ctaUrl: activeProfile.website + "/promo",
        scheduledAt: scheduledTime,
        status: "scheduled"
      });
      draftedCount++;
    });
    logs.push(`[SUCCESS] Generated ${draftedCount} schedule posts into Content Calendar.`);

    // 3. Check for reviews
    logs.push(`[AGENT] Deploying 'Review Response Agent'...`);
    const reviews = db.getReviews(orgId).filter(r => r.replyStatus === "unreplied" || r.replyStatus === "draft");
    logs.push(`[INFO] Found ${reviews.length} unreplied customer reviews.`);
    
    let draftReplyCount = 0;
    for (const r of reviews) {
      const tone = r.rating >= 4 ? "grateful" : "apologetic";
      const reply = await generateReviewReply({ reviewerName: r.reviewerName, rating: r.rating, comment: r.comment }, tone);
      db.replyToReview(orgId, r.id, reply, "draft");
      draftReplyCount++;
    }
    logs.push(`[SUCCESS] Drafted ${draftReplyCount} replies with localized sentiment filters.`);

    // 4. Geo grid rank checks
    logs.push(`[AGENT] Deploying 'Rank Tracker Map Agent'...`);
    const rankings = db.getRankings(orgId);
    if (rankings.length === 0) {
      db.addRankKeyword(orgId, activeProfile.id, "Dentist Downtown SF");
      db.addRankKeyword(orgId, activeProfile.id, "Cosmetic Dentistry San Francisco");
      logs.push(`[SUCCESS] Initialized Local Geo-Grid rank grids for primary local keywords.`);
    } else {
      // Small shift to simulate active rank tracking
      rankings.forEach(ra => {
        if (Math.random() > 0.6) {
          ra.rank = Math.max(1, ra.rank + (Math.random() > 0.5 ? 1 : -1));
        }
      });
      logs.push(`[SUCCESS] Recalculated 3x3 local geo-grid rank coordinate values.`);
    }

    const successMsg = "Automated GMB Campaign updates published successfully.";
    logs.push(`[${new Date().toISOString()}] ${successMsg}`);
    return res.json({ success: true, message: successMsg, logs });

  } catch (err: any) {
    logs.push(`[CRITICAL ERROR] Automation failed: ${err.message || err}`);
    return res.status(500).json({ success: false, logs });
  }
});


// ==========================================
// 5. Vite Dev Server / Production Handler Setup
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
