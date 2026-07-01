// src/hooks/useUnreadMessagesCount.ts
//
// Tương tự useNotificationCount.ts -- polling 30s làm fallback + WebSocket
// cập nhật tức thì. Dùng để bật/tắt "red-dot" trên nút chat ở Header.

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { fetchConversations } from "../services/chatService";
import { onChatMessage } from "../services/notificationSocket";

export function useUnreadMessagesCount() {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      const conversations = await fetchConversations();
      const total = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
      setCount(total);
    } catch {
      // silent
    }
  }, [user]);

  useEffect(() => {
    // eslint-disable-next-line
    refresh();
    const interval = setInterval(refresh, 30_000);
    return () => clearInterval(interval);
  }, [refresh]);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = onChatMessage((msg) => {
      if (msg.senderId !== user.id) {
        setCount((prev) => prev + 1);
      }
    });
    return unsubscribe;
  }, [user]);

  return { count, refresh };
}
