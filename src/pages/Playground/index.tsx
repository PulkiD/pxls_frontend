import React, { useState, useRef } from 'react';
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
  overflow: hidden;
`;

const Module = styled.div`
  background: white;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: move;
  user-select: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  min-width: 120px;
  text-align: center;

  &:hover {
    background: #f9f9f9;
  }
`;

const WorkspaceModule = styled(Module)<{ x: number; y: number }>`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  margin: 0;
  z-index: 2;
`;

const modules = [
  { id: 1, name: 'Target Identification' },
  { id: 2, name: 'Hit Optimization' },
  { id: 3, name: 'Lead Discovery' },
  { id: 4, name: 'ADMET Prediction' },
];

interface DroppedModule {
  id: number;
  name: string;
  x: number;
  y: number;
}

const Playground: React.FC = () => {
  const [workspaceModules, setWorkspaceModules] = useState<DroppedModule[]>([]);
  const dragModule = useRef<{ id: number; name: string } | null>(null);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [draggingId, setDraggingId] = useState<number | null>(null);

  // Drag from library
  const handleDragStart = (module: { id: number; name: string }, e: React.DragEvent) => {
    dragModule.current = module;
    e.dataTransfer.effectAllowed = 'copy';
  };

  // Drop on workspace
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!dragModule.current) return;
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setWorkspaceModules(prev => [
      ...prev,
      { id: dragModule.current!.id, name: dragModule.current!.name, x, y }
    ]);
    dragModule.current = null;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Drag within workspace
  const handleModuleMouseDown = (id: number, e: React.MouseEvent) => {
    setDraggingId(id);
    const module = workspaceModules.find(m => m.id === id);
    if (module) {
      dragOffset.current = {
        x: e.clientX - module.x,
        y: e.clientY - module.y,
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingId !== null) {
      setWorkspaceModules(prev =>
        prev.map(m =>
          m.id === draggingId
            ? { ...m, x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y }
            : m
        )
      );
    }
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  return (
    <PlaygroundContainer>
      <ModuleLibrary>
        <h3>Modules</h3>
        {modules.map((module) => (
          <Module
            key={module.id}
            draggable
            onDragStart={e => handleDragStart(module, e)}
          >
            {module.name}
          </Module>
        ))}
      </ModuleLibrary>
      <Workspace
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <h2 style={{ color: '#bbb', textAlign: 'center', pointerEvents: 'none' }}>
          Drag and drop modules here to create your workflow
        </h2>
        {workspaceModules.map((mod, idx) => (
          <WorkspaceModule
            key={idx}
            x={mod.x}
            y={mod.y}
            onMouseDown={e => handleModuleMouseDown(mod.id, e)}
            style={{ zIndex: draggingId === mod.id ? 10 : 2 }}
          >
            {mod.name}
          </WorkspaceModule>
        ))}
      </Workspace>
    </PlaygroundContainer>
  );
};

export default Playground; 