import React from 'react';
import styled from 'styled-components';

const ChatContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const ChatMain = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
`;

const MessageInput = styled.div`
  padding: 1rem;
  border-top: 1px solid #eee;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const ResearchAssistant: React.FC = () => {
  return (
    <ChatContainer>
      <ChatMain>
        <ChatMessages>
          {/* Chat messages will go here */}
        </ChatMessages>
        <MessageInput>
          <Input placeholder="Type your message..." />
        </MessageInput>
      </ChatMain>
    </ChatContainer>
  );
};

export default ResearchAssistant; 