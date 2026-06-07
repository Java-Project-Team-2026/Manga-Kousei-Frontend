import { AlertCircle, Trophy } from "lucide-react";
import "./AdminEditorial.scss";

const topSeries = [
  {
    rank: "01",
    title: "Hành Trình Vô Tận",
    meta: "FANTASY • 12.5 Tỷ ¥",
    trend: "+25%",
    cover: "https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&w=96&q=80",
  },
  {
    rank: "02",
    title: "Giai Điệu Mùa Hạ",
    meta: "ROMANCE • 8.9 Tỷ ¥",
    trend: "+18%",
    cover: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=96&q=80",
  },
  {
    rank: "03",
    title: "Thành Phố Tội Lỗi",
    meta: "DETECTIVE • 7.4 Tỷ ¥",
    trend: "+5%",
    cover: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=96&q=80",
  },
];

const redAlerts = [
  { title: "Chiến Binh Rồng", note: "Lượt đọc -45% trong 3 tháng qua", cta: "Xét duyệt Axe" },
  { title: "Bí Ẩn Kim Tự Tháp", note: "Trễ deadline nộp bản thảo 12 ngày", cta: "Cảnh cáo tác giả" },
  { title: "Siêu Năng Lực", note: "Rating trung bình: 1.5/5 (N=2,400)", cta: "Đổi chiến lược" },
];

export default function AdminDashboard() {
  return (
    <div className="editorial-page dashboard-page">
      <header className="editorial-hero">
        <div>
          <h1>Tổng Quan Tòa Soạn</h1>
          <p>Giám sát hiệu suất kinh doanh và quản trị nội dung tòa soạn.</p>
        </div>
        <div className="hero-actions">
          <button>Xuất báo cáo</button>
          <button className="outline">Quản lý dòng tiền</button>
        </div>
      </header>

      <section className="dashboard-stats">
        <article className="panel revenue-card">
          <span className="eyebrow">Tổng doanh thu (lũy kế năm)</span>
          <strong>84.49</strong>
          <b>Tỷ ¥ • Kết thúc Tháng 10/2023</b>
          <div className="mini-bars">
            <span style={{ width: "64%" }}></span>
            <span className="pink" style={{ width: "28%" }}></span>
            <span className="violet" style={{ width: "18%" }}></span>
          </div>
          <em>+12.4%</em>
        </article>

        <article className="panel blue-card market-card">
          <span>Thị phần & vị thế</span>
          <div>
            <strong>#2</strong>
            <b>Top 5 NXB</b>
          </div>
          <p>"Vượt mục tiêu quý 5.2%. Hiện đang thu hẹp khoảng cách với Shueisha VN."</p>
        </article>

        <article className="panel reserve-card">
          <span className="eyebrow">Ngân sách dự phòng (Q4)</span>
          <div className="donut">70%<small>Còn lại</small></div>
          <strong>21.5 Tỷ ¥</strong>
          <b>Sắp giải ngân tiền bản quyền tháng 11</b>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="panel cashflow-panel">
          <div className="panel-title-row">
            <h2>Dòng tiền thu/chi (theo quý)</h2>
            <div className="legend"><span></span>Thu <span className="pink"></span>Chi</div>
          </div>
          <div className="bar-groups">
            {[
              ["Q1 2023", 62, 36],
              ["Q2 2023", 54, 40],
              ["Q3 2023", 74, 32],
              ["Q4 (EST)", 33, 18],
            ].map(([label, income, expense]) => (
              <div className="bar-group" key={label}>
                <div className="bars">
                  <span style={{ height: `${income}%` }}></span>
                  <span className="pink" style={{ height: `${expense}%` }}></span>
                </div>
                <b>{label}</b>
              </div>
            ))}
          </div>
        </article>

        <article className="panel blue-card journal-panel">
          <h2>Nhật ký quyết định</h2>
          {[
            "Phê duyệt chuyển thể Anime cho series \"Hành Trình Vô Tận\". Ngân sách: 12 Tỷ ¥.",
            "Ngừng phát hành (Axed) series \"Bóng Ma Trường Học\" do lượt đọc giảm 40% trong 4 tuần.",
            "Ký kết tác giả mới (Golden Rookie) - Hợp đồng độc quyền 3 năm.",
          ].map((item, index) => (
            <div className="timeline-item" key={item}>
              <span>{15 - index * 3} Oct, 2023</span>
              <p>{item}</p>
            </div>
          ))}
          <button>Xem toàn bộ nhật ký</button>
        </article>

        <article className="panel ranking-panel">
          <h2><Trophy size={22} /> Bảng phong thần (Top 3)</h2>
          {topSeries.map((series) => (
            <div className="rank-row" key={series.rank}>
              <strong>{series.rank}</strong>
              <img src={series.cover} alt="" />
              <div>
                <b>{series.title}</b>
                <span>{series.meta}</span>
              </div>
              <em>{series.trend}</em>
            </div>
          ))}
        </article>

        <article className="panel danger-panel">
          <h2><AlertCircle size={22} /> Báo động đỏ (nguy kịch)</h2>
          {redAlerts.map((alert) => (
            <div className="alert-row" key={alert.title}>
              <div>
                <b>{alert.title}</b>
                <span>{alert.note}</span>
              </div>
              <button>{alert.cta}</button>
            </div>
          ))}
        </article>
      </section>
    </div>
  );
}
