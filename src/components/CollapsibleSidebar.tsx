import React from 'react';
import styled, { css } from 'styled-components';

interface CollapsibleSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  position?: 'left' | 'right';
  width?: number;
  collapsedWidth?: number;
  children: React.ReactNode;
}

const SidebarContainer = styled.div<{
  collapsed: boolean;
  position: 'left' | 'right';
  width: number;
  collapsedWidth: number;
}>`
  position: relative;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-${({ position }) => (position === 'left' ? 'right' : 'left')}: 1px solid #222;
  width: ${({ collapsed, width, collapsedWidth }) => (collapsed ? `${collapsedWidth}px` : `${width}px`)};
  min-width: ${({ collapsed, width, collapsedWidth }) => (collapsed ? `${collapsedWidth}px` : `${width}px`)};
  max-width: ${({ collapsed, width, collapsedWidth }) => (collapsed ? `${collapsedWidth}px` : `${width}px`)};
  transition: width 0.3s cubic-bezier(.4,0,.2,1);
  z-index: 2;
`;

const ToggleButton = styled.button<{
  position: 'left' | 'right';
}>`
  position: absolute;
  top: 18px;
  ${({ position }) =>
    position === 'left'
      ? css`right: -22px;`
      : css`left: -22px;`}
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1.5px solid #222;
  background: #fff;
  color: #222;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  cursor: pointer;
  z-index: 3;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
`;

const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({
  collapsed,
  onToggle,
  position = 'left',
  width = 220,
  collapsedWidth = 56,
  children,
}) => {
  return (
    <SidebarContainer
      collapsed={collapsed}
      position={position}
      width={width}
      collapsedWidth={collapsedWidth}
    >
      <ToggleButton onClick={onToggle} position={position} aria-label="Toggle sidebar">
        {position === 'left'
          ? (collapsed ? '>' : '<')
          : (collapsed ? '<' : '>')}
      </ToggleButton>
      {!collapsed && children}
    </SidebarContainer>
  );
};

export default CollapsibleSidebar; 