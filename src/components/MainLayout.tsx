import { Outlet } from "react-router-dom";
import { Header } from "./header/Header";
import { Sidebar } from "./sidebar/Sidebar";
import "./MainLayout.scss";

export const MainLayout = () => {
  return (
    <div className="main-layout">
      <Sidebar />

      <div className="main-layout__workspace">
        <Header />

        <main className="main-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
