import React, { useState } from 'react';
import { Competitor, FAQ, BusinessProfile } from '../types';
import { Sparkles, Users, FileQuestion, Plus, Trash2, CheckCircle, HelpCircle, AlertCircle, TrendingUp } from 'lucide-react';

interface CompetitorFAQProps {
  competitors: Competitor[];
  faqs: FAQ[];
  profiles: BusinessProfile[];
  onAddCompetitor: (competitor: Omit<Competitor, 'id' | 'organizationId'>) => void;
  onDeleteCompetitor: (id: string) => void;
  onAddFAQ: (faq: Omit<FAQ, 'id' | 'organizationId'>) => void;
  onToggleFAQPublish: (id: string, isPublished: boolean) => void;
  onDeleteFAQ: (id: string) => void;
}

export default function CompetitorFAQ({
  competitors,
  faqs,
  profiles,
  onAddCompetitor,
  onDeleteCompetitor,
  onAddFAQ,
  onToggleFAQPublish,
  onDeleteFAQ,
}: CompetitorFAQProps) {
  const [showFAQForm, setShowFAQForm] = useState(false);
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");

  const [showCompForm, setShowCompForm] = useState(false);
  const [compName, setCompName] = useState("");
  const [compCategory, setCompCategory] = useState("Cosmetic Dentist");
  const [compAddress, setCompAddress] = useState("");

  const activeProfile = profiles[0];

  const handleFAQSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQuestion || !faqAnswer) return;

    onAddFAQ({
      profileId: activeProfile?.id || "prof-1",
      question: faqQuestion,
      answer: faqAnswer,
      isPublished: true,
      createdAt: new Date().toISOString()
    });

    setFaqQuestion("");
    setFaqAnswer("");
    setShowFAQForm(false);
  };

  const handleCompSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compName || !compAddress) return;

    onAddCompetitor({
      profileId: activeProfile?.id || "prof-1",
      name: compName,
      category: compCategory,
      address: compAddress,
      rating: 4.5,
      reviewCount: 30,
      gaps: ["Not active on Google Business Posts updates", "Missing appointment direct scheduling URLs"],
      suggestions: `Generate 4 posts weekly targeting local neighborhoods surrounding ${compAddress} to outrank them.`
    });

    setCompName("");
    setCompAddress("");
    setShowCompForm(false);
  };

  return (
    <div className="space-y-6">
      
      {/* SECTION 1: COMPETITOR GAP ANALYSIS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 rounded-3xl p-6 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-950 text-blue-400 rounded-xl flex items-center justify-center border border-blue-900">
              <Users size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-tighter font-display">Competitor Gap Analysis</h2>
              <p className="text-xs text-slate-400">Benchmark surrounding businesses on Maps and discover local optimization opportunities.</p>
            </div>
          </div>

          <button
            onClick={() => setShowCompForm(!showCompForm)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-black uppercase tracking-widest transition cursor-pointer"
          >
            <Plus size={14} />
            Track Competitor
          </button>
        </div>

        {/* Create Competitor Form */}
        {showCompForm && (
          <form onSubmit={handleCompSubmit} className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 font-mono">Competitor Business Name</label>
              <input
                type="text"
                required
                placeholder="e.g. SF Smile Boutique"
                className="w-full text-xs bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 focus:ring-1 focus:ring-blue-600 focus:outline-none font-bold"
                value={compName}
                onChange={(e) => setCompName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 font-mono">Primary GMB Category</label>
              <input
                type="text"
                required
                placeholder="e.g. Cosmetic Dentist"
                className="w-full text-xs bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 focus:ring-1 focus:ring-blue-600 focus:outline-none font-bold"
                value={compCategory}
                onChange={(e) => setCompCategory(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 font-mono">Address Location</label>
              <input
                type="text"
                required
                placeholder="e.g. 450 Sutter St Suite 200, SF"
                className="w-full text-xs bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 focus:ring-1 focus:ring-blue-600 focus:outline-none font-sans"
                value={compAddress}
                onChange={(e) => setCompAddress(e.target.value)}
              />
            </div>

            <div className="md:col-span-3 flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowCompForm(false)}
                className="px-4 py-2 border border-slate-800 hover:bg-slate-800 rounded-lg text-xs font-black uppercase tracking-widest text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-black uppercase tracking-widest cursor-pointer"
              >
                Start Auditing
              </button>
            </div>
          </form>
        )}

        {/* Competitor Benchmark cards list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {competitors.length === 0 ? (
            <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center">
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest font-mono">No competitor benchmarks added.</p>
            </div>
          ) : (
            competitors.map(c => (
              <div key={c.id} className="bg-slate-900 border border-slate-850 rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-tighter font-display leading-snug">{c.name}</h3>
                    <span className="text-[10px] text-blue-400 font-mono font-bold">{c.category} • {c.address}</span>
                  </div>
                  <button
                    onClick={() => onDeleteCompetitor(c.id)}
                    className="p-1 text-slate-500 hover:text-rose-500 transition cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                {/* Rating details */}
                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <TrendingUp size={14} className="text-green-400" />
                  <span>Rating: <strong className="text-white font-black">{c.rating}</strong> ({c.reviewCount} reviews)</span>
                </div>

                {/* Gaps detected */}
                <div className="bg-slate-950 rounded-xl p-4 space-y-2 border border-slate-850">
                  <span className="text-[10px] font-black text-white uppercase tracking-widest font-mono block">Identified Gaps & Advantages:</span>
                  <ul className="space-y-1.5">
                    {c.gaps.map((g, i) => (
                      <li key={i} className="text-[10px] text-slate-400 flex items-start gap-1.5 leading-relaxed">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-1 shrink-0" />
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* AI Advice suggestions */}
                <div className="flex gap-2 p-1">
                  <Sparkles size={14} className="text-blue-400 shrink-0 mt-0.5 animate-pulse" />
                  <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                    <strong className="text-blue-400 font-bold">AI Advice:</strong> {c.suggestions}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* SECTION 2: GMB Q&A SECTION (FAQ) */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 rounded-3xl p-6 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-950 text-blue-400 rounded-xl flex items-center justify-center border border-blue-900">
              <FileQuestion size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-tighter font-display">Google Q&A FAQ Section</h2>
              <p className="text-xs text-slate-400">Populate common client queries and official answers directly inside Google Local Search.</p>
            </div>
          </div>

          <button
            onClick={() => setShowFAQForm(!showFAQForm)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-black uppercase tracking-widest transition cursor-pointer"
          >
            <Plus size={14} />
            Create Q&A
          </button>
        </div>

        {/* Create FAQ Form */}
        {showFAQForm && (
          <form onSubmit={handleFAQSubmit} className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 font-mono font-bold">Customer Question</label>
              <input
                type="text"
                required
                placeholder="e.g. Do you accept emergency dental walk-ins on Sutter St?"
                className="w-full text-xs bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 focus:ring-1 focus:ring-blue-600 focus:outline-none font-bold"
                value={faqQuestion}
                onChange={(e) => setFaqQuestion(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 font-mono font-bold">Official GMB Response</label>
              <textarea
                required
                rows={3}
                placeholder="Write a warm, precise official response incorporating service and local location terms..."
                className="w-full text-xs bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 focus:ring-1 focus:ring-blue-600 focus:outline-none resize-none"
                value={faqAnswer}
                onChange={(e) => setFaqAnswer(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowFAQForm(false)}
                className="px-4 py-2 border border-slate-800 hover:bg-slate-800 rounded-lg text-xs font-black uppercase tracking-widest text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-black uppercase tracking-widest cursor-pointer"
              >
                Publish FAQ
              </button>
            </div>
          </form>
        )}

        {/* FAQs List */}
        <div className="space-y-3">
          {faqs.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-xs font-black text-slate-500 uppercase tracking-widest font-mono">
              No GMB Q&As published yet.
            </div>
          ) : (
            faqs.map(f => (
              <div key={f.id} className="bg-slate-900 border border-slate-850 rounded-2xl p-6 flex flex-col gap-4 shadow-xs">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-2.5">
                    <HelpCircle size={16} className="text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-black text-white uppercase tracking-wide leading-snug">{f.question}</h4>
                      
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-green-400 flex items-center gap-0.5">
                          <CheckCircle size={10} /> Active G&A Answer
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono font-bold">
                          Added on: {new Date(f.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onDeleteFAQ(f.id)}
                      className="p-1 text-slate-500 hover:text-rose-500 transition cursor-pointer"
                      title="Remove Q&A from profile"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="bg-slate-950 rounded-xl p-4 pl-5 border-l-2 border-blue-500 text-xs text-slate-300 leading-relaxed font-sans border border-slate-850 border-l-0">
                  <strong className="text-blue-400">A (Official Response):</strong> {f.answer}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
