import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  FolderOpen,
  FileText,
  Film,
  ShoppingBag,
  CheckCircle,
} from "lucide-react";
import "./FinanceContracts.scss";

export default function AdminContracts() {
  const approvals = [
    {
      id: "NS",
      name: "Nakamura Sora",
      chapters: "04 Chương",
      details: "(#121-124)",
      amount: "45.000.000 VNĐ",
      status: "CHỜ DUYỆT",
      statusType: "pending",
      avatarColor: "#0254b1",
    },
    {
      id: "KT",
      name: "Kenji Takahashi",
      chapters: "01 Chương",
      details: "(Special)",
      amount: "12.500.000 VNĐ",
      status: "ĐÃ DUYỆT",
      statusType: "approved",
      avatarColor: "#c7d2fe",
    },
    {
      id: "ML",
      name: "Minh Lê",
      chapters: "08 Chương",
      details: "(#50-57)",
      amount: "88.200.000 VNĐ",
      status: "CHỜ DUYỆT",
      statusType: "pending",
      avatarColor: "#4f46e5",
    },
  ];

  return (
    <div className="finance-dashboard">
      <div className="main-column">
        <div className="card summary-card">
          <div className="summary-left">
            <h3 className="card-subtitle">TỔNG CHI NHUẬN BÚT THÁNG NÀY</h3>
            <div className="amount-wrapper">
              <span className="amount">2.45B</span>
              <span className="currency">VNĐ</span>
            </div>
            <div className="trend">
              <span className="trend-badge positive">
                <TrendingUp size={14} strokeWidth={2.5} /> +12.5%
              </span>
              <span className="trend-text">so với tháng 09/2023</span>
            </div>
          </div>
          <div className="summary-right">
            <div className="progress-header">
              <span>TIẾN ĐỘ THANH TOÁN</span>
              <span className="progress-percent">82%</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: "82%" }}></div>
            </div>
          </div>
        </div>

        <div className="card table-card">
          <div className="card-header">
            <h2 className="card-title">Phê duyệt thanh toán</h2>
            <a href="#" className="view-all">
              Xem tất cả &gt;
            </a>
          </div>
          <table className="approval-table">
            <thead>
              <tr>
                <th>MANGAKA</th>
                <th>SỐ CHƯƠNG</th>
                <th>SỐ TIỀN</th>
                <th>TRẠNG THÁI</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {approvals.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div className="mangaka-info">
                      <div
                        className="avatar"
                        style={{
                          backgroundColor: item.avatarColor,
                          color: item.id === "KT" ? "#1e1b4b" : "#fff",
                        }}
                      >
                        {item.id}
                      </div>
                      <span className="mangaka-name">{item.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="chapter-info">
                      <span className="chapter-count">{item.chapters}</span>
                      <span className="chapter-details">{item.details}</span>
                    </div>
                  </td>
                  <td>
                    <span className="money-amount">{item.amount}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${item.statusType}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="action-cell">
                    {item.statusType === "pending" ? (
                      <CheckCircle2 className="action-icon pending" size={24} />
                    ) : (
                      <CheckCircle className="action-icon approved" size={24} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card schedule-card">
          <h2 className="schedule-title">Lịch thanh toán định kỳ</h2>
          <div className="schedule-grid">
            <div className="schedule-item line-blue">
              <span className="schedule-label">
                CHỈ SỐ BẢO VỆ BẢN QUYỀN (IP)
              </span>
              <span className="schedule-date">15/10/2023</span>
              <span className="schedule-subtext">65 Tác giả • 1.2B VNĐ</span>
            </div>
            <div className="schedule-item line-gray">
              <span className="schedule-label">
                CHỈ SỐ BẢO VỆ BẢN QUYỀN (IP)
              </span>
              <span className="schedule-date">28/10/2023</span>
              <span className="schedule-subtext">42 Tác giả • 0.8B VNĐ</span>
            </div>
            <div className="schedule-item line-pink">
              <span className="schedule-label">
                CHỈ SỐ BẢO VỆ BẢN QUYỀN (IP)
              </span>
              <span className="schedule-date">05/11/2023</span>
              <span className="schedule-subtext highlight">
                Dự kiến • 0.45B VNĐ
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="sidebar-column">
        <div className="card alert-card">
          <div className="alert-header">
            <AlertTriangle className="alert-icon" size={20} strokeWidth={2.5} />
            <h3 className="alert-title">CẢNH BÁO PHÁP LÝ</h3>
          </div>
          <p className="alert-description">
            Phát hiện vi phạm bản quyền:
            <br />
            <strong>"Hắc Ẩn Thuật"</strong> đang bị phát tán trái phép trên 03
            nền tảng lậu (MangaD**, Truyen***).
          </p>
          <button className="btn-alert">XỬ LÝ NGAY</button>
        </div>

        <div className="card storage-card">
          <div className="storage-header">
            <FolderOpen className="storage-icon" size={24} />
            <h2 className="storage-title">
              Kho lưu trữ hợp
              <br />
              đồng
            </h2>
          </div>

          <div className="storage-list">
            <div className="storage-item">
              <div className="item-icon-wrapper">
                <FileText size={20} />
              </div>
              <div className="item-info">
                <h4 className="item-name">Hợp đồng độc quyền</h4>
                <p className="item-sub">124 hồ sơ hiện hành</p>
              </div>
              <ArrowRight className="item-arrow" size={20} />
            </div>

            <div className="storage-item">
              <div className="item-icon-wrapper blue">
                <Film size={20} />
              </div>
              <div className="item-info">
                <h4 className="item-name">Bản quyền Anime</h4>
                <p className="item-sub">12 dự án sản xuất</p>
              </div>
              <ArrowRight className="item-arrow" size={20} />
            </div>

            <div className="storage-item">
              <div className="item-icon-wrapper pink">
                <ShoppingBag size={20} />
              </div>
              <div className="item-info">
                <h4 className="item-name">Vật phẩm thương mại</h4>
                <p className="item-sub">85 nhãn hiệu đăng ký</p>
              </div>
              <ArrowRight className="item-arrow" size={20} />
            </div>
          </div>

          <div className="mini-chart-card">
            <span className="chart-title">CHỈ SỐ BẢO VỆ BẢN QUYỀN (IP)</span>
            <div className="bar-chart">
              <div className="bar" style={{ height: "40%" }}></div>
              <div className="bar" style={{ height: "70%" }}></div>
              <div className="bar" style={{ height: "30%" }}></div>
              <div className="bar" style={{ height: "85%" }}></div>
              <div className="bar" style={{ height: "50%" }}></div>
            </div>
            <span className="chart-status">
              <strong>98.2%</strong> An toàn / Đã bảo hộ
            </span>
          </div>
        </div>
      </div>

      <div className="dashboard-footer">
        <span className="footer-copyright">© 2026 Manga Kousei Co., Ltd.</span>
      </div>
    </div>
  );
}
