import React from 'react';
import styled from 'styled-components';
import TopNavBar from '../../components/TopNavBar';
import SideNavBar from '../../components/SideNavBar';
import Placard from '../../components/Placard';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const MainArea = styled.div`
  display: flex;
  flex: 1;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 2rem 0 0 0;
`;

const Welcome = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const WelcomeTitle = styled.h1`
  font-size: 2.8rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const WelcomeSubtitle = styled.div`
  font-size: 1.3rem;
  color: #888;
  font-weight: 400;
`;

const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem 2rem;
  width: 100%;
  max-width: 1100px;
`;

const navItems = [
  { label: 'Home' },
  { label: 'Analytics' },
  { label: 'Documents' },
  { label: 'Settings' },
];

const services = [
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
    path: '/kg',
  },
];

const LandingPage: React.FC = () => {
  const handleServiceClick = (path: string) => {
    window.open(path, '_blank');
  };

  const handleLogoClick = () => {
    window.location.href = '/';
  };

  const handleProfileClick = () => {
    // Placeholder for future Keycloak integration
    alert('Profile click: future login/profile integration');
  };

  return (
    <PageContainer>
      <TopNavBar logoText="PhoenixLS" profileInitials="PS" onLogoClick={handleLogoClick} onProfileClick={handleProfileClick} />
      <MainArea>
        <SideNavBar navItems={navItems} footerText="PxLS" />
        <Content>
          <Welcome>
            <WelcomeTitle>Welcome to PhoenixLS</WelcomeTitle>
            <WelcomeSubtitle>Advanced Drug Discovery & Development Platform</WelcomeSubtitle>
          </Welcome>
          <ServiceGrid>
            {services.map((service) => (
              <Placard
                key={service.title}
                title={service.title}
                description={service.description}
                buttonText="Launch Service"
                onButtonClick={() => handleServiceClick(service.path)}
              />
            ))}
            <Placard title="Coming Soon" comingSoon />
          </ServiceGrid>
        </Content>
      </MainArea>
    </PageContainer>
  );
};

export default LandingPage; 