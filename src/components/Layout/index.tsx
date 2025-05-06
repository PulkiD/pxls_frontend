import React, { useState } from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const LeftNav = styled.nav<{ isOpen: boolean }>`
  width: ${props => props.isOpen ? '250px' : '60px'};
  background: #1a1a1a;
  color: white;
  transition: width 0.3s ease;
  overflow: hidden;
`;

const RightNav = styled.nav<{ isOpen: boolean }>`
  width: ${props => props.isOpen ? '250px' : '60px'};
  background: #1a1a1a;
  color: white;
  transition: width 0.3s ease;
  overflow: hidden;
`;

const MainContent = styled.main`
  flex: 1;
  background: #f5f5f5;
  padding: 1rem;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: white;
  padding: 1rem;
  cursor: pointer;
  width: 100%;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #333;
  }
`;

const Logo = styled.div`
  padding: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
  white-space: nowrap;
`;

const NavItem = styled.div`
  padding: 0.5rem 1rem;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: #333;
  }
`;

const ProfileSection = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #333;
  white-space: nowrap;
`;

const Layout: React.FC = () => {
  const [leftNavOpen, setLeftNavOpen] = useState(false);
  const [rightNavOpen, setRightNavOpen] = useState(false);

  return (
    <LayoutContainer>
      <LeftNav isOpen={leftNavOpen}>
        <ToggleButton onClick={() => setLeftNavOpen(!leftNavOpen)}>
          ☰
        </ToggleButton>
        {leftNavOpen && (
          <>
            <Logo>PhoenixLS</Logo>
            <NavItem>Dashboard</NavItem>
            <NavItem>Services</NavItem>
            <NavItem>Analytics</NavItem>
          </>
        )}
      </LeftNav>

      <MainContent>
        <Outlet />
      </MainContent>

      <RightNav isOpen={rightNavOpen}>
        <ToggleButton onClick={() => setRightNavOpen(!rightNavOpen)}>
          ☰
        </ToggleButton>
        {rightNavOpen && (
          <>
            <ProfileSection>
              <h3>User Profile</h3>
              <p>user@example.com</p>
            </ProfileSection>
            <NavItem>Settings</NavItem>
            <NavItem>Preferences</NavItem>
            <NavItem>Help</NavItem>
            <NavItem>Logout</NavItem>
          </>
        )}
      </RightNav>
    </LayoutContainer>
  );
};

export default Layout; 