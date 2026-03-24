import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, Clock, Tag, ChevronRight, Flame, Layers } from 'lucide-react';
import { useApp } from '../store/appStore';
import type { Task } from '../store/appStore';
import { useLiveTime } from '../hooks/useLiveTime';

interface TaskCardProps {
  task: Task;
  compact?: boolean;
}

const priorityConfig = {
  high: { color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/40', label: 'High', dot: 'bg-rose-500' },
  medium: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/40', label: 'Med', dot: 'bg-amber-500' },
  low: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/40', label: 'Low', dot: 'bg-emerald-500' },
};

export function TaskCard({ task, compact = false }: TaskCardProps) {
  const { toggleTask, setSelectedTask, setTaskDetailOpen } = useApp();
  // Live date so overdue status updates automatically
  const { todayStr } = useLiveTime(60000);

  const p = priorityConfig[task.priority];
  const isOverdue = task.dueDate && task.dueDate < todayStr && !task.completed;
  const isToday = task.dueDate === todayStr;
  const completedSubtasks = task.subtasks.filter(s => s.completed).length;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTask(task);
    setTaskDetailOpen(true);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      whileHover={{ y: -1 }}
      className={`group relative flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
        task.completed
          ? 'border-slate-800/40 bg-slate-900/30 opacity-60'
          : task.priority === 'high'
          ? 'border-slate-700/50 bg-slate-900/60 hover:border-rose-500/30 hover:shadow-lg hover:shadow-rose-500/5'
          : 'border-slate-700/50 bg-slate-900/60 hover:border-slate-600/50 hover:shadow-lg hover:shadow-black/20'
      } ${task.priority === 'high' && !task.completed ? 'border-l-2 border-l-rose-500/60' : ''}`}
      onClick={handleClick}
    >
      {/* Checkbox */}
      <button
        onClick={e => { e.stopPropagation(); toggleTask(task.id); }}
        className="mt-0.5 shrink-0 text-slate-500 hover:text-blue-400 transition-colors"
      >
        {task.completed
          ? <CheckCircle2 size={18} className="text-emerald-500" />
          : <Circle size={18} />
        }
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <p className={`text-sm flex-1 ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
            {task.title}
          </p>
          {/* Priority high gets a flame icon */}
          {task.priority === 'high' && !task.completed && (
            <Flame size={14} className="text-rose-400 shrink-0 mt-0.5" />
          )}
        </div>

        {!compact && (
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {/* Priority badge */}
            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs ${p.bg} ${p.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
              {p.label}
            </span>

            {/* Due date */}
            {task.dueDate && (
              <span className={`inline-flex items-center gap-1 text-xs ${isOverdue ? 'text-rose-400' : isToday ? 'text-blue-400' : 'text-slate-500'}`}>
                <Clock size={11} />
                {isOverdue ? 'Overdue' : isToday ? 'Today' : task.dueDate}
                {task.dueTime && ` · ${task.dueTime}`}
              </span>
            )}

            {/* Tags */}
            {task.tags.slice(0, 2).map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 text-xs text-slate-500">
                <Tag size={10} />
                {tag}
              </span>
            ))}

            {/* Subtasks */}
            {task.subtasks.length > 0 && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-500 ml-auto">
                <Layers size={11} />
                {completedSubtasks}/{task.subtasks.length}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Arrow */}
      <ChevronRight size={14} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
    </motion.div>
  );
}
