import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useLogout } from "../../hooks/useLogout";
import { ConfirmDialog } from "../dialog/ConfirmDialog";
import {
  Search,
  CircleHelp,
  MessageSquareText,
  Bell,
  UserRound,
  LogOut,
  History,
  Settings,
  ShieldCheck,
  BookOpenCheck,
  CheckCheck,
  Loader2,
  MessagesSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotificationCount } from "../../hooks/useNotificationCount";
import {
  fetchMyNotifications,
  markAllRead,
  markOneRead,
  type NotificationItem,
} from "../../services/notificationService";
import {
  onChatMessage,
  onNotification,
} from "../../services/notificationSocket";
import "./Header.scss";
import {
  fetchConversations,
  type ConversationItem,
} from "../../services/chatService";
import { useUnreadMessagesCount } from "../../hooks/useUnreadMessagesCount";
import ChatWindow from "../chat/ChatWindow";

export const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [activeUtility, setActiveUtility] = useState<
    "help" | "messages" | "notifications" | null
  >(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const utilityRef = useRef<HTMLDivElement>(null);

  const { count: notifCount, refresh: refreshCount } = useNotificationCount();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const { count: msgCount, refresh: refreshMsgCount } =
    useUnreadMessagesCount();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [convLoading, setConvLoading] = useState(false);
  const [openChat, setOpenChat] = useState<ConversationItem | null>(null);
  const [notifLoading, setNotifLoading] = useState(false);

  const {
    showConfirmLogout,
    handleLogoutClick,
    handleConfirmLogout,
    handleCancelLogout,
  } = useLogout();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setShowPopup(false);
      }
      if (
        utilityRef.current &&
        !utilityRef.current.contains(event.target as Node)
      ) {
        setActiveUtility(null);
      }
    };
    if (showPopup || activeUtility) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPopup, activeUtility]);

  useEffect(() => {
    if (activeUtility !== "notifications") return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNotifLoading(true);
    fetchMyNotifications()
      .then(setNotifications)
      .catch(() => setNotifications([]))
      .finally(() => setNotifLoading(false));
  }, [activeUtility]);

  useEffect(() => {
    const unsubscribe = onNotification((newNotif) => {
      setNotifications((prev) => [newNotif, ...prev]);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (activeUtility !== "messages") return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConvLoading(true);
    fetchConversations()
      .then(setConversations)
      .catch(() => setConversations([]))
      .finally(() => setConvLoading(false));
  }, [activeUtility]);

  useEffect(() => {
    const unsubscribe = onChatMessage((msg) => {
      setConversations((prev) => {
        const idx = prev.findIndex(
          (c) => c.conversationId === msg.conversationId,
        );
        if (idx === -1) return prev;

        const updated = [...prev];
        const isMine = msg.senderId === user?.id;
        updated[idx] = {
          ...updated[idx],
          lastMessagePreview: msg.content,
          lastMessageAt: msg.createdAt,
          unreadCount: isMine
            ? updated[idx].unreadCount
            : updated[idx].unreadCount + 1,
        };

        const [item] = updated.splice(idx, 1);
        return [item, ...updated];
      });
    });
    return unsubscribe;
  }, [user?.id]);

  const handleOpenConversation = (conv: ConversationItem) => {
    setActiveUtility(null);
    setOpenChat(conv);
    setConversations((prev) =>
      prev.map((c) =>
        c.conversationId === conv.conversationId ? { ...c, unreadCount: 0 } : c,
      ),
    );
    refreshMsgCount();
  };

  const handleMarkAllRead = async () => {
    await markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    refreshCount();
  };

  const handleMarkOneRead = async (id: number) => {
    await markOneRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.notificationId === id ? { ...n, isRead: true } : n)),
    );
    refreshCount();
  };

  const handleProfileClick = () => {
    setShowPopup(false);
    setActiveUtility(null);
    navigate("/profile");
  };

  const handleActivityHistoryClick = () => {
    setShowPopup(false);
    setActiveUtility(null);
    navigate("/activity-history");
  };

  const goTo = (path: string) => {
    setActiveUtility(null);
    setShowPopup(false);
    navigate(path);
  };

  const role = user?.role;
  const reviewPath =
    role === "ADMIN"
      ? "/admin/proposal-review"
      : role === "TANTOU"
        ? "/tantou/proposal-review"
        : role === "MANGAKA"
          ? "/mangaka/series"
          : "/dashboard";

  const toggleUtility = (panel: "help" | "messages" | "notifications") => {
    setShowPopup(false);
    setActiveUtility((current) => (current === panel ? null : panel));
  };

  return (
    <header className="header-container">
      <div className="search-box">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          placeholder="Tìm kiếm series, báo cáo..."
          className="search-input"
        />
      </div>

      <div className="header-right">
        <div className="icon-group" ref={utilityRef}>
          <button
            className={`icon-btn ${activeUtility === "help" ? "active" : ""}`}
            type="button"
            aria-label="Mở trợ giúp"
            onClick={() => toggleUtility("help")}
          >
            <CircleHelp size={22} strokeWidth={1.5} />
          </button>

          <button
            className={`icon-btn chat-btn ${activeUtility === "messages" ? "active" : ""}`}
            type="button"
            aria-label="Mở tin nhắn"
            onClick={() => toggleUtility("messages")}
          >
            <MessageSquareText size={22} strokeWidth={1.5} />
            {msgCount > 0 && <span className="red-dot"></span>}
          </button>

          <button
            className={`icon-btn header-bell ${activeUtility === "notifications" ? "active" : ""}`}
            type="button"
            aria-label="Mở thông báo"
            onClick={() => toggleUtility("notifications")}
          >
            <Bell size={22} strokeWidth={1.5} />
            {notifCount > 0 && (
              <span className="header-bell__badge">
                {notifCount > 99 ? "99+" : notifCount}
              </span>
            )}
          </button>

          {activeUtility === "help" && (
            <div className="header-popover header-popover--utility">
              <div className="header-popover__header">
                <div>
                  <strong>Trợ giúp nhanh</strong>
                  <span>Các lối tắt thường dùng</span>
                </div>
              </div>
              <div className="header-action-list">
                <button type="button" onClick={() => goTo("/setting")}>
                  <Settings size={17} />
                  <span>Cài đặt hệ thống</span>
                </button>
                <button type="button" onClick={handleProfileClick}>
                  <ShieldCheck size={17} />
                  <span>Kiểm tra hồ sơ & bảo mật</span>
                </button>
                <button type="button" onClick={() => goTo(reviewPath)}>
                  <BookOpenCheck size={17} />
                  <span>Mở khu vực xét duyệt</span>
                </button>
              </div>
            </div>
          )}

          {activeUtility === "messages" && (
            <div className="header-popover header-popover--utility">
              <div className="header-popover__header">
                <div>
                  <strong>Hộp tin nội bộ</strong>
                  <span>
                    {msgCount > 0
                      ? `${msgCount} tin nhắn chưa đọc`
                      : "Không có tin mới"}
                  </span>
                </div>
              </div>
              <div className="header-message-list">
                {convLoading ? (
                  <div className="header-notif__empty">
                    <Loader2 size={18} className="header-notif__spin" />
                    <span>Đang tải...</span>
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="header-notif__empty">
                    <MessagesSquare size={28} strokeWidth={1.2} />
                    <span>Chưa có cuộc trò chuyện nào</span>
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <button
                      type="button"
                      key={conv.conversationId}
                      onClick={() => handleOpenConversation(conv)}
                    >
                      <strong>
                        {conv.otherUserName}
                        {conv.unreadCount > 0 && (
                          <span className="header-message-list__badge">
                            {conv.unreadCount}
                          </span>
                        )}
                      </strong>
                      <span>
                        {conv.lastMessagePreview ?? "Chưa có tin nhắn"}
                      </span>
                      {conv.lastMessageAt && (
                        <time>
                          {new Date(conv.lastMessageAt).toLocaleString(
                            "vi-VN",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </time>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {activeUtility === "notifications" && (
            <div className="header-popover header-popover--utility header-popover--notif">
              <div className="header-popover__header">
                <div>
                  <strong>Thông báo</strong>
                  <span>
                    {notifCount > 0
                      ? `${notifCount} chưa đọc`
                      : "Không có thông báo mới"}
                  </span>
                </div>
                {notifCount > 0 && (
                  <button
                    type="button"
                    className="header-notif__mark-all"
                    onClick={handleMarkAllRead}
                    title="Đánh dấu tất cả đã đọc"
                  >
                    <CheckCheck size={15} />
                  </button>
                )}
              </div>

              <div className="header-notif-list">
                {notifLoading ? (
                  <div className="header-notif__empty">
                    <Loader2 size={18} className="header-notif__spin" />
                    <span>Đang tải...</span>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="header-notif__empty">
                    <Bell size={28} strokeWidth={1.2} />
                    <span>Chưa có thông báo nào</span>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <button
                      key={notif.notificationId}
                      type="button"
                      className={`header-notif-item ${!notif.isRead ? "header-notif-item--unread" : ""}`}
                      onClick={() => {
                        if (!notif.isRead)
                          handleMarkOneRead(notif.notificationId);
                      }}
                    >
                      {!notif.isRead && (
                        <span className="header-notif-item__dot" />
                      )}
                      <span className="header-notif-item__body">
                        <strong>{notif.title}</strong>
                        <small>{notif.message}</small>
                        <time>{notif.createdAt}</time>
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="divider"></div>

        <div className="user-profile-wrapper" ref={popupRef}>
          <div
            className="user-profile"
            onClick={() => setShowPopup((prev) => !prev)}
          >
            <div className="user-info">
              <span className="user-name">{user?.fullName || "Khách"}</span>
              <span className="user-role">{user?.role || "Chưa rõ"}</span>
            </div>
            <img
              src={
                user?.avatarUrl ??
                "https://ui-avatars.com/api/?name=User&background=4F6EF7&color=fff"
              }
              alt="User Avatar"
              className="user-avatar"
            />
          </div>

          {showPopup && (
            <div className="profile-popup">
              <div className="popup-header">
                <div className="popup-avatar-wrapper">
                  <img
                    src={
                      user?.avatarUrl ??
                      "https://ui-avatars.com/api/?name=User&background=4F6EF7&color=fff"
                    }
                    alt="User Avatar"
                    className="popup-avatar"
                  />
                </div>
                <div className="popup-user-info">
                  <span className="popup-user-name">
                    {user?.fullName || "Kousei Admin"}
                  </span>
                  <span className="popup-user-email">
                    {user?.email || "kousei.admin@hathong.vn"}
                  </span>
                  <span className="popup-user-role">
                    {user?.role || "ADMIN"}
                  </span>
                </div>
              </div>

              <div className="popup-divider" />

              <ul className="popup-menu">
                <li className="popup-menu-item" onClick={handleProfileClick}>
                  <UserRound size={16} strokeWidth={1.5} />
                  <span>Hồ sơ của bạn</span>
                </li>
                <li
                  className="popup-menu-item"
                  onClick={handleActivityHistoryClick}
                >
                  <History size={16} strokeWidth={1.5} />
                  <span>Lịch sử hoạt động</span>
                </li>
                <li
                  className="popup-menu-item popup-menu-item--danger"
                  onClick={handleLogoutClick}
                >
                  <LogOut size={16} strokeWidth={1.5} />
                  <span>Đăng xuất</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirmLogout}
        title="Xác nhận đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?"
        confirmText="Đăng xuất"
        cancelText="Hủy"
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
      {openChat && (
        <ChatWindow conversation={openChat} onClose={() => setOpenChat(null)} />
      )}
    </header>
  );
};
