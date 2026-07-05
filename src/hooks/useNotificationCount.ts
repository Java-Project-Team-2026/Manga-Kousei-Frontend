import { useEffect, useState, useCallback } from "react";
import { useAuth } from "./useAuth";
import { fetchUnreadCount } from "../services/notificationService";
import { onNotification } from "../services/notificationSocket";

export function useNotificationCount() {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      const n = await fetchUnreadCount();
      setCount(n);
    } catch {
      // silent
    }
  }, [user]);

  const decrement = useCallback((by: number = 1) => {
    setCount((prev) => Math.max(0, prev - by));
  }, []);

  const reset = useCallback(() => {
    setCount(0);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    refresh();
    const interval = setInterval(refresh, 30_000);
    return () => clearInterval(interval);
  }, [refresh]);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = onNotification(() => {
      setCount((prev) => prev + 1);
    });
    return unsubscribe;
  }, [user]);

  return { count, refresh, decrement, reset };
}
