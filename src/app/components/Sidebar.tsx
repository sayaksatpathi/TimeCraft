import React from 'react';
import { NavLink, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, CheckSquare, Calendar, Timer, BarChart2,
  Sparkles, Settings, ChevronLeft, ChevronRight, Zap, Flame, X,
} from 'lucide-react';
import { useApp } from '../store/appStore';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/tasks', label: 'All Tasks', icon: CheckSquare },
  { to: '/calendar', label: 'Calendar', icon: Calendar },
  { to: '/focus', label: 'Focus', icon: Timer },
  { to: '/analytics', label: 'Analytics', icon: BarChart2 },
  { to: '/ai', label: 'AI Assistant', icon: Sparkles },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, userName, level, xp, streak, mobileSidebarOpen, setMobileSidebarOpen } = useApp();
  const location = useLocation();

  const xpForLevel = 3000;
  const xpProgress = (xp % xpForLevel) / xpForLevel * 100;

  const handleNavClick = () => {
    // Close mobile sidebar on navigation
    setMobileSidebarOpen(false);
  };

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative flex flex-col h-full shrink-0 overflow-hidden border-r border-slate-800/50 bg-slate-900/95 backdrop-blur-xl z-10"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800/50">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
          <Zap size={16} className="text-white" />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden flex-1"
            >
              <span className="text-white font-semibold text-sm tracking-wide">TimeCraft</span>
              <p className="text-slate-500 text-xs">Productivity</p>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Mobile close button */}
        {mobileSidebarOpen && (
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="ml-auto p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all md:hidden"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.map(({ to, label, icon: Icon, exact }) => {
          const isActive = exact ? location.pathname === to : location.pathname === to;
          return (
            <NavLink key={to} to={to} onClick={handleNavClick}>
              {({ isActive: navActive }) => (
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group cursor-pointer ${
                    navActive
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-400'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon size={18} className={navActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'} strokeWidth={1.75} />
                  <AnimatePresence>
                    {!sidebarCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.2 }}
                        className="text-sm font-medium whitespace-nowrap"
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {navActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-1 h-4 rounded-full bg-gradient-to-b from-blue-400 to-purple-500"
                    />
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User / XP section */}
      <div className="px-2 pb-4 space-y-2">
        {/* Streak */}
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mx-2 px-3 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Flame size={14} className="text-amber-400" />
                <span className="text-amber-400 text-xs font-semibold">{streak} Day Streak</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" style={{ width: '70%' }} />
                </div>
                <span className="text-slate-500 text-xs">Lv {level}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-slate-500 text-xs">{xp.toLocaleString()} XP</span>
                <span className="text-slate-600 text-xs">{xpProgress.toFixed(0)}%</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings link */}
        <NavLink to="/settings" onClick={handleNavClick}>
          {({ isActive }) => (
            <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
              isActive ? 'bg-slate-800 text-slate-200' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'
            }`}>
              <Settings size={18} strokeWidth={1.75} />
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    Settings
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          )}
        </NavLink>

        {/* Collapse toggle – desktop only */}
        <button
          onClick={toggleSidebar}
          className="hidden md:flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-all duration-200"
        >
          {sidebarCollapsed ? <ChevronRight size={18} strokeWidth={1.75} /> : <ChevronLeft size={18} strokeWidth={1.75} />}
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium whitespace-nowrap"
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
