// src/pages/redirect/DashboardRedirect.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { roleDashboardMap } from "../../constants/rolePaths";
import { resolveLandingPath } from "../../constants/landingOptions";
import { FullScreenLoader } from "../../components/common/FullScreenLoader";

const STORAGE_KEY = "manga-kousei-settings";

function readLandingSetting(): string {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return "dashboard";
    const parsed = JSON.parse(raw);
    return parsed.dashboardLanding ?? "dashboard";
  } catch {
    return "dashboard";
  }
}

export const DashboardRedirect = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <FullScreenLoader text="Đang kiểm tra phiên đăng nhập..." />;
  }

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  const dashboardPath = roleDashboardMap[user.role];
  if (!dashboardPath) return <Navigate to="/unauthorized" replace />;

  // MỚI: đọc "Trang mở mặc định" đã lưu ở Settings, thay vì luôn về
  // đúng /{role}/dashboard. resolveLandingPath() tự fallback an toàn
  // về dashboard nếu value không hợp lệ với role hiện tại (vd dữ liệu
  // cũ, hoặc admin đổi role user).
  const landingValue = readLandingSetting();
  const targetPath = resolveLandingPath(user.role, landingValue);

  return <Navigate to={targetPath} replace />;
};
