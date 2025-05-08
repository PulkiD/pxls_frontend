import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import styled from 'styled-components';
import { ErrorBoundary } from './pages/ErrorUI/ErrorHandlers';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const LoadingFallback = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
  color: #666;
`;

function App() {
  return (
    <AppContainer>
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback>Loading...</LoadingFallback>}>
          <RouterProvider router={router} />
        </Suspense>
      </ErrorBoundary>
    </AppContainer>
  );
}

export default App;
