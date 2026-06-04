import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { ProtectedRoute } from "./components/Routes/ProtectedRoute";
import { PublicRoute } from "./components/Routes/PublicRoute";
import { MainLayout } from "./components/layouts/MainLayout";
import AdminRating from "./pages/admin/AdminSurvival";
import MangakaDashboard from "./pages/mangaka/Dashboard";
import { DashboardRedirect } from "./pages/redirect/DashboardRedirect";
import AdminApprovalsPage from "./pages/admin/AdminApprovals";

function App() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Route>

      <Route path="/dashboard" element={<DashboardRedirect />} />

      <Route element={<MainLayout />}>
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin">
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="approvals" element={<AdminApprovalsPage />} />
            <Route path="survival" element={<AdminRating />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["MANGAKA"]} />}>
          <Route path="/mangaka">
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<MangakaDashboard />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
