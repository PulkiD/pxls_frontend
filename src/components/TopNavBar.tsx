import React from 'react';
import styled from 'styled-components';

interface TopNavBarProps {
  logoText: string;
  profileInitials: string;
  onLogoClick?: () => void;
  onProfileClick?: () => void;
}

const TopHeader = styled.div`
  background: #ffeccc;
  border-bottom: 1px solid #e2cfa2;
  padding: 0.75rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  font: inherit;
  display: flex;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 2rem;
  font-weight: 600;
  color: #222;
`;

const ProfileCircle = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.2rem;
  color: #222;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  cursor: pointer;
`;

const TopNavBar: React.FC<TopNavBarProps> = ({ logoText, profileInitials, onLogoClick, onProfileClick }) => (
  <TopHeader>
    <LogoButton onClick={onLogoClick} aria-label="Go to home">
      <Logo>{logoText}</Logo>
    </LogoButton>
    <ProfileCircle onClick={onProfileClick}>{profileInitials}</ProfileCircle>
  </TopHeader>
);

export default TopNavBar; 