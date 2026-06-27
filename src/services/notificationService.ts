import api from "./api";

interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface NotificationItem {
  notificationId: number;
  title: string;
  message: string;
  notificationType: string;
  isRead: boolean;
  createdAt: string;
}

export const fetchMyNotifications = (): Promise<NotificationItem[]> =>
  api
    .get<ApiResponse<NotificationItem[]>>("/notifications")
    .then((r) => r.data.data ?? []);

export const fetchUnreadCount = (): Promise<number> =>
  api
    .get<ApiResponse<{ count: number }>>("/notifications/unread-count")
    .then((r) => r.data.data.count);

export const markAllRead = (): Promise<void> =>
  api.patch("/notifications/mark-all-read");

export const markOneRead = (id: number): Promise<void> =>
  api.patch(`/notifications/${id}/read`);
