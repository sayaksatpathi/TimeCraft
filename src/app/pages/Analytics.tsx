import React from 'react';
import { motion } from 'motion/react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { Trophy, Flame, Star, TrendingUp, CheckCircle2, Clock, Zap } from 'lucide-react';
import { useApp } from '../store/appStore';
import { SEOHead, SCHEMA_BREADCRUMB } from '../components/SEOHead';
import { useLiveTime } from '../hooks/useLiveTime';

const weeklyData = [
  { day: 'Mon', completed: 4, added: 6 },
  { day: 'Tue', completed: 7, added: 5 },
  { day: 'Wed', completed: 5, added: 8 },
  { day: 'Thu', completed: 8, added: 4 },
  { day: 'Fri', completed: 6, added: 7 },
  { day: 'Sat', completed: 3, added: 2 },
  { day: 'Sun', completed: 2, added: 1 },
];

const BADGE_LIST = [
  { id: 'b1', label: 'First Task', icon: '🎯', desc: 'Complete your first task', unlocked: true },
  { id: 'b2', label: '7-Day Streak', icon: '🔥', desc: '7 consecutive days', unlocked: true },
  { id: 'b3', label: 'Century', icon: '💯', desc: 'Complete 100 tasks', unlocked: false },
  { id: 'b4', label: 'Speed Runner', icon: '⚡', desc: '5 tasks in one day', unlocked: true },
  { id: 'b5', label: 'Deep Focus', icon: '🧘', desc: '4h of focus time', unlocked: false },
  { id: 'b6', label: 'Overachiever', icon: '🏆', desc: 'Complete 10 high-priority tasks', unlocked: false },
];

const COLORS = ['#3b82f6', '#a855f7', '#10b981', '#f59e0b', '#ef4444'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-3 shadow-xl">
        <p className="text-slate-400 text-xs mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} className="text-sm font-medium" style={{ color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function Analytics() {
  const { tasks, xp, level, streak, focusTime } = useApp();
  const { todayStr } = useLiveTime(60000);

  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.filter(t => !t.completed).length;
  const overdue = tasks.filter(t => t.dueDate && t.dueDate < todayStr && !t.completed).length;

  const pieData = [
    { name: 'Completed', value: completed },
    { name: 'Pending', value: pending },
    { name: 'Overdue', value: overdue },
  ].filter(d => d.value > 0);

  const priorityData = [
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#ef4444' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#f59e0b' },
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#10b981' },
  ];

  const xpToNextLevel = 3000 - (xp % 3000);
  const xpProgress = ((xp % 3000) / 3000) * 100;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5 md:space-y-6">
      <SEOHead
        title="Productivity Analytics – Charts, XP & Achievements"
        description="Visualize your productivity with TimeCraft's analytics. Track task completion rates, weekly trends, focus time, XP levels, streaks, and badge achievements."
        keywords="productivity analytics, task statistics, productivity charts, focus time tracker, XP system, productivity gamification, achievement badges"
        path="/analytics"
        jsonLd={SCHEMA_BREADCRUMB([{ name: 'Home', path: '/' }, { name: 'Analytics', path: '/analytics' }])}
      />
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-white">Analytics & Progress</h1>
        <p className="text-slate-500 text-xs mt-0.5">Track your productivity trends and achievements</p>
      </motion.div>

      {/* XP / Level hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-5 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-blue-500/5 backdrop-blur-sm"
      >
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/25">
            <span className="text-2xl font-bold text-white">{level}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-white font-semibold">Level {level} — Productivity Ninja</p>
                <p className="text-slate-400 text-sm">{xp.toLocaleString()} XP total · {xpToNextLevel} XP to Level {level + 1}</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <Flame size={14} className="text-amber-400" />
                <span className="text-amber-300 text-sm font-semibold">{streak} day streak</span>
              </div>
            </div>
            <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: 'Tasks Completed', value: completed, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Focus Time', value: `${Math.floor(focusTime / 60)}h ${focusTime % 60}m`, icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
          { label: 'Total XP', value: xp.toLocaleString(), icon: Zap, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
          { label: 'Streak', value: `${streak} days`, icon: Flame, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.07 }}
            className={`p-4 rounded-2xl border ${stat.bg}`}
          >
            <stat.icon size={18} className={`${stat.color} mb-3`} strokeWidth={1.75} />
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-slate-500 text-xs mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Weekly bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-2xl border border-slate-700/40 bg-slate-900/60 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-blue-400" />
            <h3 className="text-white font-semibold text-sm">Weekly Productivity</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData} barGap={4}>
              <XAxis key="xaxis" dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis key="yaxis" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip key="tooltip" content={<CustomTooltip />} />
              <Bar key="bar-completed" dataKey="completed" name="Completed" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar key="bar-added" dataKey="added" name="Added" fill="#a855f7" radius={[4, 4, 0, 0]} opacity={0.5} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-blue-500" /><span className="text-slate-500 text-xs">Completed</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-purple-500 opacity-50" /><span className="text-slate-500 text-xs">Added</span></div>
          </div>
        </motion.div>

        {/* Completion pie */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="p-5 rounded-2xl border border-slate-700/40 bg-slate-900/60 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <h3 className="text-white font-semibold text-sm">Task Completion</h3>
          </div>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie
                  key="pie"
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip key="pie-tooltip" contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 flex-1">
              {pieData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[i] }} />
                  <span className="text-slate-400 text-sm flex-1">{item.name}</span>
                  <span className="text-white font-semibold text-sm">{item.value}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-slate-800">
                <p className="text-slate-500 text-xs">Completion rate</p>
                <p className="text-white font-bold text-lg">{tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0}%</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Priority distribution */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-5 rounded-2xl border border-slate-700/40 bg-slate-900/60 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <Star size={16} className="text-amber-400" />
            <h3 className="text-white font-semibold text-sm">Priority Distribution</h3>
          </div>
          <div className="space-y-3">
            {priorityData.map(p => (
              <div key={p.name} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">{p.name} Priority</span>
                  <span className="text-slate-300 text-sm font-medium">{p.value} tasks</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: p.color }}
                    animate={{ width: `${tasks.length > 0 ? (p.value / tasks.length) * 100 : 0}%` }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="p-5 rounded-2xl border border-slate-700/40 bg-slate-900/60 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <Trophy size={16} className="text-amber-400" />
            <h3 className="text-white font-semibold text-sm">Achievements</h3>
            <span className="ml-auto text-slate-500 text-xs">{BADGE_LIST.filter(b => b.unlocked).length}/{BADGE_LIST.length} unlocked</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {BADGE_LIST.map(badge => (
              <motion.div
                key={badge.id}
                whileHover={badge.unlocked ? { scale: 1.03 } : {}}
                whileTap={badge.unlocked ? { scale: 0.97 } : {}}
                className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all ${
                  badge.unlocked
                    ? 'border-amber-500/20 bg-amber-500/5 cursor-pointer hover:border-amber-500/40'
                    : 'border-slate-800 bg-slate-900/30 opacity-40 grayscale'
                }`}
              >
                <span className="text-2xl mb-1">{badge.icon}</span>
                <p className={`text-xs font-semibold ${badge.unlocked ? 'text-amber-300' : 'text-slate-500'}`}>{badge.label}</p>
                <p className="text-slate-600 text-xs mt-0.5 leading-tight">{badge.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}