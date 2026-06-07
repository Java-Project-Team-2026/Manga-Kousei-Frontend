import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ConfirmDialog } from "../dialog/ConfirmDialog";
import {
  Banknote,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  LayoutGrid,
  LibraryBig,
  LogOut,
  PenTool,
  Plus,
  Settings,
  TrendingUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import "./Sidebar.scss";

interface MenuItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const currentRole = user?.role || "ADMIN";

  const menuConfig: Record<string, MenuItem[]> = {
    MANGAKA: [
      { path: "/dashboard", label: "Bảng điều khiển", icon: LayoutGrid },
      { path: "/manage", label: "Quản lý Tác phẩm", icon: LibraryBig },
      { path: "/approvals", label: "Không gian Phê duyệt", icon: ClipboardCheck },
      { path: "/schedule", label: "Lịch trình Xuất bản", icon: CalendarDays },
      { path: "/reports", label: "Báo cáo Kinh doanh", icon: TrendingUp },
    ],
    ADMIN: [
      { path: "/dashboard", label: "Bảng điều khiển", icon: LayoutGrid },
      { path: "/approve", label: "Xét duyệt Dự án mới", icon: ClipboardCheck },
      { path: "/rating", label: "Đánh giá & Sinh tồn", icon: TrendingUp },
      { path: "/management", label: "Quản lý Số Tạp chí", icon: BookOpen },
      { path: "/finance", label: "Tài chính & Hợp đồng", icon: Banknote },
    ],
  };

  const currentMenus = menuConfig[currentRole] || menuConfig.ADMIN;

  const handleConfirmLogout = async () => {
    setShowConfirmLogout(false);
    await logout();
  };

  return (
    <>
      <aside className="sidebar-container">
        <div className="sidebar-top">
          <div className="brand-logo">
            <div className="icon-wrapper">
              <PenTool size={19} color="white" />
            </div>
            <div className="brand-text">
              <span className="brand-title">Manga Kousei</span>
              <span className="brand-subtitle">Production Studio</span>
            </div>
          </div>

          {currentRole === "MANGAKA" && (
            <button className="create-btn">
              <Plus size={18} />
              <span>Tạo Tác phẩm Mới</span>
            </button>
          )}

          <nav className="menu-nav">
            {currentMenus.map((menu) => {
              const Icon = menu.icon;

              return (
                <NavLink
                  key={menu.path}
                  to={menu.path}
                  className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}
                >
                  <Icon size={19} className="menu-icon" />
                  <span>{menu.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-bottom">
          <button className="create-btn meeting-btn" type="button">
            <Plus size={18} />
            <span>Mở phiên họp</span>
          </button>
          <div className="divider" />

          <NavLink to="/setting" className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}>
            <Settings size={19} className="menu-icon" />
            <span>Cài đặt</span>
          </NavLink>

          <button onClick={() => setShowConfirmLogout(true)} className="menu-item logout-btn" type="button">
            <LogOut size={19} className="menu-icon" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>
      <ConfirmDialog
        isOpen={showConfirmLogout}
        title="Xác nhận đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?"
        confirmText="Đăng xuất"
        cancelText="Hủy"
        onConfirm={handleConfirmLogout}
        onCancel={() => setShowConfirmLogout(false)}
      />
    </>
  );
};
