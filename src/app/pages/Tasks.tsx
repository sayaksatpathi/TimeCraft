import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { List, LayoutGrid, Filter, Plus, Search, CheckCircle2, Clock } from 'lucide-react';
import { useApp } from '../store/appStore';
import { TaskCard } from '../components/TaskCard';
import type { Priority, TaskStatus } from '../store/appStore';
import { SEOHead, SCHEMA_BREADCRUMB } from '../components/SEOHead';
import { useLiveTime } from '../hooks/useLiveTime';

type SortKey = 'priority' | 'dueDate' | 'title' | 'createdAt';

const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

const statusColumns: { key: TaskStatus; label: string; color: string; bg: string }[] = [
  { key: 'todo', label: 'To Do', color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20' },
  { key: 'in-progress', label: 'In Progress', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  { key: 'done', label: 'Done', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
];

export function Tasks() {
  const { tasks, setQuickCaptureOpen, updateTask, setSelectedTask, setTaskDetailOpen, clearCompletedTasks } = useApp();
  const [view, setView] = useState<'list' | 'board'>('list');
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortKey>('priority');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Live date for accurate overdue detection
  const { todayStr: today } = useLiveTime(60000);

  const filtered = useMemo(() => {
    let list = [...tasks];
    if (filterPriority !== 'all') list = list.filter(t => t.priority === filterPriority);
    if (filterStatus !== 'all') list = list.filter(t => t.status === filterStatus);
    if (searchQuery.trim()) list = list.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.tags.some(tag => tag.includes(searchQuery.toLowerCase())));

    list.sort((a, b) => {
      if (sortBy === 'priority') return priorityOrder[a.priority] - priorityOrder[b.priority];
      if (sortBy === 'dueDate') return (a.dueDate || '9999') < (b.dueDate || '9999') ? -1 : 1;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return b.createdAt.localeCompare(a.createdAt);
    });
    return list;
  }, [tasks, filterPriority, filterStatus, sortBy, searchQuery]);

  const stats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    overdue: tasks.filter(t => t.dueDate && t.dueDate < today && !t.completed).length,
  }), [tasks, today]);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5">
      <SEOHead
          title="Task Manager – List & Kanban Board"
          description="Manage all your tasks in TimeCraft's list and Kanban board views. Sort by due date, track progress, and stay organized across projects."
        keywords="task manager, kanban board, to-do list, task tracking, priority tasks, task planner, subtasks"
        path="/tasks"
        jsonLd={SCHEMA_BREADCRUMB([{ name: 'Home', path: '/' }, { name: 'Tasks', path: '/tasks' }])}
      />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">All Tasks</h1>
          <p className="text-slate-500 text-xs mt-0.5">{stats.total} tasks · {stats.completed} completed · {stats.overdue} overdue</p>
        </div>
        <button
          onClick={() => setQuickCaptureOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={16} />
          New Task
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/40 flex-1 min-w-48">
          <Search size={14} className="text-slate-500 shrink-0" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Filter tasks..."
            className="bg-transparent text-slate-300 text-sm outline-none w-full placeholder:text-slate-600"
          />
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm border transition-all ${showFilters ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-slate-800/60 border-slate-700/40 text-slate-400 hover:text-slate-200'}`}
        >
          <Filter size={14} />
          Filters
        </button>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as SortKey)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm bg-slate-800/60 border border-slate-700/40 text-slate-400 outline-none"
        >
          <option value="priority">Sort: Priority</option>
          <option value="dueDate">Sort: Due Date</option>
          <option value="title">Sort: Title</option>
          <option value="createdAt">Sort: Created</option>
        </select>

        {/* View toggle */}
        <div className="flex items-center rounded-xl border border-slate-700/40 overflow-hidden">
          <button
            onClick={() => setView('list')}
            className={`p-2 transition-all ${view === 'list' ? 'bg-blue-500/20 text-blue-400' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'}`}
          >
            <List size={16} />
          </button>
          <button
            onClick={() => setView('board')}
            className={`p-2 transition-all ${view === 'board' ? 'bg-blue-500/20 text-blue-400' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'}`}
          >
            <LayoutGrid size={16} />
          </button>
        </div>

        {stats.completed > 0 && (
          <button
            onClick={clearCompletedTasks}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm bg-slate-800/60 border border-slate-700/40 text-slate-400 hover:text-slate-200 transition-all"
            title="Remove all completed tasks"
          >
            Clear completed
          </button>
        )}
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-700/40 flex-wrap">
              <div className="space-y-1">
                <p className="text-slate-500 text-xs">Priority</p>
                <div className="flex gap-1.5">
                  {(['all', 'high', 'medium', 'low'] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => setFilterPriority(p)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                        filterPriority === p
                          ? p === 'all' ? 'bg-slate-700 text-white' : p === 'high' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : p === 'medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'text-slate-500 hover:text-slate-300 border border-slate-700/50'
                      }`}
                    >
                      {p === 'all' ? 'All' : p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-slate-500 text-xs">Status</p>
                <div className="flex gap-1.5">
                  {(['all', 'todo', 'in-progress', 'done'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setFilterStatus(s as TaskStatus | 'all')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                        filterStatus === s
                          ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                          : 'text-slate-500 hover:text-slate-300 border-slate-700/50'
                      }`}
                    >
                      {s === 'all' ? 'All' : s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => { setFilterPriority('all'); setFilterStatus('all'); setSearchQuery(''); }}
                className="ml-auto text-slate-500 text-xs hover:text-slate-300 transition-colors"
              >
                Clear all
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      {view === 'list' ? (
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={28} className="text-slate-600" />
              </div>
              <p className="text-slate-400 font-medium">No tasks found</p>
              <p className="text-slate-600 text-sm mt-1">Try adjusting your filters or add a new task</p>
            </div>
          ) : (
            <AnimatePresence>
              {filtered.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </AnimatePresence>
          )}
        </div>
      ) : (
        /* Board view */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statusColumns.map(col => {
            const colTasks = filtered.filter(t => t.status === col.key);
            return (
              <div key={col.key} className={`rounded-2xl border p-4 ${col.bg}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-sm font-semibold ${col.color}`}>{col.label}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full bg-slate-800 ${col.color}`}>{colTasks.length}</span>
                </div>
                <div className="space-y-2">
                  {colTasks.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-slate-600 text-xs">Drop tasks here</p>
                    </div>
                  ) : (
                    colTasks.map(task => (
                      <div
                        key={task.id}
                        className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/40 cursor-pointer hover:border-slate-600/50 transition-all"
                        onClick={() => {
                          setSelectedTask(task);
                          setTaskDetailOpen(true);
                        }}
                      >
                        <div className="flex items-start gap-2">
                          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${task.priority === 'high' ? 'bg-rose-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                          <p className={`text-sm ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>{task.title}</p>
                        </div>
                        {task.dueDate && (
                          <p className={`text-xs mt-2 flex items-center gap-1 ${task.dueDate < today && !task.completed ? 'text-rose-400' : 'text-slate-500'}`}>
                            <Clock size={10} />{task.dueDate}
                          </p>
                        )}
                        {task.tags.length > 0 && (
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {task.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="text-xs text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded-md">#{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}