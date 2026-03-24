import React from 'react';
import { Outlet } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { QuickCapture } from './QuickCapture';
import { TaskDetailModal } from './TaskDetailModal';
import {
  SEOHead,
  SCHEMA_WEBAPP,
  SCHEMA_ORGANIZATION,
  SCHEMA_SPEAKABLE,
} from './SEOHead';
import { SEOArticle } from './SEOArticle';
import { useApp } from '../store/appStore';

export function Layout() {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useApp();

  return (
    <>
      {/* Global SEO baseline – individual pages override title/description */}
      <SEOHead jsonLd={[SCHEMA_WEBAPP, SCHEMA_ORGANIZATION, SCHEMA_SPEAKABLE]} />

      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="flex h-screen bg-slate-950 overflow-hidden font-['Inter',sans-serif]">
        {/* Sidebar – mobile: fixed overlay; desktop: inline */}
        <div
          className={`
            fixed md:relative inset-y-0 left-0 z-40 h-full flex
            transition-transform duration-300 ease-in-out
            ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
        >
          <Sidebar />
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <TopNav />
          {/* <main> landmark improves accessibility + crawlability */}
          <main
            id="main-content"
            role="main"
            className="flex-1 overflow-y-auto"
            aria-label="Application content"
          >
            <Outlet />
          </main>
        </div>

        {/* Global overlays */}
        <QuickCapture />
        <TaskDetailModal />
      </div>

      {/* Visually hidden AEO / SEO article – crawlable by Google and AI engines */}
      <SEOArticle />
    </>
  );
}
