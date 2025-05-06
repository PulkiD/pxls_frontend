import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const ComingSoon = styled.div`
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const DrugRepurposing: React.FC = () => {
  return (
    <Container>
      <ComingSoon>
        <h1>Coming Soon</h1>
        <p>Drug Repurposing service is under development.</p>
      </ComingSoon>
    </Container>
  );
};

export default DrugRepurposing; 