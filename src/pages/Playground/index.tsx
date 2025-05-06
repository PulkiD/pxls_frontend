import React from 'react';
import styled from 'styled-components';

const PlaygroundContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const ModuleLibrary = styled.div`
  width: 250px;
  background: #f5f5f5;
  padding: 1rem;
  border-right: 1px solid #ddd;
`;

const Workspace = styled.div`
  flex: 1;
  background: white;
  padding: 1rem;
  position: relative;
`;

const Module = styled.div`
  background: white;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: move;
  user-select: none;

  &:hover {
    background: #f9f9f9;
  }
`;

const Playground: React.FC = () => {
  const modules = [
    { id: 1, name: 'Target Identification' },
    { id: 2, name: 'Hit Optimization' },
    { id: 3, name: 'Lead Discovery' },
    { id: 4, name: 'ADMET Prediction' },
  ];

  return (
    <PlaygroundContainer>
      <ModuleLibrary>
        <h3>Modules</h3>
        {modules.map((module) => (
          <Module key={module.id} draggable>
            {module.name}
          </Module>
        ))}
      </ModuleLibrary>
      <Workspace>
        <h2>Drag and drop modules here to create your workflow</h2>
      </Workspace>
    </PlaygroundContainer>
  );
};

export default Playground; 