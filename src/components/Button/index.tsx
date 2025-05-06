import React from 'react';
import styled, { css } from 'styled-components';

type ButtonVariant = 'primary' | 'secondary' | 'outline';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const getVariantStyles = (variant: ButtonVariant) => {
  switch (variant) {
    case 'primary':
      return css`
        background: #007bff;
        color: white;
        &:hover {
          background: #0056b3;
        }
      `;
    case 'secondary':
      return css`
        background: #6c757d;
        color: white;
        &:hover {
          background: #545b62;
        }
      `;
    case 'outline':
      return css`
        background: transparent;
        border: 1px solid #007bff;
        color: #007bff;
        &:hover {
          background: #f8f9fa;
        }
      `;
  }
};

const StyledButton = styled.button<ButtonProps>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
  width: ${props => props.fullWidth ? '100%' : 'auto'};

  ${props => getVariantStyles(props.variant || 'primary')}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return <StyledButton {...props}>{children}</StyledButton>;
};

export default Button; 