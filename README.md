# PhoenixLS - Drug Discovery Platform

A scalable web application for enterprise drug discovery services, built with React, TypeScript, and Vite.

## Features

- Research Assistant Service (AI-powered chatbot)
- Drug Repurposing Service
- End-to-end Playground for Drug Discovery Workflows

## Tech Stack

- Frontend: React + TypeScript + Vite
- State Management: Redux Toolkit
- API Integration: React Query + Axios
- Styling: Styled Components
- Routing: React Router

## Project Structure

```
pxls_frontend/
├── public/
├── src/
│   ├── assets/        # Static assets
│   ├── components/    # Reusable UI components
│   ├── config/        # Configuration files
│   ├── features/      # Feature-specific components
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Route-level components
│   ├── router/        # Routing configuration
│   ├── services/      # API services
│   ├── styles/        # Global styles
│   ├── utils/         # Utility functions
│   ├── App.tsx        # Root component
│   └── main.tsx       # Entry point
├── index.html
└── package.json
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_API_BASE_URL=your_api_base_url
```

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

This project is proprietary and confidential.
