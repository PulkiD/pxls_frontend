# PhoenixLS - Drug Discovery Platform

A scalable web application for enterprise drug discovery services, built with React, TypeScript, and Vite.

## Features

- **AI-powered Research Assistant**: Enables users to interact with a chat interface, receive responses (potentially including knowledge graph visualizations), and manage conversation history.
- **Knowledge Graph (KG) Explorer**: Allows users to execute queries, visualize, and interact with complex knowledge graphs. Features include saving/loading queries and node/edge information display.
- **Clinical Study Report (CSR) Summarization**: A multi-step tool for uploading CSR documents, mapping tables to relevant sections (e.g., FDA sections), and viewing generated summaries.
- **Workflow Playground**: Provides a drag-and-drop interface to construct custom drug discovery workflows using predefined modules like 'Target Identification' and 'ADMET Prediction'.
- **Drug Repurposing Service**: Placeholder for a future service (currently displays a "Coming Soon" message).
- **Comprehensive Error Handling**: Includes UI for displaying errors and reporting them.

## Tech Stack

- Frontend: React + TypeScript + Vite
- State Management: Redux Toolkit
- API Integration: React Query + Axios
- Styling: Styled Components
- Routing: React Router

## Project Structure

```
pxls_frontend/
├── public/ # Static assets directly served
├── src/    # Main source code
│   ├── assets/        # Static assets like images, fonts, etc., imported by components
│   ├── components/    # Core reusable UI components (e.g., `Button`, `Modal`, `TopNavBar`, `CollapsibleSidebar`, `Placard`, Chat elements, KGViz components like `GraphVisualization`)
│   ├── config/        # Application-wide configuration files
│   ├── constants/     # Application-level constant values (e.g., `kgviz.constants`)
│   ├── features/      # Modules for specific, self-contained application features (e.g., `NetworkEvolution` for KGViz, or larger UI sections tied to a feature)
│   ├── hooks/         # Custom React hooks for reusable logic, state management, and data fetching (e.g., `useChat`, `useKnowledgeGraph`, `useErrorReport`)
│   ├── pages/         # Top-level components representing application views/routes (e.g., `LandingPage`, `ResearchAssistant`, `CSRSummary`, `KGExplorer`, `Playground`, `ErrorUI`)
│   ├── router/        # Routing configuration for the application (using React Router)
│   ├── services/      # Modules responsible for API interactions and other external services (e.g., `chatService`, `kgService`, `errorService`)
│   ├── store/         # Global state management setup using Redux Toolkit (slices, store configuration)
│   ├── styles/        # Global styles, themes, base CSS (`index.css`, `App.css`), and potentially shared styled-component utilities
│   ├── types/         # TypeScript type definitions, interfaces, and enums used across the application (e.g., for API responses, component props, data structures like `GraphData`)
│   ├── utils/         # Common utility functions and helpers
│   ├── App.tsx        # Root application component, typically setting up global context providers, error boundaries, and main router outlet
│   └── main.tsx       # Main entry point of the React application, renders the `App` component
├── index.html
└── package.json
```

## Running Locally (Without Docker)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173) by default.

3. **Build for production:**
   ```bash
   npm run build
   ```
   The production-ready files will be in the `dist/` directory.

4. **Preview the production build locally:**
   ```bash
   npm run preview
   ```

## Running with Docker

1. **Build the Docker image:**
   ```bash
   docker build -t pxls-frontend .
   ```

2. **Run the Docker container:**
   ```bash
   docker run -p 8080:80 pxls-frontend
   ```
   The app will be available at [http://localhost:8080](http://localhost:8080).

- The Dockerfile uses a multi-stage build: it builds the React app with Node, then serves it with Nginx.
- The `nginx.conf` is configured for single-page app routing and static asset caching.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_API_BASE_URL=your_api_base_url
```

## Detailed Documentation

For a more in-depth understanding of the codebase, refer to the documentation within the `docs/` folder:
- `docs/overview.md`: A comprehensive overview of the project, similar to this README.
- `docs/pages.md`: Detailed descriptions of each page, its purpose, user flows, and components used.
- `docs/components.md`: Documentation for reusable UI components, their props, and usage.
- `docs/hooks.md`: Information on custom React hooks, their functionality, and how to use them.
- `docs/services.md`: (To be created) Details about API service integrations.
- `docs/store.md`: (To be created) Explanation of the Redux store structure, slices, and state management patterns.
- `docs/user_flows.md`: (To be created) Visual or textual descriptions of key user journeys through the application.

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

This project is proprietary and confidential.
