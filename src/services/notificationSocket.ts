import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import type { NotificationItem } from "./notificationService";
import type { ChatMessageItem } from "./chatService";

const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL ?? "http://localhost:8080";

type NotificationHandler = (notification: NotificationItem) => void;
type ChatMessageHandler = (message: ChatMessageItem) => void;

let client: Client | null = null;
const notificationHandlers = new Set<NotificationHandler>();
const chatMessageHandlers = new Set<ChatMessageHandler>();

export function connectNotificationSocket() {
  if (client?.active) return;

  client = new Client({
    webSocketFactory: () => new SockJS(`${WS_BASE_URL}/ws`),
    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,

    onConnect: () => {
      client?.subscribe("/user/queue/notifications", (message: IMessage) => {
        try {
          const notification: NotificationItem = JSON.parse(message.body);
          notificationHandlers.forEach((handler) => handler(notification));
        } catch (err) {
          console.error("Không parse được notification realtime:", err);
        }
      });

      client?.subscribe("/user/queue/messages", (message: IMessage) => {
        try {
          const chatMessage: ChatMessageItem = JSON.parse(message.body);
          chatMessageHandlers.forEach((handler) => handler(chatMessage));
        } catch (err) {
          console.error("Không parse được chat message realtime:", err);
        }
      });
    },

    onStompError: (frame) => {
      console.error("STOMP error:", frame.headers["message"], frame.body);
    },

    onWebSocketClose: () => {
      console.warn("WebSocket đã đóng, sẽ tự reconnect...");
    },
  });

  client.activate();
}

export function disconnectNotificationSocket() {
  client?.deactivate();
  client = null;
  notificationHandlers.clear();
  chatMessageHandlers.clear();
}

export function onNotification(handler: NotificationHandler): () => void {
  notificationHandlers.add(handler);
  return () => notificationHandlers.delete(handler);
}

export function onChatMessage(handler: ChatMessageHandler): () => void {
  chatMessageHandlers.add(handler);
  return () => chatMessageHandlers.delete(handler);
}
