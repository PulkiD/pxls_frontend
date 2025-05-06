import React from 'react';
import styled from 'styled-components';
import Button from '../Button';

interface ChatHistoryProps {
  conversations: Array<{
    id: string;
    title: string;
    lastMessage: string;
    timestamp: string;
  }>;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  activeId?: string;
}

const HistoryContainer = styled.div`
  width: 250px;
  background: #f8f9fa;
  border-right: 1px solid #dee2e6;
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const HistoryHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  font-weight: bold;
`;

const ButtonContainer = styled.div`
  padding: 0 1rem;
  margin-bottom: 1rem;
  flex-shrink: 0;
`;

const NewChatButton = styled(Button)`
  width: 100%;
`;

const ConversationsList = styled.div`
  flex: 1;
  overflow-y: auto;
  border-top: 1px solid #dee2e6;
`;

const ConversationItem = styled.div<{ isActive: boolean }>`
  padding: 1rem;
  cursor: pointer;
  border-bottom: 1px solid #dee2e6;
  background: ${props => props.isActive ? '#e9ecef' : 'transparent'};

  &:hover {
    background: #e9ecef;
  }
`;

const ConversationTitle = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const ConversationPreview = styled.div`
  font-size: 0.875rem;
  color: #6c757d;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Timestamp = styled.div`
  font-size: 0.75rem;
  color: #adb5bd;
  margin-top: 0.25rem;
`;

const ChatHistory: React.FC<ChatHistoryProps> = ({ conversations, onSelect, onNewChat, activeId }) => {
  return (
    <HistoryContainer>
      <ButtonContainer>
        <NewChatButton onClick={onNewChat} variant="outline">
          Start New Chat
        </NewChatButton>
      </ButtonContainer>
      <HistoryHeader>Chat History</HistoryHeader>
      <ConversationsList>
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            onClick={() => onSelect(conversation.id)}
            isActive={conversation.id === activeId}
          >
            <ConversationTitle>{conversation.title}</ConversationTitle>
            <ConversationPreview>{conversation.lastMessage}</ConversationPreview>
            <Timestamp>{conversation.timestamp}</Timestamp>
          </ConversationItem>
        ))}
      </ConversationsList>
    </HistoryContainer>
  );
};

export default ChatHistory; 