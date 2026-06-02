import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface ChatConversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string | null;
  participantAddress: string;
  messages: ChatMessage[];
  lastMessage: ChatMessage | null;
  unreadCount: number;
  isOnline: boolean;
}

interface ChatState {
  conversations: ChatConversation[];
  activeConversationId: string | null;
  isChatOpen: boolean;
  isMinimized: boolean;
  totalUnreadCount: number;

  openChat: () => void;
  closeChat: () => void;
  toggleMinimize: () => void;
  setActiveConversation: (id: string | null) => void;
  sendMessage: (conversationId: string, content: string, senderId: string) => void;
  markAsRead: (conversationId: string) => void;
  startConversation: (participant: { id: string; name: string; avatar: string | null; address: string }) => string;
  receiveMessage: (conversationId: string, message: Omit<ChatMessage, 'id' | 'read'>) => void;
}

function generateMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Mock conversations for demo
const mockConversations: ChatConversation[] = [
  {
    id: 'conv-1',
    participantId: 'user-1',
    participantName: 'ShadowMaster',
    participantAvatar: null,
    participantAddress: '0x1234...5678',
    messages: [
      {
        id: 'msg-1',
        senderId: 'user-1',
        content: 'Hey! Want to trade your Gengar?',
        timestamp: new Date(Date.now() - 3600000),
        read: true,
      },
      {
        id: 'msg-2',
        senderId: 'me',
        content: 'Sure! What do you have to offer?',
        timestamp: new Date(Date.now() - 3500000),
        read: true,
      },
      {
        id: 'msg-3',
        senderId: 'user-1',
        content: 'I have a legendary Dragonite!',
        timestamp: new Date(Date.now() - 300000),
        read: false,
      },
    ],
    lastMessage: {
      id: 'msg-3',
      senderId: 'user-1',
      content: 'I have a legendary Dragonite!',
      timestamp: new Date(Date.now() - 300000),
      read: false,
    },
    unreadCount: 1,
    isOnline: true,
  },
  {
    id: 'conv-2',
    participantId: 'user-2',
    participantName: 'CrystalGem',
    participantAvatar: null,
    participantAddress: '0x2345...6789',
    messages: [
      {
        id: 'msg-4',
        senderId: 'user-2',
        content: 'GG on that battle!',
        timestamp: new Date(Date.now() - 7200000),
        read: true,
      },
    ],
    lastMessage: {
      id: 'msg-4',
      senderId: 'user-2',
      content: 'GG on that battle!',
      timestamp: new Date(Date.now() - 7200000),
      read: true,
    },
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: 'conv-3',
    participantId: 'user-3',
    participantName: 'ThunderStrike',
    participantAvatar: null,
    participantAddress: '0x3456...7890',
    messages: [
      {
        id: 'msg-5',
        senderId: 'user-3',
        content: 'Check out my new legendary collection!',
        timestamp: new Date(Date.now() - 60000),
        read: false,
      },
    ],
    lastMessage: {
      id: 'msg-5',
      senderId: 'user-3',
      content: 'Check out my new legendary collection!',
      timestamp: new Date(Date.now() - 60000),
      read: false,
    },
    unreadCount: 1,
    isOnline: true,
  },
];

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: mockConversations,
      activeConversationId: null,
      isChatOpen: false,
      isMinimized: true,
      totalUnreadCount: mockConversations.reduce((acc, conv) => acc + conv.unreadCount, 0),

      openChat: () => {
        set({ isChatOpen: true, isMinimized: false });
      },

      closeChat: () => {
        set({ isChatOpen: false, activeConversationId: null });
      },

      toggleMinimize: () => {
        set((state) => ({ isMinimized: !state.isMinimized }));
      },

      setActiveConversation: (id: string | null) => {
        set({ activeConversationId: id });
        if (id) {
          get().markAsRead(id);
        }
      },

      sendMessage: (conversationId: string, content: string, senderId: string) => {
        const newMessage: ChatMessage = {
          id: generateMessageId(),
          senderId,
          content,
          timestamp: new Date(),
          read: true,
        };

        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, newMessage],
                  lastMessage: newMessage,
                }
              : conv
          ),
        }));
      },

      markAsRead: (conversationId: string) => {
        set((state) => {
          const conversation = state.conversations.find((c) => c.id === conversationId);
          const unreadToMark = conversation?.unreadCount || 0;

          return {
            conversations: state.conversations.map((conv) =>
              conv.id === conversationId
                ? {
                    ...conv,
                    unreadCount: 0,
                    messages: conv.messages.map((msg) => ({ ...msg, read: true })),
                  }
                : conv
            ),
            totalUnreadCount: Math.max(0, state.totalUnreadCount - unreadToMark),
          };
        });
      },

      startConversation: (participant) => {
        const existingConv = get().conversations.find(
          (c) => c.participantId === participant.id
        );
        
        if (existingConv) {
          set({ activeConversationId: existingConv.id, isChatOpen: true, isMinimized: false });
          return existingConv.id;
        }

        const newConversation: ChatConversation = {
          id: `conv-${Date.now()}`,
          participantId: participant.id,
          participantName: participant.name,
          participantAvatar: participant.avatar,
          participantAddress: participant.address,
          messages: [],
          lastMessage: null,
          unreadCount: 0,
          isOnline: Math.random() > 0.5,
        };

        set((state) => ({
          conversations: [newConversation, ...state.conversations],
          activeConversationId: newConversation.id,
          isChatOpen: true,
          isMinimized: false,
        }));

        return newConversation.id;
      },

      receiveMessage: (conversationId: string, message) => {
        const newMessage: ChatMessage = {
          ...message,
          id: generateMessageId(),
          read: false,
        };

        const state = get();
        const isActive = state.activeConversationId === conversationId && state.isChatOpen && !state.isMinimized;

        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, newMessage],
                  lastMessage: newMessage,
                  unreadCount: isActive ? conv.unreadCount : conv.unreadCount + 1,
                }
              : conv
          ),
          totalUnreadCount: isActive ? state.totalUnreadCount : state.totalUnreadCount + 1,
        }));
      },
    }),
    {
      name: "pokemon-chat-storage",
    }
  )
);