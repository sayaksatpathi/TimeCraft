import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Home, Zap } from 'lucide-react';

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="space-y-5"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20 flex items-center justify-center mx-auto">
          <Zap size={32} className="text-blue-400" />
        </div>
        <div>
          <h1 className="text-6xl font-bold text-white">404</h1>
          <p className="text-slate-400 mt-2">Page not found</p>
          <p className="text-slate-600 text-sm mt-1">The page you're looking for doesn't exist.</p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/20"
        >
          <Home size={16} />
          Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}
