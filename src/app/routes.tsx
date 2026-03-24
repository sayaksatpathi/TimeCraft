import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { CalendarView } from './pages/CalendarView';
import { Focus } from './pages/Focus';
import { Analytics } from './pages/Analytics';
import { AIAssistant } from './pages/AIAssistant';
import { Settings } from './pages/Settings';
import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'tasks', Component: Tasks },
      { path: 'calendar', Component: CalendarView },
      { path: 'focus', Component: Focus },
      { path: 'analytics', Component: Analytics },
      { path: 'ai', Component: AIAssistant },
      { path: 'settings', Component: Settings },
      { path: '*', Component: NotFound },
    ],
  },
]);