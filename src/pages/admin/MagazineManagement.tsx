import { Eye, GripVertical, MoreVertical, Printer } from "lucide-react";
import "./AdminPages.scss";

const lineup = [
  ["01", "Kaisen No Shiro", "Chương 142: The Broken Vow", "24 Trang", "Lead color page", "Hoàn tất file"],
  ["02", "Neon Samurai", "Chương 89: Circuit Overload", "19 Trang", "Regular B&W", "Đang chỉnh sửa"],
  ["03", "Void Walker", "Chương 22: Echoes of Reality", "20 Trang", "Regular B&W", "Hoàn tất file"],
  ["04", "Digital Soul", "Chương 12: The First Login", "32 Trang", "One Shot / New Series", "Chưa nộp file"],
];

export default function MagazineManagement() {
  return (
    <div className="admin-screen magazine-screen">
      <section className="magazine-heading">
        <div>
          <p>Quản lý số tạp chí / <b>Số 45/2023</b></p>
          <h1>Line-up Số Tạp chí #45/2023</h1>
          <div><span>Phân bổ trang: 420/420</span><span>Hạn chót: 25/10/2023</span></div>
        </div>
        <button className="outline" type="button"><Eye size={18} /> Xem trước line-up</button>
        <button type="button"><Printer size={18} /> Chốt số lượng & gửi in</button>
      </section>

      <section className="magazine-grid">
        <div>
          <div className="lineup-toolbar">
            <span>Sắp xếp thứ tự series (kéo thả)</span>
            <b>20 series tổng cộng</b>
          </div>
          <div className="lineup-list">
            {lineup.map(([order, title, chapter, pages, type, status]) => (
              <article className="lineup-card" key={order}>
                <GripVertical size={18} />
                <strong>{order}</strong>
                <div><b>{title}</b><span>{chapter}</span></div>
                <p>{pages}<em>{type}</em></p>
                <i className={status.includes("Chưa") ? "late" : status.includes("Đang") ? "editing" : ""}>
                  {status}
                </i>
                <MoreVertical size={18} />
              </article>
            ))}
          </div>
        </div>

        <aside className="print-sidebar">
          <article className="panel print-info">
            <h2>Thông tin in ấn</h2>
            <div><span>Số lượng bản in dự kiến</span><b>1.200.000 bản</b></div>
            <div><span>Nhà máy đối tác</span><b>Dai Nippon Printing Co., Ltd.</b></div>
            <div><span>Hạn chót chốt file</span><b>25/10/2023 - 18:00 JST</b></div>
            <label>
              <span>Trạng thái tổng thể</span>
              <i><em style={{ width: "75%" }} /></i>
              <b>75% Hoàn tất <small>420/420 Trang</small></b>
            </label>
          </article>

          <article className="panel checklist">
            <h2>Kiểm tra hậu cần</h2>
            <p>Thiết kế bìa đã phê duyệt</p>
            <p>Quảng cáo nhà tài trợ (6 trang)</p>
            <p className="late">Quà tặng kèm (Omakae) - Đang chờ mẫu</p>
          </article>

          <article className="panel notify-box">
            <h2>Thông báo Editorial Board</h2>
            <p>Gửi thông báo nhắc nhở cho tất cả các Editor có Series chưa nộp file?</p>
            <button type="button">Gửi nhắc nhở khẩn cấp</button>
          </article>
        </aside>
      </section>
    </div>
  );
}
