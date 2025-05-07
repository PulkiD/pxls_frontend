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

const Item = styled.div<{ active: boolean }>`
  padding: 0.7rem 1rem;
  cursor: pointer;
  background: ${({ active }) => (active ? '#e9ecef' : 'transparent')};
  border-radius: 4px;
  font-size: 1rem;
  font-weight: ${({ active }) => (active ? 600 : 400)};
  color: #222;
  &:hover {
    background: #f0f0f0;
  }
`;

const ChatHistoryDropdown: React.FC<ChatHistoryDropdownProps> = ({ conversations, activeId, onSelect, title }) => {
  const [expanded, setExpanded] = useState(true);

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
                {conv.title}
              </Item>
            ))
          )}
        </List>
      )}
    </DropdownContainer>
  );
};

export default ChatHistoryDropdown; 