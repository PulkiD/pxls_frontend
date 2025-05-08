import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import ErrorHandlers from '../pages/ErrorUI/ErrorHandlers';

// Lazy load pages for better performance
const LandingPage = lazy(() => import('../pages/LandingPage'));
const ResearchAssistant = lazy(() => import('../pages/ResearchAssistant'));
const DrugRepurposing = lazy(() => import('../pages/DrugRepurposing'));
const Playground = lazy(() => import('../pages/Playground'));
const KGExplorer = lazy(() => import('../pages/KGExplorer'));
const CSRSummary = lazy(() => import('../pages/CSRSummary'));

export const services = [
  {
    title: 'Research Assistant',
    description: 'AI-powered chatbot for research assistance and drug discovery insights',
    path: '/chat',
  },
  {
    title: 'CSR Summarization',
    description: 'AI-powered clinical study report summarization',
    path: '/csrsummary',
  },
  {
    title: 'Molecular Discovery',
    description: 'AI-powered generation of molecules with specified properties',
    path: '/molecular',
  },
  {
    title: 'Playground',
    description: 'Drag-and-drop service creation for specific use-case leveraging our AI-powered modules',
    path: '/playground',
  },
  {
    title: 'KG Explorer',
    description: 'Visualize our in-house developed biological KG',
    path: '/kgexplorer',
  },
];

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
    errorElement: <ErrorHandlers error={{ message: 'An error occurred on the landing page.' }} />,
  },
  {
    path: '/chat',
    element: <ResearchAssistant />,
    errorElement: <ErrorHandlers error={{ message: 'An error occurred in Research Assistant.' }} />,
  },
  {
    path: '/repurpose',
    element: <DrugRepurposing />,
    errorElement: <ErrorHandlers error={{ message: 'An error occurred in Drug Repurposing.' }} />,
  },
  {
    path: '/playground',
    element: <Playground />,
    errorElement: <ErrorHandlers error={{ message: 'An error occurred in Playground.' }} />,
  },
  {
    path: '/kgexplorer',
    element: <KGExplorer />,
    errorElement: <ErrorHandlers error={{ message: 'An error occurred in KG Explorer.' }} />,
  },
  {
    path: '/csrsummary',
    element: <CSRSummary />,
    errorElement: <ErrorHandlers error={{ message: 'An error occurred in CSR Summarization.' }} />,
  },
]); 