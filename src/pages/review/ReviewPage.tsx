import {
  Banknote,
  Bell,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Eye,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  PenLine,
  PenTool,
  Pencil,
  Plus,
  Search,
  Settings,
  TrendingUp,
  X,
} from "lucide-react";
import "./ReviewPage.scss";

const menuItems = [
  { label: "Bảng điều khiển", icon: LayoutDashboard },
  { label: "Xét duyệt Dự án mới", icon: ClipboardCheck, active: true },
  { label: "Đánh giá & Sinh tồn", icon: TrendingUp },
  { label: "Quản lý Số Tạp chí", icon: BookOpen },
  { label: "Tài chính & Hợp đồng", icon: Banknote },
];

const projects = [
  {
    title: "Huyết Chiến Thành Shinjuku",
    code: "#SHJ-042",
    author: "Kuro-san",
    status: "Sẵn sàng",
    progress: 82,
    active: true,
  },
  {
    title: "Mùa Hạ Không Màu",
    code: "#SUM-009",
    author: "Aoki Yuki",
    status: "Chờ duyệt",
    progress: 45,
  },
  {
    title: "Cyberpunk: DaLat 2077",
    code: "#CPK-112",
    author: "V-Studio",
    status: "Chờ duyệt",
    progress: 12,
  },
];

const chapters = [
  { code: "C01", title: "Khởi đầu của bóng tối" },
  { code: "C02", title: "Lưỡi kiếm rỉ sét" },
  { code: "C03", title: "Hồi ức Shinjuku" },
];

export default function ReviewPage() {
  return (
    <div className="approve-page">
      <aside className="approve-sidebar">
        <div>
          <div className="approve-brand">
            <div className="approve-brand__icon">
              <PenTool size={22} />
            </div>
            <div>
              <h1>Manga Kousei</h1>
              <p>Production Studio</p>
            </div>
          </div>

          <nav className="approve-nav">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <button className={item.active ? "active" : ""} key={item.label} type="button">
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="approve-sidebar__footer">
          <button className="meeting-button" type="button">
            <Plus size={20} />
            <span>Mở phiên họp</span>
          </button>
          <div className="approve-divider" />
          <button type="button">
            <Settings size={20} />
            <span>Cài đặt</span>
          </button>
          <button type="button">
            <LogOut size={20} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      <div className="approve-workspace">
        <header className="approve-topbar">
          <label className="approve-search">
            <Search size={20} />
            <input placeholder="Tìm kiếm series, báo cáo..." type="search" />
          </label>

          <div className="approve-topbar__right">
            <button aria-label="Trợ giúp" type="button">
              <CircleHelp size={20} />
            </button>
            <button aria-label="Tin nhắn" className="has-dot" type="button">
              <MessageSquareText size={20} />
            </button>
            <button aria-label="Thông báo" type="button">
              <Bell size={20} />
            </button>
            <div className="approve-profile">
              <div>
                <strong>Kousei Studio</strong>
                <span>Admin</span>
              </div>
              <div className="approve-avatar" />
            </div>
          </div>
        </header>

        <main className="approve-content">
          <section className="project-queue">
            <div className="queue-title">
              <h2>Đang chờ duyệt</h2>
              <span>3 Dự án</span>
            </div>

            <div className="queue-list">
              {projects.map((project) => (
                <article className={`queue-card ${project.active ? "active" : ""}`} key={project.code}>
                  <div className="queue-card__top">
                    <div>
                      <h3>{project.title}</h3>
                      <p>
                        ID: {project.code} • Tác giả: {project.author}
                      </p>
                    </div>
                    <span className={project.active ? "status-ready" : "status-waiting"}>
                      {project.status}
                    </span>
                  </div>
                  <div className="vote-row">
                    <strong>Phiếu thuận hiện tại</strong>
                    <b>{project.progress}%</b>
                  </div>
                  <div className="vote-progress">
                    <span style={{ width: `${project.progress}%` }} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="review-detail">
            <div className="detail-heading">
              <div>
                <Eye size={20} />
                <h2>Dự án ID #SHJ-042 đang xem xét</h2>
              </div>
              <div className="detail-tags">
                <span>Biên tập</span>
                <span>Tiếp thị</span>
              </div>
            </div>

            <div className="detail-grid">
              <article className="review-box summary-box">
                <header>
                  <FileText size={22} />
                  <h3>Tóm tắt kịch bản</h3>
                </header>
                <p>
                  Bối cảnh Tokyo tương lai năm 2045, nơi các Samurai cơ khí hóa
                  đấu tranh giành quyền kiểm soát nguồn năng lượng vô tận tại
                  Shinjuku. Nhân vật chính là một cựu binh mất trí nhớ, sở hữu
                  thanh kiếm cổ đại có khả năng cắt đứt cả không gian. Cốt truyện
                  tập trung vào sự phản bội, danh dự và bản chất của con người
                  trong kỷ nguyên máy móc.
                </p>
              </article>

              <article className="review-box sketch-box">
                <header>
                  <PenLine size={22} />
                  <h3>Phác thảo nhân vật</h3>
                </header>
                <div className="samurai-sketch" aria-label="Phác thảo nhân vật samurai">
                  <span className="sketch-circle" />
                  <span className="hair hair-one" />
                  <span className="hair hair-two" />
                  <span className="hair hair-three" />
                  <span className="face">
                    <i className="eye-left" />
                    <i className="eye-right" />
                    <i className="mouth" />
                  </span>
                  <span className="neck" />
                  <span className="armor armor-left" />
                  <span className="armor armor-right" />
                  <span className="robe robe-left" />
                  <span className="robe robe-right" />
                  <span className="blade-line blade-one" />
                  <span className="blade-line blade-two" />
                </div>
              </article>
            </div>

            <article className="review-box chapters-box">
              <header>
                <div>
                  <BookOpen size={23} />
                  <h3>3 chương name đầu tiên (bản thảo)</h3>
                </div>
                <div className="chapter-controls">
                  <button aria-label="Trước" type="button">
                    <ChevronLeft size={21} />
                  </button>
                  <button aria-label="Sau" type="button">
                    <ChevronRight size={21} />
                  </button>
                </div>
              </header>

              <div className="chapter-grid">
                {chapters.map((chapter) => (
                  <div className="chapter-tile" key={chapter.code}>
                    <strong>{chapter.code}</strong>
                    <span>{chapter.title}</span>
                  </div>
                ))}
              </div>
            </article>

            <div className="decision-actions">
              <button className="reject" type="button">
                <X size={24} />
                <span>Từ chối</span>
              </button>
              <button className="revise" type="button">
                <Pencil size={22} />
                <span>Cần sửa đổi</span>
              </button>
              <button className="approve" type="button">
                <CheckCircle2 size={23} />
                <span>Bỏ phiếu Đồng ý</span>
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
