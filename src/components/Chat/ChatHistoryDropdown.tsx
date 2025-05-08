import React, { useState } from 'react';
import styled from 'styled-components';

export interface ConversationSummary {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
}

interface ChatHistoryDropdownProps {
  conversations: ConversationSummary[];
  activeId?: string;
  onSelect: (id: string) => void;
  onDelete?: (id: string) => void;
  title?: string;
}

const DropdownContainer = styled.div`
  margin-bottom: 1rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: 500;
  padding: 0.75rem 2rem 0.75rem 2rem;
  user-select: none;
`;

const Arrow = styled.span<{ expanded: boolean }>`
  margin-left: 0.5rem;
  font-size: 1rem;
  transition: transform 0.2s;
  transform: rotate(${props => (props.expanded ? '180deg' : '0deg')});
`;

const List = styled.div`
  background: #fafafa;
  border-radius: 6px;
  margin: 0.5rem 1.5rem 0 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  max-height: 220px;
  overflow-y: auto;
`;

const ItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0 0.5rem;
  font-size: 1.2rem;
  opacity: 0;
  transition: opacity 0.2s;
  
  &:hover {
    color: #ff4444;
  }
`;

const Item = styled.div<{ active: boolean }>`
  padding: 0.7rem 1rem;
  cursor: pointer;
  background: ${({ active }) => (active ? '#e9ecef' : 'transparent')};
  border-radius: 4px;
  font-size: 1rem;
  font-weight: ${({ active }) => (active ? 600 : 400)};
  color: #222;
  width: 100%;
  
  &:hover {
    background: #f0f0f0;
    
    ${DeleteButton} {
      opacity: 1;
    }
  }
`;

const ChatHistoryDropdown: React.FC<ChatHistoryDropdownProps> = ({ 
  conversations, 
  activeId, 
  onSelect, 
  onDelete,
  title 
}) => {
  const [expanded, setExpanded] = useState(true);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDelete?.(id);
  };

  return (
    <DropdownContainer>
      <Header onClick={() => setExpanded(e => !e)}>
        {title || 'Chat History'}
        <Arrow expanded={expanded}>▼</Arrow>
      </Header>
      {expanded && (
        <List>
          {conversations.length === 0 ? (
            <Item active={false} style={{ color: '#888', fontStyle: 'italic' }}>No history</Item>
          ) : (
            conversations.map(conv => (
              <Item
                key={conv.id}
                active={conv.id === activeId}
                onClick={() => onSelect(conv.id)}
              >
                <ItemContainer>
                  {conv.title}
                  {onDelete && (
                    <DeleteButton onClick={(e) => handleDelete(e, conv.id)}>
                      ×
                    </DeleteButton>
                  )}
                </ItemContainer>
              </Item>
            ))
          )}
        </List>
      )}
    </DropdownContainer>
  );
};

export default ChatHistoryDropdown; 