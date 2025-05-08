import React from 'react';
import styled from 'styled-components';
import type { Relationship } from '../../types/GraphVisualization.types';
import type { SimulationLinkDatum } from 'd3';

// Define D3Link type here since it's specific to this component
interface D3Link extends Omit<Relationship, 'source' | 'target'>, SimulationLinkDatum<any> {
  source: any;
  target: any;
  isActive?: boolean;
}

interface EdgeInfoPanelProps {
  edge: D3Link;
  x: number;
  y: number;
}

const Panel = styled.div<{ x: number; y: number }>`
  position: absolute;
  left: ${props => props.x + 20}px;
  top: ${props => props.y}px;
  max-width: 350px;
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

const EvolutionList = styled.ul`
  margin-left: 12px;
  list-style-type: none;
  padding: 0;
`;

const EvolutionItem = styled.li`
  font-size: 0.875rem;
  color: #9ca3af;
  
  span {
    color: white;
  }
`;

const EdgeInfoPanel: React.FC<EdgeInfoPanelProps> = ({ edge, x, y }) => {
  return (
    <Panel x={x} y={y}>
      <Title>Relationship</Title>
      <InfoSection>
        <InfoRow>
          Type: <span>{edge.relation}</span>
        </InfoRow>
        <InfoRow>
          From: <span>{edge.source.name}</span>
        </InfoRow>
        <InfoRow>
          To: <span>{edge.target.name}</span>
        </InfoRow>
        <InfoRow>
          Weight: <span>{edge.weight}</span>
        </InfoRow>
        {edge.evolution && (
          <InfoRow>
            Evolution:
            <EvolutionList>
              {Object.entries(edge.evolution).map(([year, value]) => (
                <EvolutionItem key={year}>
                  <span>{year}: {value}</span>
                </EvolutionItem>
              ))}
            </EvolutionList>
          </InfoRow>
        )}
        {Object.entries(edge.properties || {}).map(([key, value]) => (
          <InfoRow key={key}>
            {key}: <span>{String(value)}</span>
          </InfoRow>
        ))}
        {edge.isActive !== undefined && (
          <InfoRow>
            Status: <span>{edge.isActive ? 'Active' : 'Inactive'}</span>
          </InfoRow>
        )}
      </InfoSection>
    </Panel>
  );
};

export default EdgeInfoPanel; 