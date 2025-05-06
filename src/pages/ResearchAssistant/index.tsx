import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import TopNavBar from '../../components/TopNavBar';
import SideNavBar from '../../components/SideNavBar';
import CollapsibleSidebar from '../../components/CollapsibleSidebar';
import Message from '../../components/Chat/Message';
import ChatInput from '../../components/Chat/ChatInput';
import ChatHistoryDropdown, { type ConversationSummary } from '../../components/Chat/ChatHistoryDropdown';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  border: 1px solid #222;
`;

const MainArea = styled.div`
  display: flex;
  flex: 1;
  border-top: 1px solid #222;
  position: relative;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  position: relative;
  background: #fff;
  border-left: 1px solid #222;
  border-right: 1px solid #222;
  transition: margin 0.3s cubic-bezier(.4,0,.2,1);
`;

const ChatWindow = styled.div`
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 0 1.5rem 0;
`;

const MessagesList = styled.div`
  flex: 1 1 0;
  overflow-y: auto;
  padding: 2.5rem 1.5rem 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Welcome = styled.div`
  text-align: center;
  margin-top: 4rem;
`;

const WelcomeTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const WelcomeSubtitle = styled.div`
  font-size: 1.3rem;
  color: #888;
  font-weight: 400;
`;

const ChatInputContainer = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 1.5rem;
`;

const navItems = [
  { label: 'Documents' },
  { label: 'Settings' },
];

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
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Prepare conversation summaries for dropdown
  const conversationSummaries: ConversationSummary[] = conversations.map(conv => ({
    id: conv.id,
    title: conv.title,
    lastMessage: conv.lastMessage,
    timestamp: conv.timestamp,
  }));

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversation, conversations]);

  const handleLogoClick = () => {
    window.location.href = '/';
  };

  const handleProfileClick = () => {
    // Placeholder for future Keycloak integration
    alert('Profile click: future login/profile integration');
  };

  return (
    <PageContainer>
      <TopNavBar
        logoText="Research Assistant"
        profileInitials="PS"
        onLogoClick={handleLogoClick}
        onProfileClick={handleProfileClick}
      />
      <MainArea>
        <CollapsibleSidebar
          collapsed={leftCollapsed}
          onToggle={() => setLeftCollapsed((c) => !c)}
          position="left"
        >
          <SideNavBar
            navItems={navItems}
            footerText="PxLS"
            onStartNewChat={handleNewChat}
            chatHistoryDropdown={
              <ChatHistoryDropdown
                conversations={conversationSummaries}
                activeId={activeConversation}
                onSelect={handleSelectConversation}
              />
            }
          />
        </CollapsibleSidebar>
        <Content>
          <ChatWindow>
            <MessagesList>
              {!activeConversation ? (
                <Welcome>
                  <WelcomeTitle>Welcome to Research Assistant</WelcomeTitle>
                  <WelcomeSubtitle>How can I help you with your Drug Discovery Research today?</WelcomeSubtitle>
                </Welcome>
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
              <div ref={messagesEndRef} />
            </MessagesList>
            <ChatInputContainer>
              <ChatInput onSend={handleSendMessage} disabled={isLoading} />
            </ChatInputContainer>
          </ChatWindow>
        </Content>
        <CollapsibleSidebar
          collapsed={rightCollapsed}
          onToggle={() => setRightCollapsed((c) => !c)}
          position="right"
        >
          {/* Placeholder for future network panel */}
          <></>
        </CollapsibleSidebar>
      </MainArea>
    </PageContainer>
  );
};

export default ResearchAssistant; 