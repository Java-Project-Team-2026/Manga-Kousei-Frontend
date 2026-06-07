import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  PenLine,
  Pencil,
  X,
} from "lucide-react";
import "./ReviewPage.scss";

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
                      ID: {project.code} - Tác giả: {project.author}
                    </p>
                  </div>
                  <span className={project.active ? "status-ready" : "status-waiting"}>{project.status}</span>
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
                Bối cảnh Tokyo tương lai năm 2045, nơi các Samurai cơ khí hóa đấu tranh giành quyền kiểm soát
                nguồn năng lượng vô tận tại Shinjuku. Nhân vật chính là một cựu binh mất trí nhớ, sở hữu thanh
                kiếm cổ đại có khả năng cắt đứt cả không gian.
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
  );
}
