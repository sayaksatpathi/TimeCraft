import React from 'react';
import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://flowtask.app';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  path?: string;
  type?: 'website' | 'article' | 'webapp';
  jsonLd?: object | object[];
  noIndex?: boolean;
}

export function SEOHead({
  title = 'FlowTask – AI Productivity App | Tasks, Pomodoro Timer & Focus Mode',
  description = 'FlowTask is a free AI-powered productivity app with smart task management, Kanban boards, Pomodoro focus timer, calendar, analytics, and an AI assistant. Boost your productivity today.',
  keywords = 'productivity app, task manager, pomodoro timer, kanban board, AI assistant, focus mode, to-do list, time management, free productivity tool, task tracking, calendar planner',
  path = '/',
  type = 'website',
  jsonLd,
  noIndex = false,
}: SEOHeadProps) {
  const fullTitle = title.includes('FlowTask') ? title : `${title} | FlowTask`;
  const canonicalUrl = `${BASE_URL}${path}`;

  return (
    <Helmet>
      {/* ── Primary ── */}
      <html lang="en" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      {!noIndex && <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />}
      <meta name="author" content="FlowTask" />
      <meta name="application-name" content="FlowTask" />
      <meta name="generator" content="FlowTask App" />

      {/* ── Open Graph ── */}
      <meta property="og:type" content={type === 'webapp' ? 'website' : type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={DEFAULT_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="FlowTask – AI Productivity App" />
      <meta property="og:site_name" content="FlowTask" />
      <meta property="og:locale" content="en_US" />

      {/* ── Twitter / X ── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@flowtaskapp" />
      <meta name="twitter:creator" content="@flowtaskapp" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={DEFAULT_IMAGE} />
      <meta name="twitter:image:alt" content="FlowTask – AI Productivity App" />

      {/* ── Mobile / PWA ── */}
      <meta name="theme-color" content="#0f172a" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="FlowTask" />
      <link rel="manifest" href="/manifest.json" />

      {/* ── JSON-LD ── */}
      {jsonLd &&
        (Array.isArray(jsonLd) ? jsonLd : [jsonLd]).map((schema, i) => (
          <script key={i} type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        ))}
    </Helmet>
  );
}

/* ─────────────────────────────────────────────
   Pre-built JSON-LD schemas – import & use them
   in each page for zero-effort structured data
───────────────────────────────────────────── */

export const SCHEMA_WEBAPP = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'FlowTask',
  url: BASE_URL,
  description:
    'FlowTask is a free AI-powered productivity app with smart task management, Kanban boards, Pomodoro focus timer, calendar, analytics, and a built-in AI assistant — all in one place.',
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Web, iOS, Android',
  browserRequirements: 'Requires a modern web browser with JavaScript enabled',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
  featureList: [
    'AI-powered task assistant',
    'Pomodoro focus timer with customizable intervals',
    'Kanban board and list view task management',
    'Calendar integration with week view',
    'Productivity analytics and charts',
    'XP and level progression system',
    'Daily streak tracking',
    'Quick task capture',
    'Subtask management',
    'Priority levels (high, medium, low)',
    'Tag and label system',
    'Dark mode interface',
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '1284',
    bestRating: '5',
    worstRating: '1',
  },
  screenshot: `${BASE_URL}/screenshot.png`,
  softwareVersion: '2.0',
};

export const SCHEMA_ORGANIZATION = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'FlowTask',
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  sameAs: [
    'https://twitter.com/flowtaskapp',
    'https://github.com/flowtask',
    'https://www.linkedin.com/company/flowtask',
    'https://www.producthunt.com/products/flowtask',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'hello@flowtask.app',
    availableLanguage: 'English',
  },
};

