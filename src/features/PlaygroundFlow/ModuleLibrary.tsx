import React from 'react';
import styled from 'styled-components';

export interface ModuleType {
  type: string;
  label: string;
}

interface ModuleLibraryProps {
  modules: ModuleType[];
}

const LibraryContainer = styled.div`
  width: 220px;
  background: #f5f5f5;
  padding: 1rem;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ModuleItem = styled.div`
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  cursor: grab;
  user-select: none;
  text-align: center;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  &:hover {
    background: #f0f0f0;
  }
`;

const ModuleLibrary: React.FC<ModuleLibraryProps> = ({ modules }) => {
  const handleDragStart = (e: React.DragEvent, module: ModuleType) => {
    e.dataTransfer.setData('application/reactflow', module.type);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <LibraryContainer>
      <h3>Module Library</h3>
      {modules.map((mod) => (
        <ModuleItem
          key={mod.type}
          draggable
          onDragStart={e => handleDragStart(e, mod)}
        >
          {mod.label}
        </ModuleItem>
      ))}
    </LibraryContainer>
  );
};

export default ModuleLibrary; 