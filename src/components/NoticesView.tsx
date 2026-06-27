import React, { useState } from 'react';
import { Megaphone, Plus, Pin, Trash2, Calendar, User, Search, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Notice } from '../types';

interface NoticesViewProps {
  notices: Notice[];
  onAddNotice: (notice: Omit<Notice, 'id' | 'date'>) => void;
  onTogglePinNotice: (id: string) => void;
  onDeleteNotice: (id: string) => void;
}

export default function NoticesView({
  notices,
  onAddNotice,
  onTogglePinNotice,
  onDeleteNotice
}: NoticesViewProps) {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Academic' | 'Event' | 'Urgent' | 'General'>('Academic');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Office of Super Admin');

  // Filter and sort notices
  const processedNotices = notices
    .filter(notice => {
      const matchesCategory = filterCategory === 'All' || notice.category === filterCategory;
      const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            notice.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    // Pinned notices stay at the top
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.date.localeCompare(a.date); // newest first
    });

  const categories: ('Academic' | 'Event' | 'Urgent' | 'General')[] = [
    'Academic', 'Event', 'Urgent', 'General'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      alert('Please fill out all fields.');
      return;
    }

    onAddNotice({
      title,
      content,
      category,
      author,
      isPinned: false
    });

    setTitle('');
    setContent('');
    setCategory('Academic');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Campus Notice Board</h2>
          <p className="text-sm text-slate-500 mt-1">Draft, pin, and organize alerts and formal academic declarations.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center gap-2 hover:bg-emerald-700 transition-colors cursor-pointer shadow-sm animate-pulse-slow"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Notice</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Notices Board Area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Controls: Search & Category tabs */}
          <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-2xs">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                placeholder="Search announcements..."
              />
            </div>
            <div className="flex gap-1 overflow-x-auto">
              <button 
                onClick={() => setFilterCategory('All')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  filterCategory === 'All' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                All
              </button>
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    filterCategory === cat ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Notices Feed */}
          {processedNotices.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center">
              <Megaphone className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No announcements fit the current search filters.</p>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              {processedNotices.map((notice) => (
                <div 
                  key={notice.id}
                  className={`bg-white p-6 rounded-2xl border transition-all relative ${
                    notice.isPinned ? 'border-l-4 border-l-emerald-500 border-slate-200' : 'border-slate-100'
                  } shadow-2xs hover:border-slate-200`}
                >
                  {/* Top line metadata */}
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-sm ${
                        notice.category === 'Urgent' ? 'bg-red-50 text-red-600 border border-red-100' :
                        notice.category === 'Academic' ? 'bg-[#6ffbbe] text-[#002113]' :
                        notice.category === 'Event' ? 'bg-indigo-50 text-indigo-700' :
                        'bg-slate-50 text-slate-600'
                      }`}>
                        {notice.category}
                      </span>
                      {notice.isPinned && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold bg-emerald-50/50 px-1.5 py-0.5 rounded-sm">
                          <Pin className="w-3 h-3 fill-emerald-600" />
                          <span>Pinned</span>
                        </span>
                      )}
                    </div>

                    <div className="flex gap-1">
                      <button 
                        onClick={() => onTogglePinNotice(notice.id)}
                        className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                          notice.isPinned ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-300 hover:bg-slate-100 hover:text-slate-500'
                        }`}
                        title={notice.isPinned ? "Unpin notice" : "Pin notice to top"}
                      >
                        <Pin className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDeleteNotice(notice.id)}
                        className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-slate-50 rounded-md cursor-pointer transition-colors"
                        title="Delete notice"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Notice Content */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-800 text-base sm:text-lg leading-tight">{notice.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal whitespace-pre-wrap">{notice.content}</p>
                  </div>

                  {/* Notice Footer Author / Date */}
                  <div className="flex justify-between items-center pt-4 mt-4 border-t border-slate-50 text-[11px] text-slate-400 font-medium">
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-300" />
                      <span>{notice.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-300" />
                      <span>Published: {notice.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notice Publisher Form Panel (Right) */}
        <div className="lg:col-span-1">
          {showAddForm ? (
            <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-4 animate-fade-in">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-sm">Draft Announcement</h3>
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Announcement Title</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Summer Convocation Registration"
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    required
                  />
                </div>

                {/* Category selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Category Severity</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium cursor-pointer"
                  >
                    <option value="Academic">Academic (General Coursework)</option>
                    <option value="Urgent">Urgent (Immediate Action)</option>
                    <option value="Event">Event (Campus Activities)</option>
                    <option value="General">General (Utility / Infrastructure)</option>
                  </select>
                </div>

                {/* Content text */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Body content</label>
                  <textarea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Draft detailed announcement text here..."
                    className="w-full h-32 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium resize-none"
                    required
                  />
                </div>

                {/* Author text */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Publisher Desk</label>
                  <input 
                    type="text" 
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g., Office of Registrar"
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs"
                >
                  Publish Announcement
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center space-y-3 shadow-2xs">
              <AlertTriangle className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="font-bold text-slate-700 text-sm">Official Alert Desk</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Drafted notices are pinned immediately. Use the pin button to ensure crucial information remains easily visible at the top of the feed.
              </p>
              <button 
                onClick={() => setShowAddForm(true)}
                className="mt-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer block mx-auto"
              >
                Draft Announcement
              </button>
            </div>
          )}

          <div className="mt-4 p-5 bg-emerald-50/20 border border-emerald-500/10 rounded-2xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-700 text-xs">Security Clearance</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Only authenticated administrators can submit announcements to the official board.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
