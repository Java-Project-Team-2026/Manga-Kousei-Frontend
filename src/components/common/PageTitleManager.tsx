import { useEffect } from "react";
import { useLocation, matchPath } from "react-router-dom";

const BASE_TITLE = "Manga Kousei";

const PAGE_TITLES: { path: string; title: string }[] = [
  { path: "/login", title: "Đăng nhập" },
  { path: "/unauthorized", title: "Không có quyền truy cập" },
  { path: "/dashboard", title: "Bảng điều khiển" },
  { path: "/profile", title: "Hồ sơ cá nhân" },
  { path: "/setting", title: "Cài đặt" },
  { path: "/help", title: "Trợ giúp" },
  { path: "/activity-history", title: "Lịch sử hoạt động" },

  { path: "/admin/dashboard", title: "Bảng điều khiển" },
  { path: "/admin/approvals", title: "Xét duyệt dự án" },
  { path: "/admin/proposal-review", title: "Duyệt Bản Name" },
  { path: "/admin/proposal-review/:proposalId", title: "Duyệt Bản Name" },
  {
    path: "/admin/schedule-assignment/:proposalId",
    title: "Phân công Lịch trình",
  },
  { path: "/admin/personnel", title: "Quản lý Nhân sự" },

  { path: "/tantou/dashboard", title: "Bảng điều khiển" },
  { path: "/tantou/manage", title: "Quản lý Tác phẩm" },
  { path: "/tantou/approvals", title: "Không gian Phê duyệt" },
  { path: "/tantou/proposal-review", title: "Đề xuất mới" },
  { path: "/tantou/proposal-review/:proposalId", title: "Đề xuất mới" },
  { path: "/tantou/schedule", title: "Lịch trình Xuất bản" },
  { path: "/tantou/reports", title: "Báo cáo Kinh doanh" },
  { path: "/tantou/series/:seriesId/chapters", title: "Quản lý Chapters" },

  { path: "/mangaka/dashboard", title: "Bảng điều khiển" },
  { path: "/mangaka/series", title: "Tác phẩm" },
  { path: "/mangaka/series/:id", title: "Chi tiết Tác phẩm" },
  { path: "/mangaka/schedule", title: "Lịch trình" },
  { path: "/mangaka/assistants", title: "Nhân sự" },
  { path: "/mangaka/reports", title: "Báo cáo" },
  { path: "/mangaka/create-work", title: "Tạo Tác phẩm Mới" },
  { path: "/mangaka/series/:seriesId/chapters", title: "Quản lý Chapters" },
  {
    path: "/mangaka/series/:seriesId/chapters/:chapterId/pages",
    title: "Quản lý Trang",
  },

  { path: "/assistant/dashboard", title: "Bảng điều khiển" },
  { path: "/assistant/income", title: "Thu nhập" },
  { path: "/assistant/invitations", title: "Lời mời" },
  { path: "/assistant/tasks", title: "Công việc của tôi" },
];

export function PageTitleManager() {
  const location = useLocation();

  useEffect(() => {
    const matched = PAGE_TITLES.find((route) =>
      matchPath({ path: route.path, end: true }, location.pathname),
    );

    document.title = matched ? `${matched.title} — ${BASE_TITLE}` : BASE_TITLE;
  }, [location.pathname]);

  return null;
}
