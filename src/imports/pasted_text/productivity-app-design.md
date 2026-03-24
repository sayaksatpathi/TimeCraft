System/Role: You are an Expert UI/UX Designer and Figma Architect. Design a complete, production-ready, modern productivity To-Do web application UI with AI-powered features. This app is designed for standalone, personal daily use. The final deliverable must be highly accessible, responsive, and visually premium, adhering strictly to modern Figma best practices.

🎨 1. FIGMA ARCHITECTURE & DESIGN SYSTEM (STRICTLY ENFORCED)
The foundation must be built for seamless scaling and personal customization.

Figma Best Practices: - Use Auto Layout (Shift+A) for every frame, card, and layout. No absolute positioning unless necessary for specific overlays.

Set up Local Variables for colors, spacing (8px grid: 8, 16, 24, 32, 48), and border radii.

Create a robust Component Library using Component Properties (Variants, Booleans, Text properties, Swap Instance).

Visual Style: Minimal, futuristic dashboard. Glassmorphism + soft shadows + subtle gradients.

Theming: Full Support for BOTH Dark Mode and Light Mode (map via Figma variables).

Color System:

Primary: Blue → Purple gradient (Tech-forward, energetic)

Success: Emerald Green

Warning: Amber/Orange

Danger: Rose Red

Neutral/Surface: Slate/Gray scale for borders and backgrounds.

Typography: Inter or Poppins. Define a strict type scale (H1 to H6, Body, Caption, Overline).

Icons: Clean outline (Lucide or Heroicons style). Keep stroke width consistent (1.5px or 2px).

🧱 2. INFORMATION ARCHITECTURE & NAVIGATION
Structure the app for a frictionless, single-user experience.

Sidebar (Collapsible): Logo, Navigation (Dashboard, Today, All Tasks, Calendar, Focus, Analytics, AI Assistant), Settings, and a Collapse/Expand toggle.

Top Navbar: Global Search (cmd/ctrl+K shortcut visible) and a Quick Add (+) button.

🖥️ 3. CORE SCREENS & LAYOUTS (DESKTOP-FIRST)
1. Dashboard (Home)

Greeting Section: Dynamic greeting (e.g., "Good Morning, Amitabh"), Date, and a subtle AI-generated motivational quote.

Today Summary: Completion progress bar (circular or linear), Quick stats (completed, pending, overdue).

Task List (Preview): Draggable cards featuring Checkbox, Title, Due time, Priority tag, Subtask count.

Productivity Widgets: Weekly performance sparkline, Daily streak flame, Focus time logged.

Quick Add: Natural language input field (e.g., "Remind me to call Mom tomorrow at 5pm #personal").

2. Task Management (The Engine)

Views: Toggle between List (compact) and Board/Kanban (To Do, In Progress, Done).

Filters/Sort: By Priority, Due Date, Tags, Project.

Task Details Modal/Slide-over: - Editable Title & Description (Rich text support).

Subtasks checklist (with its own progress bar).

Attachments/Local file drag-and-drop zone.

Due date picker, Priority selector, Tags.

Activity log (History of local changes).

3. Calendar View

Monthly + Weekly toggle.

Tasks mapped to dates with color-coding. Drag-and-drop to reschedule. Highlight current day.

4. Focus Mode (Distraction-Free)

Minimalist full-screen Pomodoro timer (25:00 default).

Start / Pause / Reset controls. Session counter. Current active task prominently displayed.

5. Analytics & Gamification

Weekly productivity bar charts, tasks completed vs. pending pie charts.

Gamification: XP points system, Level up badges, Daily streak indicator (flame icon).

6. AI Assistant Panel (Slide-out or Fixed)

Chat interface for AI interaction.

Suggested prompt chips: "Plan my day", "Break this large project into subtasks", "Reschedule my overdue tasks".

AI-generated schedule cards that can be added to the calendar with one click.

⚡ 4. STATES, EDGE CASES & MICROINTERACTIONS
Empty States: Beautiful, encouraging illustrations and clear Call-to-Actions (CTAs) for "No tasks due today" or "No search results".

Loading States: Skeleton loaders for the dashboard and task lists.

Success Feedback: Satisfying micro-interactions (e.g., a subtle confetti pop or checkmark animation when completing a high-priority task). Hover effects on all clickable elements.

📱 5. RESPONSIVENESS & ACCESSIBILITY
Breakpoints: Design specific frames for Desktop (1440px), Tablet (768px - sidebar becomes hamburger menu), and Mobile (390px - stacked layout, implement a Bottom Tab Bar for core navigation).

Accessibility (a11y): Ensure high contrast ratios for text. Design clear focus states (rings) for keyboard navigation. Ensure touch targets on mobile are at least 44x44px.

🧠 6. COGNITIVE LOAD & DEEP FOCUS ARCHITECTURE (CRITICAL)
The design must actively protect attention and prevent "tool fatigue."

Progressive Disclosure: Do not show every button, tag, and option at once. Use hover states for secondary actions (like delete or duplicate) and keep the default view ruthlessly clean.

"Zen" Execution Mode: A specific, distraction-free view (a step further than the standard Focus Mode). When activated:

The sidebar collapses entirely.

All non-essential navigation fades out.

Only the single active task, its subtasks, and the Pomodoro timer remain on screen, centered.

Smart Chunking (AI Feature): When a task description is too long or a project is too large, design a subtle AI chip that suggests: "Break this down into 3 smaller steps."

Visual Hierarchy for Prioritization: High-priority tasks should physically look different (e.g., slight elevation, distinct border, or bolder typography) so the eye is immediately drawn to what matters most.

Frictionless Brain-Dump (Quick Capture): A global keyboard shortcut (Cmd/Ctrl + K or Space) that instantly opens a minimalist, floating "Quick Capture" bar over any screen to dump a thought without leaving the current workflow.

⚙️ 7. SETTINGS & LOCAL DATA MANAGEMENT
General Settings: Theme toggle (dark/light/system) and Notification preferences (browser/system level).

Data Management: UI for local data backup, including options to "Export Data as JSON/CSV" and "Import Backup".

🚀 FINAL DELIVERABLE EXPECTATIONS
The UI should feel like a combination of Notion's clean structural hierarchy, Todoist's frictionless task entry, and Linear's lightning-fast, futuristic aesthetic. It must be structured flawlessly in Figma so a frontend developer could immediately begin inspecting and building it as a local-first application.