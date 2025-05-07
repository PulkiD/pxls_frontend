import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';

// Lazy load pages for better performance
const LandingPage = lazy(() => import('../pages/LandingPage'));
const ResearchAssistant = lazy(() => import('../pages/ResearchAssistant'));
const DrugRepurposing = lazy(() => import('../pages/DrugRepurposing'));
const Playground = lazy(() => import('../pages/Playground'));
const KGExplorer = lazy(() => import('../pages/KGExplorer'));

export const services = [
  {
    title: 'Research Assistant',
    description: 'AI-powered chatbot for research assistance and drug discovery insights',
    path: '/chat',
  },
  {
    title: 'CSR Summarization',
    description: 'AI-powered clinical study report summarization',
    path: '/csr',
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
  {
    path: '/kgexplorer',
    element: <KGExplorer />,
  },
]); 