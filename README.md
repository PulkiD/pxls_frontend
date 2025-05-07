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

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

This project is proprietary and confidential.
