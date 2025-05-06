import React from 'react';
import styled from 'styled-components';
import Button from '../../components/Button';

const LandingPageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #1a1a1a;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
`;

const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
`;

const ServiceCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ServiceTitle = styled.h2`
  font-size: 1.5rem;
  color: #1a1a1a;
  margin: 0;
`;

const ServiceDescription = styled.p`
  color: #666;
  margin: 0;
  flex: 1;
`;

const LandingPage: React.FC = () => {
  const services = [
    {
      id: 1,
      title: 'Research Assistant',
      description: 'AI-powered chatbot for research assistance and drug discovery insights',
      path: '/chat'
    },
    {
      id: 2,
      title: 'Drug Repurposing',
      description: 'Discover new therapeutic applications for existing drugs through advanced analytics',
      path: '/repurpose'
    },
    {
      id: 3,
      title: 'End-to-end Playground',
      description: 'Interactive drug discovery workflow builder with drag-and-drop functionality',
      path: '/playground'
    }
  ];

  const handleServiceClick = (path: string) => {
    window.open(path, '_blank');
  };

  return (
    <LandingPageContainer>
      <Header>
        <Title>Welcome to PhoenixLS</Title>
        <Subtitle>Advanced Drug Discovery Platform</Subtitle>
      </Header>
      <ServiceGrid>
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            onClick={() => handleServiceClick(service.path)}
          >
            <ServiceTitle>{service.title}</ServiceTitle>
            <ServiceDescription>{service.description}</ServiceDescription>
            <Button variant="outline" fullWidth>
              Launch Service
            </Button>
          </ServiceCard>
        ))}
      </ServiceGrid>
    </LandingPageContainer>
  );
};

export default LandingPage; 