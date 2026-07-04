import { useEffect, useState } from "react";
import {
  fetchMyNotifications,
  type NotificationItem,
} from "../services/notificationService";
import {
  connectNotificationSocket,
  disconnectNotificationSocket,
  onNotification,
} from "../services/notificationSocket";
import { useAuth } from "./useAuth";

export function useRealtimeNotifications() {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchMyNotifications().then(setNotifications).catch(console.error);
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    connectNotificationSocket();
    const unsubscribe = onNotification((newNotif) => {
      setNotifications((prev) => [newNotif, ...prev]);
    });

    return () => {
      unsubscribe();
      disconnectNotificationSocket();
    };
  }, [isAuthenticated]);

  return notifications;
}
