import {
  Banknote,
  BookOpen,
  ClipboardCheck,
  LogOut,
  PenTool,
  Plus,
  Settings,
  TrendingUp,
  LayoutDashboard,
} from "lucide-react";

const navItems = [
  { label: "Bảng điều khiển", icon: LayoutDashboard, active: false },
  { label: "Xét duyệt Dự án mới", icon: ClipboardCheck, active: true },
  { label: "Đánh giá & Sinh tồn", icon: TrendingUp, active: false },
  { label: "Quản lý Số Tạp chí", icon: BookOpen, active: false },
  { label: "Tài chính & Hợp đồng", icon: Banknote, active: false },
];

export default function Sidebar() {
  return (
    <aside className="review-sidebar">
      <div className="sidebar-content">
        <div className="review-brand">
          <div className="review-brand__mark">
            <PenTool size={22} />
          </div>
          <div>
            <h1>Manga Kousei</h1>
            <p>Production Studio</p>
          </div>
        </div>

        <nav className="review-nav">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                className={item.active ? "active" : ""}
                type="button"
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-footer">
        <button className="meeting-button" type="button">
          <Plus size={20} />
          Mở phiên họp
        </button>
        <div className="sidebar-divider" />
        <button type="button">
          <Settings size={20} />
          <span>Cài đặt</span>
        </button>
        <button type="button">
          <LogOut size={20} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
