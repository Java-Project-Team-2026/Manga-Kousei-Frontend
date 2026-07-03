export interface LandingOption {
  value: string;
  label: string;
  path: string;
}

export const landingOptionsByRole: Record<string, LandingOption[]> = {
  ADMIN: [
    { value: "dashboard", label: "Bảng điều khiển", path: "/admin/dashboard" },
    {
      value: "approvals",
      label: "Không gian xét duyệt",
      path: "/admin/approvals",
    },
    { value: "personnel", label: "Nhân sự", path: "/admin/personnel" },
  ],
  TANTOU: [
    { value: "dashboard", label: "Bảng điều khiển", path: "/tantou/dashboard" },
    {
      value: "approvals",
      label: "Không gian xét duyệt",
      path: "/tantou/approvals",
    },
    { value: "schedule", label: "Lịch trình", path: "/tantou/schedule" },
    { value: "reports", label: "Báo cáo", path: "/tantou/reports" },
  ],
  MANGAKA: [
    {
      value: "dashboard",
      label: "Bảng điều khiển",
      path: "/mangaka/dashboard",
    },
    { value: "series", label: "Tác phẩm", path: "/mangaka/series" },
    { value: "schedule", label: "Lịch trình", path: "/mangaka/schedule" },
    { value: "reports", label: "Báo cáo", path: "/mangaka/reports" },
  ],
  ASSISTANT: [
    {
      value: "dashboard",
      label: "Bảng điều khiển",
      path: "/assistant/dashboard",
    },
    { value: "tasks", label: "Nhiệm vụ", path: "/assistant/tasks" },
    { value: "income", label: "Thu nhập", path: "/assistant/income" },
    { value: "invitations", label: "Lời mời", path: "/assistant/invitations" },
  ],
};

export function resolveLandingPath(role: string, value: string): string {
  const options = landingOptionsByRole[role] ?? [];
  const found = options.find((o) => o.value === value);
  if (found) return found.path;

  const fallback = options.find((o) => o.value === "dashboard");
  return fallback?.path ?? "/dashboard";
}
