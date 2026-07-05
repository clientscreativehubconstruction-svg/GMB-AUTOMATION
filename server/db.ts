import fs from 'fs';
import path from 'path';

// Define the multi-tenant schema interfaces
export interface Organization {
  id: string;
  name: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'member';
}

export interface Membership {
  id: string;
  userId: string;
  organizationId: string;
  role: 'owner' | 'admin' | 'member';
}

export interface Subscription {
  id: string;
  organizationId: string;
  planId: 'free' | 'starter' | 'pro' | 'agency';
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  periodStart: string;
  periodEnd: string;
  amount: number;
}

export interface GoogleAccount {
  id: string;
  organizationId: string;
  googleAccountId: string;
  email: string;
  oauthRefreshToken: string;
  isConnected: boolean;
  connectedAt: string;
}

export interface BusinessProfile {
  id: string;
  organizationId: string;
  googleAccountId: string;
  locationId: string;
  name: string;
  category: string;
  address: string;
  phone: string;
  website: string;
  rating: number;
  reviewCount: number;
  status: 'verified' | 'pending' | 'unverified';
  auditRecommendations?: string; // Cache for Gemini optimization audit
  lastAuditedAt?: string;
}

export interface Post {
  id: string;
  organizationId: string;
  profileId: string;
  headline: string;
  content: string;
  imageUrl?: string;
  ctaType: 'BOOK' | 'ORDER' | 'SHOP' | 'LEARN_MORE' | 'SIGN_UP' | 'CALL' | 'NONE';
  ctaUrl?: string;
  scheduledAt: string; // ISO String
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  publishedAt?: string;
  metrics?: {
    views: number;
    clicks: number;
  };
}

export interface Review {
  id: string;
  organizationId: string;
  profileId: string;
  reviewerName: string;
  reviewerAvatar?: string;
  rating: number; // 1 to 5
  comment: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  reviewTime: string; // ISO String
  replyText?: string;
  replyStatus: 'unreplied' | 'draft' | 'replied' | 'failed';
  repliedAt?: string;
}

export interface AnalyticsMetric {
  id: string;
  organizationId: string;
  profileId: string;
  date: string; // YYYY-MM-DD
  views: number;
  calls: number;
  websiteClicks: number;
  directionRequests: number;
}

export interface RankingGrid {
  id: string;
  organizationId: string;
  profileId: string;
  keyword: string;
  gridX: number; // 1-3 or 1-5
  gridY: number;
  rank: number; // 1-20+ (1-3 is green)
}

export interface Competitor {
  id: string;
  organizationId: string;
  profileId: string;
  name: string;
  category: string;
  address: string;
  rating: number;
  reviewCount: number;
  gaps: string[];
  suggestions: string;
}

export interface FAQ {
  id: string;
  organizationId: string;
  profileId: string;
  question: string;
  answer: string;
  isPublished: boolean;
  createdAt: string;
}

export interface Invoice {
  id: string;
  organizationId: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  planId: string;
  status: 'paid' | 'unpaid' | 'failed';
  pdfUrl?: string;
}

// Full database interface
interface DatabaseSchema {
  organizations: Organization[];
  users: User[];
  memberships: Membership[];
  subscriptions: Subscription[];
  googleAccounts: GoogleAccount[];
  businessProfiles: BusinessProfile[];
  posts: Post[];
  reviews: Review[];
  analytics: AnalyticsMetric[];
  rankings: RankingGrid[];
  competitors: Competitor[];
  faqs: FAQ[];
  invoices: Invoice[];
}

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'db.json');

// Helper to ensure database folder exists
function ensureDirectoryExistence(filePath: string) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