export const SCHEMA_FAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is FlowTask?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'FlowTask is a free AI-powered productivity application that combines task management, a Pomodoro focus timer, Kanban boards, a calendar, productivity analytics, and an AI assistant into one seamless web app.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is FlowTask free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, FlowTask is completely free. All core features including task management, Pomodoro timer, Kanban board, calendar, and AI assistant are available at no cost.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is a Pomodoro timer and how does FlowTask use it?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Pomodoro Technique is a time management method that uses timed work intervals (typically 25 minutes) separated by short breaks. FlowTask includes a fully customizable Pomodoro timer where you can set your own focus duration, short break, and long break lengths. It also features Zen Mode for distraction-free sessions and lets you link tasks directly to your timer.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does FlowTask have a Kanban board?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, FlowTask includes a full Kanban board view alongside a traditional list view. Tasks can be organized by status columns and dragged between them to update their progress.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does the AI assistant in FlowTask work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "FlowTask's built-in AI assistant helps you plan your day, break down complex tasks, prioritize your workload, and answer productivity-related questions. It provides smart suggestions based on your tasks and work patterns.",
      },
    },
    {
      '@type': 'Question',
      name: 'What productivity analytics does FlowTask provide?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'FlowTask provides detailed productivity analytics including task completion rates, daily focus time, weekly progress charts, XP and level tracking, daily streaks, and performance trends over time.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does FlowTask work on mobile?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, FlowTask is fully responsive and works on all screen sizes including smartphones and tablets. It can be installed as a Progressive Web App (PWA) on mobile devices for an app-like experience.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is FlowTask different from Todoist, Notion, or Trello?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'FlowTask uniquely combines task management, a built-in Pomodoro focus timer with Zen Mode, productivity analytics with XP gamification, and an AI assistant all in a single free app. Unlike Todoist, Notion, or Trello, you don\'t need separate tools for focus timing, analytics, and AI assistance.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I customize the Pomodoro timer in FlowTask?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, FlowTask lets you fully customize your Pomodoro timer. You can set your own focus duration (1–120 minutes), short break length (1–30 minutes), and long break length (1–60 minutes) directly from the Focus page settings.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does FlowTask save my data?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'FlowTask stores your tasks and preferences locally in your browser. Your data stays on your device and is never sent to external servers unless you choose to enable cloud sync.',
      },
    },
  ],
};

export const SCHEMA_HOW_TO_POMODORO = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to use the Pomodoro Technique with FlowTask',
  description:
    'A step-by-step guide to using the customizable Pomodoro timer in FlowTask to improve focus and productivity.',
  totalTime: 'PT30M',
  estimatedCost: { '@type': 'MonetaryAmount', currency: 'USD', value: '0' },
  step: [
    {
      '@type': 'HowToStep',
      name: 'Open Focus Mode',
      text: 'Navigate to the Focus page from the FlowTask sidebar.',
      position: 1,
    },
    {
      '@type': 'HowToStep',
      name: 'Customize your timer',
      text: 'Click the settings gear icon to set your preferred focus duration (default 25 min), short break (default 5 min), and long break (default 15 min).',
      position: 2,
    },
    {
      '@type': 'HowToStep',
      name: 'Select a task',
      text: 'Choose a task from your list to link to this focus session so you stay on target.',
      position: 3,
    },
    {
      '@type': 'HowToStep',
      name: 'Start your focus session',
      text: 'Press the Play button to begin the countdown. Optionally enable Zen Mode to eliminate all distractions.',
      position: 4,
    },
    {
      '@type': 'HowToStep',
      name: 'Take a break',
      text: "When the timer ends, FlowTask automatically switches to your short break. After 4 focus sessions, it suggests a long break.",
      position: 5,
    },
    {
      '@type': 'HowToStep',
      name: 'Track your progress',
      text: 'Completed sessions accumulate XP and are tracked in your Analytics dashboard with daily and weekly charts.',
      position: 6,
    },
  ],
};

export const SCHEMA_BREADCRUMB = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: `${BASE_URL}${item.path}`,
  })),
});

export const SCHEMA_SPEAKABLE = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['[data-speakable]'],
  },
  url: BASE_URL,
};
