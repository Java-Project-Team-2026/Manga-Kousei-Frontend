import { AlertCircle, CheckCircle2, Dot } from "lucide-react";
import "./AdminPages.scss";

const topManga = [
  ["01", "Hành Trình Vô Tận", "Fantasy - 12.5 tỷ", "+25%"],
  ["02", "Giai Điệu Mùa Hạ", "Romance - 8.9 tỷ", "+18%"],
  ["03", "Thành Phố Tội Lỗi", "Detective - 7.4 tỷ", "+5%"],
];

const alerts = [
  ["Chiến Binh Rồng", "Lượt đọc: -45% trong 3 tháng qua", "Xét duyệt Axe"],
  ["Bí Ẩn Kim Tự Tháp", "Trễ deadline nộp bản thảo 12 ngày", "Cảnh cáo tác giả"],
  ["Siêu Năng Lực", "Rating trung bình: 1.5/5 (N=2,400)", "Đổi chiến lược"],
];

export default function AdminDashboard() {
  return (
    <div className="admin-screen dashboard-screen">
      <section className="page-heading">
        <div>
          <h1>Tổng quan tòa soạn</h1>
          <p>Giám sát hiệu suất kinh doanh và quản trị nội dung tòa soạn.</p>
        </div>
        <div className="heading-actions">
          <button type="button">Xuất báo cáo</button>
          <button className="outline" type="button">Quản lý dòng tiền</button>
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="stat-card revenue-card">
          <span>Tổng doanh thu (lũy kế năm)</span>
          <strong>84.49</strong>
          <small>Tỷ ¥ - Kết thúc tháng 10/2023</small>
          <b>+12.4%</b>
          <div className="mini-bars">
            <i /><i /><i />
          </div>
        </article>

        <article className="stat-card blue-card">
          <span>Thị phần & vị thế</span>
          <strong>#2 <em>Top 5 NXB</em></strong>
          <p>Vượt mục tiêu quý 5.2%. Hiện đang thu hẹp khoảng cách với Shueisha VN.</p>
        </article>

        <article className="stat-card reserve-card">
          <span>Ngân sách dự phòng (Q4)</span>
          <div className="donut">70%</div>
          <strong>21.5 tỷ ¥</strong>
          <small>Sắp giải ngân tiền bản quyền tháng 11</small>
        </article>

        <article className="panel cashflow-panel">
          <header>
            <h2>Dòng tiền thu/chi (theo quý)</h2>
            <span><i className="income" /> Thu <i className="cost" /> Chi</span>
          </header>
          <div className="bar-chart">
            {["Q1 2023", "Q2 2023", "Q3 2023", "Q4 (Est)"].map((quarter, index) => (
              <div className="bar-group" key={quarter}>
                <div className="bar-wrap">
                  <i className="bar income" style={{ height: `${62 + index * 8}px` }} />
                  <i className="bar cost" style={{ height: `${42 + (index % 2) * 8}px` }} />
                </div>
                <span>{quarter}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel log-panel">
          <h2>Nhật ký quyết định</h2>
          <ul>
            <li><Dot />15 Oct, 2023 - Phê duyệt chuyển thể Anime cho series Hành Trình Vô Tận.</li>
            <li><Dot />12 Oct, 2023 - Ngừng phát hành series Bóng Ma Trường Học do lượt đọc giảm.</li>
            <li><Dot />10 Oct, 2023 - Ký kết tác giả mới Golden Rookie.</li>
          </ul>
          <button type="button">Xem toàn bộ nhật ký</button>
        </article>

        <article className="panel ranking-panel">
          <h2><CheckCircle2 size={20} /> Bảng phong thần (Top 3)</h2>
          {topManga.map(([rank, title, meta, growth]) => (
            <div className="rank-row" key={rank}>
              <strong>{rank}</strong>
              <div className="cover" />
              <div>
                <b>{title}</b>
                <span>{meta}</span>
              </div>
              <em>{growth}</em>
            </div>
          ))}
        </article>

        <article className="panel danger-panel">
          <h2><AlertCircle size={20} /> Báo động đỏ (nguy kịch)</h2>
          {alerts.map(([title, meta, action]) => (
            <div className="alert-row" key={title}>
              <div>
                <b>{title}</b>
                <span>{meta}</span>
              </div>
              <button type="button">{action}</button>
            </div>
          ))}
        </article>
      </section>
    </div>
  );
}
