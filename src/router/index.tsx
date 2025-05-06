import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';

// Lazy load pages for better performance
const LandingPage = lazy(() => import('../pages/LandingPage'));
const ResearchAssistant = lazy(() => import('../pages/ResearchAssistant'));
const DrugRepurposing = lazy(() => import('../pages/DrugRepurposing'));
const Playground = lazy(() => import('../pages/Playground'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/chat',
    element: <ResearchAssistant />,
  },
  {
    path: '/repurpose',
    element: <DrugRepurposing />,
  },
  {
    path: '/playground',
    element: <Playground />,
  },
]); 