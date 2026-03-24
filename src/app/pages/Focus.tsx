import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Timer, CheckCircle2, Brain, Volume2, VolumeX, ChevronRight, Settings2, X, Minus, Plus } from 'lucide-react';
import { useApp } from '../store/appStore';
import { SEOHead, SCHEMA_HOW_TO_POMODORO, SCHEMA_BREADCRUMB } from '../components/SEOHead';
import { useLiveTime } from '../hooks/useLiveTime';

type TimerMode = 'focus' | 'short-break' | 'long-break';

interface TimerSettings {
  focus: number;
  'short-break': number;
  'long-break': number;
}

const DEFAULT_SETTINGS: TimerSettings = {
  focus: 25,
  'short-break': 5,
  'long-break': 15,
};

const MODE_CONFIG: Record<TimerMode, { label: string; color: string; bg: string; ring: string }> = {
  focus: { label: 'Focus', color: 'text-blue-400', bg: 'from-blue-500 to-purple-600', ring: 'stroke-blue-500' },
  'short-break': { label: 'Short Break', color: 'text-emerald-400', bg: 'from-emerald-500 to-teal-600', ring: 'stroke-emerald-500' },
  'long-break': { label: 'Long Break', color: 'text-amber-400', bg: 'from-amber-500 to-orange-600', ring: 'stroke-amber-500' },
};

