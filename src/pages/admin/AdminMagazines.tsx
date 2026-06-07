import {
  CheckCircle2,
  GripVertical,
  MoreVertical,
  Printer,
  Send,
  SquareCheckBig,
  XCircle,
} from "lucide-react";
import "./AdminEditorial.scss";

const lineup = [
  {
    order: "01",
    title: "Kaisen No Shiro",
    chapter: "Chương 142: \"The Broken Vow\"",
    pages: "24 Trang",
    type: "Lead Color Page",
    status: "Hoàn tất file",
    statusType: "done",
  },
  {
    order: "02",
    title: "Neon Samurai",
    chapter: "Chương 89: \"Circuit Overload\"",
    pages: "19 Trang",
    type: "Regular B&W",
    status: "Đang chỉnh sửa",
    statusType: "editing",
  },
  {
    order: "03",
    title: "Void Walker",
    chapter: "Chương 22: \"Echoes of Reality\"",
    pages: "20 Trang",
    type: "Regular B&W",
    status: "Hoàn tất file",
    statusType: "done",
  },
  {
    order: "04",
    title: "Digital Soul",
    chapter: "Chương 12: \"The First Login\"",
    pages: "32 Trang",
    type: "One Shot / New Series",
    status: "Chưa nộp file",
    statusType: "missing",
  },
];

export default function AdminMagazines() {
  return (
    <div className="editorial-page magazine-page">
      <header className="magazine-header">
        <div>
          <span>Quản lý số tạp chí › Số 45/2023</span>
          <h1>Line-up Số Tạp chí<br />#45/2023</h1>
          <div className="issue-badges">
            <b>Phân bổ trang: 420/420</b>
            <em>Hạn chót: 25/10/2023</em>
          </div>
        </div>
        <div className="magazine-actions">
          <button className="outline"><SquareCheckBig size={18} /> Xem trước line-up</button>
          <button><Printer size={18} /> Chốt số lượng & gửi in</button>
        </div>
      </header>

      <div className="magazine-layout">
        <main>
          <div className="lineup-strip">
            <span>Sắp xếp thứ tự series (kéo thả)</span>
            <b>20 series tổng cộng</b>
          </div>
          <section className="lineup-list">
            {lineup.map((item) => (
              <article className="lineup-item" key={item.order}>
                <GripVertical size={18} />
                <strong>{item.order}</strong>
                <div className="line-title">
                  <b>{item.title}</b>
                  <span>{item.chapter}</span>
                </div>
                <div className="line-pages">
                  <b>{item.pages}</b>
                  <em>{item.type}</em>
                </div>
                <div className={`line-status ${item.statusType}`}>
                  <i></i>{item.status}
                </div>
                <MoreVertical size={18} />
              </article>
            ))}
          </section>
        </main>

        <aside className="magazine-side">
          <section className="panel print-panel">
            <h2><Printer size={18} /> Thông tin in ấn</h2>
            <div className="info-box">
              <span>Số lượng bản in dự kiến</span>
              <strong>1.200.000<small>bản</small></strong>
            </div>
            <div className="info-box">
              <span>Nhà máy đối tác</span>
              <b>Dai Nippon Printing Co., Ltd.</b>
            </div>
            <div className="info-box">
              <span>Hạn chót chốt file (final deadline)</span>
              <b>25/10/2023 – 18:00 JST</b>
            </div>
            <div className="overall-status">
              <span>Trạng thái tổng thể</span>
              <div><i style={{ width: "75%" }}></i></div>
              <b>75% Hoàn tất <small>420/420 Trang</small></b>
            </div>
          </section>

          <section className="panel checklist-panel">
            <h2>Kiểm tra hậu cần</h2>
            <p><CheckCircle2 size={16} /> Thiết kế bìa đã phê duyệt</p>
            <p><CheckCircle2 size={16} /> Quảng cáo nhà tài trợ (6 trang)</p>
            <p className="bad"><XCircle size={16} /> Quà tặng kèm (Omake) - Đang chờ mẫu</p>
          </section>

          <section className="notice-panel">
            <span>Thông báo Editorial Board</span>
            <p>Gửi thông báo nhắc nhở cho tất cả các Editor có Series chưa nộp file?</p>
            <button><Send size={16} /> Gửi nhắc nhở khẩn cấp</button>
          </section>
        </aside>
      </div>
    </div>
  );
}
