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
  auditRecommendations?: string;
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
  scheduledAt: string;
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
  rating: number;
  comment: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  reviewTime: string;
  replyText?: string;
  replyStatus: 'unreplied' | 'draft' | 'replied' | 'failed';
  repliedAt?: string;
}

export interface AnalyticsMetric {
  id: string;
  organizationId: string;
  profileId: string;
  date: string;
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
  gridX: number;
  gridY: number;
  rank: number;
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
}

export type DashboardTab =
  | 'overview'
  | 'health'
  | 'calendar'
  | 'posts'
  | 'reviews'
  | 'analytics'
  | 'rankings'
  | 'competitors'
  | 'faqs'
  | 'automation'
  | 'billing'
  | 'settings';
