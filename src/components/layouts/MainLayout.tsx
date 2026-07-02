import { Outlet } from "react-router-dom";
import { Header } from "../header/Header";
import { Sidebar } from "../sidebar/Sidebar";
import { useRealtimeNotifications } from "../../hooks/useRealtimeNotifications";
import "./MainLayout.scss";
export const MainLayout = () => {
  useRealtimeNotifications();

  return (
    <div className="main-layout">
      <Sidebar />

      <div className="main-layout__body">
        <Header />

        <main className="main-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
