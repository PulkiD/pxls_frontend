import React from 'react';
import styled, { css } from 'styled-components';
import Button from './Button';

interface PlacardProps {
  title: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  comingSoon?: boolean;
}

const Card = styled.div<{ comingSoon?: boolean }>`
  background: ${({ comingSoon }) => (comingSoon ? '#f7f7f7' : '#fff')};
  border: 2px solid ${({ comingSoon }) => (comingSoon ? '#e2e2e2' : '#222')};
  border-radius: 18px;
  padding: 2.2rem 1.5rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 210px;
  box-shadow: none;
  transition: box-shadow 0.2s, border 0.2s, transform 0.2s;
  cursor: ${({ comingSoon }) => (comingSoon ? 'default' : 'pointer')};
  ${({ comingSoon }) =>
    !comingSoon &&
    css`
      &:hover {
        box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        border-color: #bfa14a;
        transform: translateY(-8px);
      }
    `}
`;

const Title = styled.div`
  font-size: 1.35rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const Description = styled.div`
  color: #444;
  font-size: 1rem;
  text-align: center;
  margin-bottom: 1.2rem;
`;

const ComingSoonText = styled.div`
  color: #aaa;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
`;

const Placard: React.FC<PlacardProps> = ({ title, description, buttonText, onButtonClick, comingSoon }) => (
  <Card comingSoon={comingSoon}>
    {comingSoon ? (
      <ComingSoonText>{title}</ComingSoonText>
    ) : (
      <>
        <Title>{title}</Title>
        {description && <Description>{description}</Description>}
        {buttonText && (
          <Button variant="outline" onClick={onButtonClick} style={{ minWidth: 140, fontSize: '1rem' }}>
            {buttonText}
          </Button>
        )}
      </>
    )}
  </Card>
);

export default Placard; 