// Initial/Seeded Database state
const INITIAL_DATABASE: DatabaseSchema = {
  organizations: [
    { id: "org-1", name: "Premium Dental Care Corp", createdAt: "2026-01-10T12:00:00Z" },
    { id: "org-2", name: "The Artisanal Pizza Co", createdAt: "2026-03-15T09:00:00Z" }
  ],
  users: [
    { id: "usr-1", email: "clientscreativehubconstruction@gmail.com", name: "Dr. Catherine Bennett", role: "owner" },
    { id: "usr-2", email: "pizza.owner@example.com", name: "Marco Rossi", role: "owner" }
  ],
  memberships: [
    { id: "mem-1", userId: "usr-1", organizationId: "org-1", role: "owner" },
    { id: "mem-2", userId: "usr-2", organizationId: "org-2", role: "owner" }
  ],
  subscriptions: [
    {
      id: "sub-1",
      organizationId: "org-1",
      planId: "pro",
      status: "active",
      periodStart: "2026-06-04T00:00:00Z",
      periodEnd: "2026-08-04T00:00:00Z",
      amount: 49.00
    },
    {
      id: "sub-2",
      organizationId: "org-2",
      planId: "starter",
      status: "active",
      periodStart: "2026-06-15T00:00:00Z",
      periodEnd: "2026-07-15T00:00:00Z",
      amount: 19.00
    }
  ],
  googleAccounts: [
    {
      id: "gac-1",
      organizationId: "org-1",
      googleAccountId: "g-101",
      email: "dentist.care@gmail.com",
      oauthRefreshToken: "1//04_mock_refresh_token_dental_care_api_secrets",
      isConnected: true,
      connectedAt: "2026-01-11T14:30:00Z"
    }
  ],
  businessProfiles: [
    {
      id: "prof-1",
      organizationId: "org-1",
      googleAccountId: "g-101",
      locationId: "loc-dental-downtown",
      name: "Bennett Dental Downtown & Cosmetic Center",
      category: "Dentist",
      address: "450 Sutter St Suite 1800, San Francisco, CA 94108",
      phone: "(415) 555-0192",
      website: "https://www.bennettdentalcosmetic.com",
      rating: 4.8,
      reviewCount: 142,
      status: "verified",
      lastAuditedAt: "2026-07-02T10:00:00Z",
      auditRecommendations: "### Local SEO & Profile Audit - Bennett Dental Downtown\n\n**Missing Information & Immediate Gaps:**\n1. **Secondary Categories**: Currently listed only under 'Dentist'. You are missing critical high-search volumes by not adding 'Cosmetic Dentist', 'Teeth Whitening Service', and 'Dental Clinic'.\n2. **Profile Completeness**: Your appointment link goes to a generic contact page rather than your direct booking scheduler. Fix this to boost conversions.\n3. **Services List**: Clear services are missing for Invisalign, Dental Implants, and Emergency Dentistry.\n\n**Category Suggestions:**\n- Primary: **Dentist**\n- Secondary: **Cosmetic Dentist**, **Dental Clinic**, **Teeth Whitening Service**, **Emergency Dental Service**\n\n**Description Enhancements:**\n*Current*: 'Friendly dental clinic in downtown San Francisco offering fillings, cleanings, and cosmetic work.'\n*Recommended (SEO Optimized)*: 'Bennett Dental Downtown & Cosmetic Center is San Francisco\\'s premier boutique dental clinic, specializing in cosmetic dentistry, teeth whitening, veneers, Invisalign, and emergency dental care. Located conveniently on Sutter St, our experienced dentists provide warm, friendly, and state-of-the-art care. Book your appointment online today!'\n\n**FAQ Ideas to Add:**\n- *Q: Do you offer emergency dental services in San Francisco?*\n  *A: Yes! We offer same-day emergency dental appointments for tooth pain, broken teeth, and dental trauma at our downtown SF location.*\n- *Q: Is dental parking available nearby?*\n  *A: Yes, there is public parking directly adjacent to Sutter Street, and we are easily accessible via BART (Montgomery St Station).*"
    }
  ],
  posts: [
    {
      id: "post-1",
      organizationId: "org-1",
      profileId: "prof-1",
      headline: "💡 Why Professional Teeth Whitening is Worth It",
      content: "Thinking about brightening your smile? While over-the-counter kits are tempting, professional teeth whitening provides dramatically faster, safer, and longer-lasting results under expert supervision. Our custom-molded trays minimize sensitivity while maximizing shine. Ask us about our summer bright-smile specials at Bennett Dental Downtown!\n\n#TeethWhitening #SanFranciscoDentist #CosmeticDentistry #SmileCare #DowntownSF",
      imageUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=600",
      ctaType: "BOOK",
      ctaUrl: "https://www.bennettdentalcosmetic.com/book",
      scheduledAt: "2026-07-05T09:00:00Z",
      status: "scheduled"
    },
    {
      id: "post-2",
      organizationId: "org-1",
      profileId: "prof-1",
      headline: "🦷 Combat Cavities: 3 Tips from Dr. Catherine Bennett",
      content: "Regular dental health isn't just about brushing! Here are 3 clinical dental tips from our team:\n\n1. Floss daily to remove plaque where brushes can't reach.\n2. Swap sugary snacks for crisp veggies like celery and carrots.\n3. Drink water right after meals to wash away acidic residue.\n\nReady for your dental hygiene checkup? Schedule today!",
      imageUrl: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=600",
      ctaType: "LEARN_MORE",
      ctaUrl: "https://www.bennettdentalcosmetic.com/blog",
      scheduledAt: "2026-07-03T10:00:00Z",
      status: "published",
      publishedAt: "2026-07-03T10:00:30Z",
      metrics: { views: 184, clicks: 22 }
    }
  ],
  reviews: [
    {
      id: "rev-1",
      organizationId: "org-1",
      profileId: "prof-1",
      reviewerName: "David Sterling",
      reviewerAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
      rating: 5,
      comment: "Absolutely the best dental experience in San Francisco. Dr. Catherine Bennett was extremely gentle, explained the whole process, and the downtown clinic is beautiful and modern. Highly recommend their cosmetic teeth whitening!",
      sentiment: "positive",
      reviewTime: "2026-07-03T15:20:00Z",
      replyText: "Hi David! Thank you so much for the wonderful review. We are delighted to hear you had a great experience and enjoyed our modern downtown clinic. It's always our pleasure to deliver gentle, high-quality care. We look forward to seeing you at your next visit! - Dr. Bennett and Team",
      replyStatus: "replied",
      repliedAt: "2026-07-03T17:15:00Z"
    },
    {
      id: "rev-2",
      organizationId: "org-1",
      profileId: "prof-1",
      reviewerName: "Amara Jones",
      reviewerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
      rating: 2,
      comment: "The cleaning was good, but the billing department was super confusing. They told me my insurance would cover 100% of the premium scan, but then I received an unexpected bill in the mail. Frustrated with the lack of communication.",
      sentiment: "negative",
      reviewTime: "2026-07-02T11:05:00Z",
      replyStatus: "draft",
      replyText: "Dear Amara, thank you for sharing your feedback. We sincerely apologize for any confusion and frustration regarding your billing and insurance coverage. We aim for complete transparency with our patient accounts. Our office manager will reach out to you directly today to review the invoice and find a resolution. We appreciate your patience as we make this right. - Bennett Dental Team"
    }
  ],
  analytics: [
    { id: "an-1", organizationId: "org-1", profileId: "prof-1", date: "2026-06-28", views: 250, calls: 12, websiteClicks: 30, directionRequests: 18 },
    { id: "an-2", organizationId: "org-1", profileId: "prof-1", date: "2026-06-29", views: 280, calls: 14, websiteClicks: 35, directionRequests: 22 },
    { id: "an-3", organizationId: "org-1", profileId: "prof-1", date: "2026-06-30", views: 310, calls: 19, websiteClicks: 42, directionRequests: 25 },
    { id: "an-4", organizationId: "org-1", profileId: "prof-1", date: "2026-07-01", views: 295, calls: 11, websiteClicks: 38, directionRequests: 19 },
    { id: "an-5", organizationId: "org-1", profileId: "prof-1", date: "2026-07-02", views: 330, calls: 22, websiteClicks: 47, directionRequests: 28 },
    { id: "an-6", organizationId: "org-1", profileId: "prof-1", date: "2026-07-03", views: 350, calls: 25, websiteClicks: 52, directionRequests: 31 },
    { id: "an-7", organizationId: "org-1", profileId: "prof-1", date: "2026-07-04", views: 380, calls: 28, websiteClicks: 60, directionRequests: 34 }
  ],
  rankings: [
    // Representing a 3x3 local grid for "Cosmetic Dentist SF"
    { id: "rn-1", organizationId: "org-1", profileId: "prof-1", keyword: "Cosmetic Dentist SF", gridX: 1, gridY: 1, rank: 2 },
    { id: "rn-2", organizationId: "org-1", profileId: "prof-1", keyword: "Cosmetic Dentist SF", gridX: 1, gridY: 2, rank: 1 },
    { id: "rn-3", organizationId: "org-1", profileId: "prof-1", keyword: "Cosmetic Dentist SF", gridX: 1, gridY: 3, rank: 3 },
    { id: "rn-4", organizationId: "org-1", profileId: "prof-1", keyword: "Cosmetic Dentist SF", gridX: 2, gridY: 1, rank: 4 },
    { id: "rn-5", organizationId: "org-1", profileId: "prof-1", keyword: "Cosmetic Dentist SF", gridX: 2, gridY: 2, rank: 2 },
    { id: "rn-6", organizationId: "org-1", profileId: "prof-1", keyword: "Cosmetic Dentist SF", gridX: 2, gridY: 3, rank: 5 },
    { id: "rn-7", organizationId: "org-1", profileId: "prof-1", keyword: "Cosmetic Dentist SF", gridX: 3, gridY: 1, rank: 7 },
    { id: "rn-8", organizationId: "org-1", profileId: "prof-1", keyword: "Cosmetic Dentist SF", gridX: 3, gridY: 2, rank: 3 },
    { id: "rn-9", organizationId: "org-1", profileId: "prof-1", keyword: "Cosmetic Dentist SF", gridX: 3, gridY: 3, rank: 8 },

    // Representing a 3x3 local grid for "Teeth Whitening San Francisco"
    { id: "rn-10", organizationId: "org-1", profileId: "prof-1", keyword: "Teeth Whitening San Francisco", gridX: 1, gridY: 1, rank: 1 },
    { id: "rn-11", organizationId: "org-1", profileId: "prof-1", keyword: "Teeth Whitening San Francisco", gridX: 1, gridY: 2, rank: 1 },
    { id: "rn-12", organizationId: "org-1", profileId: "prof-1", keyword: "Teeth Whitening San Francisco", gridX: 1, gridY: 3, rank: 2 },
    { id: "rn-13", organizationId: "org-1", profileId: "prof-1", keyword: "Teeth Whitening San Francisco", gridX: 2, gridY: 1, rank: 2 },
    { id: "rn-14", organizationId: "org-1", profileId: "prof-1", keyword: "Teeth Whitening San Francisco", gridX: 2, gridY: 2, rank: 3 },
    { id: "rn-15", organizationId: "org-1", profileId: "prof-1", keyword: "Teeth Whitening San Francisco", gridX: 2, gridY: 3, rank: 11 },
    { id: "rn-16", organizationId: "org-1", profileId: "prof-1", keyword: "Teeth Whitening San Francisco", gridX: 3, gridY: 1, rank: 5 },
    { id: "rn-17", organizationId: "org-1", profileId: "prof-1", keyword: "Teeth Whitening San Francisco", gridX: 3, gridY: 2, rank: 9 },
    { id: "rn-18", organizationId: "org-1", profileId: "prof-1", keyword: "Teeth Whitening San Francisco", gridX: 3, gridY: 3, rank: 14 }
  ],
  competitors: [
    {
      id: "comp-1",
      organizationId: "org-1",
      profileId: "prof-1",
      name: "Sutter Dental Boutique SF",
      category: "Cosmetic Dentist",
      address: "450 Sutter St #1500, San Francisco, CA 94108",
      rating: 4.9,
      reviewCount: 280,
      gaps: ["Lists Invisalign as primary service in GMB description", "Actively posts 4 times a week on Google Business Posts", "Has custom Q&A section with 12 questions"],
      suggestions: "Increase your weekly posting volume to 4 posts. Draft Q&A content around Invisalign pricing, insurance coverage, and appointment scheduling as Sutter Dental Boutique currently captures 18% more local search impression share for Invisalign."
    },
    {
      id: "comp-2",
      organizationId: "org-1",
      profileId: "prof-1",
      name: "Downtown SF Dental Clinic",
      category: "Dental Clinic",
      address: "323 Geary St #500, San Francisco, CA 94102",
      rating: 4.6,
      reviewCount: 94,
      gaps: ["Missing specific Cosmetic Dentistry primary category", "Slow to reply to reviews (takes 6 days on average)"],
      suggestions: "Capitalize on their slow response rate by using our AI Review reply automation to respond within 2 hours. This signals higher active user engagement to Google Local Algorithm."
    }
  ],
  faqs: [
    {
      id: "faq-1",
      organizationId: "org-1",
      profileId: "prof-1",
      question: "Are emergency dentist appointments available on weekends?",
      answer: "We offer weekend emergency standby coverage. Please call our central booking line directly to verify availability for urgent treatment on Saturdays and Sundays.",
      isPublished: true,
      createdAt: "2026-04-01T08:00:00Z"
    },
    {
      id: "faq-2",
      organizationId: "org-1",
      profileId: "prof-1",
      question: "Do you accept major dental PPO insurance plans?",
      answer: "Yes, we accept and are in-network with most major Dental PPO plans, including Delta Dental, Cigna, MetLife, Aetna, and Guardian. We provide complementary insurance benefit checks prior to your visit.",
      isPublished: true,
      createdAt: "2026-04-02T09:30:00Z"
    }
  ],
  invoices: [
    { id: "inv-1", organizationId: "org-1", invoiceNumber: "INV-2026-001", date: "2026-05-04", amount: 49.00, planId: "pro", status: "paid" },
    { id: "inv-2", organizationId: "org-1", invoiceNumber: "INV-2026-002", date: "2026-06-04", amount: 49.00, planId: "pro", status: "paid" },
    { id: "inv-3", organizationId: "org-2", invoiceNumber: "INV-2026-101", date: "2026-06-15", amount: 19.00, planId: "starter", status: "paid" }
  ]
};

