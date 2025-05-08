import React, { Component } from 'react';
import type { ErrorInfo } from 'react';
import styled from 'styled-components';
import { reportError } from '../services/errorService';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: #f8f9fa;
  text-align: center;
`;

const ErrorTitle = styled.h1`
  color: #dc3545;
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  color: #6c757d;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  max-width: 600px;
`;

const RetryButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #0056b3;
  }
`;

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Report the error
    reportError(error, {
      context: 'React Error Boundary',
      componentStack: errorInfo.componentStack
    });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorTitle>Something went wrong</ErrorTitle>
          <ErrorMessage>
            {this.state.error?.message || 'An unexpected error occurred. Please try again.'}
          </ErrorMessage>
          <RetryButton onClick={this.handleRetry}>
            Try Again
          </RetryButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 