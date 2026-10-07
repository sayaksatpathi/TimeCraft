<div align="center">

# ⏳ TimeCraft

### Craft your time — a modern productivity workspace for tasks, focus, and insight.

[![Live Demo](https://img.shields.io/badge/▶_Live_Demo-time--craft--one.vercel.app-0ea5e9?style=for-the-badge)](https://time-craft-one.vercel.app)

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![MUI](https://img.shields.io/badge/MUI-007FFF?style=flat-square&logo=mui&logoColor=white)](https://mui.com/)
[![Radix UI](https://img.shields.io/badge/Radix_UI-161618?style=flat-square&logo=radixui&logoColor=white)](https://www.radix-ui.com/)

</div>

---

## Overview

**TimeCraft** is a single-page productivity app that brings task management, a calendar, a focus timer, and analytics into one calm, dark-mode workspace. It's built as a client-side SPA with React Router, a global app store, and toast-driven feedback — fast, keyboard-friendly, and responsive from phone to desktop.

## ✨ Features

| Area | What it does |
|------|--------------|
| 📊 **Dashboard** | At-a-glance overview of your day, progress, and what's next |
| ✅ **Tasks** | Create, edit, and organize tasks with a detail modal and quick capture |
| 📅 **Calendar** | Visualize scheduled work across a full calendar view |
| 🎯 **Focus** | A dedicated focus mode to work deeply on one thing at a time |
| 📈 **Analytics** | Trends and stats on how your time is actually spent |
| 🤖 **AI Assistant** | A built-in assistant surface for planning and productivity help |
| ⚙️ **Settings** | Personalize the workspace to how you work |

Plus: smooth client-side routing, in-app toasts (`sonner`), SEO-aware `<head>` management (`react-helmet-async`), and a polished slate-dark UI.

## 🧱 Tech Stack

- **Framework:** React 18 + TypeScript, bundled with Vite
- **Routing:** React Router (data router)
- **UI:** MUI + Radix UI primitives, Emotion styling
- **State:** Custom `AppProvider` context store
- **UX:** `sonner` toasts, `react-helmet-async` for SEO

## 🚀 Getting Started

```bash
# install dependencies
npm install

# start the dev server
npm run dev

# build for production
npm run build
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

## 🗂️ Project Structure

```
src/
├── app/
│   ├── components/   # Layout, Sidebar, TopNav, TaskCard, modals, SEO
│   ├── pages/        # Dashboard, Tasks, Calendar, Focus, Analytics, AI, Settings
│   ├── store/        # appStore (global state)
│   ├── routes.tsx    # route table
│   └── App.tsx       # providers + router + toaster
└── main.tsx          # entry point
```

---

<div align="center">

Built by **[Sayak Satpathi](https://github.com/sayaksatpathi)** · [Live Demo](https://time-craft-one.vercel.app)

</div>
