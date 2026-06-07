import { Bell, CircleHelp, MessageSquareText, Search } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import "./Header.scss";

export const Header = () => {
  const { user } = useAuth();

  return (
    <header className="header-container">
      <label className="search-box">
        <Search className="search-icon" size={19} />
        <input type="text" placeholder="Tìm kiếm series, báo cáo..." className="search-input" />
      </label>

      <div className="header-right">
        <div className="icon-group">
          <button className="icon-btn" aria-label="Trợ giúp" type="button">
            <CircleHelp size={21} strokeWidth={1.7} />
          </button>
          <button className="icon-btn chat-btn" aria-label="Tin nhắn" type="button">
            <MessageSquareText size={21} strokeWidth={1.7} />
            <span className="red-dot" />
          </button>
          <button className="icon-btn" aria-label="Thông báo" type="button">
            <Bell size={21} strokeWidth={1.7} />
          </button>
        </div>

        <div className="header-divider" />

        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">{user?.fullName || "Kousei Studio"}</span>
            <span className="user-role">{user?.role || "Admin"}</span>
          </div>
          <img
            src="https://ui-avatars.com/api/?name=Kousei+Studio&background=0f172a&color=fff"
            alt="User Avatar"
            className="user-avatar"
          />
        </div>
      </div>
    </header>
  );
};
