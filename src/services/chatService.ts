// src/services/chatService.ts
import api from "./api";

interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface ConversationItem {
  conversationId: number;
  otherUserId: number;
  otherUserName: string;
  otherUserAvatarUrl: string | null;
  otherUserRole: string | null;
  lastMessagePreview: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
}

export interface ChatMessageItem {
  messageId: number;
  conversationId: number;
  senderId: number;
  senderName: string;
  senderAvatarUrl: string | null;
  content: string;
  isRead: boolean;
  createdAt: string;
}

interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // trang hiện tại (0-based)
  size: number;
  last: boolean;
}

export const fetchConversations = (): Promise<ConversationItem[]> =>
  api
    .get<ApiResponse<ConversationItem[]>>("/chat/conversations")
    .then((r) => r.data.data ?? []);

export const fetchMessages = (
  conversationId: number,
  page = 0,
  size = 30,
): Promise<SpringPage<ChatMessageItem>> =>
  api
    .get<
      ApiResponse<SpringPage<ChatMessageItem>>
    >(`/chat/conversations/${conversationId}/messages?page=${page}&size=${size}`)
    .then((r) => r.data.data);

export const sendChatMessage = (
  conversationId: number,
  content: string,
): Promise<ChatMessageItem> =>
  api
    .post<
      ApiResponse<ChatMessageItem>
    >(`/chat/conversations/${conversationId}/messages`, { content })
    .then((r) => r.data.data);

export const markConversationRead = (conversationId: number): Promise<void> =>
  api.patch(`/chat/conversations/${conversationId}/read`);
