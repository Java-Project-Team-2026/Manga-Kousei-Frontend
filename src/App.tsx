import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/admin/Dashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import { MainLayout } from "./components/MainLayout";
import AdminRating from "./pages/admin/Rating";

function App() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Route>
      <Route element={<MainLayout />}>
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/rating" element={<AdminRating />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
