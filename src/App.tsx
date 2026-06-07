import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import { ProtectedRoute } from "./components/Routes/ProtectedRoute";
import { PublicRoute } from "./components/Routes/PublicRoute";
import { MainLayout } from "./components/MainLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminRating from "./pages/admin/Rating";
import MagazineManagement from "./pages/admin/MagazineManagement";
import FinanceContracts from "./pages/admin/FinanceContracts";
import ReviewPage from "./pages/review/ReviewPage";
import TantouDashboard from "./pages/tantou/TantouDashboard";
import TantouManage from "./pages/tantou/TantouManage";
import TantouApprovals from "./pages/tantou/TantouApprovals";
import TantouSchedule from "./pages/tantou/TantouSchedule";
import TantouReports from "./pages/tantou/TantouReports";
import MangakaDashboard from "./pages/mangaka/MangakaDashboard";
import MangakaSeries from "./pages/mangaka/MangakaSeries";
import MangakaSchedule from "./pages/mangaka/MangakaSchedule";
import MangakaAssistants from "./pages/mangaka/MangakaAssistants";
import MangakaReports from "./pages/mangaka/MangakaReports";
import { Unauthorized } from "./pages/others/Unauthorized";
import { NotFound } from "./pages/others/NotFound";

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
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/approve" element={<ReviewPage />} />
          <Route path="/rating" element={<AdminRating />} />
          <Route path="/management" element={<MagazineManagement />} />
          <Route path="/finance" element={<FinanceContracts />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["TANTOU"]} />}>
          <Route path="/tantou/dashboard" element={<TantouDashboard />} />
          <Route path="/tantou/manage" element={<TantouManage />} />
          <Route path="/tantou/approvals" element={<TantouApprovals />} />
          <Route path="/tantou/schedule" element={<TantouSchedule />} />
          <Route path="/tantou/reports" element={<TantouReports />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["MANGAKA"]} />}>
          <Route path="/mangaka/dashboard" element={<MangakaDashboard />} />
          <Route path="/mangaka/series" element={<MangakaSeries />} />
          <Route path="/mangaka/schedule" element={<MangakaSchedule />} />
          <Route path="/mangaka/assistants" element={<MangakaAssistants />} />
          <Route path="/mangaka/reports" element={<MangakaReports />} />
        </Route>
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
