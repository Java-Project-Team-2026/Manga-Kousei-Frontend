import { Outlet } from "react-router-dom";
import { Header } from "../header/Header";
import { Sidebar } from "../sidebar/Sidebar";

export const MainLayout = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header />

        <main
          style={{
            flex: 1,
            backgroundColor: "#f3f4f6",
            overflowY: "auto",
            minHeight: 0,
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};
