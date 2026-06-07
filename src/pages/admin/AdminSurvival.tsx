import {
  AlertTriangle,
  Bell,
  CalendarDays,
  Filter,
  Search,
  Scissors,
  Sparkles,
  Timer,
} from "lucide-react";
import "./AdminEditorial.scss";

const mangaRows = [
  {
    title: "Blue Lock: Neo Saga",
    author: "Yusuke Nomura",
    rank: "#1",
    trend: "up",
    inventory: 12,
    inventoryNote: "(Sắp hết)",
    views: "840.2K",
    status: "Đang bùng nổ",
    statusType: "hot",
    action: "Lên trang bìa",
    secondary: "Tankoubon",
    cover:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=96&q=80",
  },
  {
    title: "Chân Trời Cũ",
    author: "K. Matsu",
    rank: "#14",
    trend: "flat",
    inventory: 45,
    inventoryNote: "(Ổn định)",
    views: "112.5K",
    status: "Tiềm năng",
    statusType: "stable",
    action: "Theo dõi thêm",
    secondary: "Tankoubon",
    cover:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=96&q=80",
  },
  {
    title: "Diệt Vong Ký",
    author: "T. Sato",
    rank: "#42",
    trend: "down",
    inventory: 88,
    inventoryNote: "(Tồn kho cao)",
    views: "12.1K",
    status: "Nguy cấp",
    statusType: "danger",
    action: "Khai tử (Axe)",
    secondary: "",
    cover:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=96&q=80",
  },
];

const forecastWeeks = [
  { label: "Tuần 1", height: 62, tone: "base" },
  { label: "Tuần 2", height: 78, tone: "base" },
  { label: "Tuần 3", height: 47, tone: "base" },
  { label: "Tuần 4", height: 94, tone: "base" },
  { label: "Dự báo T11", height: 83, tone: "dark" },
];

export default function AdminSurvival() {
  return (
    <div className="editorial-page survival-page">
      <header className="survival-header">
        <div>
          <h1>Tháng 10/2023: Xếp hạng & Đào thải</h1>
          <p>
            <CalendarDays size={17} /> Kỳ tổng duyệt Quý 4 - Phân tích hiệu
            suất sinh tồn manga
          </p>
        </div>

        <div className="survival-header-actions">
          <div className="deadline-card">
            <Timer size={22} />
            <span>Hạn chót Axe kỳ này</span>
            <strong>48:12:03</strong>
          </div>
          <button className="header-icon-btn" aria-label="Thông báo">
            <Bell size={22} />
          </button>
          <img
            src="https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?auto=format&fit=crop&w=96&q=80"
            alt="Admin"
          />
        </div>
      </header>

      <section className="survival-top">
        <article className="panel forecast-card">
          <div className="panel-title-row">
            <div>
              <h2>Dự báo lưu hành Quý tới</h2>
              <p>Dữ liệu phân tích dựa trên lượt xem Digital & Tiền đặt trước</p>
            </div>
            <div className="toggle-pills">
              <span>Tankoubon</span>
              <span>Digital</span>
            </div>
          </div>

          <div className="forecast-bars">
            {forecastWeeks.map((week, index) => (
              <div className={`forecast-item ${week.tone}`} key={week.label}>
                <span style={{ height: `${week.height}%` }}>
                  <i></i>
                </span>
                <b>{week.label}</b>
                {index === 4 && <em>Dự kiến bùng nổ</em>}
              </div>
            ))}
          </div>
        </article>

        <aside className="survival-metrics">
          <article className="panel metric-card">
            <Sparkles size={26} />
            <strong>2.4M</strong>
            <span>Tổng lượt xem trực tuyến</span>
            <em>+12.5%</em>
          </article>

          <article className="panel collapse-card">
            <AlertTriangle size={26} />
            <strong>Cấp độ Đỏ</strong>
            <span>Đang trong vùng nguy cấp</span>
            <em>3 dự án</em>
          </article>
        </aside>
      </section>

      <section className="panel ranking-table-card">
        <div className="table-toolbar">
          <h2>
            Bảng tổng hợp xếp hạng manga
            <br />
            (Tháng 10)
          </h2>
          <div className="table-actions">
            <label>
              <Search size={16} />
              <input placeholder="Tìm kiếm tựa truyện..." />
            </label>
            <button>
              <Filter size={17} /> Lọc
            </button>
          </div>
        </div>

        <table className="survival-table">
          <thead>
            <tr>
              <th>Tên truyện</th>
              <th>Xếp hạng khảo sát</th>
              <th>Tỷ lệ tồn kho</th>
              <th>Lượt xem Digital</th>
              <th>Trạng thái</th>
              <th>Hành động vĩ mô</th>
            </tr>
          </thead>
          <tbody>
            {mangaRows.map((row) => (
              <tr key={row.title}>
                <td>
                  <div className="manga-title-cell">
                    <img src={row.cover} alt="" />
                    <div>
                      <b>{row.title}</b>
                      <span>Tác giả: {row.author}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <strong className={`rank ${row.trend}`}>{row.rank}</strong>
                </td>
                <td>
                  <div className={`inventory ${row.statusType}`}>
                    <span>
                      <i style={{ width: `${row.inventory}%` }}></i>
                    </span>
                    <b>{row.inventory}%</b>
                    <small>{row.inventoryNote}</small>
                  </div>
                </td>
                <td>
                  <b>{row.views}</b>
                </td>
                <td>
                  <span className={`survival-status ${row.statusType}`}>
                    {row.status}
                  </span>
                </td>
                <td>
                  <div className="row-actions">
                    <button className={row.statusType === "danger" ? "danger" : ""}>
                      {row.statusType === "danger" ? (
                        <Scissors size={15} />
                      ) : row.statusType === "hot" ? (
                        <Sparkles size={15} />
                      ) : null}
                      {row.action}
                    </button>
                    {row.secondary && <button className="outline">{row.secondary}</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <footer className="table-footer">
          <span>Hiển thị 3 trên tổng số 48 dự án đang lưu hành.</span>
          <div>
            <button>‹</button>
            <button className="active">1</button>
            <button>2</button>
            <button>3</button>
            <button>›</button>
          </div>
        </footer>
      </section>
    </div>
  );
}
