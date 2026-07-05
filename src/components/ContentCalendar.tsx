import React, { useState } from 'react';
import { Post } from '../types';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Sparkles, Send, Clock, BadgeAlert, Plus } from 'lucide-react';

interface ContentCalendarProps {
  posts: Post[];
  onCreatePost: (post: Omit<Post, 'id' | 'organizationId'>) => void;
  onUpdatePost: (id: string, updates: Partial<Post>) => void;
}

export default function ContentCalendar({ posts, onCreatePost, onUpdatePost }: ContentCalendarProps) {
  // Simple calendar navigation state (current week of July 2026)
  const [currentDate, setCurrentDate] = useState<Date>(new Date("2026-07-04"));
  const [selectedDayPost, setSelectedDayPost] = useState<Post | null>(null);
  const [showQuickAdd, setShowQuickAdd] = useState<{ day: string } | null>(null);

  const [headline, setHeadline] = useState("");
  const [content, setContent] = useState("");
  const [ctaType, setCtaType] = useState<Post['ctaType']>("BOOK");

  // Generate 7 days of the current week starting from Sunday or previous day
  const getDaysOfWeek = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day; // adjust to Sunday
    startOfWeek.setDate(diff);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(startOfWeek);
      nextDay.setDate(startOfWeek.getDate() + i);
      days.push(nextDay);
    }
    return days;
  };

  const days = getDaysOfWeek(currentDate);

  // Navigate week
  const handlePrevWeek = () => {
    const prev = new Date(currentDate);
    prev.setDate(currentDate.getDate() - 7);
    setCurrentDate(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(currentDate);
    next.setDate(currentDate.getDate() + 7);
    setCurrentDate(next);
  };

  const formatDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const formatDayNumber = (date: Date) => {
    return date.getDate();
  };

  // Check if dates are equal (YYYY-MM-DD)
  const isSameDate = (date1: Date, date2String: string) => {
    const d1 = date1.toISOString().split('T')[0];
    const d2 = date2String.split('T')[0];
    return d1 === d2;
  };

  const getPostsForDate = (date: Date) => {
    return posts.filter(p => isSameDate(date, p.scheduledAt));
  };

  // Drag-and-drop simulated reschedule action: move post to another date
  const handleSimulatedReschedule = (post: Post, targetDate: Date) => {
    onUpdatePost(post.id, {
      scheduledAt: targetDate.toISOString()
    });
    if (selectedDayPost && selectedDayPost.id === post.id) {
      setSelectedDayPost({ ...post, scheduledAt: targetDate.toISOString() });
    }
  };

  const handleQuickAddSubmit = (e: React.FormEvent, dateString: string) => {
    e.preventDefault();
    if (!headline || !content) return;

    onCreatePost({
      profileId: posts[0]?.profileId || "prof-1",
      headline,
      content,
      ctaType,
      ctaUrl: "https://www.bennettdentalcosmetic.com/booking",
      scheduledAt: new Date(dateString + "T09:00:00Z").toISOString(),
      status: "scheduled",
      imageUrl: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=600"
    });

    setHeadline("");
    setContent("");
    setCtaType("BOOK");
    setShowQuickAdd(null);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 rounded-3xl p-6 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-600/10 text-blue-400 rounded-xl flex items-center justify-center">
            <CalendarIcon size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-tighter font-display">Content Calendar</h2>
            <p className="text-xs text-slate-400">Plan, reschedule, and monitor GMB social post performance.</p>
          </div>
        </div>

        {/* Date Navigator */}
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrevWeek}
            className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-300 transition cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs font-black text-white min-w-[150px] text-center font-mono uppercase tracking-wider">
            {days[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {days[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <button 
            onClick={handleNextWeek}
            className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-300 transition cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Main Grid Calendar */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {days.map((day, idx) => {
          const dayPosts = getPostsForDate(day);
          const isToday = new Date().toDateString() === day.toDateString();
          const dateString = day.toISOString().split('T')[0];

          return (
            <div 
              key={idx} 
              className={`bg-slate-900 rounded-2xl border min-h-[180px] p-4 flex flex-col justify-between transition relative ${isToday ? 'border-blue-600 ring-2 ring-blue-600/20' : 'border-slate-800/80'}`}
            >
              <div>
                {/* Day Header */}
                <div className="flex items-center justify-between mb-3 border-b border-slate-800/60 pb-2">
                  <span className={`text-[10px] font-black tracking-widest uppercase ${isToday ? 'text-blue-400' : 'text-slate-500'}`}>
                    {formatDayName(day)}
                  </span>
                  <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-black font-mono ${isToday ? 'bg-blue-600 text-white' : 'text-slate-300'}`}>
                    {formatDayNumber(day)}
                  </span>
                </div>

                {/* Day Post Items */}
                <div className="space-y-2">
                  {dayPosts.map(p => (
                    <div 
                      key={p.id}
                      onClick={() => setSelectedDayPost(p)}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition ${p.status === 'published' ? 'bg-green-500/5 border-green-500/20 hover:bg-green-500/10' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}
                    >
                      <p className="text-[11px] font-bold text-slate-200 line-clamp-2 leading-snug">
                        {p.headline}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className={`inline-flex items-center gap-0.5 text-[8px] font-black uppercase px-1.5 py-0.5 rounded-sm ${p.status === 'published' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>
                          {p.status === 'published' ? 'Published' : 'Scheduled'}
                        </span>
                        
                        {p.metrics && (
                          <span className="text-[8px] text-slate-500 font-mono font-bold">
                            👁️ {p.metrics.views}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-3 pt-2 border-t border-slate-800/60 flex justify-between items-center">
                <button
                  onClick={() => setShowQuickAdd({ day: dateString })}
                  className="p-1 rounded-md text-slate-500 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                  title="Quick draft post"
                >
                  <Plus size={14} />
                </button>

                {/* Dropdown Rescheduling Simulation options */}
                {dayPosts.length > 0 && (
                  <select
                    className="text-[9px] bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-slate-400 cursor-pointer max-w-[80px] font-bold"
                    onChange={(e) => {
                      if (e.target.value) {
                        const targetDay = days[parseInt(e.target.value)];
                        handleSimulatedReschedule(dayPosts[0], targetDay);
                      }
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>Move Day</option>
                    {days.map((d, i) => (
                      <option key={i} value={i} disabled={d.toDateString() === day.toDateString()}>
                        {formatDayName(d)} {formatDayNumber(d)}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Add Popover Modal */}
      {showQuickAdd && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full border border-slate-800 p-8 shadow-2xl">
            <h3 className="text-base font-black text-white uppercase tracking-tighter font-display mb-6">Quick Draft Post for {showQuickAdd.day}</h3>
            <form onSubmit={(e) => handleQuickAddSubmit(e, showQuickAdd.day)} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 font-mono">Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 🦷 Free Cleaning Assessment Weekend"
                  className="w-full text-xs bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 focus:ring-1 focus:ring-blue-600 focus:outline-none font-sans font-bold"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 font-mono">Content Post</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your promotion, service update, or seasonal tips..."
                  className="w-full text-xs bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 focus:ring-1 focus:ring-blue-600 focus:outline-none resize-none font-sans"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 font-mono">Call to Action (CTA)</label>
                  <select
                    className="w-full text-xs bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 focus:ring-1 focus:ring-blue-600 focus:outline-none font-bold"
                    value={ctaType}
                    onChange={(e) => setCtaType(e.target.value as Post['ctaType'])}
                  >
                    <option value="BOOK" className="bg-slate-900">BOOK (Appointment)</option>
                    <option value="LEARN_MORE" className="bg-slate-900">LEARN MORE (Blog/Site)</option>
                    <option value="CALL" className="bg-slate-900">CALL (Phone)</option>
                    <option value="SIGN_UP" className="bg-slate-900">SIGN UP</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowQuickAdd(null)}
                  className="px-4 py-2 border border-slate-800 hover:bg-slate-800 rounded-lg text-xs font-black uppercase tracking-widest text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-black uppercase tracking-widest cursor-pointer"
                >
                  Schedule Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Focus View on Day Post click */}
      {selectedDayPost && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-800 overflow-hidden shadow-2xl">
            
            {/* Header Banner */}
            <div className="h-44 w-full bg-slate-950 relative overflow-hidden">
              <img 
                src={selectedDayPost.imageUrl} 
                alt="Post Concept" 
                className="w-full h-full object-cover opacity-80"
                referrerPolicy="no-referrer"
              />
              <span className={`absolute top-4 right-4 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-sm text-white backdrop-blur-md ${selectedDayPost.status === 'published' ? 'bg-green-600/80' : 'bg-blue-600/80'}`}>
                {selectedDayPost.status === 'published' ? 'Live on GMB' : 'Scheduled Draft'}
              </span>
            </div>

            {/* Content Details */}
            <div className="p-8 space-y-5">
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter font-display leading-tight">
                  {selectedDayPost.headline}
                </h3>
                <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">
                  <Clock size={12} />
                  <span>Scheduled: {new Date(selectedDayPost.scheduledAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-850 rounded-xl p-5 text-xs text-slate-300 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap font-sans">
                {selectedDayPost.content}
              </div>

              <div className="flex items-center justify-between border-t border-slate-800 pt-5">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">Action Link CTA</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-black uppercase tracking-wider font-mono">
                    {selectedDayPost.ctaType}
                  </span>
                </div>

                {selectedDayPost.metrics ? (
                  <div className="flex gap-6">
                    <div className="text-center">
                      <span className="text-sm font-black text-white block">{selectedDayPost.metrics.views}</span>
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono block">GMB Views</span>
                    </div>
                    <div className="text-center">
                      <span className="text-sm font-black text-white block">{selectedDayPost.metrics.clicks}</span>
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono block">Actions</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 italic">No metrics collected yet</div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-3">
                {selectedDayPost.status !== 'published' && (
                  <button
                    onClick={() => {
                      onUpdatePost(selectedDayPost.id, { status: 'published', publishedAt: new Date().toISOString() });
                      setSelectedDayPost({ ...selectedDayPost, status: 'published', publishedAt: new Date().toISOString() });
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-black uppercase tracking-widest transition cursor-pointer"
                  >
                    Publish Now
                  </button>
                )}
                <button
                  onClick={() => setSelectedDayPost(null)}
                  className="px-4 py-2 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-black uppercase tracking-widest transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
