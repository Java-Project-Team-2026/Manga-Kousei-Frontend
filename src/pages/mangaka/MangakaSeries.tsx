import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  Download,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import {
  fetchMySeries,
  type MangakaSeries,
} from "../../services/mangakaSeriesService";
import { getAvatarColor, getInitials } from "../../utils";
import "./MangakaSeries.scss";

const WEEKDAY_LABELS: Record<number, string> = {
  1: "Thứ 2",
  2: "Thứ 3",
  3: "Thứ 4",
  4: "Thứ 5",
  5: "Thứ 6",
  6: "Thứ 7",
  7: "CN",
};

function scheduleLabel(type: string | null, day: number | null): string {
  if (!type || day === null) return "Chưa có lịch";
  if (type === "weekly")
    return `${WEEKDAY_LABELS[day] ?? `Thứ ${day}`} hàng tuần`;
  return `Ngày ${day} hàng tháng`;
}

function statusMeta(status: string | null) {
  switch (status) {
    case "approved":
      return { label: "Đang hoạt động", cls: "s-active" };
    case "hiatus":
      return { label: "Tạm dừng", cls: "s-hiatus" };
    case "completed":
      return { label: "Hoàn thành", cls: "s-done" };
    case "cancelled":
      return { label: "Đã huỷ", cls: "s-cancelled" };
    default:
      return { label: status ?? "—", cls: "s-default" };
  }
}

const COVER_PLACEHOLDER =
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop";

export default function MangakaSeriesPage() {
  const navigate = useNavigate();
  const [seriesList, setSeriesList] = useState<MangakaSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    fetchMySeries()
      .then(setSeriesList)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filters = [
    { id: "all", label: "Tất cả" },
    { id: "approved", label: "Đang hoạt động" },
    { id: "hiatus", label: "Tạm dừng" },
    { id: "completed", label: "Hoàn thành" },
  ];

  const filtered = seriesList.filter((s) => {
    const matchStatus =
      activeFilter === "all" || s.seriesStatus === activeFilter;
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="mangaka-series-page">
      <div className="series-hero">
        <div className="hero-text">
          <div className="breadcrumb">
            Tác phẩm <ChevronRight size={14} />
          </div>
          <h1>Kho Tác Phẩm</h1>
          <p>Quản lý tất cả series, tiến độ và đội ngũ sản xuất tại đây.</p>
        </div>
        <div className="hero-actions">
          <button className="btn-outline">
            <Download size={16} /> Tải báo cáo
          </button>
          <button
            className="btn-primary"
            onClick={() => navigate("/mangaka/create-work")}
          >
            <Plus size={16} /> Tạo Series Mới
          </button>
        </div>
      </div>

      <div className="series-toolbar">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm series..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          {filters.map((f) => (
            <button
              key={f.id}
              className={`filter-tab ${activeFilter === f.id ? "active" : ""}`}
              onClick={() => setActiveFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button className="btn-icon">
          <SlidersHorizontal size={16} />
        </button>
      </div>

      {loading ? (
        <div className="ms-empty">
          <span>Đang tải series...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="ms-empty">
          <BookOpen size={32} strokeWidth={1.25} />
          <span>
            {search
              ? "Không tìm thấy series phù hợp."
              : "Bạn chưa có series nào. Hãy tạo series mới!"}
          </span>
        </div>
      ) : (
        <div className="series-grid">
          {filtered.map((s) => {
            const st = statusMeta(s.seriesStatus);
            return (
              <div
                key={s.seriesId}
                className="series-card"
                onClick={() => navigate(`/mangaka/series/${s.seriesId}`)}
              >
                <div className="card-cover">
                  <img
                    src={s.coverImageUrl ?? COVER_PLACEHOLDER}
                    alt={s.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = COVER_PLACEHOLDER;
                    }}
                  />
                  <div className="card-cover__scrim" />
                  <div className="card-cover__bottom">
                    <span className="card-cover__title">{s.title}</span>
                    <span className={`card-cover__badge ${st.cls}`}>
                      {st.label}
                    </span>
                  </div>
                </div>

                {s.genres.length > 0 && (
                  <div className="card-genres">
                    {s.genres.slice(0, 3).map((g) => (
                      <span key={g} className="card-genre-chip">
                        {g}
                      </span>
                    ))}
                  </div>
                )}

                <div className="card-stats">
                  <div className="card-stat">
                    <BookOpen size={14} />
                    <span>{s.chapterCount} chương</span>
                  </div>
                  <div className="card-stat">
                    <Calendar size={14} />
                    <span>{scheduleLabel(s.scheduleType, s.dayValue)}</span>
                  </div>
                </div>

                <div className="card-footer">
                  <div className="card-tantou">
                    {s.tantouName ? (
                      <>
                        {s.tantouAvatarUrl ? (
                          <img
                            className="tantou-avatar"
                            src={s.tantouAvatarUrl}
                            alt={s.tantouName}
                          />
                        ) : (
                          <div
                            className="tantou-avatar tantou-avatar--initials"
                            style={{
                              background: getAvatarColor(s.tantouName),
                            }}
                          >
                            {getInitials(s.tantouName)}
                          </div>
                        )}
                        <div>
                          <div className="tantou-role">Tantou</div>
                          <div className="tantou-name">{s.tantouName}</div>
                        </div>
                      </>
                    ) : (
                      <span className="tantou-role">Chưa có Tantou</span>
                    )}
                  </div>

                  {s.approvedAt && (
                    <div className="card-approved">
                      <Clock size={11} />
                      {s.approvedAt}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filtered.length > 0 && (
        <div className="pagination">
          <button className="page-btn">‹</button>
          <button className="page-btn active">1</button>
          <button className="page-btn">›</button>
        </div>
      )}
    </div>
  );
}
