import React from 'react';
import styled from 'styled-components';
import type { Node } from '../../types/GraphVisualization.types';

interface NodeInfoPanelProps {
  node: Node;
  x: number;
  y: number;
}

const Panel = styled.div<{ x: number; y: number }>`
  position: absolute;
  left: ${props => props.x + 20}px;
  top: ${props => props.y}px;
  max-width: 300px;
  z-index: 1000;
  background: rgba(17, 24, 39, 0.9);
  border: 1px solid #374151;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InfoRow = styled.p`
  font-size: 0.875rem;
  color: #9ca3af;
  
  span {
    color: white;
  }
`;

const NodeInfoPanel: React.FC<NodeInfoPanelProps> = ({ node, x, y }) => {
  return (
    <Panel x={x} y={y}>
      <Title>{node.name}</Title>
      <InfoSection>
        <InfoRow>
          Type: <span>{node.type}</span>
        </InfoRow>
        {Object.entries(node.properties || {}).map(([key, value]) => (
          <InfoRow key={key}>
            {key}: <span>{String(value)}</span>
          </InfoRow>
        ))}
      </InfoSection>
    </Panel>
  );
};

export default NodeInfoPanel; 