import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { roleDashboardMap } from "../../constants/rolePaths";
import { FullScreenLoader } from "../../components/common/FullScreenLoader";

export const DashboardRedirect = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <FullScreenLoader text="Đang kiểm tra phiên đăng nhập..." />;
  }

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  const dashboardPath = roleDashboardMap[user.role];
  if (!dashboardPath) return <Navigate to="/unauthorized" replace />;

  return <Navigate to={dashboardPath} replace />;
};
