import { useEffect, useState, useCallback } from "react";
import { useAuth } from "./useAuth";
import { fetchUnreadCount } from "../services/notificationService";

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

  useEffect(() => {
    // eslint-disable-next-line
    refresh();
    const interval = setInterval(refresh, 30_000);
    return () => clearInterval(interval);
  }, [refresh]);

  return { count, refresh };
}
