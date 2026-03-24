import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import {
  CheckCircle2, Clock, AlertTriangle, Flame, Timer, TrendingUp,
  Sparkles, ArrowRight, Zap, Star, Target
} from 'lucide-react';
import { useApp } from '../store/appStore';
import { TaskCard } from '../components/TaskCard';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import {
  SEOHead,
  SCHEMA_FAQ,
  SCHEMA_BREADCRUMB,
} from '../components/SEOHead';
import { useLiveTime } from '../hooks/useLiveTime';

const weeklyData = [
  { day: 'Mon', tasks: 4 },
  { day: 'Tue', tasks: 7 },
  { day: 'Wed', tasks: 5 },
  { day: 'Thu', tasks: 8 },
  { day: 'Fri', tasks: 6 },
  { day: 'Sat', tasks: 3 },
  { day: 'Sun', tasks: 2 },
];

const quotes = [
  "The secret of getting ahead is getting started.",
  "Focus on being productive instead of busy.",
  "Small progress is still progress.",
  "You don't have to be great to start, but you have to start to be great.",
];

export function Dashboard() {
  const { tasks, userName, streak, focusTime, xp, level, setQuickCaptureOpen } = useApp();
  const navigate = useNavigate();
  const [quickInput, setQuickInput] = useState('');

  // Live time — minute-level updates are enough for the dashboard
  const { todayStr, greeting, formattedDate, now } = useLiveTime(60000);

  const todayTasks = tasks.filter(t => t.dueDate === todayStr);
  const completedToday = todayTasks.filter(t => t.completed).length;
  const pendingToday = todayTasks.filter(t => !t.completed).length;
  const overdueTasks = tasks.filter(t => t.dueDate && t.dueDate < todayStr && !t.completed);
  const totalTasks = tasks.filter(t => !t.completed).length;
  const progress = todayTasks.length > 0 ? (completedToday / todayTasks.length) * 100 : 0;
  const quote = quotes[now.getDay() % quotes.length];

  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const stats = [
    {
      label: 'Completed Today', value: completedToday, icon: CheckCircle2,
      color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20',
      onClick: () => navigate('/tasks'),
      hint: 'View all tasks',
    },
    {
      label: 'Pending Today', value: pendingToday, icon: Clock,
      color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20',
      onClick: () => navigate('/tasks'),
      hint: 'View pending tasks',
    },
    {
      label: 'Overdue', value: overdueTasks.length, icon: AlertTriangle,
      color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20',
      onClick: () => navigate('/tasks'),
      hint: 'View overdue tasks',
    },
    {
      label: 'Total Active', value: totalTasks, icon: Target,
      color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20',
      onClick: () => navigate('/tasks'),
      hint: 'View all active tasks',
    },
  ];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5 md:space-y-6">
      <SEOHead
        title="Dashboard – Your Productivity Overview"
        description="View today's tasks, focus time, XP progress, streaks, and weekly performance at a glance. TimeCraft's dashboard keeps you on track every day."
        path="/"
        jsonLd={[SCHEMA_FAQ, SCHEMA_BREADCRUMB([{ name: 'Home', path: '/' }])]}
      />
      {/* Greeting + quote */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-xl md:text-2xl font-bold text-white">{greeting}, {userName} 👋</h1>
        <p className="text-slate-500 text-sm mt-1 flex items-center gap-1.5">
          <Sparkles size={13} className="text-purple-400 shrink-0" />
          <em>"{quote}"</em>
        </p>
        <p className="text-slate-600 text-xs mt-1">{formattedDate}</p>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, i) => (
          <motion.button
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.97 }}
            onClick={stat.onClick}
            className={`p-4 rounded-2xl border ${stat.bg} ${stat.border} backdrop-blur-sm text-left cursor-pointer hover:brightness-110 transition-all`}
            title={stat.hint}
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon size={18} className={stat.color} strokeWidth={1.75} />
              <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
            </div>
            <p className="text-slate-400 text-xs">{stat.label}</p>
          </motion.button>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
        {/* Today's tasks */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="lg:col-span-2 space-y-4"
        >
          {/* Today's progress header */}
          <div className="p-4 md:p-5 rounded-2xl border border-slate-700/40 bg-slate-900/60 backdrop-blur-sm">
            <div className="flex items-center gap-4 md:gap-5">
              {/* Circular progress */}
              <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0">
                <svg width="100%" height="100%" viewBox="0 0 80 80" className="-rotate-90">
                  <circle cx="40" cy="40" r="36" stroke="#1e293b" strokeWidth="6" fill="none" />
                  <circle
                    cx="40" cy="40" r="36"
                    stroke="url(#progressGrad)" strokeWidth="6" fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                  />
                  <defs>
                    <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{Math.round(progress)}%</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">Today's Progress</h3>
                <p className="text-slate-400 text-sm mt-0.5">{completedToday} of {todayTasks.length} tasks done</p>
                <div className="mt-2 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Task list */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-sm">Today's Tasks</h3>
              <button
                onClick={() => navigate('/tasks')}
                className="text-slate-500 text-xs hover:text-blue-400 transition-colors flex items-center gap-1"
              >
                {pendingToday} remaining <ArrowRight size={11} />
              </button>
            </div>
            {todayTasks.length === 0 ? (
              <div className="text-center py-10 px-6 rounded-2xl border border-dashed border-slate-700/50">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 size={24} className="text-slate-600" />
                </div>
                <p className="text-slate-400 text-sm font-medium">No tasks due today!</p>
                <p className="text-slate-600 text-xs mt-1">Enjoy your day or add something new</p>
                <button
                  onClick={() => setQuickCaptureOpen(true)}
                  className="mt-3 px-4 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs hover:bg-slate-700 transition-all"
                >
                  Add a task
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {todayTasks.sort((a, b) => {
                  const pOrder = { high: 0, medium: 1, low: 2 };
                  return pOrder[a.priority] - pOrder[b.priority];
                }).map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>

          {/* Overdue */}
          {overdueTasks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-rose-400" />
                <h3 className="text-rose-400 font-semibold text-sm">Overdue ({overdueTasks.length})</h3>
                <button
                  onClick={() => navigate('/tasks')}
                  className="ml-auto text-slate-600 text-xs hover:text-slate-400 transition-colors"
                >
                  View all →
                </button>
              </div>
              <div className="space-y-2">
                {overdueTasks.slice(0, 3).map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Right sidebar widgets */}
        <div className="space-y-4">
          {/* Streak widget */}
          <motion.button
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/analytics')}
            className="w-full p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-sm text-left cursor-pointer hover:border-amber-500/40 transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Flame size={18} className="text-amber-400" />
              </div>
              <div>
                <p className="text-amber-300 font-semibold text-sm">{streak} Day Streak 🔥</p>
                <p className="text-slate-500 text-xs">Keep it going!</p>
              </div>
            </div>
            <div className="flex gap-1 mt-3">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-1.5 rounded-full ${i < streak % 7 ? 'bg-amber-500' : 'bg-slate-800'}`}
                />
              ))}
            </div>
          </motion.button>

          {/* XP / Level widget */}
          <motion.button
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/analytics')}
            className="w-full p-4 rounded-2xl border border-purple-500/20 bg-purple-500/5 backdrop-blur-sm text-left cursor-pointer hover:border-purple-500/40 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Star size={16} className="text-purple-400" />
                <p className="text-purple-300 font-semibold text-sm">Level {level}</p>
              </div>
              <span className="text-slate-400 text-xs">{xp.toLocaleString()} XP</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                animate={{ width: `${(xp % 3000) / 3000 * 100}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
            <p className="text-slate-600 text-xs mt-1.5">{3000 - (xp % 3000)} XP to Level {level + 1}</p>
          </motion.button>

          {/* Focus time */}
          <motion.button
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/focus')}
            className="w-full p-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 backdrop-blur-sm text-left cursor-pointer hover:border-blue-500/40 transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <Timer size={16} className="text-blue-400" />
              <p className="text-blue-300 font-semibold text-sm">Focus Time</p>
              <ArrowRight size={12} className="ml-auto text-slate-600" />
            </div>
            <p className="text-white text-2xl font-bold">{Math.floor(focusTime / 60)}h {focusTime % 60}m</p>
            <p className="text-slate-500 text-xs mt-0.5">logged today · tap to focus</p>
          </motion.button>

          {/* Weekly sparkline */}
          <motion.button
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/analytics')}
            className="w-full p-4 rounded-2xl border border-slate-700/40 bg-slate-900/60 backdrop-blur-sm text-left cursor-pointer hover:border-slate-600/50 transition-all"
          >
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} className="text-emerald-400" />
              <p className="text-slate-300 font-semibold text-sm">Weekly Performance</p>
              <ArrowRight size={12} className="ml-auto text-slate-600" />
            </div>
            <ResponsiveContainer width="100%" height={60}>
              <AreaChart data={weeklyData}>
                <XAxis key="xaxis" dataKey="day" hide />
                <Tooltip
                  key="tooltip"
                  contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
                  labelStyle={{ color: '#94a3b8' }}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Area
                  key="area"
                  type="monotone"
                  dataKey="tasks"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="#3b82f6"
                  fillOpacity={0.15}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-between mt-1">
              {weeklyData.map(d => (
                <span key={d.day} className="text-slate-600 text-xs">{d.day[0]}</span>
              ))}
            </div>
          </motion.button>

          {/* Quick add */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45, duration: 0.4 }}
            className="p-4 rounded-2xl border border-slate-700/40 bg-slate-900/60 backdrop-blur-sm"
          >
            <p className="text-slate-400 text-xs mb-2 flex items-center gap-1.5">
              <Zap size={11} className="text-blue-400" />
              Quick brain dump
            </p>
            <div className="flex gap-2">
              <input
                value={quickInput}
                onChange={e => setQuickInput(e.target.value)}
                placeholder='"Call Mom tomorrow at 5pm #personal"'
                className="flex-1 bg-slate-800/60 border border-slate-700/40 rounded-xl px-3 py-2 text-slate-300 text-xs outline-none placeholder:text-slate-600 focus:border-blue-500/40 transition-colors"
                onKeyDown={e => {
                  if (e.key === 'Enter' && quickInput.trim()) {
                    setQuickCaptureOpen(true);
                    setQuickInput('');
                  }
                }}
              />
              <button
                onClick={() => setQuickCaptureOpen(true)}
                className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
