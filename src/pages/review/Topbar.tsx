import { Bell, CircleHelp, MessageSquareText, Search } from "lucide-react";

export default function Topbar() {
  return (
    <header className="review-topbar">
      <label className="review-search">
        <Search size={20} />
        <input placeholder="Tìm kiếm series, báo cáo..." type="search" />
      </label>

      <div className="topbar-actions">
        <button aria-label="Trợ giúp" type="button">
          <CircleHelp size={20} />
        </button>
        <button aria-label="Tin nhắn" className="has-dot" type="button">
          <MessageSquareText size={20} />
        </button>
        <button aria-label="Thông báo" type="button">
          <Bell size={20} />
        </button>
        <div className="topbar-profile">
          <div>
            <strong>Kousei Studio</strong>
            <span>Admin</span>
          </div>
          <div className="profile-photo" />
        </div>
      </div>
    </header>
  );
}
