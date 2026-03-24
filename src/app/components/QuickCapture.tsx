import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Zap, Tag, Calendar, AlertCircle } from 'lucide-react';
import { useApp } from '../store/appStore';
import type { Priority } from '../store/appStore';
import { localDateStr } from '../hooks/useLiveTime';

export function QuickCapture() {
  const { quickCaptureOpen, setQuickCaptureOpen, addTask } = useApp();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [tag, setTag] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (quickCaptureOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [quickCaptureOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({
      title: title.trim(),
      priority,
      dueDate: dueDate || null,
      tags: tag ? [tag] : [],
    });
    setTitle('');
    setPriority('medium');
    setDueDate('');
    setTag('');
    setQuickCaptureOpen(false);
  };

  const parseNaturalLanguage = (input: string) => {
    const lower = input.toLowerCase();
    if (lower.includes('urgent') || lower.includes('asap')) setPriority('high');
    if (lower.includes('tomorrow')) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDueDate(localDateStr(tomorrow));
    }
    if (lower.includes('today')) {
      setDueDate(localDateStr());
    }
    if (lower.includes('#')) {
      const match = input.match(/#(\w+)/);
      if (match) setTag(match[1]);
    }
    setTitle(input);
  };

  const priorityColors = {
    high: 'border-rose-500 bg-rose-500/10 text-rose-400',
    medium: 'border-amber-500 bg-amber-500/10 text-amber-400',
    low: 'border-emerald-500 bg-emerald-500/10 text-emerald-400',
  };

  return (
    <AnimatePresence>
      {quickCaptureOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setQuickCaptureOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full max-w-xl bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-5 pt-5 pb-3 border-b border-slate-800/50">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Zap size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Quick Capture</p>
                  <p className="text-slate-500 text-xs">Natural language supported — "Call mom tomorrow #personal"</p>
                </div>
                <button onClick={() => setQuickCaptureOpen(false)} className="ml-auto text-slate-500 hover:text-slate-300 transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <input
                  ref={inputRef}
                  value={title}
                  onChange={e => parseNaturalLanguage(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full bg-transparent text-white text-lg placeholder:text-slate-600 outline-none"
                />

                {/* Options row */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Priority */}
                  <div className="flex items-center gap-1">
                    {(['high', 'medium', 'low'] as Priority[]).map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                          priority === p ? priorityColors[p] : 'border-slate-700 text-slate-500 hover:border-slate-600'
                        }`}
                      >
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </button>
                    ))}
                  </div>

                  {/* Due date */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/60 border border-slate-700/50">
                    <Calendar size={12} className="text-slate-400" />
                    <input
                      type="date"
                      value={dueDate}
                      onChange={e => setDueDate(e.target.value)}
                      className="bg-transparent text-slate-400 text-xs outline-none"
                    />
                  </div>

                  {/* Tag */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/60 border border-slate-700/50">
                    <Tag size={12} className="text-slate-400" />
                    <input
                      value={tag}
                      onChange={e => setTag(e.target.value)}
                      placeholder="tag"
                      className="bg-transparent text-slate-400 text-xs outline-none w-16"
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-1">
                  <p className="text-slate-600 text-xs flex items-center gap-1">
                    <AlertCircle size={11} />
                    Press Enter to save · Esc to close
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuickCaptureOpen(false)}
                      className="px-3 py-1.5 rounded-lg text-slate-400 text-sm hover:bg-slate-800 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
                    >
                      Capture
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}