import { useState } from 'react';
import { FileEdit, Plus, Trash2, Save, Eye, EyeOff, Tag, Clock } from 'lucide-react';
import { Note } from '../types';

interface NotesViewProps {
  notes: Note[];
  onAddNote: (note: Omit<Note, 'id' | 'lastModified'>) => void;
  onUpdateNote: (id: string, updated: Partial<Note>) => void;
  onDeleteNote: (id: string) => void;
}

export default function NotesView({ notes, onAddNote, onUpdateNote, onDeleteNote }: NotesViewProps) {
  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || '');
  const [isEditing, setIsEditing] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);

  // Draft states
  const [draftTitle, setDraftTitle] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [draftCategory, setDraftCategory] = useState('General');

  // Find active note
  const activeNote = notes.find(n => n.id === selectedNoteId);

  // Sync draft states when note selection changes
  useState(() => {
    if (activeNote) {
      setDraftTitle(activeNote.title);
      setDraftContent(activeNote.content);
      setDraftCategory(activeNote.category);
    }
  });

  const handleSelectNote = (id: string) => {
    setSelectedNoteId(id);
    const note = notes.find(n => n.id === id);
    if (note) {
      setDraftTitle(note.title);
      setDraftContent(note.content);
      setDraftCategory(note.category);
      setPreviewMode(false);
    }
  };

  const handleCreateNewNote = () => {
    const newDraft = {
      title: 'Untitled Note',
      content: '## New Memo\nWrite some guidelines or campus notes here...',
      category: 'General'
    };

    onAddNote(newDraft);
    // Find newly added note (it will be at the end or we select it from parent updates, we can let parent do it or guess id)
    setTimeout(() => {
      // Auto-select latest note
      if (notes.length > 0) {
        const latest = notes[notes.length - 1];
        if (latest) {
          handleSelectNote(latest.id);
        }
      }
    }, 50);
  };

  const handleSave = () => {
    if (!selectedNoteId) return;
    onUpdateNote(selectedNoteId, {
      title: draftTitle,
      content: draftContent,
      category: draftCategory
    });
  };

  // Simple, elegant Markdown to HTML visualizer
  const renderMarkdown = (text: string) => {
    if (!text) return <p className="text-slate-400 italic">No content written yet.</p>;

    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Headers
      if (line.startsWith('## ')) {
        return <h3 key={idx} className="text-base sm:text-lg font-bold text-slate-800 mt-4 mb-2">{line.replace('## ', '')}</h3>;
      }
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="text-sm sm:text-base font-bold text-slate-800 mt-3 mb-1">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('# ')) {
        return <h2 key={idx} className="text-lg sm:text-xl font-extrabold text-slate-800 mt-4 mb-2 pb-1 border-b border-slate-100">{line.replace('# ', '')}</h2>;
      }

      // Checkboxes
      if (line.startsWith('- [ ] ')) {
        return (
          <div key={idx} className="flex items-center gap-2.5 my-1.5 text-xs sm:text-sm text-slate-600">
            <input type="checkbox" checked={false} disabled className="rounded border-slate-300 text-emerald-600" />
            <span>{line.replace('- [ ] ', '')}</span>
          </div>
        );
      }
      if (line.startsWith('- [x] ') || line.startsWith('- [X] ')) {
        return (
          <div key={idx} className="flex items-center gap-2.5 my-1.5 text-xs sm:text-sm text-slate-400 line-through">
            <input type="checkbox" checked={true} disabled className="rounded border-slate-300 text-emerald-500" />
            <span>{line.replace(/- \[[xX]\] /, '')}</span>
          </div>
        );
      }

      // Bullet List
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <ul key={idx} className="list-disc pl-5 my-1 text-xs sm:text-sm text-slate-600">
            <li>{line.substring(2)}</li>
          </ul>
        );
      }

      // Inline Code blocks or quote blocks
      if (line.startsWith('> ')) {
        return (
          <blockquote key={idx} className="border-l-4 border-emerald-500 bg-slate-50 px-4 py-2 my-2 text-xs sm:text-sm text-slate-600 italic rounded-r-md">
            {line.replace('> ', '')}
          </blockquote>
        );
      }

      // Empty space
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }

      // Standard text line
      return <p key={idx} className="text-xs sm:text-sm text-slate-600 leading-relaxed my-1">{line}</p>;
    });
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Administrative Memos</h2>
          <p className="text-sm text-slate-500 mt-1">Jot down meeting minutes, facility protocols, and smart checklist notes.</p>
        </div>
      </div>

      {/* Dual Pane Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch min-h-[500px]">
        
        {/* Left Pane: Notes List */}
        <div className="md:col-span-1 bg-white rounded-2xl border border-slate-100 shadow-xs p-4 flex flex-col justify-between space-y-4">
          <div className="space-y-4 flex-1 overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Saved Notes</span>
              <button 
                onClick={handleCreateNewNote}
                className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg cursor-pointer transition-colors"
                title="Create New Note"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {notes.length === 0 ? (
                <p className="text-center text-slate-400 text-xs py-12">No administrative notes saved yet.</p>
              ) : (
                notes.map((note) => {
                  const isSelected = note.id === selectedNoteId;
                  return (
                    <div
                      key={note.id}
                      onClick={() => handleSelectNote(note.id)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-emerald-50/40 border-emerald-200 text-emerald-900 shadow-3xs' 
                          : 'border-slate-100 bg-slate-50/20 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-bold text-slate-800 text-xs sm:text-sm line-clamp-1 flex-1">{note.title}</span>
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            onDeleteNote(note.id);
                            if (note.id === selectedNoteId && notes.length > 1) {
                              const remain = notes.filter(n => n.id !== note.id);
                              if (remain[0]) handleSelectNote(remain[0].id);
                            }
                          }}
                          className="p-1 text-slate-300 hover:text-red-500 rounded-md transition-colors"
                          title="Delete note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold mt-3">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3 text-slate-300" />
                          <span>{note.category}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-300" />
                          <span>{note.lastModified.split(' ')[0]}</span>
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Pane: Note Workspace */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-xs p-6 flex flex-col justify-between">
          {selectedNoteId && activeNote ? (
            <div className="space-y-4 h-full flex flex-col justify-between">
              
              {/* Workspace Header */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div className="flex-1 mr-4">
                  <input 
                    type="text" 
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    className="w-full text-base sm:text-lg font-bold text-slate-800 border-none focus:outline-none focus:ring-0 p-0"
                    placeholder="Enter Note Title..."
                  />
                  <div className="flex items-center gap-2.5 mt-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Category:</span>
                    <input 
                      type="text" 
                      value={draftCategory}
                      onChange={(e) => setDraftCategory(e.target.value)}
                      className="border border-slate-200 rounded px-2 py-0.5 text-[11px] text-slate-600 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 w-32"
                      placeholder="Category"
                    />
                  </div>
                </div>

                {/* Workspace toggle controls */}
                <div className="flex gap-2 shrink-0">
                  <button 
                    onClick={() => setPreviewMode(!previewMode)}
                    className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-600 flex items-center gap-1.5 cursor-pointer"
                    title={previewMode ? "Edit Raw Notes" : "Visual Preview"}
                  >
                    {previewMode ? (
                      <>
                        <EyeOff className="w-4 h-4" />
                        <span className="hidden sm:inline">Code Mode</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">Preview</span>
                      </>
                    )}
                  </button>

                  <button 
                    onClick={handleSave}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    title="Save Changes"
                  >
                    <Save className="w-4 h-4" />
                    <span className="hidden sm:inline">Save Memo</span>
                  </button>
                </div>
              </div>

              {/* Workspace Content Input / Markdown Preview */}
              <div className="flex-1 pt-4 min-h-[300px]">
                {previewMode ? (
                  <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 min-h-[300px] overflow-y-auto max-h-[360px] prose prose-slate">
                    {renderMarkdown(draftContent)}
                  </div>
                ) : (
                  <textarea 
                    value={draftContent}
                    onChange={(e) => setDraftContent(e.target.value)}
                    className="w-full h-full min-h-[300px] border-none focus:outline-none focus:ring-0 text-slate-700 text-sm font-mono leading-relaxed p-2 bg-slate-50/30 rounded-xl resize-none"
                    placeholder="Draft rich text or checklists here... Supports simple # headers and - [ ] checkboxes!"
                  />
                )}
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center space-y-3 flex-1">
              <FileEdit className="w-12 h-12 text-slate-300 animate-bounce-slow" />
              <h4 className="font-bold text-slate-700 text-sm">Select or Create a Note</h4>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                Choose an existing administrative memo from the left column, or click the create button to open a clean workspace.
              </p>
              <button 
                onClick={handleCreateNewNote}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
              >
                Create note
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
