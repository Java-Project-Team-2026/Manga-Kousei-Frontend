import { AlertTriangle, ArrowRight, CheckCircle2, FileArchive, FileText, Gift } from "lucide-react";
import "./AdminPages.scss";

const payments = [
  ["NS", "Nakamura Sora", "04 Chương (#121-124)", "45.000.000 VNĐ", "Chờ duyệt"],
  ["KT", "Kenji Takahashi", "01 Chương (Special)", "12.500.000 VNĐ", "Đã duyệt"],
  ["ML", "Minh Lê", "08 Chương (#50-57)", "88.200.000 VNĐ", "Chờ duyệt"],
];

const contractTypes = [
  { icon: FileText, title: "Hợp đồng độc quyền", desc: "124 hồ sơ hiện hành" },
  { icon: FileArchive, title: "Bản quyền Anime", desc: "12 dự án sản xuất" },
  { icon: Gift, title: "Vật phẩm thương mại", desc: "85 nhãn hiệu đăng ký" },
];

export default function FinanceContracts() {
  return (
    <div className="admin-screen finance-screen">
      <h1>Trung tâm tài chính</h1>
      <section className="finance-grid">
        <article className="panel finance-kpi">
          <span>Tổng chi nhuận bút tháng này</span>
          <strong>2.45B <em>VNĐ</em></strong>
          <small>+12.5% so với tháng 09/2023</small>
          <div>
            <b>Tiến độ thanh toán</b>
            <i><em style={{ width: "82%" }} /></i>
            <strong>82%</strong>
          </div>
        </article>

        <article className="legal-alert">
          <AlertTriangle size={24} />
          <h2>Cảnh báo pháp lý</h2>
          <p>Phát hiện vi phạm bản quyền: "Hắc Ấn Thuật" đang bị phát tán trái phép trên 03 nền tảng lậu.</p>
          <button type="button">Xử lý ngay</button>
        </article>

        <article className="panel payment-panel">
          <header>
            <h2>Phê duyệt thanh toán</h2>
            <a href="#">Xem tất cả</a>
          </header>
          {payments.map(([initials, name, chapters, amount, status]) => (
            <div className="payment-row" key={name}>
              <strong>{initials}</strong>
              <b>{name}</b>
              <span>{chapters}</span>
              <em>{amount}</em>
              <i className={status === "Đã duyệt" ? "approved" : ""}>{status}</i>
              <CheckCircle2 size={20} />
            </div>
          ))}
        </article>

        <aside className="contract-store">
          <h2>Kho lưu trữ hợp đồng</h2>
          {contractTypes.map(({ icon: ContractIcon, title, desc }) => {
            return (
              <article key={title}>
                <ContractIcon size={24} />
                <div><b>{title}</b><span>{desc}</span></div>
                <ArrowRight size={20} />
              </article>
            );
          })}
          <div className="ip-chart">
            <span>Chỉ số bảo vệ bản quyền (IP)</span>
            <div><i /><i /><i /><i /><i /></div>
            <b>98.2% An toàn / Đã bảo hộ</b>
          </div>
        </aside>

        <article className="schedule-panel">
          <h2>Lịch thanh toán định kỳ</h2>
          <div>
            <p><span>Chỉ số bảo vệ bản quyền (IP)</span><b>15/10/2023</b><em>65 Tác giả - 1.2B VNĐ</em></p>
            <p><span>Chỉ số bảo vệ bản quyền (IP)</span><b>28/10/2023</b><em>42 Tác giả - 0.8B VNĐ</em></p>
            <p><span>Chỉ số bảo vệ bản quyền (IP)</span><b>05/11/2023</b><em>Dự kiến - 0.45B VNĐ</em></p>
          </div>
        </article>
      </section>
    </div>
  );
}
