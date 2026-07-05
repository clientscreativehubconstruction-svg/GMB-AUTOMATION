import React, { useState } from 'react';
import { Review } from '../types';
import { Sparkles, MessageSquare, Send, CheckCircle, HelpCircle, Star, AlertCircle, RefreshCw, ThumbsUp, Plus } from 'lucide-react';

interface ReviewsCenterProps {
  reviews: Review[];
  onReplyToReview: (id: string, replyText: string, status: 'replied' | 'draft') => void;
  onDraftReplyWithAI: (reviewId: string, reviewerName: string, rating: number, comment: string, tone: string) => Promise<string>;
  onInjectMockReview: (review: { reviewerName: string; rating: number; comment: string; sentiment: 'positive' | 'neutral' | 'negative' }) => void;
  draftingMap: { [key: string]: boolean };
}

export default function ReviewsCenter({
  reviews,
  onReplyToReview,
  onDraftReplyWithAI,
  onInjectMockReview,
  draftingMap,
}: ReviewsCenterProps) {
  const [selectedTones, setSelectedTones] = useState<{ [key: string]: 'professional' | 'apologetic' | 'upbeat' | 'grateful' }>({});
  const [editedDrafts, setEditedDrafts] = useState<{ [key: string]: string }>({});

  const [mockName, setMockName] = useState("");
  const [mockRating, setMockRating] = useState(5);
  const [mockComment, setMockComment] = useState("");
  const [showInjectorForm, setShowInjectorForm] = useState(false);

  const handleToneChange = (reviewId: string, tone: any) => {
    setSelectedTones(prev => ({ ...prev, [reviewId]: tone }));
  };

  const handleTextChange = (reviewId: string, text: string) => {
    setEditedDrafts(prev => ({ ...prev, [reviewId]: text }));
  };

  const handleGenerateAI = async (r: Review) => {
    const tone = selectedTones[r.id] || (r.rating >= 4 ? "grateful" : "apologetic");
    const aiDraftText = await onDraftReplyWithAI(r.id, r.reviewerName, r.rating, r.comment, tone);
    setEditedDrafts(prev => ({ ...prev, [r.id]: aiDraftText }));
  };

  const handlePublish = (reviewId: string) => {
    const replyText = editedDrafts[reviewId] || reviews.find(r => r.id === reviewId)?.replyText || "";
    onReplyToReview(reviewId, replyText, 'replied');
  };

  const handleSaveDraft = (reviewId: string) => {
    const replyText = editedDrafts[reviewId] || reviews.find(r => r.id === reviewId)?.replyText || "";
    onReplyToReview(reviewId, replyText, 'draft');
  };

  const handleMockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mockName || !mockComment) return;

    const sentiment = mockRating >= 4 ? 'positive' : mockRating === 3 ? 'neutral' : 'negative';
    onInjectMockReview({
      reviewerName: mockName,
      rating: mockRating,
      comment: mockComment,
      sentiment
    });

    setMockName("");
    setMockComment("");
    setShowInjectorForm(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar with mock review injector trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 rounded-3xl p-6 border border-slate-800">
        <div>
          <h2 className="text-lg font-black text-white uppercase tracking-tighter font-display">Review Center</h2>
          <p className="text-xs text-slate-400">Monitor reputation, analyze sentiment, and automate customer engagement replies.</p>
        </div>

        <button
          onClick={() => setShowInjectorForm(!showInjectorForm)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-black uppercase tracking-widest transition cursor-pointer"
        >
          <Plus size={14} />
          Inject Test Review
        </button>
      </div>

      {/* Mock Review Injector form */}
      {showInjectorForm && (
        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl">
          <div className="flex items-center gap-1.5 mb-6 text-sm font-black text-white uppercase tracking-tighter font-display">
            <Plus size={14} className="text-blue-500" />
            <span>Simulate a Customer Review (Real-Time Reply Test)</span>
          </div>

          <form onSubmit={handleMockSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 font-mono">Reviewer Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Michael Thorne"
                className="w-full text-xs bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 focus:ring-1 focus:ring-blue-600 focus:outline-none font-bold"
                value={mockName}
                onChange={(e) => setMockName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 font-mono">Rating Star (1 to 5)</label>
              <select
                className="w-full text-xs bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 focus:ring-1 focus:ring-blue-600 focus:outline-none font-bold"
                value={mockRating}
                onChange={(e) => setMockRating(parseInt(e.target.value))}
              >
                <option value="5" className="bg-slate-900">⭐⭐⭐⭐⭐ (5 Stars)</option>
                <option value="4" className="bg-slate-900">⭐⭐⭐⭐ (4 Stars)</option>
                <option value="3" className="bg-slate-900">⭐⭐⭐ (3 Stars)</option>
                <option value="2" className="bg-slate-900">⭐⭐ (2 Stars)</option>
                <option value="1" className="bg-slate-900">⭐ (1 Star)</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 font-mono">Comment</label>
              <input
                type="text"
                required
                placeholder="Share clean, specific dental or restaurant details to test semantic reply filters..."
                className="w-full text-xs bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 focus:ring-1 focus:ring-blue-600 focus:outline-none font-sans"
                value={mockComment}
                onChange={(e) => setMockComment(e.target.value)}
              />
            </div>

            <div className="md:col-span-3 flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowInjectorForm(false)}
                className="px-4 py-2 border border-slate-800 hover:bg-slate-800 rounded-lg text-xs font-black uppercase tracking-widest text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-black uppercase tracking-widest cursor-pointer"
              >
                Inject Review
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews feed list */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center">
            <MessageSquare size={36} className="text-slate-600 mb-4 animate-pulse" />
            <span className="text-xs font-black text-white uppercase tracking-wider block">No Reviews Found</span>
            <p className="text-[11px] text-slate-500 mt-2 max-w-sm uppercase font-black tracking-widest font-mono">
              Inject a mock review or switch organizations to view reviews feed.
            </p>
          </div>
        ) : (
          reviews.map(r => {
            const isDrafting = draftingMap[r.id] || false;
            const currentTone = selectedTones[r.id] || (r.rating >= 4 ? "grateful" : "apologetic");
            const currentDraftText = editedDrafts[r.id] !== undefined ? editedDrafts[r.id] : (r.replyText || "");

            return (
              <div key={r.id} className="bg-slate-900 border border-slate-850 rounded-2xl p-6 flex flex-col gap-4">
                
                {/* Top header: Reviewer metadata */}
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-950 border border-slate-800 overflow-hidden shrink-0">
                      <img 
                        src={r.reviewerAvatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100`} 
                        alt={r.reviewerName} 
                        className="h-full w-full object-cover opacity-90"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white uppercase tracking-wide">{r.reviewerName}</h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={11} 
                              className={`${i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-800'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono font-bold">
                          {new Date(r.reviewTime).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Sentiment tag */}
                  <span className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-sm border ${
                    r.sentiment === 'positive' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                    r.sentiment === 'negative' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}>
                    {r.sentiment === 'positive' && <ThumbsUp size={10} />}
                    Sentiment: {r.sentiment}
                  </span>
                </div>

                {/* Review comment */}
                <p className="text-xs text-slate-300 leading-relaxed font-sans pl-1 italic">
                  "{r.comment}"
                </p>

                {/* Reply Section */}
                <div className="bg-slate-950 rounded-xl p-5 border border-slate-850">
                  <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                      <Sparkles size={11} className="text-blue-500 animate-pulse" />
                      AI Response Agent Draft
                    </span>

                    {/* Tone selector */}
                    {r.replyStatus !== 'replied' && (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 font-mono font-black uppercase tracking-wider">Tone:</span>
                        <select
                          className="bg-slate-900 border border-slate-800 rounded-md px-2 py-0.5 text-[10px] font-black text-slate-300 cursor-pointer uppercase tracking-wider"
                          value={currentTone}
                          onChange={(e) => handleToneChange(r.id, e.target.value)}
                        >
                          <option value="grateful" className="bg-slate-950">Grateful & Warm</option>
                          <option value="professional" className="bg-slate-950">Professional / Crisp</option>
                          <option value="apologetic" className="bg-slate-950">Apologetic & Solving</option>
                          <option value="upbeat" className="bg-slate-950">Upbeat & Energetic</option>
                        </select>

                        <button
                          disabled={isDrafting}
                          onClick={() => handleGenerateAI(r)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600 text-white rounded-md text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 cursor-pointer disabled:opacity-50"
                        >
                          {isDrafting ? <RefreshCw size={10} className="animate-spin" /> : 'Re-Draft'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Reply text display / textarea editor */}
                  {r.replyStatus === 'replied' ? (
                    <div className="space-y-2">
                      <p className="text-xs text-slate-300 italic font-sans leading-relaxed">
                        "{r.replyText}"
                      </p>
                      <div className="flex items-center gap-1 text-[9px] text-green-400 font-black uppercase tracking-widest font-mono pt-1">
                        <CheckCircle size={11} />
                        <span>Published response active on GMB profile.</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <textarea
                        rows={3}
                        className="w-full bg-slate-900 text-xs border border-slate-800 text-white rounded-lg p-2.5 focus:ring-1 focus:ring-blue-600 focus:outline-none resize-none font-sans"
                        placeholder="AI will draft a response. You can also type or tweak the message here..."
                        value={currentDraftText}
                        onChange={(e) => handleTextChange(r.id, e.target.value)}
                      />

                      <div className="flex justify-end gap-3">
                        <button
                          disabled={!currentDraftText}
                          onClick={() => handleSaveDraft(r.id)}
                          className="px-3 py-1.5 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded text-[10px] font-black uppercase tracking-widest cursor-pointer"
                        >
                          Save Draft
                        </button>
                        <button
                          disabled={!currentDraftText}
                          onClick={() => handlePublish(r.id)}
                          className="inline-flex items-center gap-1 px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-[10px] font-black uppercase tracking-widest cursor-pointer"
                        >
                          <Send size={10} />
                          Publish Reply
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
