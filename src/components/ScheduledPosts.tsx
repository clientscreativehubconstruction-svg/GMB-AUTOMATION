import React, { useState } from 'react';
import { Post, BusinessProfile } from '../types';
import { Sparkles, Calendar, Trash2, Send, Clock, Plus, RefreshCw, FileText, CheckCircle } from 'lucide-react';

interface ScheduledPostsProps {
  posts: Post[];
  profiles: BusinessProfile[];
  onCreatePost: (post: Omit<Post, 'id' | 'organizationId'>) => void;
  onUpdatePost: (id: string, updates: Partial<Post>) => void;
  onDeletePost: (id: string) => void;
  onGenerateAISchedule: () => void;
  isGeneratingAI: boolean;
}

export default function ScheduledPosts({
  posts,
  profiles,
  onCreatePost,
  onUpdatePost,
  onDeletePost,
  onGenerateAISchedule,
  isGeneratingAI,
}: ScheduledPostsProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [headline, setHeadline] = useState("");
  const [content, setContent] = useState("");
  const [ctaType, setCtaType] = useState<Post['ctaType']>("BOOK");
  const [ctaUrl, setCtaUrl] = useState("https://www.bennettdentalcosmetic.com/book");
  const [scheduledAt, setScheduledAt] = useState("2026-07-05T09:00:00");
  const [imagePromptGuide, setImagePromptGuide] = useState("");

  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);
  const [isBulkOperating, setIsBulkOperating] = useState(false);
  const [showBulkReschedule, setShowBulkReschedule] = useState(false);
  const [bulkRescheduleDate, setBulkRescheduleDate] = useState("2026-07-05T09:00:00");

  const activeProfile = profiles[0];

  const handleToggleSelect = (postId: string) => {
    setSelectedPostIds(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPostIds.length === posts.length) {
      setSelectedPostIds([]);
    } else {
      setSelectedPostIds(posts.map(p => p.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPostIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedPostIds.length} selected campaigns?`)) return;

    setIsBulkOperating(true);
    try {
      const activeOrgId = activeProfile?.organizationId || posts[0]?.organizationId || "org-1";
      for (let i = 0; i < selectedPostIds.length; i++) {
        const id = selectedPostIds[i];
        if (i === selectedPostIds.length - 1) {
          onDeletePost(id);
        } else {
          await fetch(`/api/posts/${id}?organizationId=${activeOrgId}`, { method: 'DELETE' });
        }
      }
    } catch (err) {
      console.error("Bulk delete failed", err);
    } finally {
      setSelectedPostIds([]);
      setIsBulkOperating(false);
    }
  };

  const handleBulkReschedule = async () => {
    if (selectedPostIds.length === 0) return;
    setIsBulkOperating(true);
    try {
      const activeOrgId = activeProfile?.organizationId || posts[0]?.organizationId || "org-1";
      const formattedDate = new Date(bulkRescheduleDate).toISOString();
      for (let i = 0; i < selectedPostIds.length; i++) {
        const id = selectedPostIds[i];
        if (i === selectedPostIds.length - 1) {
          onUpdatePost(id, { scheduledAt: formattedDate, status: "scheduled" });
        } else {
          await fetch(`/api/posts/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ scheduledAt: formattedDate, status: "scheduled", organizationId: activeOrgId })
          });
        }
      }
      setShowBulkReschedule(false);
    } catch (err) {
      console.error("Bulk reschedule failed", err);
    } finally {
      setSelectedPostIds([]);
      setIsBulkOperating(false);
    }
  };

  const handleBulkPublish = async () => {
    if (selectedPostIds.length === 0) return;
    if (!confirm(`Are you sure you want to publish all ${selectedPostIds.length} selected campaigns live on Google Maps immediately?`)) return;

    setIsBulkOperating(true);
    try {
      const activeOrgId = activeProfile?.organizationId || posts[0]?.organizationId || "org-1";
      for (let i = 0; i < selectedPostIds.length; i++) {
        const id = selectedPostIds[i];
        const publishUpdates = {
          status: "published" as const,
          publishedAt: new Date().toISOString(),
          metrics: { views: 1, clicks: 0 }
        };
        if (i === selectedPostIds.length - 1) {
          onUpdatePost(id, publishUpdates);
        } else {
          await fetch(`/api/posts/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...publishUpdates, organizationId: activeOrgId })
          });
        }
      }
    } catch (err) {
      console.error("Bulk publish failed", err);
    } finally {
      setSelectedPostIds([]);
      setIsBulkOperating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline || !content) return;

    onCreatePost({
      profileId: activeProfile?.id || "prof-1",
      headline,
      content,
      ctaType,
      ctaUrl,
      scheduledAt: new Date(scheduledAt).toISOString(),
      status: "scheduled",
      imageUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=600"
    });

    setHeadline("");
    setContent("");
    setCtaType("BOOK");
    setImagePromptGuide("");
    setShowCreateForm(false);
  };

  const handleSimulatePublish = (postId: string) => {
    onUpdatePost(postId, {
      status: "published",
      publishedAt: new Date().toISOString(),
      metrics: { views: 1, clicks: 0 }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 rounded-3xl p-6 border border-slate-800">
        <div>
          <h2 className="text-lg font-black text-white uppercase tracking-tighter font-display">Scheduled Campaigns</h2>
          <p className="text-xs text-slate-400">Deploy high-engagement local social content onto Google Search and Maps.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={isGeneratingAI}
            onClick={onGenerateAISchedule}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 rounded-lg text-xs font-black uppercase tracking-widest transition cursor-pointer disabled:opacity-50"
          >
            {isGeneratingAI ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                Orchestrating...
              </>
            ) : (
              <>
                <Sparkles size={14} />
                Generate AI Schedule
              </>
            )}
          </button>

          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-black uppercase tracking-widest transition cursor-pointer"
          >
            <Plus size={14} />
            New Post Draft
          </button>
        </div>
      </div>

      {/* Manual Creation Form */}
      {showCreateForm && (
        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800">
          <div className="flex items-center gap-2 mb-6 text-base font-black text-white uppercase tracking-tighter font-display">
            <Plus size={18} className="text-blue-500" />
            <span>Create Google Social Campaign</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 font-mono">Headline (SEO Keywords + Title)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 🦷 Professional teeth whitening San Francisco special"
                  className="w-full text-xs bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 focus:ring-1 focus:ring-blue-600 focus:outline-none font-bold"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 font-mono">Scheduled Date & Time (Local)</label>
                <input
                  type="datetime-local"
                  required
                  className="w-full text-xs bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 focus:ring-1 focus:ring-blue-600 focus:outline-none font-bold"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 font-mono">Post Content (Max 1500 Characters)</label>
              <textarea
                required
                rows={4}
                placeholder="Include localized keywords (e.g., Downtown SF, Sutter St) and key services info. Rotate tips, promotions, and FAQ highlights..."
                className="w-full text-xs bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 focus:ring-1 focus:ring-blue-600 focus:outline-none resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 font-mono">Call to Action (CTA)</label>
                <select
                  className="w-full text-xs bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 focus:ring-1 focus:ring-blue-600 focus:outline-none font-bold"
                  value={ctaType}
                  onChange={(e) => setCtaType(e.target.value as Post['ctaType'])}
                >
                  <option value="BOOK" className="bg-slate-900">BOOK (Appointment)</option>
                  <option value="LEARN_MORE" className="bg-slate-900">LEARN MORE</option>
                  <option value="CALL" className="bg-slate-900">CALL (Dial Direct)</option>
                  <option value="SHOP" className="bg-slate-900">SHOP</option>
                  <option value="SIGN_UP" className="bg-slate-900">SIGN UP</option>
                  <option value="NONE" className="bg-slate-900">NONE</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 font-mono">CTA Redirect URL</label>
                <input
                  type="url"
                  placeholder="https://yourwebsite.com/landing"
                  className="w-full text-xs bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 focus:ring-1 focus:ring-blue-600 focus:outline-none font-bold"
                  value={ctaUrl}
                  onChange={(e) => setCtaUrl(e.target.value)}
                  disabled={ctaType === 'NONE' || ctaType === 'CALL'}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 border border-slate-800 hover:bg-slate-800 rounded-lg text-xs font-black uppercase tracking-widest text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-black uppercase tracking-widest cursor-pointer"
              >
                Add to Calendar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bulk actions bar if campaigns exist */}
      {posts.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-black text-slate-300 font-mono uppercase tracking-wider">
              <input
                type="checkbox"
                checked={posts.length > 0 && selectedPostIds.length === posts.length}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-blue-600"
              />
              <span>Select All Campaigns ({posts.length})</span>
            </label>
            
            {selectedPostIds.length > 0 && (
              <span className="text-[10px] font-black text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 uppercase tracking-widest font-mono">
                {selectedPostIds.length} Selected
              </span>
            )}
          </div>

          {selectedPostIds.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              {/* Bulk Delete */}
              <button
                onClick={handleBulkDelete}
                disabled={isBulkOperating}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest transition cursor-pointer disabled:opacity-50"
              >
                <Trash2 size={12} />
                Delete Selected
              </button>

              {/* Bulk Reschedule with inline input */}
              <div className="flex items-center gap-2">
                {showBulkReschedule ? (
                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg p-1.5">
                    <input
                      type="datetime-local"
                      value={bulkRescheduleDate}
                      onChange={(e) => setBulkRescheduleDate(e.target.value)}
                      className="text-[10px] bg-slate-900 border border-slate-800 text-white rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-blue-600 font-bold"
                    />
                    <button
                      onClick={handleBulkReschedule}
                      disabled={isBulkOperating}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-black uppercase tracking-wider transition cursor-pointer"
                    >
                      Apply
                    </button>
                    <button
                      onClick={() => setShowBulkReschedule(false)}
                      className="px-2 py-1 border border-slate-800 hover:bg-slate-800 text-slate-400 rounded text-[10px] font-black uppercase tracking-wider transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowBulkReschedule(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest transition cursor-pointer"
                  >
                    <Calendar size={12} />
                    Reschedule
                  </button>
                )}
              </div>

              {/* Bulk Publish */}
              <button
                onClick={handleBulkPublish}
                disabled={isBulkOperating}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white border border-green-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest transition cursor-pointer disabled:opacity-50"
              >
                <Send size={12} />
                Publish Selected
              </button>
            </div>
          )}
        </div>
      )}

      {/* Campaigns list splits by Scheduled / Live */}
      <div className="grid grid-cols-1 gap-6">
        {posts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center">
            <FileText size={40} className="text-slate-600 mb-4 animate-pulse" />
            <span className="text-xs font-black text-white uppercase tracking-wider block">No Campaigns Scheduled</span>
            <p className="text-[11px] text-slate-500 mt-2 max-w-sm uppercase font-black tracking-widest font-mono">
              Use the "Generate AI Schedule" button to automatically deploy our content writer & image prompt agents!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(p => {
              const isSelected = selectedPostIds.includes(p.id);
              return (
                <div 
                  key={p.id} 
                  className={`bg-slate-900 rounded-2xl border p-6 flex gap-4 items-start transition duration-150 ${
                    isSelected 
                      ? 'border-blue-500/50 bg-blue-950/10 shadow-lg shadow-blue-500/5' 
                      : 'border-slate-850 hover:border-slate-800'
                  }`}
                >
                  {/* Select Checkbox */}
                  <div className="pt-1.5 shrink-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelect(p.id)}
                      className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-blue-600"
                    />
                  </div>

                  {/* Right side: layout flex */}
                  <div className="flex-1 flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    
                    {/* Left block: Text Details */}
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-sm border ${p.status === 'published' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                          {p.status === 'published' ? 'Live on Google Maps' : 'Scheduled GMB Post'}
                        </span>
                        <span className="text-sm font-black text-white leading-tight">{p.headline}</span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line truncate max-h-24">
                        {p.content}
                      </p>

                      <div className="flex items-center gap-6 text-[10px] font-black text-slate-500 font-mono uppercase tracking-widest">
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-slate-600" />
                          {p.status === 'published' ? `Published: ${new Date(p.publishedAt || "").toLocaleString()}` : `Scheduled: ${new Date(p.scheduledAt).toLocaleString()}`}
                        </span>
                        {p.ctaType !== 'NONE' && (
                          <span className="bg-slate-950 text-blue-400 border border-slate-800 px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase tracking-wider">
                            CTA: {p.ctaType}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right block: Action control and prompt preview */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 lg:self-stretch justify-between">
                      {/* Visual mockup card with its prompt */}
                      <div className="w-full sm:w-44 bg-slate-950 border border-slate-850 rounded-xl p-3 flex flex-col justify-between">
                        <div className="h-20 w-full rounded-lg overflow-hidden bg-slate-900 relative mb-2">
                          <img 
                            src={p.imageUrl} 
                            alt="Concept Mock" 
                            className="w-full h-full object-cover opacity-80"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <span className="text-[9px] text-slate-500 font-mono uppercase font-bold tracking-tight line-clamp-2" title="Generated by Image Prompt Agent">
                          Image Prompt: Ready for Imagen
                        </span>
                      </div>

                      {/* Operational Button list */}
                      <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                        {p.status !== 'published' && (
                          <button
                            onClick={() => handleSimulatePublish(p.id)}
                            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-black uppercase tracking-widest cursor-pointer transition"
                            title="Bypass schedule queue"
                          >
                            <Send size={12} />
                            Publish
                          </button>
                        )}
                        
                        <button
                          onClick={() => onDeletePost(p.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer transition flex items-center justify-center"
                          title="Delete campaign"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
