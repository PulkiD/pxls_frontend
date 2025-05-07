import React from 'react';
import styled from 'styled-components';

interface NavItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

interface SideNavBarProps {
  navItems: NavItem[];
  footerText: string;
  extraSections?: React.ReactNode;
}

const Sidebar = styled.div`
  width: 220px;
  background: #fff;
  border-right: 1px solid #e2cfa2;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const NavSection = styled.div`
  padding: 2rem 0 0 0;
  flex: 1 1 auto;
`;

const NavItemDiv = styled.div<{ active?: boolean }>`
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  color: #222;
  cursor: pointer;
  font-weight: 500;
  background: ${({ active }) => (active ? '#f5f5f5' : 'transparent')};
  &:hover {
    background: #f5f5f5;
  }
`;

const SidebarFooter = styled.div`
  padding: 2rem;
  font-weight: 700;
  font-size: 1.2rem;
  color: #222;
  flex-shrink: 0;
  margin-top: auto;
`;

const SideNavBar: React.FC<SideNavBarProps> = ({ navItems, footerText, extraSections }) => (
  <Sidebar>
    <NavSection>
      {navItems.map((item, idx) => (
        <NavItemDiv
          key={item.label}
          active={item.active}
          onClick={item.onClick}
        >
          {item.label}
        </NavItemDiv>
      ))}
      {extraSections}
    </NavSection>
    <SidebarFooter>{footerText}</SidebarFooter>
  </Sidebar>
);

export default SideNavBar; 