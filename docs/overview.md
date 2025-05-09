# PhoenixLS - Drug Discovery Platform Overview

A scalable web application for enterprise drug discovery services, built with React, TypeScript, and Vite.

## Features

- **AI-powered Research Assistant**: Enables users to interact with a chat interface, receive responses (potentially including knowledge graph visualizations), and manage conversation history. (See `docs/pages.md#research-assistant`)
- **Knowledge Graph (KG) Explorer**: Allows users to execute queries, visualize, and interact with complex knowledge graphs. Features include saving/loading queries and node/edge information display. (See `docs/pages.md#kg-explorer`)
- **Clinical Study Report (CSR) Summarization**: A multi-step tool for uploading CSR documents, mapping tables to relevant sections (e.g., FDA sections), and viewing generated summaries. (See `docs/pages.md#csr-summary`)
- **Workflow Playground**: Provides a drag-and-drop interface to construct custom drug discovery workflows using predefined modules like 'Target Identification' and 'ADMET Prediction'. (See `docs/pages.md#playground`)
- **Drug Repurposing Service**: Placeholder for a future service (currently displays a "Coming Soon" message). (See `docs/pages.md#drug-repurposing`)
- **Comprehensive Error Handling**: Includes UI for displaying errors and reporting them, with a global `ErrorBoundary`. (See `docs/pages.md#error-handling-ui` and `docs/components.md#errorboundary`)

## Tech Stack

- Frontend: React + TypeScript + Vite
- State Management: Redux Toolkit (see `src/store/`)
- API Integration: `@tanstack/react-query` (React Query) + Axios (see `src/hooks/` and `src/services/`)
- Styling: Styled Components
- Routing: React Router (see `src/router/`)

## Project Structure

```
pxls_frontend/
├── public/ # Static assets directly served
├── src/    # Main source code
│   ├── assets/        # Static assets like images, fonts, etc., imported by components
│   ├── components/    # Core reusable UI components (e.g., `Button`, `Modal`, `TopNavBar`, `Placard`, Chat elements, KGViz components). See docs/components.md
│   ├── config/        # Application-wide configuration files
│   ├── constants/     # Application-level constant values (e.g., `kgviz.constants`)
│   ├── features/      # Modules for specific, self-contained application features (e.g., `NetworkEvolution` for KGViz)
│   ├── hooks/         # Custom React hooks for reusable logic and data fetching (e.g., `useChat`, `useKnowledgeGraph`). See docs/hooks.md
│   ├── pages/         # Top-level components for application views/routes (e.g., `LandingPage`, `ResearchAssistant`). See docs/pages.md
│   ├── router/        # Routing configuration for the application
│   ├── services/      # Modules for API interactions (e.g., `chatService`, `kgService`). (docs/services.md - TBC)
│   ├── store/         # Global state management setup using Redux Toolkit. (docs/store.md - TBC)
│   ├── styles/        # Global styles, themes, base CSS
│   ├── types/         # TypeScript type definitions and interfaces
│   ├── utils/         # Common utility functions
│   ├── App.tsx        # Root application component
│   └── main.tsx       # Main entry point of the React application
├── index.html
└── package.json
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_API_BASE_URL=your_api_base_url
```

## Key Architectural Patterns

- **Component-Based Architecture:** Leverages React for building a modular and reusable UI.
- **Centralized State Management:** Uses Redux Toolkit for predictable global state, particularly for UI state or shared application data not tied to server state.
- **Server State Management with React Query:** Employs `@tanstack/react-query` for fetching, caching, synchronizing, and updating server state. This is evident in custom hooks like `useChat` and `useKnowledgeGraph`.
- **Service Layer:** API interactions are abstracted into a service layer (`src/services/`), promoting separation of concerns.
- **Custom Hooks:** Reusable logic, especially data fetching and complex state interactions, is encapsulated in custom hooks (`src/hooks/`).
- **Styled Components:** Used for co-locating component styles with their logic, enhancing maintainability and enabling dynamic styling.

## Navigation and User Flows

- The application features a main `LandingPage` providing access to various services.
- Key services like `ResearchAssistant`, `KGExplorer`, and `CSRSummary` have dedicated page components with complex UIs and specific user flows.
- Detailed user flows for each page are documented in `docs/pages.md`.
- Future documentation in `docs/user_flows.md` will provide higher-level journey maps. 