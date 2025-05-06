import React, { useState } from 'react';
import styled from 'styled-components';
import Message from '../../components/Chat/Message';
import ChatInput from '../../components/Chat/ChatInput';
import ChatHistory from '../../components/Chat/ChatHistory';

const ChatContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const ChatMain = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: white;
`;

const WelcomeMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  lastMessage: string;
  timestamp: string;
}

const ResearchAssistant: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async (content: string) => {
    setError(null); // Clear previous errors
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date().toLocaleTimeString()
    };

    if (!activeConversation) {
      // Create new conversation
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
        messages: [newMessage],
        lastMessage: content,
        timestamp: new Date().toLocaleString()
      };
      setConversations(prev => [...prev, newConversation]);
      setActiveConversation(newConversation.id);
    } else {
      // Update existing conversation
      setConversations(prev => prev.map(conv => {
        if (conv.id === activeConversation) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: content,
            timestamp: new Date().toLocaleString()
          };
        }
        return conv;
      }));
    }

    setIsLoading(true);

    // Simulate API call with possible error
    setTimeout(() => {
      // 20% chance of error
      if (Math.random() < 0.2) {
        setError('Failed to send message. Please try again.');
        setIsLoading(false);
        return;
      }
      const response: Message = {
        id: (Date.now() + 1).toString(),
        content: 'This is a simulated response. In a real application, this would come from the backend API.',
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      };

      setConversations(prev => prev.map(conv => {
        if (conv.id === activeConversation) {
          return {
            ...conv,
            messages: [...conv.messages, response],
            lastMessage: response.content,
            timestamp: new Date().toLocaleString()
          };
        }
        return conv;
      }));
      setIsLoading(false);
    }, 1000);
  };

  const handleNewChat = () => {
    setActiveConversation(undefined);
    setError(null);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversation(id);
    setError(null);
  };

  const getCurrentMessages = () => {
    if (!activeConversation) return [];
    const conversation = conversations.find(conv => conv.id === activeConversation);
    return conversation?.messages || [];
  };

  return (
    <ChatContainer>
      <ChatHistory
        conversations={conversations}
        onSelect={handleSelectConversation}
        onNewChat={handleNewChat}
        activeId={activeConversation}
      />
      <ChatMain>
        <MessagesContainer>
          {!activeConversation ? (
            <WelcomeMessage>
              <h2>Welcome to Research Assistant</h2>
              <p>How can I help you with your drug discovery research today?</p>
            </WelcomeMessage>
          ) : (
            getCurrentMessages().map(message => (
              <Message
                key={message.id}
                content={message.content}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))
          )}
          {error && (
            <div style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>
              {error} <button onClick={() => setError(null)}>Dismiss</button>
            </div>
          )}
        </MessagesContainer>
        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
      </ChatMain>
    </ChatContainer>
  );
};

export default ResearchAssistant; 