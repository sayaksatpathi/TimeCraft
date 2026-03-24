import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, Bot, User, Loader2, Plus, Calendar, Layers, RefreshCw } from 'lucide-react';
import { useApp } from '../store/appStore';
import { SEOHead, SCHEMA_BREADCRUMB } from '../components/SEOHead';

const SUGGESTED_PROMPTS = [
  { icon: '📅', label: 'Plan my day', prompt: 'Help me plan my day based on my current tasks.' },
  { icon: '🔀', label: 'Break down project', prompt: 'Help me break down a large project into smaller actionable subtasks.' },
  { icon: '⏰', label: 'Reschedule overdue', prompt: 'I have some overdue tasks. Help me reschedule and prioritize them.' },
  { icon: '🎯', label: 'Prioritize tasks', prompt: 'Help me prioritize my pending tasks based on urgency and importance.' },
  { icon: '⚡', label: 'Quick wins', prompt: 'Which tasks can I complete quickly to build momentum?' },
  { icon: '🧘', label: 'Work-life balance', prompt: 'Suggest a healthy work schedule for today that includes breaks.' },
];

const AI_RESPONSES: Record<string, string> = {
  default: "I understand! Based on your task list, here's what I'd suggest:\n\n• Start with your **high-priority** tasks while your energy is fresh\n• Block 25-minute focus sessions using the Pomodoro technique\n• Group similar tasks together to minimize context switching\n\nWould you like me to create a specific schedule for today?",
  plan: "Here's your optimized day plan:\n\n**Morning (9:00 - 12:00)**\n• Design system review (45 min)\n• Review pull requests (30 min)\n• Short break ☕\n\n**Afternoon (13:00 - 17:00)**\n• Update API documentation (60 min)\n• Team sync & emails (30 min)\n• Buffer time for unexpected tasks\n\n**Evening**\n• Capture tomorrow's priorities\n• Review today's progress\n\nShall I add these as time-blocked events to your calendar?",
  break: "I'll break this down into manageable steps for you:\n\n**Phase 1 — Research & Planning** (Day 1-2)\n1. Define scope and success criteria\n2. Research existing solutions\n3. Create initial wireframes\n\n**Phase 2 — Execution** (Day 3-5)\n4. Build core functionality\n5. Write tests\n6. Internal review\n\n**Phase 3 — Polish & Launch** (Day 6-7)\n7. Bug fixes & edge cases\n8. Documentation\n9. Final review & ship\n\nWant me to add these as subtasks to one of your current tasks?",
  overdue: "You have 2 overdue tasks. Here's my recommendation:\n\n🔴 **Refactor auth module** (2 days overdue)\n→ Reschedule to today — this is tech debt that compounds\n\n🟡 **Send weekly newsletter** (already done ✓)\n\n**My advice:**\n• Tackle the auth module first thing tomorrow morning\n• Block 2 hours of uninterrupted time\n• Consider breaking it into smaller PRs to ship faster\n\nShall I reschedule this to tomorrow with a 9 AM reminder?",
  prioritize: "Based on urgency × impact analysis:\n\n**Must Do Today 🔴**\n1. Review pull requests\n2. Design system review\n\n**Do This Week 🟡**\n3. Update API documentation\n4. Deploy v2.3 hotfix\n5. Prepare presentation slides\n\n**Schedule for Later 🟢**\n6. User onboarding flow update\n7. Write quarterly report\n\nThis order maximizes your team unblocking and business value. Shall I reorder your task list?",
  quick: "Here are your quick wins (under 15 minutes each):\n\n⚡ **Immediate** (<5 min)\n• Review and close the easy PR comments\n• Mark completed subtasks\n\n✅ **Quick** (5-15 min)\n• Update standup notes\n• Reply to client emails\n• Review daily newsletter draft\n\nCompleting these will boost your momentum and add +250 XP! 🎯",
  balance: "Here's a balanced schedule that protects your wellbeing:\n\n**08:30** — Morning routine & planning\n**09:00-11:00** — Deep work block (highest priority task)\n**11:00-11:15** — Break: walk or stretch\n**11:15-12:30** — Focused work block #2\n**12:30-13:30** — Lunch away from screen 🌿\n**13:30-15:00** — Collaborative work & meetings\n**15:00-15:15** — Snack break ☕\n**15:15-16:30** — Creative or lower-energy tasks\n**16:30-17:00** — Review, wrap-up & capture tomorrow\n**17:00** — Hard stop 🛑\n\nRemember: sustainable productivity > burnout sprints.",
};

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('plan') || lower.includes('day') || lower.includes('schedule')) return AI_RESPONSES.plan;
  if (lower.includes('break') || lower.includes('subtask') || lower.includes('project')) return AI_RESPONSES.break;
  if (lower.includes('overdue') || lower.includes('reschedule')) return AI_RESPONSES.overdue;
  if (lower.includes('priorit')) return AI_RESPONSES.prioritize;
  if (lower.includes('quick') || lower.includes('fast') || lower.includes('win')) return AI_RESPONSES.quick;
  if (lower.includes('balance') || lower.includes('break') || lower.includes('health')) return AI_RESPONSES.balance;
  return AI_RESPONSES.default;
}

