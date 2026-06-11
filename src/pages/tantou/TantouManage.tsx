import "./TantouManage.scss";

const works = [
  {
    id: 1,
    title: "Neon Genesis...",
    genre: "HÀNH ĐỘNG / VIỄN TƯỞNG",
    status: "Đúng tiến độ",
    statusColor: "green",
    deadline: "12/10",
    chapter: "Chương 45 đang thực hiện",
    task: "Phác thảo bản Name_____",
    progress: 65,
    author: "Shinji Ikari",
    role: "Mangaka",
  },
  {
    id: 2,
    title: "Cafe Tokyo...",
    genre: "ĐỜI THƯỜNG",
    status: "Trễ hạn",
    statusColor: "red",
    deadline: "Hôm qua",
    chapter: "Chương 12 đang duyệt",
    task: "Chờ biên tập viên duyệt",
    progress: 90,
    author: "Satoshi Kon",
    role: "Mangaka",
  },

  {
    id: 3,
    title: "Blade of the...",
    genre: "FANTASY / CHUYỂN SINH",
    status: "Tiền sản xuất",
    statusColor: "blue",
    deadline: "05/11",
    chapter: "Bản thảo Chương 1",
    task: "Thiết kế nhân vật",
    progress: 25,
    author: "Kentaro Miura",
    role: "Mangaka",
  },
];

export default function TantouManage() {
  return (
    <div className="tantou-manage">
      <span className="portfolio-tag">PORTFOLIO</span>

      <div className="page-header">
        <div>
          <h1>Quản lý Tác phẩm</h1>

          <p>
            Danh sách các bộ truyện manga đang trong quá trình sản xuất.
            Theo dõi tiến độ chương, thời hạn và trao đổi với mangaka.
          </p>
        </div>

        <div className="header-actions">
          <select>
            <option>Tất cả trạng thái</option>
          </select>

          <button>▦</button>
          <button>☰</button>
        </div>
      </div>

      <div className="works-grid">
        {works.map((work) => (
          <div
            key={work.id}
            className={`work-card ${work.statusColor}`}
          >
            <div className="card-top">
              <span className="genre">
                {work.genre}
              </span>

              <span
                className={`status ${work.statusColor}`}
              >
                ● {work.status}
              </span>
            </div>

            <div className="card-content">
            <div className="content-left">
              <h3 className="title">{work.title}</h3>

            <div className="deadline-inline">
      Hạn: {work.deadline}
    </div>
  </div>

  <div className="thumbnail-placeholder" />
</div>
          
            <div className="deadline-row">
              
            </div>

            <div className="chapter-row">
  <span>{work.chapter}</span>

  <span
    className={`deadline-mini ${
      work.id === 2 ? "overdue" : ""
    }`}
  >
    Hạn: {work.deadline}
  </span>
</div>
            <div className="progress-bar">
              <div
                className={`progress-fill ${work.statusColor}`}
                style={{
                  width: `${work.progress}%`,
                }}
              />
            </div>

           <div className={`task-row ${work.statusColor === "red" ? "task-red" : ""}`}>
  <span>{work.task}</span>
  <span className="progress-text">
    Hoàn thành {work.progress}%
  </span>
</div>

            <div className="author-row">
              <div className="author-info">
                <div className="avatar">
                  👤
                </div>

                <div>
                  <h4>{work.author}</h4>
                  <p>{work.role}</p>
                </div>
              </div>

              <button
                className={
                  work.statusColor === "red"
                    ? "warning-btn"
                    : "message-btn"
                }
              >
                {work.statusColor === "red"
                  ? "!"
                  : "✉"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button>{"<"}</button>

        <button className="active">
          1
        </button>

        <button>2</button>
        <button>3</button>

        <button>{">"}</button>
      </div>
    </div>
  );
}