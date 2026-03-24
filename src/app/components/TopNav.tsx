import React, { useState } from 'react';
import { Search, Plus, Command, Menu, Clock } from 'lucide-react';
import { useApp } from '../store/appStore';
import { motion } from 'motion/react';
import { useLiveTime } from '../hooks/useLiveTime';

interface TopNavProps {
  onAddTask?: () => void;
}

export function TopNav({ onAddTask }: TopNavProps) {
  const { setQuickCaptureOpen, setMobileSidebarOpen, userName, tasks } = useApp();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Live time — updates every second
  const { greeting, formattedTime, formattedDate, second } = useLiveTime(1000);

  const pendingCount = tasks.filter(t => !t.completed).length;

  const filteredTasks = searchQuery.trim()
    ? tasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <header className="flex items-center gap-3 px-4 md:px-6 py-3 md:py-4 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-20">
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileSidebarOpen(true)}
        className="md:hidden p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Greeting + live clock – hidden on mobile */}
      <div className="hidden md:flex flex-col mr-auto">
        <p className="text-slate-300 text-sm">
          {greeting}, <span className="text-white font-semibold">{userName}</span> 👋
        </p>
        <p className="text-slate-600 text-xs">{formattedDate}</p>
      </div>

      {/* Live clock pill — visible on all screens */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/40 shrink-0">
        <Clock size={12} className="text-blue-400" />
        <span className="text-slate-300 text-sm font-mono tabular-nums tracking-wider">
          {formattedTime}
          <span
            className="text-slate-500"
            style={{ opacity: second % 2 === 0 ? 1 : 0.3, transition: 'opacity 0.4s' }}
          >
            :{String(second % 60).padStart(2, '0')}
          </span>
        </span>
      </div>

      {/* Search */}
      <div className="relative flex-1 md:flex-none md:w-72">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/40 cursor-pointer hover:border-slate-600/50 transition-all"
          onClick={() => { setSearchOpen(true); setQuickCaptureOpen(false); }}
        >
          <Search size={14} className="text-slate-500 shrink-0" />
          <span className="text-slate-500 text-sm flex-1">Search tasks...</span>
          <div className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-700/60 border border-slate-600/30">
            <Command size={10} className="text-slate-500" />
            <span className="text-slate-500 text-xs">K</span>
          </div>
        </div>
        {searchOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => { setSearchOpen(false); setSearchQuery(''); }} />
            <div className="absolute top-full left-0 right-0 mt-2 z-40 bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800">
                <Search size={16} className="text-slate-400" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search tasks, projects..."
                  className="flex-1 bg-transparent text-slate-200 text-sm outline-none placeholder:text-slate-500"
                />
              </div>
              <div className="max-h-64 overflow-y-auto py-2">
                {searchQuery.trim() === '' ? (
                  <p className="text-slate-500 text-xs text-center py-6">Start typing to search...</p>
                ) : filteredTasks.length === 0 ? (
                  <p className="text-slate-500 text-xs text-center py-6">No tasks found</p>
                ) : (
                  filteredTasks.slice(0, 6).map(task => (
                    <div key={task.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-800/60 cursor-pointer" onClick={() => setSearchOpen(false)}>
                      <div className={`w-2 h-2 rounded-full shrink-0 ${task.priority === 'high' ? 'bg-rose-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                      <span className={`text-sm ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>{task.title}</span>
                      {task.dueDate && <span className="ml-auto text-slate-600 text-xs shrink-0">{task.dueDate}</span>}
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Quick add */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setQuickCaptureOpen(true)}
          className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add Task</span>
        </motion.button>
      </div>
    </header>
  );
}
