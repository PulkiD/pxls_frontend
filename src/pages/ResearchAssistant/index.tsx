import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import TopNavBar from '../../components/TopNavBar';
import SideNavBar from '../../components/SideNavBar';
import CollapsibleSidebar from '../../components/CollapsibleSidebar';
import Message from '../../components/Chat/Message';
import ChatInput from '../../components/Chat/ChatInput';
import ChatHistoryDropdown, { type ConversationSummary } from '../../components/Chat/ChatHistoryDropdown';
import Modal from '../../components/Modal';
import GraphVisualization from '../../components/KGViz/GraphVisualization';
// TODO: Replace with API data in the future. This is a placeholder for now.
import sampleKG from '../../config/sample_kg_output.json';

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

const RightPanelContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 1rem 1rem 1rem;
  height: 100%;
  background: #fff;
  border-left: 1px solid #222;
`;

const MiniGraphContainer = styled.div`
  width: 220px;
  height: 180px;
  border: 1px solid #bbb;
  border-radius: 10px;
  background: #fff;
  margin-bottom: 1.5rem;
  overflow: hidden;
`;

const ExpandButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: #e3f0ff;
  color: #222;
  border: 1px solid #bcd;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.2s;
  &:hover {
    background: #d0e7ff;
  }
`;

const RightPanelHeader = styled.div`
  width: 100%;
  padding: 0.5rem 0.5rem 0.5rem 2.5rem;
  font-size: 1rem;
  font-weight: 500;
  border-bottom: 1px solid #222;
  background: #fff;
`;

const ModalFooter = styled.div`
  width: 100%;
  background: #f5f5f5;
  border-top: 1px solid #ddd;
  padding: 1.2rem 2.5rem;
  display: flex;
  flex-direction: row;
  gap: 2.5rem;
  align-items: center;
  justify-content: flex-end;
  min-height: 60px;
`;

const ModalGraphArea = styled.div`
  flex: 1;
  min-height: 0;
  width: 100%;
  background: #fff;
  display: flex;
  align-items: stretch;
  justify-content: center;
`;

const navItems = [
  { label: 'Documents' },
  { label: 'Settings' },
];

interface MessageType {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: MessageType[];
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
  const [showGraphModal, setShowGraphModal] = useState(false);

  const handleSendMessage = async (content: string) => {
    setError(null);
    const newMessage: MessageType = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date().toLocaleTimeString()
    };

    if (!activeConversation) {
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
    setTimeout(() => {
      if (Math.random() < 0.2) {
        setError('Failed to send message. Please try again.');
        setIsLoading(false);
        return;
      }
      const response: MessageType = {
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

  const conversationSummaries: ConversationSummary[] = conversations.map(conv => ({
    id: conv.id,
    title: conv.title,
    lastMessage: conv.lastMessage,
    timestamp: conv.timestamp,
  }));

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversation, conversations]);

  const handleLogoClick = () => {
    window.location.href = '/';
  };

  const handleProfileClick = () => {
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
            navItems={[
              { label: 'Start New Chat', onClick: handleNewChat },
              ...navItems
            ]}
            footerText="PxLS"
            extraSections={
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
          width={320}
        >
          <RightPanelHeader>PxLS Knowledge Graph</RightPanelHeader>
          <RightPanelContent>
            <MiniGraphContainer>
              <GraphVisualization data={sampleKG as any} hideControls={true} />
            </MiniGraphContainer>
            <ExpandButton onClick={() => setShowGraphModal(true)}>
              Click to Expand
            </ExpandButton>
          </RightPanelContent>
        </CollapsibleSidebar>
        <Modal open={showGraphModal} onClose={() => setShowGraphModal(false)}>
          <ModalGraphArea>
            <GraphVisualization data={sampleKG as any} hideControls={false} />
          </ModalGraphArea>
          <ModalFooter>
          </ModalFooter>
        </Modal>
      </MainArea>
    </PageContainer>
  );
};

export default ResearchAssistant; 