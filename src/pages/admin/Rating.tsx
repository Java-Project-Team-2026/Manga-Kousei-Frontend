import { Bell, CalendarDays, ChevronLeft, ChevronRight, Filter, Search, Timer } from "lucide-react";
import "./AdminPages.scss";

const rankingRows = [
  ["Blue Lock: Neo Saga", "Tác giả: Yusuke Nomura", "#1", "12% (Sắp hết)", "840.2K", "Đang bùng nổ"],
  ["Chân Trời Cũ", "Tác giả: K. Matsui", "#14", "45% (Ổn định)", "112.5K", "Tiềm năng"],
  ["Diệt Vong Ký", "Tác giả: T. Sato", "#42", "88% (Tồn kho cao)", "12.1K", "Ô nguy cấp"],
];

export default function AdminRating() {
  return (
    <div className="admin-screen rating-screen">
      <section className="rating-header">
        <div>
          <h1>Tháng 10/2023: Xếp hạng & đào thải</h1>
          <p><CalendarDays size={15} /> Kỳ tổng duyệt Quý 4 - Phân tích hiệu suất sinh tồn manga</p>
        </div>
        <div className="deadline-pill">
          <Timer size={18} />
          <span>Hạn chót Axe kỳ này</span>
          <strong>48:12:03</strong>
        </div>
        <Bell size={20} />
      </section>

      <section className="forecast-panel panel">
        <div>
          <h2>Dự báo lưu hành Quý tới</h2>
          <p>Dữ liệu phân tích dựa trên lượt xem Digital & Tiền đặt trước</p>
          <div className="forecast-bars">
            {[62, 78, 46, 95, 84].map((height, index) => (
              <span key={index} style={{ height: `${height}%` }}>
                <i />
              </span>
            ))}
          </div>
          <div className="week-labels">
            <span>Tuần 1</span><span>Tuần 2</span><span>Tuần 3</span><span>Tuần 4</span><b>Dự báo T11</b>
          </div>
        </div>
        <aside className="forecast-stats">
          <article>
            <b>2.4M</b>
            <span>Tổng lượt xem trực tuyến</span>
            <em>+12.5%</em>
          </article>
          <article className="risk-card">
            <b>Cấp độ Đỏ</b>
            <span>Đang trong vùng nguy cấp</span>
            <em>3 dự án</em>
          </article>
        </aside>
      </section>

      <section className="panel ranking-table-panel">
        <header>
          <h2>Bảng tổng hợp xếp hạng Manga (tháng 10)</h2>
          <div className="table-tools">
            <label>
              <Search size={15} />
              <input placeholder="Tìm kiếm tựa truyện..." />
            </label>
            <button type="button"><Filter size={16} /> Lọc</button>
          </div>
        </header>

        <div className="manga-table">
          <div className="table-head">
            <span>Tên truyện</span><span>Xếp hạng khảo sát</span><span>Tỷ lệ tồn kho</span><span>Lượt xem Digital</span><span>Trạng thái</span><span>Hành động vĩ mô</span>
          </div>
          {rankingRows.map(([title, author, rank, stock, views, status]) => (
            <div className="table-row" key={title}>
              <div className="title-cell">
                <div className="cover" />
                <div><b>{title}</b><span>{author}</span></div>
              </div>
              <strong className={rank === "#42" ? "danger-text" : ""}>{rank}</strong>
              <span>{stock}</span>
              <b>{views}</b>
              <em>{status}</em>
              <div className="row-actions">
                <button className={rank === "#42" ? "danger-action" : ""} type="button">
                  {rank === "#42" ? "Khai tử (Axe)" : "Lên trang bìa"}
                </button>
                {rank !== "#42" && <button type="button">Tankoubon</button>}
              </div>
            </div>
          ))}
        </div>
        <footer>
          <span>Hiển thị 3 trên tổng số 48 dự án đang lưu hành.</span>
          <div><ChevronLeft size={16} /><b>1</b><span>2</span><span>3</span><ChevronRight size={16} /></div>
        </footer>
      </section>
    </div>
  );
}
