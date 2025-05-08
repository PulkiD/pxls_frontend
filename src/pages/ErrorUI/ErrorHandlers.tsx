import React from 'react';
import styled from 'styled-components';
import { useErrorReport } from '../../hooks/useErrorReport';
import Button from '../../components/Button';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  padding: 2rem;
`;

const ErrorBox = styled.div`
  background: #fff3f3;
  border: 1.5px solid #ffb3b3;
  border-radius: 12px;
  padding: 2.5rem 2rem;
  max-width: 480px;
  box-shadow: 0 2px 16px rgba(255,0,0,0.06);
  text-align: center;
`;

const Title = styled.h1`
  color: #d32f2f;
  font-size: 2.2rem;
  margin-bottom: 1rem;
`;

const Message = styled.div`
  color: #b71c1c;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
`;

const Details = styled.pre`
  background: #fff0f0;
  color: #b71c1c;
  font-size: 0.98rem;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  text-align: left;
  overflow-x: auto;
`;

const Feedback = styled.div`
  margin-top: 1rem;
  color: #388e3c;
  font-weight: 500;
`;

interface ErrorHandlersProps {
  error: Error | { message: string; stack?: string };
  info?: any;
}

const ErrorHandlers: React.FC<ErrorHandlersProps> = ({ error, info }) => {
  const { sendErrorReport, loading, result, error: reportError } = useErrorReport();
  const [reported, setReported] = React.useState(false);

  const handleReport = () => {
    sendErrorReport({
      message: error.message,
      stack: error.stack,
      info,
    });
    setReported(true);
  };

  return (
    <Container>
      <ErrorBox>
        <Title>Something went wrong</Title>
        <Message>{error.message || 'An unexpected error occurred.'}</Message>
        {error.stack && <Details>{error.stack}</Details>}
        {info && <Details>{JSON.stringify(info, null, 2)}</Details>}
        <Button onClick={handleReport} disabled={loading || reported}>
          {loading ? 'Reporting...' : reported ? 'Reported' : 'Report this error'}
        </Button>
        {result && <Feedback>{result.message}</Feedback>}
        {reportError && <Feedback style={{ color: '#d32f2f' }}>{reportError}</Feedback>}
      </ErrorBox>
      <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center', marginTop: '1.5rem' }}>
        <Button variant="primary" onClick={() => window.history.back()}>Go Back</Button>
        <Button variant="primary" onClick={() => window.location.href = '/'}>Go Home</Button>
      </div>
    </Container>
  );
};

export default ErrorHandlers;

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: Error | null, info: any }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error, info: null };
  }

  componentDidCatch(error: Error, info: any) {
    this.setState({ error, info });
  }

  render() {
    if (this.state.error) {
      return <ErrorHandlers error={this.state.error} info={this.state.info} />;
    }
    return this.props.children;
  }
} 