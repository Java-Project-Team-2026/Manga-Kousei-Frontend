import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { roleDashboardMap } from "../constants/rolePaths";

export const DashboardRedirect = () => {
  const { user, loading, isAuthenticated } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  const dashboardPath = roleDashboardMap[user.role];
  if (!dashboardPath) return <Navigate to="/unauthorized" replace />;

  return <Navigate to={dashboardPath} replace />;
};