function formatMessage(content: string) {
  return content.split('\n').map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return <p key={i} className="font-semibold text-white mt-2 mb-1">{line.slice(2, -2)}</p>;
    }
    if (line.startsWith('• ') || line.startsWith('→ ')) {
      return <p key={i} className="flex gap-2 text-slate-300 text-sm"><span className="text-blue-400 shrink-0">{line[0]}</span>{line.slice(2)}</p>;
    }
    if (/^\d+\./.test(line)) {
      return <p key={i} className="text-slate-300 text-sm pl-2">{line}</p>;
    }
    if (line.includes('**')) {
      const parts = line.split('**');
      return (
        <p key={i} className="text-slate-300 text-sm">
          {parts.map((p, j) => j % 2 === 1 ? <strong key={j} className="text-white font-semibold">{p}</strong> : p)}
        </p>
      );
    }
    if (line.trim() === '') return <div key={i} className="h-1" />;
    return <p key={i} className="text-slate-300 text-sm">{line}</p>;
  });
}

export function AIAssistant() {
  const { aiMessages, addAIMessage, tasks } = useApp();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMessage = text.trim();
    setInput('');
    addAIMessage({ role: 'user', content: userMessage });
    setIsTyping(true);

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));
    setIsTyping(false);
    addAIMessage({ role: 'assistant', content: getAIResponse(userMessage) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex flex-col h-full max-h-screen">
      <SEOHead
        title="AI Productivity Assistant – Smart Task Planning & Scheduling"
        description="Chat with TimeCraft's built-in AI assistant to plan your day, break down projects, prioritize tasks, reschedule overdue work, and get personalized productivity advice."
        keywords="AI productivity assistant, AI task planner, smart scheduler, AI to-do, productivity AI, chatbot productivity, task prioritization AI"
        path="/ai"
        jsonLd={SCHEMA_BREADCRUMB([{ name: 'Home', path: '/' }, { name: 'AI Assistant', path: '/ai' }])}
      />
      {/* Header */}
      <div className="px-4 md:px-6 py-4 md:py-5 border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold">AI Assistant</h1>
            <p className="text-slate-500 text-xs">Powered by TimeCraft AI</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-400 text-xs">Online</span>
          </div>
        </div>
      </div>

      {/* Suggested prompts */}
      <div className="px-4 md:px-6 py-3 border-b border-slate-800/30">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {SUGGESTED_PROMPTS.map(({ icon, label, prompt }) => (
            <button
              key={label}
              onClick={() => sendMessage(prompt)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/40 text-slate-300 text-xs whitespace-nowrap hover:border-blue-500/40 hover:text-blue-300 transition-all shrink-0"
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-5 space-y-5">
        <AnimatePresence>
          {aiMessages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                  : 'bg-slate-800 border border-slate-700/50'
              }`}>
                {msg.role === 'user'
                  ? <User size={14} className="text-white" />
                  : <Bot size={14} className="text-blue-400" />
                }
              </div>

              {/* Bubble */}
              <div className={`max-w-sm lg:max-w-lg space-y-1 ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className={`px-4 py-3 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-tr-sm'
                    : 'bg-slate-800/80 border border-slate-700/40 rounded-tl-sm'
                }`}>
                  {msg.role === 'user'
                    ? <p className="text-sm">{msg.content}</p>
                    : <div className="space-y-0.5">{formatMessage(msg.content)}</div>
                  }
                </div>
                <p className="text-slate-600 text-xs px-1">
                  {msg.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700/50 flex items-center justify-center shrink-0">
                <Bot size={14} className="text-blue-400" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-slate-800/80 border border-slate-700/40">
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-blue-400"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 md:px-6 pb-4 md:pb-6 pt-3 border-t border-slate-800/50">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-800/60 border border-slate-700/40 focus-within:border-blue-500/40 transition-all">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything about your tasks..."
              className="flex-1 bg-transparent text-slate-200 text-sm outline-none placeholder:text-slate-600"
              disabled={isTyping}
            />
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!input.trim() || isTyping}
            className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/20"
          >
            {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </motion.button>
        </form>
      </div>
    </div>
  );
}