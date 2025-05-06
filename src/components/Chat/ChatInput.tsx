import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../Button';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const InputContainer = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-top: 1px solid #eee;
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputContainer>
        <StyledInput
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={disabled}
        />
        <Button type="submit" disabled={disabled || !message.trim()}>
          Send
        </Button>
      </InputContainer>
    </form>
  );
};

export default ChatInput; 