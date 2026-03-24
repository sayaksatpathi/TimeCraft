import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Calendar, Clock, Plus } from 'lucide-react';
import { useApp } from '../store/appStore';
import type { Task } from '../store/appStore';
import { SEOHead, SCHEMA_BREADCRUMB } from '../components/SEOHead';
import { useLiveTime } from '../hooks/useLiveTime';

type CalendarMode = 'month' | 'week';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const priorityColors: Record<string, string> = {
  high: 'bg-rose-500/30 text-rose-300 border-rose-500/30',
  medium: 'bg-amber-500/30 text-amber-300 border-amber-500/30',
  low: 'bg-emerald-500/30 text-emerald-300 border-emerald-500/30',
};

export function CalendarView() {
  const { tasks, setSelectedTask, setTaskDetailOpen, setQuickCaptureOpen } = useApp();
  const [mode, setMode] = useState<CalendarMode>('month');

  // Live date — minute-level accuracy is more than enough for a calendar
  const { todayStr, now } = useLiveTime(60000);

  const [currentDate, setCurrentDate] = useState({
    year: now.getFullYear(),
    month: now.getMonth(),
  });

  const getTasksForDate = (dateStr: string) => tasks.filter(t => t.dueDate === dateStr);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setTaskDetailOpen(true);
  };

  const prevMonth = () => {
    setCurrentDate(prev => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 };
      return { year: prev.year, month: prev.month - 1 };
    });
  };

  const nextMonth = () => {
    setCurrentDate(prev => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 };
      return { year: prev.year, month: prev.month + 1 };
    });
  };

  const goToToday = () => {
    setCurrentDate({ year: now.getFullYear(), month: now.getMonth() });
  };

  const daysInMonth = getDaysInMonth(currentDate.year, currentDate.month);
  const firstDay = getFirstDayOfMonth(currentDate.year, currentDate.month);

  // Week view: get 7 days starting from Sunday of current week (based on live "now")
  const getWeekDays = () => {
    const sunday = new Date(now);
    sunday.setDate(now.getDate() - now.getDay());
    sunday.setHours(0, 0, 0, 0);
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(sunday);
      day.setDate(sunday.getDate() + i);
      return day;
    });
  };

  const weekDays = getWeekDays();

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-5">
      <SEOHead
        title="Task Calendar – Month & Week View Planner"
        description="Plan and visualize your tasks in TimeCraft's interactive calendar. Switch between month and week views, see tasks by due date, and open tasks to view or edit details."
        keywords="task calendar, productivity calendar, task planner, weekly planner, monthly planner, due date tracker, schedule tasks"
        path="/calendar"
        jsonLd={SCHEMA_BREADCRUMB([{ name: 'Home', path: '/' }, { name: 'Calendar', path: '/calendar' }])}
      />
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20 flex items-center justify-center">
            <Calendar size={18} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Calendar</h1>
            <p className="text-slate-500 text-xs">{MONTH_NAMES[currentDate.month]} {currentDate.year}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Quick add */}
          <button
            onClick={() => setQuickCaptureOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Add Task</span>
          </button>
          {/* Mode toggle */}
          <div className="flex items-center rounded-xl border border-slate-700/40 overflow-hidden">
            {(['month', 'week'] as CalendarMode[]).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1.5 text-sm font-medium transition-all ${mode === m ? 'bg-blue-500/20 text-blue-400' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'}`}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
          {/* Nav */}
          <div className="flex items-center rounded-xl border border-slate-700/40 overflow-hidden">
            <button onClick={prevMonth} className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all">
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1.5 text-slate-400 text-sm hover:text-slate-200 hover:bg-slate-800/60 transition-all"
            >
              Today
            </button>
            <button onClick={nextMonth} className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-700/40 bg-slate-900/60 backdrop-blur-sm overflow-hidden"
      >
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-slate-800/50">
          {DAYS.map((day, idx) => (
            <div key={day} className="py-2 md:py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span className="hidden md:inline">{day}</span>
              <span className="md:hidden">{DAYS_SHORT[idx]}</span>
            </div>
          ))}
        </div>

        {/* Scrollable calendar body on mobile */}
        <div className="overflow-x-auto">
          {mode === 'month' ? (
            <div className="grid grid-cols-7 min-w-[420px]">
              {/* Empty cells before first day */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-16 md:min-h-24 p-1 md:p-2 border-b border-r border-slate-800/30 bg-slate-950/20" />
              ))}
              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${currentDate.year}-${String(currentDate.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const dayTasks = getTasksForDate(dateStr);
                const isToday = dateStr === todayStr;
                const isWeekend = (firstDay + i) % 7 === 0 || (firstDay + i) % 7 === 6;

                return (
                  <div
                    key={day}
                    className={`min-h-16 md:min-h-24 p-1 md:p-2 border-b border-r border-slate-800/30 transition-all ${isToday ? 'bg-blue-500/5' : isWeekend ? 'bg-slate-950/30' : ''}`}
                  >
                    <div className={`w-5 h-5 md:w-6 md:h-6 rounded-lg flex items-center justify-center text-xs font-semibold mb-1 ${
                      isToday
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                        : 'text-slate-400'
                    }`}>
                      {day}
                    </div>
                    <div className="space-y-0.5">
                      {dayTasks.slice(0, 2).map(task => (
                        <button
                          key={task.id}
                          onClick={() => handleTaskClick(task)}
                          className={`w-full text-left text-xs px-1 md:px-1.5 py-0.5 rounded-md border truncate cursor-pointer hover:opacity-80 transition-opacity ${priorityColors[task.priority]} ${task.completed ? 'opacity-50 line-through' : ''}`}
                        >
                          <span className="hidden md:inline">{task.title}</span>
                          <span className="md:hidden">•</span>
                        </button>
                      ))}
                      {dayTasks.length > 2 && (
                        <p className="text-xs text-slate-500 pl-1">+{dayTasks.length - 2}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Week view */
            <div className="grid grid-cols-7 min-w-[420px]">
              {weekDays.map((day, i) => {
                const dateStr = day.toISOString().split('T')[0];
                const dayTasks = getTasksForDate(dateStr);
                const isToday = dateStr === todayStr;

                return (
                  <div key={i} className={`min-h-36 md:min-h-48 p-2 md:p-3 border-r border-slate-800/30 ${isToday ? 'bg-blue-500/5' : ''}`}>
                    <div className={`w-7 h-7 md:w-8 md:h-8 rounded-xl flex items-center justify-center text-xs md:text-sm font-semibold mb-2 md:mb-3 ${
                      isToday
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                        : 'text-slate-400'
                    }`}>
                      {day.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayTasks.map(task => (
                        <button
                          key={task.id}
                          onClick={() => handleTaskClick(task)}
                          className={`w-full text-left p-1.5 md:p-2 rounded-lg border text-xs cursor-pointer hover:opacity-80 transition-opacity ${priorityColors[task.priority]} ${task.completed ? 'opacity-50' : ''}`}
                        >
                          <p className={`truncate font-medium ${task.completed ? 'line-through' : ''}`}>{task.title}</p>
                          {task.dueTime && (
                            <p className="hidden md:flex items-center gap-1 mt-0.5 opacity-70">
                              <Clock size={9} />{task.dueTime}
                            </p>
                          )}
                        </button>
                      ))}
                      {dayTasks.length === 0 && (
                        <p className="text-slate-700 text-xs text-center mt-3 md:mt-4">—</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap">
        {[
          { color: 'bg-rose-500', label: 'High Priority' },
          { color: 'bg-amber-500', label: 'Medium Priority' },
          { color: 'bg-emerald-500', label: 'Low Priority' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${color}`} />
            {label}
          </div>
        ))}
        <div className="flex items-center gap-1.5 ml-auto">
          <div className="w-3 h-3 rounded bg-gradient-to-br from-blue-500 to-purple-600" />
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}