function Stepper({
  value,
  onChange,
  min = 1,
  max = 120,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
      >
        <Minus size={14} />
      </button>
      <div className="w-16 text-center">
        <span className="text-white font-bold text-lg tabular-nums">{value}</span>
        <span className="text-slate-500 text-xs ml-1">min</span>
      </div>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

export function Focus() {
  const { tasks, addFocusTime } = useApp();
  const [settings, setSettings] = useState<TimerSettings>(DEFAULT_SETTINGS);
  const [pendingSettings, setPendingSettings] = useState<TimerSettings>(DEFAULT_SETTINGS);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(settings.focus * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [zenMode, setZenMode] = useState(false);
  const [muted, setMuted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const originalTitleRef = useRef(document.title);

  // Live wall clock for the side display
  const { formattedTime, second } = useLiveTime(1000);

  const activeTasks = tasks.filter(t => !t.completed).slice(0, 5);
  const selectedTask = tasks.find(t => t.id === selectedTaskId);

  const totalTime = settings[mode] * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Update browser tab title with live countdown when running
  useEffect(() => {
    if (isRunning) {
      const config = MODE_CONFIG[mode];
      document.title = `${formatTime(timeLeft)} · ${config.label} – FlowTask`;
    } else {
      document.title = originalTitleRef.current;
    }
    return () => {
      document.title = originalTitleRef.current;
    };
  }, [isRunning, timeLeft, mode]);

  const handleComplete = useCallback(() => {
    setIsRunning(false);
    if (mode === 'focus') {
      setSessions(s => s + 1);
      addFocusTime(settings.focus);
      setMode('short-break');
      setTimeLeft(settings['short-break'] * 60);
    } else {
      setMode('focus');
      setTimeLeft(settings.focus * 60);
    }
  }, [mode, addFocusTime, settings]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            handleComplete();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, handleComplete]);

  const handleModeChange = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(settings[newMode] * 60);
    setIsRunning(false);
  };

  const handleReset = () => {
    setTimeLeft(settings[mode] * 60);
    setIsRunning(false);
  };

  const openSettings = () => {
    setPendingSettings({ ...settings });
    setSettingsOpen(true);
  };

  const applySettings = () => {
    setSettings({ ...pendingSettings });
    setTimeLeft(pendingSettings[mode] * 60);
    setIsRunning(false);
    setSettingsOpen(false);
  };

  const config = MODE_CONFIG[mode];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`min-h-full flex flex-col items-center justify-center p-4 md:p-6 relative ${zenMode ? 'bg-slate-950' : 'pt-16 md:pt-20'}`}
      >
        <SEOHead
          title="Pomodoro Focus Timer – Customizable Work & Break Intervals | FlowTask"
          description="Use FlowTask's free Pomodoro focus timer with fully customizable focus sessions (1–120 min), short breaks, and long breaks. Features Zen Mode, task linking, and session tracking."
          keywords="pomodoro timer, focus timer, work timer, pomodoro technique, focus mode, productivity timer, customizable pomodoro, zen mode"
          path="/focus"
          jsonLd={[SCHEMA_HOW_TO_POMODORO, SCHEMA_BREADCRUMB([{ name: 'Home', path: '/' }, { name: 'Focus', path: '/focus' }])]}
        />
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-10 bg-gradient-to-r ${config.bg}`} />
        </div>

        {/* Zen mode toggle */}
        {!zenMode && (
          <button
            onClick={() => setZenMode(true)}
            className="absolute top-4 md:top-6 right-4 md:right-6 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/40 text-slate-400 text-sm hover:text-slate-200 transition-all"
          >
            <Brain size={14} />
            <span className="hidden sm:inline">Zen Mode</span>
          </button>
        )}
        {zenMode && (
          <button
            onClick={() => setZenMode(false)}
            className="absolute top-4 md:top-6 right-4 md:right-6 text-slate-600 text-sm hover:text-slate-400 transition-colors"
          >
            Exit Zen
          </button>
        )}

        {/* Mute */}
        <button
          onClick={() => setMuted(!muted)}
          className="absolute top-4 md:top-6 left-4 md:left-6 p-2 rounded-xl bg-slate-800/60 border border-slate-700/40 text-slate-500 hover:text-slate-300 transition-all"
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        {/* Settings gear */}
        {!zenMode && (
          <button
            onClick={openSettings}
            className="absolute top-4 md:top-6 left-14 md:left-16 p-2 rounded-xl bg-slate-800/60 border border-slate-700/40 text-slate-500 hover:text-slate-300 transition-all"
            title="Timer settings"
          >
            <Settings2 size={16} />
          </button>
        )}

        {/* Live wall clock — top center */}
        {!zenMode && (
          <div className="absolute top-4 md:top-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/40 border border-slate-700/30">
            <span className="text-slate-400 text-sm font-mono tabular-nums">
              {formattedTime}
              <span
                className="text-slate-600"
                style={{ opacity: second % 2 === 0 ? 1 : 0.2, transition: 'opacity 0.4s' }}
              >
                :{String(second).padStart(2, '0')}
              </span>
            </span>
          </div>
        )}

        <div className="relative z-10 flex flex-col items-center gap-8 max-w-md w-full mt-8 md:mt-4">
          {/* Mode selector */}
          {!zenMode && (
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/60 border border-slate-700/40">
              {(Object.keys(MODE_CONFIG) as TimerMode[]).map(m => (
                <button
                  key={m}
                  onClick={() => handleModeChange(m)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    mode === m
                      ? `bg-gradient-to-r ${config.bg} text-white shadow-lg`
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {MODE_CONFIG[m].label}
                </button>
              ))}
            </div>
          )}

          {/* Timer circle */}
          <div className="relative w-full max-w-[220px] md:max-w-[280px] mx-auto">
            <svg viewBox="0 0 280 280" className="w-full -rotate-90">
              <circle cx="140" cy="140" r="120" stroke="#1e293b" strokeWidth="8" fill="none" />
              <motion.circle
                cx="140" cy="140" r="120"
                stroke="url(#timerGrad)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
              <defs>
                <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={mode === 'focus' ? '#3b82f6' : mode === 'short-break' ? '#10b981' : '#f59e0b'} />
                  <stop offset="100%" stopColor={mode === 'focus' ? '#a855f7' : mode === 'short-break' ? '#14b8a6' : '#f97316'} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl md:text-6xl font-bold text-white tabular-nums tracking-tight">
                {formatTime(timeLeft)}
              </span>
              <span className={`text-sm font-medium mt-1 ${config.color}`}>{config.label}</span>
              {/* Running indicator pulse */}
              {isRunning && (
                <div className="flex items-center gap-1 mt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 text-xs">Running</span>
                </div>
              )}
              {sessions > 0 && !isRunning && (
                <div className="flex items-center gap-1 mt-2">
                  {Array.from({ length: Math.min(sessions, 4) }).map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full bg-gradient-to-br ${config.bg}`} />
                  ))}
                  {sessions > 4 && <span className="text-slate-500 text-xs ml-1">+{sessions - 4}</span>}
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleReset}
              className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/40 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 transition-all"
            >
              <RotateCcw size={20} />
            </button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsRunning(!isRunning)}
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${config.bg} text-white shadow-xl flex items-center justify-center transition-all`}
            >
              {isRunning ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
            </motion.button>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/40 text-slate-500">
              <div className="flex items-center gap-1">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span className="text-sm text-slate-300">{sessions}</span>
              </div>
            </div>
          </div>

          {/* Current task */}
          {!zenMode && (
            <div className="w-full space-y-3">
              <p className="text-slate-500 text-sm text-center">Currently working on</p>
              {selectedTask ? (
                <div className="p-4 rounded-2xl border border-slate-700/40 bg-slate-900/60 text-center">
                  <div className={`w-2 h-2 rounded-full mx-auto mb-2 ${selectedTask.priority === 'high' ? 'bg-rose-500' : selectedTask.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  <p className="text-white font-semibold">{selectedTask.title}</p>
                  {selectedTask.subtasks.length > 0 && (
                    <p className="text-slate-500 text-xs mt-1">
                      {selectedTask.subtasks.filter(s => s.completed).length}/{selectedTask.subtasks.length} subtasks
                    </p>
                  )}
                  <button onClick={() => setSelectedTaskId(null)} className="text-slate-600 text-xs mt-2 hover:text-slate-400 transition-colors">
                    Clear selection
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-2xl border border-dashed border-slate-700/50 text-center">
                  <p className="text-slate-600 text-sm">Select a task to focus on</p>
                </div>
              )}

              <div className="space-y-2">
                {activeTasks.map(task => (
                  <button
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id === selectedTaskId ? null : task.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      selectedTaskId === task.id
                        ? 'border-blue-500/40 bg-blue-500/10 text-blue-300'
                        : 'border-slate-700/40 bg-slate-900/40 text-slate-400 hover:border-slate-600/50 hover:text-slate-300'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full shrink-0 ${task.priority === 'high' ? 'bg-rose-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                    <span className="text-sm flex-1 truncate">{task.title}</span>
                    <ChevronRight size={14} className="shrink-0 opacity-50" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Session info */}
          <div className="flex items-center gap-6 text-center">
            <div>
              <p className="text-white font-bold text-lg">{sessions}</p>
              <p className="text-slate-500 text-xs">Sessions</p>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div>
              <p className="text-white font-bold text-lg">{sessions * settings.focus}m</p>
              <p className="text-slate-500 text-xs">Focused</p>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div>
              <p className="text-white font-bold text-lg">{Math.ceil(sessions / 4) || 0}</p>
              <p className="text-slate-500 text-xs">Rounds</p>
            </div>
          </div>
        </div>

        {/* Settings Modal */}
        <AnimatePresence>
          {settingsOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                onClick={() => setSettingsOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ duration: 0.2 }}
                className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl p-6"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Timer size={15} className="text-white" />
                    </div>
                    <h2 className="text-white font-semibold">Timer Settings</h2>
                  </div>
                  <button
                    onClick={() => setSettingsOpen(false)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Settings rows */}
                <div className="space-y-5">
                  {/* Focus */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <div>
                      <p className="text-blue-300 font-medium text-sm">Focus</p>
                      <p className="text-slate-500 text-xs mt-0.5">Deep work session</p>
                    </div>
                    <Stepper
                      value={pendingSettings.focus}
                      onChange={v => setPendingSettings(p => ({ ...p, focus: v }))}
                      min={1}
                      max={120}
                    />
                  </div>

                  {/* Short Break */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <div>
                      <p className="text-emerald-300 font-medium text-sm">Short Break</p>
                      <p className="text-slate-500 text-xs mt-0.5">Quick rest</p>
                    </div>
                    <Stepper
                      value={pendingSettings['short-break']}
                      onChange={v => setPendingSettings(p => ({ ...p, 'short-break': v }))}
                      min={1}
                      max={30}
                    />
                  </div>

                  {/* Long Break */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <div>
                      <p className="text-amber-300 font-medium text-sm">Long Break</p>
                      <p className="text-slate-500 text-xs mt-0.5">Extended rest</p>
                    </div>
                    <Stepper
                      value={pendingSettings['long-break']}
                      onChange={v => setPendingSettings(p => ({ ...p, 'long-break': v }))}
                      min={1}
                      max={60}
                    />
                  </div>
                </div>

                {/* Reset to defaults */}
                <button
                  onClick={() => setPendingSettings({ ...DEFAULT_SETTINGS })}
                  className="w-full mt-4 py-2 text-slate-500 text-sm hover:text-slate-300 transition-colors"
                >
                  Reset to defaults
                </button>

                {/* Apply */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={applySettings}
                  className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-sm hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25"
                >
                  Apply Changes
                </motion.button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}