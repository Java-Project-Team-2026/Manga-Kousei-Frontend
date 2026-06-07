import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Eye,
  GripVertical,
  Layers3,
  MessageSquareText,
  MoreVertical,
  Printer,
  Send,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import "./AdminMagazines.scss";

type DetailView = "progress" | "budget" | "deadline" | "backlog";

type WorkItem = {
  id: number;
  title: string;
  issue: string;
  chapter: string;
  pages: number;
  note: string;
  status: string;
  statusTone: "blue" | "red" | "amber";
  editor: string;
  comment: string;
};

const initialWorkItems: WorkItem[] = [
  {
    id: 1,
    title: "Kaisen No Shiro",
    issue: "Tập 14",
    chapter: 'Chương 142: "The Broken Vow"',
    pages: 24,
    note: "Lead color page",
    status: "ĐANG VẼ LẠI",
    statusTone: "red",
    editor: "Editor Mori",
    comment:
      "Cần vẽ lại khung 3-5 ở trang 12 để đồng nhất ánh sáng với cảnh mở đầu.",
  },
  {
    id: 2,
    title: "Neon Samurai",
    issue: "Tập 9",
    chapter: 'Chương 89: "Circuit Overload"',
    pages: 19,
    note: "Regular B&W",
    status: "XEM XÉT BÌA",
    statusTone: "blue",
    editor: "Editor Tanaka",
    comment:
      "Đội thiết kế đang so màu bản in thử, ưu tiên khóa bìa trước 18:00 hôm nay.",
  },
  {
    id: 3,
    title: "Void Walker",
    issue: "Tập 22",
    chapter: 'Chương 22: "Echoes of Reality"',
    pages: 20,
    note: "Regular B&W",
    status: "HẾT TRANG MÀU",
    statusTone: "amber",
    editor: "Editor Sato",
    comment:
      "Đã vượt quota trang màu. Cần chuyển hai spread cuối sang B&W hoặc xin duyệt thêm ngân sách.",
  },
  {
    id: 4,
    title: "Digital Soul",
    issue: "Tập 12",
    chapter: 'Chương 12: "The First Login"',
    pages: 32,
    note: "One shot / new series",
    status: "CHƯA NỘP FILE",
    statusTone: "red",
    editor: "Editor Arai",
    comment:
      "Tác giả báo trễ bản final. Nếu quá 21:00 cần đẩy xuống slot dự phòng.",
  },
];

const detailCopy: Record<
  DetailView,
  { title: string; description: string; rows: string[] }
> = {
  progress: {
    title: "Tiến độ tổng thể",
    description: "65% hoàn thành trên toàn bộ chiến dịch phát hành số 1.",
    rows: ["Biên tập: 82%", "Thiết kế: 58%", "In ấn: 35%"],
  },
  budget: {
    title: "Chi phí dự kiến",
    description: "120.000.000đ, đang dùng 60% ngân sách đã phê duyệt.",
    rows: ["Bìa & màu: 32.000.000đ", "In thử: 18.000.000đ", "Quà tặng: 22.000.000đ"],
  },
  deadline: {
    title: "Mốc thời gian",
    description: "Hạn chót file final vào 25/10/2023 - 18:00 JST.",
    rows: ["Còn 12 ngày", "Nhắc editor sau 48 giờ", "Khóa file in trước 24/10"],
  },
  backlog: {
    title: "Công việc tồn đọng",
    description: "7 đầu việc chưa hoàn tất, 3 việc đang có rủi ro cao.",
    rows: ["2 file tranh cần sửa", "1 bìa cần duyệt", "4 kiểm tra hậu cần"],
  },
};

