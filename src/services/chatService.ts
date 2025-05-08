import axios from 'axios';
import sampleKG from '../services/mockData/sample_kg_output.json';
const useMock = import.meta.env.VITE_USE_MOCK_API === 'true';

// In-memory mock store for demo purposes
let mockConversations: Record<string, any> = {};
let mockConversationOrder: string[] = [];
let mockIdCounter = 1;

// Load mock data from localStorage on module load
if (useMock) {
  const storedConversations = localStorage.getItem('mockConversations');
  const storedOrder = localStorage.getItem('mockConversationOrder');
  const storedCounter = localStorage.getItem('mockIdCounter');
  if (storedConversations) mockConversations = JSON.parse(storedConversations);
  if (storedOrder) mockConversationOrder = JSON.parse(storedOrder);
  if (storedCounter) mockIdCounter = parseInt(storedCounter, 10);
}

function saveMockData() {
  localStorage.setItem('mockConversations', JSON.stringify(mockConversations));
  localStorage.setItem('mockConversationOrder', JSON.stringify(mockConversationOrder));
  localStorage.setItem('mockIdCounter', mockIdCounter.toString());
}

function getNowISO() {
  return new Date().toISOString();
}

function createBotResponse(userMessage: string) {
  return {
    id: `msg_${mockIdCounter++}`,
    content: `Bot reply to: "${userMessage}" (dummy response)` ,
    isUser: false,
    timestamp: getNowISO(),
  };
}

function createMockGraphData() {
  // Optionally return graphData for some messages
  return Math.random() < 0.5 ? undefined : sampleKG;
}

export async function sendMessage({ conversationId, message }: { conversationId?: string, message: string }) {
  if (useMock) {
    // New conversation
    if (!conversationId || !mockConversations[conversationId]) {
      const newId = `conv_${mockIdCounter++}`;
      const userMsg = {
        id: `msg_${mockIdCounter++}`,
        content: message,
        isUser: true,
        timestamp: getNowISO(),
      };
      const botMsg = createBotResponse(message);
      const graphData = createMockGraphData();
      mockConversations[newId] = {
        id: newId,
        title: message.slice(0, 30) + (message.length > 30 ? '...' : ''),
        messages: [userMsg, botMsg],
        lastMessage: botMsg.content,
        timestamp: getNowISO(),
        graphData,
      };
      mockConversationOrder.unshift(newId);
      saveMockData();
      return {
        conversationId: newId,
        botResponse: botMsg,
        graphData,
      };
    }
    // Existing conversation
    const conv = mockConversations[conversationId];
    const userMsg = {
      id: `msg_${mockIdCounter++}`,
      content: message,
      isUser: true,
      timestamp: getNowISO(),
    };
    const botMsg = createBotResponse(message);
    const graphData = createMockGraphData();
    conv.messages.push(userMsg, botMsg);
    conv.lastMessage = botMsg.content;
    conv.timestamp = getNowISO();
    conv.graphData = graphData;
    // Move to top
    mockConversationOrder = [conversationId, ...mockConversationOrder.filter(id => id !== conversationId)];
    saveMockData();
    return {
      conversationId,
      botResponse: botMsg,
      graphData,
    };
  }
  // Real API
  const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/assistant/chat`, {
    conversationId,
    message: { content: message }
  });
  return response.data;
}

export async function getConversationSummaries() {
  if (useMock) {
    return mockConversationOrder.map(id => {
      const conv = mockConversations[id];
      return {
        id: conv.id,
        title: conv.title,
        lastMessage: conv.lastMessage,
        timestamp: conv.timestamp,
      };
    });
  }
  const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/assistant/conversations`);
  return response.data.conversations;
}

export async function getConversationDetails(conversationId: string) {
  if (useMock) {
    const conv = mockConversations[conversationId];
    if (!conv) throw new Error('Conversation not found');
    return {
      id: conv.id,
      title: conv.title,
      messages: conv.messages,
      lastMessage: conv.lastMessage,
      timestamp: conv.timestamp,
    };
  }
  const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/assistant/conversations/${conversationId}`);
  return response.data;
} 