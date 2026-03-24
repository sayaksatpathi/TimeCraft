import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { localDateStr } from '../hooks/useLiveTime';

export type Priority = 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  dueDate: string | null;
  dueTime: string | null;
  tags: string[];
  subtasks: Subtask[];
  project: string | null;
  status: TaskStatus;
  createdAt: string;
  timeLogged: number;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AppContextType {
  tasks: Task[];
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  quickCaptureOpen: boolean;
  selectedTask: Task | null;
  taskDetailOpen: boolean;
  userName: string;
  xp: number;
  level: number;
  streak: number;
  focusTime: number;
  aiMessages: AIMessage[];
  addTask: (task: Partial<Task>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  clearTasks: () => void;
  toggleSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  setQuickCaptureOpen: (open: boolean) => void;
  setSelectedTask: (task: Task | null) => void;
  setTaskDetailOpen: (open: boolean) => void;
  addAIMessage: (message: Omit<AIMessage, 'id' | 'timestamp'>) => void;
  addFocusTime: (minutes: number) => void;
  setUserName: (name: string) => void;
}

const TODAY = localDateStr();

const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Design system review',
    description: 'Review the component library and ensure consistency across all UI elements. Pay attention to color tokens, spacing, and typography scale.',
    completed: false,
    priority: 'high',
    dueDate: TODAY,
    dueTime: '10:00',
    tags: ['design', 'review'],
    subtasks: [
      { id: 's1', title: 'Audit color tokens', completed: true },
      { id: 's2', title: 'Review typography scale', completed: true },
      { id: 's3', title: 'Check spacing system', completed: false },
      { id: 's4', title: 'Document findings', completed: false },
    ],
    project: 'Design',
    status: 'in-progress',
    createdAt: TODAY,
    timeLogged: 45,
  },
  {
    id: '2',
    title: 'Update API documentation',
    description: 'Update the API docs to reflect the new v3 endpoints and deprecate old ones.',
    completed: false,
    priority: 'medium',
    dueDate: TODAY,
    dueTime: '14:00',
    tags: ['dev', 'docs'],
    subtasks: [
      { id: 's5', title: 'List new endpoints', completed: false },
      { id: 's6', title: 'Write examples', completed: false },
    ],
    project: 'Backend',
    status: 'todo',
    createdAt: TODAY,
    timeLogged: 0,
  },
  {
    id: '3',
    title: 'Review pull requests',
    description: 'Review 3 open PRs from the team and provide feedback.',
    completed: false,
    priority: 'high',
    dueDate: TODAY,
    dueTime: '16:00',
    tags: ['dev'],
    subtasks: [],
    project: 'Engineering',
    status: 'todo',
    createdAt: TODAY,
    timeLogged: 0,
  },
  {
    id: '4',
    title: 'Team standup notes',
    description: 'Write up notes from the morning standup and share with the team.',
    completed: true,
    priority: 'low',
    dueDate: TODAY,
    dueTime: '09:30',
    tags: ['meetings'],
    subtasks: [],
    project: null,
    status: 'done',
    createdAt: TODAY,
    timeLogged: 15,
  },
  {
    id: '5',
    title: 'Deploy v2.3 hotfix',
    description: 'Deploy the hotfix for the critical authentication bug discovered in production.',
    completed: false,
    priority: 'high',
    dueDate: localDateStr(new Date(Date.now() + 86400000)),
    dueTime: '11:00',
    tags: ['dev', 'urgent'],
    subtasks: [
      { id: 's7', title: 'Run test suite', completed: false },
      { id: 's8', title: 'Stage deployment', completed: false },
      { id: 's9', title: 'Production rollout', completed: false },
    ],
    project: 'Engineering',
    status: 'todo',
    createdAt: TODAY,
    timeLogged: 0,
  },
  {
    id: '6',
    title: 'Write quarterly report',
    description: 'Compile Q1 2026 metrics and write the executive summary for the board.',
    completed: false,
    priority: 'medium',
    dueDate: localDateStr(new Date(Date.now() + 4 * 86400000)),
    dueTime: null,
    tags: ['reporting', 'leadership'],
    subtasks: [
      { id: 's10', title: 'Gather KPI data', completed: false },
      { id: 's11', title: 'Write executive summary', completed: false },
      { id: 's12', title: 'Create charts', completed: false },
    ],
    project: null,
    status: 'todo',
    createdAt: TODAY,
    timeLogged: 30,
  },
  {
    id: '7',
    title: 'Call with client – Acme Corp',
    description: 'Product roadmap discussion and Q2 feature prioritization.',
    completed: false,
    priority: 'high',
    dueDate: localDateStr(new Date(Date.now() + 86400000)),
    dueTime: '15:00',
    tags: ['client', 'meetings'],
    subtasks: [
      { id: 's13', title: 'Prepare agenda', completed: true },
      { id: 's14', title: 'Review last meeting notes', completed: false },
    ],
    project: 'Acme Corp',
    status: 'in-progress',
    createdAt: TODAY,
    timeLogged: 20,
  },
  {
    id: '8',
    title: 'Fix navigation bug on mobile',
    description: 'The hamburger menu is not closing properly on iOS devices.',
    completed: false,
    priority: 'medium',
    dueDate: localDateStr(new Date(Date.now() + 2 * 86400000)),
    dueTime: null,
    tags: ['dev', 'bug'],
    subtasks: [],
    project: 'Engineering',
    status: 'todo',
    createdAt: TODAY,
    timeLogged: 0,
  },
  {
    id: '9',
    title: 'Update user onboarding flow',
    description: 'Redesign the 3-step onboarding to reduce drop-off rate.',
    completed: false,
    priority: 'low',
    dueDate: localDateStr(new Date(Date.now() + 6 * 86400000)),
    dueTime: null,
    tags: ['design', 'ux'],
    subtasks: [
      { id: 's15', title: 'User research review', completed: false },
      { id: 's16', title: 'Wireframes', completed: false },
      { id: 's17', title: 'Prototype testing', completed: false },
    ],
    project: 'Design',
    status: 'todo',
    createdAt: TODAY,
    timeLogged: 0,
  },
  {
    id: '10',
    title: 'Prepare presentation slides',
    description: 'Create slides for the all-hands meeting covering product updates.',
    completed: false,
    priority: 'high',
    dueDate: localDateStr(new Date(Date.now() + 3 * 86400000)),
    dueTime: '09:00',
    tags: ['presentations'],
    subtasks: [
      { id: 's18', title: 'Draft outline', completed: false },
      { id: 's19', title: 'Design slides', completed: false },
    ],
    project: null,
    status: 'todo',
    createdAt: TODAY,
    timeLogged: 0,
  },
  {
    id: '11',
    title: 'Refactor auth module',
    description: 'Technical debt: refactor the authentication module to use the new SDK.',
    completed: false,
    priority: 'medium',
    // Purposely 2 days overdue to show overdue functionality
    dueDate: localDateStr(new Date(Date.now() - 2 * 86400000)),
    dueTime: null,
    tags: ['dev', 'tech-debt'],
    subtasks: [],
    project: 'Engineering',
    status: 'todo',
    createdAt: TODAY,
    timeLogged: 0,
  },
  {
    id: '12',
    title: 'Send weekly newsletter',
    description: 'Draft and send the weekly product update newsletter to subscribers.',
    completed: true,
    priority: 'medium',
    dueDate: TODAY,
    dueTime: '10:00',
    tags: ['marketing'],
    subtasks: [],
    project: null,
    status: 'done',
    createdAt: TODAY,
    timeLogged: 30,
  },
];

