import React from 'react';
import styled from 'styled-components';

interface MessageProps {
  content: string;
  isUser: boolean;
  timestamp: string;
}

const MessageContainer = styled.div<{ isUser: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  margin: 1.2rem 0;
`;

const MessageBubble = styled.div<{ isUser: boolean }>`
  max-width: 60%;
  padding: 1rem 1.25rem;
  border-radius: 1.2rem;
  background: ${props => props.isUser ? '#007bff' : '#f0f0f0'};
  color: ${props => props.isUser ? 'white' : '#333'};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  font-size: 1rem;
  word-break: break-word;
`;

const Timestamp = styled.div<{ isUser: boolean }>`
  font-size: 0.8rem;
  color: #888;
  margin-top: 0.3rem;
  text-align: ${props => props.isUser ? 'right' : 'left'};
`;

const Message: React.FC<MessageProps> = ({ content, isUser, timestamp }) => {
  return (
    <MessageContainer isUser={isUser}>
      <MessageBubble isUser={isUser}>
        {content}
      </MessageBubble>
      <Timestamp isUser={isUser}>{timestamp}</Timestamp>
    </MessageContainer>
  );
};

export default Message; 