import React from 'react';
import styled from 'styled-components';

interface MessageProps {
  content: string;
  isUser: boolean;
  timestamp: string;
}

const MessageContainer = styled.div<{ isUser: boolean }>`
  display: flex;
  justify-content: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  margin: 1rem 0;
`;

const MessageBubble = styled.div<{ isUser: boolean }>`
  max-width: 70%;
  padding: 1rem;
  border-radius: 1rem;
  background: ${props => props.isUser ? '#007bff' : '#f0f0f0'};
  color: ${props => props.isUser ? 'white' : '#333'};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const Timestamp = styled.div`
  font-size: 0.75rem;
  color: #666;
  margin-top: 0.25rem;
  text-align: right;
`;

const Message: React.FC<MessageProps> = ({ content, isUser, timestamp }) => {
  return (
    <MessageContainer isUser={isUser}>
      <div>
        <MessageBubble isUser={isUser}>
          {content}
        </MessageBubble>
        <Timestamp>{timestamp}</Timestamp>
      </div>
    </MessageContainer>
  );
};

export default Message; 