import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bell, Download, Upload, Trash2, User, Database, Shield, ChevronRight } from 'lucide-react';
import { useApp } from '../store/appStore';
import { SEOHead, SCHEMA_BREADCRUMB } from '../components/SEOHead';

export function Settings() {
  const { userName, setUserName, tasks, clearTasks } = useApp();
  const [editName, setEditName] = useState(userName);
  const [notifications, setNotifications] = useState(true);
  const [browserNotif, setBrowserNotif] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const handleSaveName = () => {
    if (editName.trim()) {
      setUserName(editName.trim());
      setNameSaved(true);
      setTimeout(() => setNameSaved(false), 2000);
    }
  };

  const handleExportJSON = () => {
    const data = { tasks, exportedAt: new Date().toISOString(), version: '1.0' };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flowtask-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Title', 'Priority', 'Status', 'Due Date', 'Tags', 'Completed'];
    const rows = tasks.map(t => [t.id, `"${t.title}"`, t.priority, t.status, t.dueDate || '', t.tags.join(';'), t.completed]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flowtask-tasks-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (confirmClear) {
      clearTasks();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      // Auto-cancel after 5 seconds
      setTimeout(() => setConfirmClear(false), 5000);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-5">
      <SEOHead
        title="Settings – Customize Your Productivity Workspace | FlowTask"
        description="Customize your FlowTask experience. Update your profile name, manage notifications, export or import task data, and control your productivity workspace settings."
        keywords="productivity app settings, customize workspace, export tasks, notification settings"
        path="/settings"
        noIndex={false}
        jsonLd={SCHEMA_BREADCRUMB([{ name: 'Home', path: '/' }, { name: 'Settings', path: '/settings' }])}
      />
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-white">Settings</h1>
        <p className="text-slate-500 text-xs mt-0.5">Manage your preferences and data</p>
      </motion.div>

      {/* Profile */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-5 rounded-2xl border border-slate-700/40 bg-slate-900/60 backdrop-blur-sm space-y-4"
      >
        <div className="flex items-center gap-2 mb-1">
          <User size={16} className="text-blue-400" />
          <h3 className="text-white font-semibold text-sm">Profile</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
            <span className="text-white text-xl font-bold">{editName.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1">
            <label className="text-slate-500 text-xs block mb-1">Display Name</label>
            <div className="flex items-center gap-2">
              <input
                value={editName}
                onChange={e => setEditName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                className="flex-1 bg-slate-800/60 border border-slate-700/40 rounded-xl px-3 py-2 text-slate-200 text-sm outline-none focus:border-blue-500/40 transition-colors"
                placeholder="Your name"
              />
              <button
                onClick={handleSaveName}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  nameSaved
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                }`}
              >
                {nameSaved ? '✓ Saved' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-5 rounded-2xl border border-slate-700/40 bg-slate-900/60 backdrop-blur-sm space-y-4"
      >
        <div className="flex items-center gap-2 mb-1">
          <Bell size={16} className="text-amber-400" />
          <h3 className="text-white font-semibold text-sm">Notifications</h3>
        </div>
        {[
          { label: 'In-app notifications', desc: 'Alerts and reminders within the app', value: notifications, onChange: setNotifications },
          { label: 'Browser notifications', desc: 'System-level notifications (requires permission)', value: browserNotif, onChange: setBrowserNotif },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between py-1">
            <div>
              <p className="text-slate-300 text-sm">{item.label}</p>
              <p className="text-slate-600 text-xs mt-0.5">{item.desc}</p>
            </div>
            <button
              onClick={() => item.onChange(!item.value)}
              className={`relative w-11 h-6 rounded-full transition-all ${item.value ? 'bg-blue-500' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${item.value ? 'left-5' : 'left-0.5'}`} />
            </button>
          </div>
        ))}
      </motion.div>

      {/* Data Management */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="p-5 rounded-2xl border border-slate-700/40 bg-slate-900/60 backdrop-blur-sm space-y-4"
      >
        <div className="flex items-center gap-2 mb-1">
          <Database size={16} className="text-emerald-400" />
          <h3 className="text-white font-semibold text-sm">Data Management</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-700/40 bg-slate-800/40 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Download size={16} className="text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-200 text-sm font-medium">Export JSON</p>
              <p className="text-slate-500 text-xs">Full backup with all data</p>
            </div>
            <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-400 shrink-0" />
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-700/40 bg-slate-800/40 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <Download size={16} className="text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-200 text-sm font-medium">Export CSV</p>
              <p className="text-slate-500 text-xs">Tasks as spreadsheet</p>
            </div>
            <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-400 shrink-0" />
          </button>
          <label className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-700/40 bg-slate-800/40 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all group cursor-pointer text-left">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Upload size={16} className="text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-200 text-sm font-medium">Import Backup</p>
              <p className="text-slate-500 text-xs">Restore from JSON file</p>
            </div>
            <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-400 shrink-0" />
            <input type="file" accept=".json" className="hidden" />
          </label>

          {/* Clear All Data — two-step confirm */}
          <button
            onClick={handleClearData}
            className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all group text-left ${
              confirmClear
                ? 'border-rose-500/60 bg-rose-500/15 animate-pulse'
                : 'border-slate-700/40 bg-slate-800/40 hover:border-rose-500/30 hover:bg-rose-500/5'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
              <Trash2 size={16} className="text-rose-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${confirmClear ? 'text-rose-400' : 'text-rose-300'}`}>
                {confirmClear ? '⚠ Tap again to confirm' : 'Clear All Data'}
              </p>
              <p className="text-slate-500 text-xs">
                {confirmClear ? 'This cannot be undone!' : `Removes all ${tasks.length} tasks`}
              </p>
            </div>
            <ChevronRight size={14} className="text-slate-600 group-hover:text-rose-400 shrink-0" />
          </button>
        </div>
        <div className="pt-2 border-t border-slate-800/50">
          <p className="text-slate-600 text-xs">
            Local storage: {tasks.length} tasks · {tasks.reduce((a, t) => a + t.subtasks.length, 0)} subtasks
          </p>
        </div>
      </motion.div>

      {/* Privacy notice */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-start gap-3 p-4 rounded-2xl border border-slate-800/50 bg-slate-900/30"
      >
        <Shield size={16} className="text-slate-500 mt-0.5 shrink-0" />
        <p className="text-slate-600 text-xs">
          FlowTask is a local-first application. All your data is stored locally in your browser and never sent to any server. Your privacy is fully protected.
        </p>
      </motion.div>
    </div>
  );
}