class DBManager {
  private data: DatabaseSchema;

  constructor() {
    this.data = { ...INITIAL_DATABASE };
    this.load();
  }

  // Load database from file
  private load() {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        this.data = JSON.parse(fileContent);
      } else {
        this.save();
      }
    } catch (e) {
      console.error("Error loading database:", e);
      this.data = { ...INITIAL_DATABASE };
    }
  }

  // Save database to file
  private save() {
    try {
      ensureDirectoryExistence(DB_FILE_PATH);
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error("Error saving database:", e);
    }
  }

  // Helper to get next UUID-like random id
  private generateId(prefix: string): string {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Row-Level Isolation Queries (Tenant Specific)
  public getOrganizations(): Organization[] {
    return this.data.organizations;
  }

  public getOrganizationById(id: string): Organization | undefined {
    return this.data.organizations.find(o => o.id === id);
  }

  public createOrganization(name: string): Organization {
    const org: Organization = {
      id: this.generateId('org'),
      name,
      createdAt: new Date().toISOString()
    };
    this.data.organizations.push(org);

    // Auto-create active subscription
    const sub: Subscription = {
      id: this.generateId('sub'),
      organizationId: org.id,
      planId: 'free',
      status: 'active',
      periodStart: new Date().toISOString(),
      periodEnd: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
      amount: 0
    };
    this.data.subscriptions.push(sub);

    this.save();
    return org;
  }

  public getUsers(orgId: string): User[] {
    const memberships = this.data.memberships.filter(m => m.organizationId === orgId);
    const userIds = memberships.map(m => m.userId);
    return this.data.users.filter(u => userIds.includes(u.id));
  }

  public addUserToOrg(orgId: string, email: string, name: string, role: 'owner' | 'admin' | 'member'): User {
    let user = this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      user = {
        id: this.generateId('usr'),
        email,
        name,
        role
      };
      this.data.users.push(user);
    }
    
    const membership: Membership = {
      id: this.generateId('mem'),
      userId: user.id,
      organizationId: orgId,
      role
    };
    this.data.memberships.push(membership);
    this.save();
    return user;
  }

  public getSubscription(orgId: string): Subscription | undefined {
    return this.data.subscriptions.find(s => s.organizationId === orgId);
  }

  public updateSubscription(orgId: string, planId: 'free' | 'starter' | 'pro' | 'agency', status: 'active' | 'cancelled') {
    const sub = this.data.subscriptions.find(s => s.organizationId === orgId);
    const amounts = { free: 0, starter: 19, pro: 49, agency: 99 };
    
    if (sub) {
      sub.planId = planId;
      sub.status = status === 'active' ? 'active' : 'cancelled';
      sub.amount = amounts[planId];
      sub.periodStart = new Date().toISOString();
      sub.periodEnd = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString();
    } else {
      this.data.subscriptions.push({
        id: this.generateId('sub'),
        organizationId: orgId,
        planId,
        status: status === 'active' ? 'active' : 'cancelled',
        periodStart: new Date().toISOString(),
        periodEnd: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
        amount: amounts[planId]
      });
    }

    // Generate Invoice
    if (amounts[planId] > 0) {
      this.data.invoices.push({
        id: this.generateId('inv'),
        organizationId: orgId,
        invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 900) + 100}`,
        date: new Date().toISOString().split('T')[0],
        amount: amounts[planId],
        planId: planId,
        status: 'paid'
      });
    }

    this.save();
  }

  public getGoogleAccounts(orgId: string): GoogleAccount[] {
    return this.data.googleAccounts.filter(ga => ga.organizationId === orgId);
  }

  public connectGoogleAccount(orgId: string, email: string, googleAccountId: string): GoogleAccount {
    // Delete existing connection if any
    this.data.googleAccounts = this.data.googleAccounts.filter(ga => ga.organizationId !== orgId || ga.googleAccountId !== googleAccountId);
    
    const account: GoogleAccount = {
      id: this.generateId('gac'),
      organizationId: orgId,
      googleAccountId,
      email,
      oauthRefreshToken: "oauth_refresh_token_" + Math.random().toString(36).substr(2, 12),
      isConnected: true,
      connectedAt: new Date().toISOString()
    };
    this.data.googleAccounts.push(account);

    // Auto-create a sample business profile for this connected account
    const profileName = email.split('@')[0].split('.').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + " GMB Service";
    this.data.businessProfiles.push({
      id: this.generateId('prof'),
      organizationId: orgId,
      googleAccountId: googleAccountId,
      locationId: `loc-${Math.floor(Math.random() * 100000)}`,
      name: profileName,
      category: "Professional Services",
      address: "100 Pine St, San Francisco, CA 94111",
      phone: "(415) 555-9000",
      website: `https://www.${email.split('@')[0]}.com`,
      rating: 4.5,
      reviewCount: 12,
      status: "verified"
    });

    this.save();
    return account;
  }

  public disconnectGoogleAccount(orgId: string, accountId: string) {
    // Disconnect google account
    const accounts = this.data.googleAccounts.filter(ga => ga.id === accountId && ga.organizationId === orgId);
    accounts.forEach(ga => {
      ga.isConnected = false;
    });

    // Remove profiles and secondary entities associated with profiles under this account
    const connectedProfiles = this.data.businessProfiles.filter(p => p.organizationId === orgId && accounts.some(ga => ga.googleAccountId === p.googleAccountId));
    const profileIds = connectedProfiles.map(p => p.id);

    this.data.businessProfiles = this.data.businessProfiles.filter(p => p.organizationId !== orgId || !profileIds.includes(p.id));
    this.data.posts = this.data.posts.filter(po => po.organizationId !== orgId || !profileIds.includes(po.profileId));
    this.data.reviews = this.data.reviews.filter(r => r.organizationId !== orgId || !profileIds.includes(r.profileId));
    this.data.faqs = this.data.faqs.filter(f => f.organizationId !== orgId || !profileIds.includes(f.profileId));
    this.data.rankings = this.data.rankings.filter(ra => ra.organizationId !== orgId || !profileIds.includes(ra.profileId));
    this.data.competitors = this.data.competitors.filter(c => c.organizationId !== orgId || !profileIds.includes(c.profileId));

    this.data.googleAccounts = this.data.googleAccounts.filter(ga => !(ga.id === accountId && ga.organizationId === orgId));

    this.save();
  }

  public getBusinessProfiles(orgId: string): BusinessProfile[] {
    return this.data.businessProfiles.filter(bp => bp.organizationId === orgId);
  }

  public updateBusinessProfileAudit(orgId: string, profileId: string, auditText: string) {
    const prof = this.data.businessProfiles.find(bp => bp.id === profileId && bp.organizationId === orgId);
    if (prof) {
      prof.auditRecommendations = auditText;
      prof.lastAuditedAt = new Date().toISOString();
      this.save();
    }
  }

  public deleteBusinessProfile(orgId: string, profileId: string) {
    this.data.businessProfiles = this.data.businessProfiles.filter(p => !(p.id === profileId && p.organizationId === orgId));
    this.data.posts = this.data.posts.filter(po => !(po.profileId === profileId && po.organizationId === orgId));
    this.data.reviews = this.data.reviews.filter(r => !(r.profileId === profileId && r.organizationId === orgId));
    this.data.faqs = this.data.faqs.filter(f => !(f.profileId === profileId && f.organizationId === orgId));
    this.data.rankings = this.data.rankings.filter(ra => !(ra.profileId === profileId && ra.organizationId === orgId));
    this.data.competitors = this.data.competitors.filter(c => !(c.profileId === profileId && c.organizationId === orgId));
    this.save();
  }

  public getPosts(orgId: string): Post[] {
    return this.data.posts.filter(po => po.organizationId === orgId);
  }

  public createPost(orgId: string, post: Omit<Post, 'id' | 'organizationId'>): Post {
    const newPost: Post = {
      ...post,
      id: this.generateId('post'),
      organizationId: orgId
    };
    this.data.posts.push(newPost);
    this.save();
    return newPost;
  }

  public updatePost(orgId: string, postId: string, updates: Partial<Post>) {
    const post = this.data.posts.find(po => po.id === postId && po.organizationId === orgId);
    if (post) {
      Object.assign(post, updates);
      this.save();
    }
    return post;
  }

  public deletePost(orgId: string, postId: string) {
    this.data.posts = this.data.posts.filter(p => !(p.id === postId && p.organizationId === orgId));
    this.save();
  }

  public getReviews(orgId: string): Review[] {
    return this.data.reviews.filter(r => r.organizationId === orgId);
  }

  public createReview(orgId: string, review: Omit<Review, 'id' | 'organizationId'>): Review {
    const newReview: Review = {
      ...review,
      id: this.generateId('rev'),
      organizationId: orgId
    };
    this.data.reviews.push(newReview);
    this.save();
    return newReview;
  }

  public replyToReview(orgId: string, reviewId: string, replyText: string, status: 'replied' | 'draft' = 'replied') {
    const review = this.data.reviews.find(r => r.id === reviewId && r.organizationId === orgId);
    if (review) {
      review.replyText = replyText;
      review.replyStatus = status;
      if (status === 'replied') {
        review.repliedAt = new Date().toISOString();
      }
      this.save();
    }
    return review;
  }

  public getAnalytics(orgId: string): AnalyticsMetric[] {
    return this.data.analytics.filter(a => a.organizationId === orgId);
  }

  public getRankings(orgId: string): RankingGrid[] {
    return this.data.rankings.filter(ra => ra.organizationId === orgId);
  }

  public addRankKeyword(orgId: string, profileId: string, keyword: string) {
    // Generate an initial 3x3 local grid for keyword ranks
    for (let x = 1; x <= 3; x++) {
      for (let y = 1; y <= 3; y++) {
        const randRank = Math.floor(Math.random() * 8) + 1; // 1 to 8
        this.data.rankings.push({
          id: this.generateId('rn'),
          organizationId: orgId,
          profileId,
          keyword,
          gridX: x,
          gridY: y,
          rank: randRank
        });
      }
    }
    this.save();
  }

  public deleteRankKeyword(orgId: string, profileId: string, keyword: string) {
    this.data.rankings = this.data.rankings.filter(ra => !(ra.organizationId === orgId && ra.profileId === profileId && ra.keyword === keyword));
    this.save();
  }

  public getCompetitors(orgId: string): Competitor[] {
    return this.data.competitors.filter(c => c.organizationId === orgId);
  }

  public createCompetitor(orgId: string, competitor: Omit<Competitor, 'id' | 'organizationId'>): Competitor {
    const comp: Competitor = {
      ...competitor,
      id: this.generateId('comp'),
      organizationId: orgId
    };
    this.data.competitors.push(comp);
    this.save();
    return comp;
  }

  public deleteCompetitor(orgId: string, compId: string) {
    this.data.competitors = this.data.competitors.filter(c => !(c.id === compId && c.organizationId === orgId));
    this.save();
  }

  public getFaqs(orgId: string): FAQ[] {
    return this.data.faqs.filter(f => f.organizationId === orgId);
  }

  public createFAQ(orgId: string, faq: Omit<FAQ, 'id' | 'organizationId'>): FAQ {
    const newFaq: FAQ = {
      ...faq,
      id: this.generateId('faq'),
      organizationId: orgId
    };
    this.data.faqs.push(newFaq);
    this.save();
    return newFaq;
  }

  public updateFAQ(orgId: string, faqId: string, updates: Partial<FAQ>) {
    const faq = this.data.faqs.find(f => f.id === faqId && f.organizationId === orgId);
    if (faq) {
      Object.assign(faq, updates);
      this.save();
    }
    return faq;
  }

  public deleteFAQ(orgId: string, faqId: string) {
    this.data.faqs = this.data.faqs.filter(f => !(f.id === faqId && f.organizationId === orgId));
    this.save();
  }

  public getInvoices(orgId: string): Invoice[] {
    return this.data.invoices.filter(i => i.organizationId === orgId);
  }
}

export const db = new DBManager();