export default function AdminMagazines() {
  const [activeView, setActiveView] = useState<DetailView>("progress");
  const [activeTab, setActiveTab] = useState<"worklist" | "timeline">(
    "worklist",
  );
  const [workItems, setWorkItems] = useState(initialWorkItems);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null);

  const activeDetail = detailCopy[activeView];
  const backlogCount = useMemo(
    () => workItems.filter((item) => item.status !== "HOÀN TẤT FILE").length,
    [workItems],
  );

  const moveItem = (targetId: number) => {
    if (draggedId === null || draggedId === targetId) {
      return;
    }

    setWorkItems((current) => {
      const fromIndex = current.findIndex((item) => item.id === draggedId);
      const toIndex = current.findIndex((item) => item.id === targetId);
      if (fromIndex < 0 || toIndex < 0) {
        return current;
      }

      const next = [...current];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  return (
    <section className="magazine-page">
      <div className="magazine-heading">
        <nav className="magazine-breadcrumb" aria-label="Breadcrumb">
          <a href="/admin/magazines">Quản lý Dự án</a>
          <ChevronRight size={14} />
          <a href="/admin/magazines">Dự án #101</a>
        </nav>

        <div className="magazine-title-row">
          <div>
            <p>Dự án: Hoshizora Chronicle - Số 1</p>
            <h1>CHIẾN DỊCH RA MẮT TRUYỆN TRANH MỚI</h1>
          </div>
          <button className="outline-action" type="button">
            <Eye size={17} />
            Xem chi tiết dự án
          </button>
        </div>
      </div>

      <div className="stat-grid" aria-label="Chỉ số dự án">
        <button
          className={`stat-card ${activeView === "progress" ? "active" : ""}`}
          type="button"
          onClick={() => setActiveView("progress")}
        >
          <span className="stat-icon">
            <TrendingUp size={19} />
          </span>
          <span>
            <b>Tiến độ tổng thể</b>
            <strong>65%</strong>
          </span>
          <span className="progress-ring" aria-hidden="true">
            <i />
          </span>
        </button>

        <button
          className={`stat-card ${activeView === "budget" ? "active" : ""}`}
          type="button"
          onClick={() => setActiveView("budget")}
        >
          <span className="stat-icon">
            <CircleDollarSign size={19} />
          </span>
          <span>
            <b>Chi phí</b>
            <strong>120.000.000đ</strong>
          </span>
          <span className="mini-bar" aria-label="60% ngân sách">
            <i />
          </span>
        </button>

        <button
          className={`stat-card ${activeView === "deadline" ? "active" : ""}`}
          type="button"
          onClick={() => setActiveView("deadline")}
        >
          <span className="stat-icon">
            <CalendarClock size={19} />
          </span>
          <span>
            <b>Hạn chót</b>
            <strong>Còn 12 ngày</strong>
          </span>
          <span className="mini-timeline" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </button>

        <button
          className={`stat-card ${activeView === "backlog" ? "active" : ""}`}
          type="button"
          onClick={() => setActiveView("backlog")}
        >
          <span className="stat-icon">
            <ClipboardList size={19} />
          </span>
          <span>
            <b>Công việc tồn đọng</b>
            <strong>{backlogCount} việc</strong>
          </span>
          <span className="backlog-stack" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </button>
      </div>

      <div className="magazine-layout">
        <main className="magazine-board">
          <section className="detail-panel" aria-live="polite">
            <div>
              <p>{activeDetail.title}</p>
              <h2>{activeDetail.description}</h2>
            </div>
            <ul>
              {activeDetail.rows.map((row) => (
                <li key={row}>
                  <Sparkles size={14} />
                  {row}
                </li>
              ))}
            </ul>
          </section>

          <div className="worklist-toolbar">
            <div>
              <h2>DANH SÁCH CÔNG VIỆC TRONG SỐ NÀY</h2>
              <p>Dựa trên "Sắp xếp thứ tự Series"</p>
            </div>
            <div className="segmented-tabs">
              <button
                className={activeTab === "worklist" ? "active" : ""}
                type="button"
                onClick={() => setActiveTab("worklist")}
              >
                <Layers3 size={15} />
                Công việc
              </button>
              <button
                className={activeTab === "timeline" ? "active" : ""}
                type="button"
                onClick={() => setActiveTab("timeline")}
              >
                <CalendarClock size={15} />
                Mốc thời gian
              </button>
            </div>
          </div>

          <section className={`tab-scene ${activeTab}`}>
            {activeTab === "worklist" ? (
              <div className="series-list">
                {workItems.map((item, index) => (
                  <article
                    className={`series-row ${
                      draggedId === item.id ? "dragging" : ""
                    }`}
                    draggable
                    key={item.id}
                    onDragStart={() => setDraggedId(item.id)}
                    onDragEnter={() => moveItem(item.id)}
                    onDragOver={(event) => event.preventDefault()}
                    onDragEnd={() => setDraggedId(null)}
                  >
                    <button
                      className="drag-handle"
                      type="button"
                      aria-label="Kéo để đổi thứ tự"
                    >
                      <GripVertical size={17} />
                    </button>
                    <span className="row-index">{String(index + 1).padStart(2, "0")}</span>
                    <div className="series-title">
                      <b>{item.title}</b>
                      <span>{item.issue}</span>
                      <small>{item.chapter}</small>
                    </div>
                    <div className="series-pages">
                      <strong>{item.pages} Trang</strong>
                      <em>{item.note}</em>
                    </div>
                    <button
                      className={`status-pill ${item.statusTone}`}
                      type="button"
                      onClick={() => setSelectedItem(item)}
                    >
                      {item.status}
                    </button>
                    <button className="row-menu" type="button" aria-label="Tùy chọn">
                      <MoreVertical size={17} />
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="timeline-view">
                <div>
                  <span>Hôm nay</span>
                  <strong>Khóa danh sách series</strong>
                  <p>Ưu tiên các truyện có trang màu hoặc bìa chưa duyệt.</p>
                </div>
                <div>
                  <span>21/10</span>
                  <strong>Nhận bản in thử</strong>
                  <p>So màu bìa, kiểm tra gáy sách và quà tặng kèm.</p>
                </div>
                <div>
                  <span>25/10</span>
                  <strong>Final deadline - 18:00 JST</strong>
                  <p>Gửi file hoàn chỉnh sang Dai Nippon Printing Co., Ltd.</p>
                </div>
              </div>
            )}
          </section>
        </main>

        <aside className="print-sidebar">
          <section className="side-panel">
            <h3>
              <Printer size={16} />
              Thông tin in ấn
            </h3>
            <div className="print-metric">
              <span>Số lượng bản in dự kiến</span>
              <strong>1.200.000 bản</strong>
            </div>
            <div className="print-metric">
              <span>Nhà máy đối tác</span>
              <strong>Dai Nippon Printing Co., Ltd.</strong>
            </div>
            <div className="print-metric">
              <span>Hạn chót file final</span>
              <strong>25/10/2023 - 18:00 JST</strong>
            </div>
            <div className="overall-status">
              <span>Trạng thái tổng thể</span>
              <i>
                <b />
              </i>
              <strong>65% Hoàn tất <small>420/640 Trang</small></strong>
            </div>
          </section>

          <section className="side-panel checklist">
            <h3>Kiểm tra hậu cần</h3>
            <p>
              <CheckCircle2 size={15} />
              Thiết kế bìa đã phê duyệt
            </p>
            <p>
              <CheckCircle2 size={15} />
              Quảng cáo nhà tài trợ còn 8 trang
            </p>
            <p className="warning">
              <AlertTriangle size={15} />
              Quà tặng kèm đang chờ mẫu
            </p>
          </section>

          <section className="notice-panel">
            <h3>Thông báo editorial board</h3>
            <p>Gửi thông báo nhắc nhở cho tất cả Editor có series chưa nộp file.</p>
            <button type="button">
              <Send size={15} />
              Gửi nhắc nhở khẩn cấp
            </button>
          </section>
        </aside>
      </div>

      {selectedItem && (
        <div
          className="status-modal-backdrop"
          onClick={() => setSelectedItem(null)}
          role="presentation"
        >
          <section
            className="status-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="status-title"
          >
            <button
              className="modal-close"
              type="button"
              onClick={() => setSelectedItem(null)}
              aria-label="Đóng"
            >
              <X size={18} />
            </button>
            <span className={`status-pill ${selectedItem.statusTone}`}>
              {selectedItem.status}
            </span>
            <h2 id="status-title">{selectedItem.title}</h2>
            <p className="modal-editor">
              <MessageSquareText size={16} />
              {selectedItem.editor}
            </p>
            <p>{selectedItem.comment}</p>
            <div className="modal-actions">
              <button type="button">Đổi trạng thái</button>
              <button type="button" onClick={() => setSelectedItem(null)}>
                Đã nắm
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