const INITIAL_AI_MESSAGES: AIMessage[] = [
  {
    id: 'ai-0',
    role: 'assistant',
    content: "Hi! I'm your AI productivity assistant. I can help you plan your day, break down complex projects, reschedule overdue tasks, and more. What would you like to accomplish today?",
    timestamp: new Date(),
  },
];

const AppContext = createContext<AppContextType | null>(null);

type PersistedAppStateV1 = {
  tasks: Task[];
  sidebarCollapsed: boolean;
  userName: string;
  xp: number;
  focusTime: number;
};

const STORAGE_KEY = 'timecraft.appState.v1';

function loadPersistedState(): Partial<PersistedAppStateV1> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Partial<PersistedAppStateV1>;
    if (parsed && Array.isArray(parsed.tasks)) return parsed;
    return {};
  } catch {
    return {};
  }
}

function savePersistedState(state: PersistedAppStateV1) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors (private mode, quota, etc.)
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const persisted = loadPersistedState();
  const [tasks, setTasks] = useState<Task[]>(() => (persisted.tasks && persisted.tasks.length ? persisted.tasks : INITIAL_TASKS));
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => persisted.sidebarCollapsed ?? false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [quickCaptureOpen, setQuickCaptureOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskDetailOpen, setTaskDetailOpen] = useState(false);
  const [userName, setUserName] = useState(() => persisted.userName ?? 'Alex');
  const [xp, setXp] = useState(() => persisted.xp ?? 2750);
  const [level] = useState(12);
  const [streak] = useState(7);
  const [focusTime, setFocusTime] = useState(() => persisted.focusTime ?? 90);
  const [aiMessages, setAIMessages] = useState<AIMessage[]>(INITIAL_AI_MESSAGES);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.style.fontFamily = "'Inter', sans-serif";
  }, []);

  // Persist key app state across refreshes
  useEffect(() => {
    savePersistedState({
      tasks,
      sidebarCollapsed,
      userName,
      xp,
      focusTime,
    });
  }, [tasks, sidebarCollapsed, userName, xp, focusTime]);

  // Keyboard shortcut for quick capture
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setQuickCaptureOpen(true);
      }
      if (e.key === 'Escape') {
        setQuickCaptureOpen(false);
        setTaskDetailOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const addTask = useCallback((task: Partial<Task>) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: task.title || 'Untitled Task',
      description: task.description || '',
      completed: false,
      priority: task.priority || 'medium',
      dueDate: task.dueDate || null,
      dueTime: task.dueTime || null,
      tags: task.tags || [],
      subtasks: task.subtasks || [],
      project: task.project || null,
      status: task.status || 'todo',
      createdAt: localDateStr(), // ← local timezone
      timeLogged: 0,
    };
    setTasks(prev => [newTask, ...prev]);
    toast.success('Task captured!', { description: newTask.title, duration: 2500 });
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    // Keep selectedTask in sync so modal reflects live changes
    setSelectedTask(prev => prev && prev.id === id ? { ...prev, ...updates } : prev);
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    setTaskDetailOpen(false);
    setSelectedTask(null);
    toast('Task deleted', { duration: 2000 });
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const completed = !t.completed;
      if (completed) {
        setXp(x => x + 100);
        toast.success('Task completed! +100 XP ⚡', { duration: 2500 });
      }
      return { ...t, completed, status: completed ? 'done' : 'todo' };
    }));
    // Sync selectedTask
    setSelectedTask(prev => {
      if (!prev || prev.id !== id) return prev;
      const completed = !prev.completed;
      return { ...prev, completed, status: completed ? 'done' : 'todo' };
    });
  }, []);

  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        subtasks: t.subtasks.map(s => s.id === subtaskId ? { ...s, completed: !s.completed } : s),
      };
    }));
    setSelectedTask(prev => {
      if (!prev || prev.id !== taskId) return prev;
      return {
        ...prev,
        subtasks: prev.subtasks.map(s => s.id === subtaskId ? { ...s, completed: !s.completed } : s),
      };
    });
  }, []);

  const clearTasks = useCallback(() => {
    setTasks([]);
    setTaskDetailOpen(false);
    setSelectedTask(null);
    toast('All tasks cleared', { duration: 2000 });
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(c => !c);
  }, []);

  const addAIMessage = useCallback((message: Omit<AIMessage, 'id' | 'timestamp'>) => {
    setAIMessages(prev => [...prev, { ...message, id: Date.now().toString(), timestamp: new Date() }]);
  }, []);

  const addFocusTime = useCallback((minutes: number) => {
    setFocusTime(t => t + minutes);
    setXp(x => x + minutes * 5);
  }, []);

  return (
    <AppContext.Provider value={{
      tasks, sidebarCollapsed, mobileSidebarOpen, quickCaptureOpen, selectedTask,
      taskDetailOpen, userName, xp, level, streak, focusTime, aiMessages,
      addTask, updateTask, deleteTask, toggleTask, toggleSubtask, clearTasks,
      toggleSidebar, setMobileSidebarOpen, setQuickCaptureOpen, setSelectedTask,
      setTaskDetailOpen, addAIMessage, addFocusTime, setUserName,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
