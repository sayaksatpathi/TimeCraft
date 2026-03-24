import { RouterProvider } from 'react-router';
import { AppProvider } from './store/appStore';
import { router } from './routes';
import { Toaster } from 'sonner';
import { HelmetProvider } from 'react-helmet-async';

export default function App() {
  return (
    <HelmetProvider>
      <AppProvider>
        <RouterProvider router={router} />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              border: '1px solid rgba(148,163,184,0.15)',
              color: '#e2e8f0',
              borderRadius: '12px',
              fontSize: '13px',
            },
          }}
        />
      </AppProvider>
    </HelmetProvider>
  );
}