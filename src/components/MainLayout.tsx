import { Outlet } from "react-router-dom";
import { Header } from "./header/Header";
import { Sidebar } from "./sidebar/Sidebar"; // Import Sidebar vào

export const MainLayout = () => {
  return (
    // Container ngoài cùng: Flex dòng (Row)
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* 1. CỘT TRÁI: Sidebar (Cố định chiều ngang 260px trong CSS rồi) */}
      <Sidebar />

      {/* 2. CỘT PHẢI: Chứa Header và Ruột trang */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header nằm trên cùng của cột phải */}
        <Header />

        {/* Ruột trang thay đổi theo Router nằm dưới Header */}
        <main style={{ padding: "24px", flex: 1, backgroundColor: "#f3f4f6" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
