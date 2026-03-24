import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, CheckCircle2, Circle, Clock, Tag, AlertTriangle, Trash2,
  Plus, Sparkles, Calendar, Layers
} from 'lucide-react';
import { useApp } from '../store/appStore';
import type { Priority, TaskStatus } from '../store/appStore';
import { useLiveTime } from '../hooks/useLiveTime';

const priorityConfig = {
  high: { color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30', label: 'High' },
  medium: { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', label: 'Medium' },
  low: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', label: 'Low' },
};

export function TaskDetailModal() {
  const { selectedTask, taskDetailOpen, setTaskDetailOpen, setSelectedTask, toggleTask, toggleSubtask, updateTask, deleteTask } = useApp();
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [newSubtask, setNewSubtask] = useState('');
  const [showAISuggestion] = useState(true);
  // Live date for overdue detection
  const { todayStr } = useLiveTime(60000);

  useEffect(() => {
    if (selectedTask) {
      setEditTitle(selectedTask.title);
      setEditDesc(selectedTask.description);
    }
  }, [selectedTask?.id]);

  const handleClose = () => {
    if (selectedTask) {
      updateTask(selectedTask.id, { title: editTitle, description: editDesc });
    }
    setTaskDetailOpen(false);
    setTimeout(() => setSelectedTask(null), 300);
  };

  const handleAddSubtask = () => {
    if (!newSubtask.trim() || !selectedTask) return;
    const updated = [...selectedTask.subtasks, { id: Date.now().toString(), title: newSubtask.trim(), completed: false }];
    updateTask(selectedTask.id, { subtasks: updated });
    setNewSubtask('');
  };

  const handleDelete = () => {
    if (selectedTask) deleteTask(selectedTask.id);
  };

  const completedSubtasks = selectedTask?.subtasks.filter(s => s.completed).length || 0;
  const subtaskProgress = selectedTask?.subtasks.length ? (completedSubtasks / selectedTask.subtasks.length) * 100 : 0;
  const isOverdue = selectedTask?.dueDate && selectedTask.dueDate < todayStr && !selectedTask.completed;

  return (
    <AnimatePresence>
      {taskDetailOpen && selectedTask && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed right-0 top-0 bottom-0 w-full sm:max-w-md bg-slate-900 border-l border-slate-700/50 z-50 overflow-y-auto shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 flex items-center gap-3 px-5 py-4 border-b border-slate-800/50 bg-slate-900/95 backdrop-blur-sm z-10">
              <button
                onClick={() => toggleTask(selectedTask.id)}
                className="text-slate-400 hover:text-emerald-400 transition-colors"
              >
                {selectedTask.completed
                  ? <CheckCircle2 size={20} className="text-emerald-500" />
                  : <Circle size={20} />
                }
              </button>
              <h2 className="text-white font-semibold text-base flex-1 truncate">Task Details</h2>
              <button
                onClick={handleDelete}
                className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
              >
                <Trash2 size={16} />
              </button>
              <button onClick={handleClose} className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-all">
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Title */}
              <div>
                <input
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className={`w-full bg-transparent text-xl font-semibold outline-none placeholder:text-slate-600 ${selectedTask.completed ? 'line-through text-slate-500' : 'text-white'}`}
                  placeholder="Task title..."
                />
              </div>

              {/* AI Suggestion chip */}
              {showAISuggestion && selectedTask.subtasks.length === 0 && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <Sparkles size={14} className="text-blue-400 shrink-0" />
                  <p className="text-blue-300 text-xs flex-1">AI suggests breaking this into 3 smaller steps</p>
                  <button className="text-blue-400 text-xs font-medium hover:text-blue-300 transition-colors">Apply</button>
                </div>
              )}

              {/* Meta */}
              <div className="grid grid-cols-2 gap-3">
                {/* Priority */}
                <div className="space-y-1.5">
                  <label className="text-slate-500 text-xs font-medium flex items-center gap-1">
                    <AlertTriangle size={11} /> Priority
                  </label>
                  <div className="flex gap-1">
                    {(['high', 'medium', 'low'] as Priority[]).map(p => (
                      <button
                        key={p}
                        onClick={() => updateTask(selectedTask.id, { priority: p })}
                        className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          selectedTask.priority === p
                            ? priorityConfig[p].bg + ' ' + priorityConfig[p].color
                            : 'border-slate-700/50 text-slate-500 hover:border-slate-600'
                        }`}
                      >
                        {priorityConfig[p].label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-slate-500 text-xs font-medium flex items-center gap-1">
                    <Layers size={11} /> Status
                  </label>
                  <select
                    value={selectedTask.status}
                    onChange={e => updateTask(selectedTask.id, { status: e.target.value as TaskStatus })}
                    className="w-full bg-slate-800/60 border border-slate-700/50 rounded-lg px-2 py-1.5 text-slate-300 text-xs outline-none"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>

                {/* Due date */}
                <div className="space-y-1.5">
                  <label className={`text-xs font-medium flex items-center gap-1 ${isOverdue ? 'text-rose-400' : 'text-slate-500'}`}>
                    <Calendar size={11} /> Due Date {isOverdue && '· Overdue'}
                  </label>
                  <input
                    type="date"
                    value={selectedTask.dueDate || ''}
                    onChange={e => updateTask(selectedTask.id, { dueDate: e.target.value || null })}
                    className="w-full bg-slate-800/60 border border-slate-700/50 rounded-lg px-2 py-1.5 text-slate-300 text-xs outline-none"
                  />
                </div>

                {/* Due time */}
                <div className="space-y-1.5">
                  <label className="text-slate-500 text-xs font-medium flex items-center gap-1">
                    <Clock size={11} /> Due Time
                  </label>
                  <input
                    type="time"
                    value={selectedTask.dueTime || ''}
                    onChange={e => updateTask(selectedTask.id, { dueTime: e.target.value || null })}
                    className="w-full bg-slate-800/60 border border-slate-700/50 rounded-lg px-2 py-1.5 text-slate-300 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-1.5">
                <label className="text-slate-500 text-xs font-medium flex items-center gap-1">
                  <Tag size={11} /> Tags
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTask.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700/50 text-slate-400 text-xs">
                      #{tag}
                    </span>
                  ))}
                  {selectedTask.tags.length === 0 && (
                    <span className="text-slate-600 text-xs">No tags added</span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-slate-500 text-xs font-medium">Description</label>
                <textarea
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                  placeholder="Add a description..."
                  rows={3}
                  className="w-full bg-slate-800/40 border border-slate-700/50 rounded-xl px-3 py-2.5 text-slate-300 text-sm outline-none resize-none placeholder:text-slate-600 focus:border-blue-500/40 transition-colors"
                />
              </div>

              {/* Subtasks */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-slate-400 text-sm font-medium flex items-center gap-1.5">
                    <Layers size={14} />
                    Subtasks
                    <span className="text-slate-600 text-xs">({completedSubtasks}/{selectedTask.subtasks.length})</span>
                  </label>
                </div>

                {/* Progress bar */}
                {selectedTask.subtasks.length > 0 && (
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                      animate={{ width: `${subtaskProgress}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                )}

                {/* Subtask list */}
                <div className="space-y-1.5">
                  {selectedTask.subtasks.map(subtask => (
                    <div key={subtask.id} className="flex items-center gap-2.5 group">
                      <button
                        onClick={() => toggleSubtask(selectedTask.id, subtask.id)}
                        className="text-slate-500 hover:text-emerald-400 transition-colors"
                      >
                        {subtask.completed
                          ? <CheckCircle2 size={15} className="text-emerald-500" />
                          : <Circle size={15} />
                        }
                      </button>
                      <span className={`text-sm flex-1 ${subtask.completed ? 'line-through text-slate-600' : 'text-slate-300'}`}>
                        {subtask.title}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Add subtask */}
                <div className="flex items-center gap-2">
                  <Plus size={14} className="text-slate-500 shrink-0" />
                  <input
                    value={newSubtask}
                    onChange={e => setNewSubtask(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddSubtask()}
                    placeholder="Add subtask..."
                    className="flex-1 bg-transparent text-slate-400 text-sm outline-none placeholder:text-slate-600"
                  />
                  {newSubtask && (
                    <button onClick={handleAddSubtask} className="text-blue-400 text-xs hover:text-blue-300">Add</button>
                  )}
                </div>
              </div>

              {/* Save */}
              <button
                onClick={handleClose}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}