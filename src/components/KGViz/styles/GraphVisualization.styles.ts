import styled from 'styled-components';

export const GraphContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const ModalLayout = styled.div`
  display: flex;
  height: 100%;
  min-height: 0;
  flex: 1;
`;

export const LeftSidebar = styled.div`
  width: 260px;
  background: #f7f7f7;
  border-right: 1px solid #e5e7eb;
  padding: 1.5rem 1rem 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  z-index: 2;
  overflow-y: auto;
  min-height: 0;
`;

export const MainGraphArea = styled.div`
  flex: 1;
  position: relative;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const SidebarSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const SectionTitle = styled.h4`
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1f2937;
`;

export const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const StatItem = styled.div`
  font-size: 0.97rem;
  color: #333;
`;

export const StatValue = styled.span`
  font-weight: 600;
`;

export const NodeTypeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const NodeTypeLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 0.97rem;
  color: #444;
  margin-bottom: 0.125rem;
  cursor: pointer;
  
  &:hover {
    color: #1f2937;
  }
`;

export const NodeTypeCheckbox = styled.input`
  margin-right: 0.5rem;
  cursor: pointer;
`;

export const NodeTypeName = styled.span<{ color: string }>`
  color: ${props => props.color || '#333'};
  font-weight: 500;
`; 