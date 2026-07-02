import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  CalendarDays,
  Loader2,
  BookOpen,
  Users,
  FileEdit,
  Timer,
  CheckCircle2,
  ChevronRight,
  Star,
  Minus,
  BarChart3,
} from "lucide-react";
import "./MangakaDashboard.scss";
import RecentActivityWidget from "../../components/activityLog/RecentActivityWidget";
import {
  fetchMangakaDashboardStats,
  fetchMangakaDeadlines,
  fetchMangakaTopSeries,
  type MangakaDashboardStats,
  type MangakaDeadlineItem,
  type SeriesRankItem,
} from "../../services/mangakaDashboardService";
import {
  fetchMySeries,
  type MangakaSeries,
} from "../../services/mangakaSeriesService";
import {
  fetchActiveAssistants,
  type AssistantAssignmentRes,
} from "../../services/assistantAssignmentService";
import { getAvatarColor, getInitials } from "../../utils";

export default function MangakaDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState<MangakaDashboardStats | null>(null);
  const [deadlines, setDeadlines] = useState<MangakaDeadlineItem[]>([]);
  const [ranking, setRanking] = useState<SeriesRankItem[]>([]);
  const [series, setSeries] = useState<MangakaSeries[]>([]);
  const [assistants, setAssistants] = useState<AssistantAssignmentRes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const now = new Date();
  const dateLabel = now.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
  });

  useEffect(() => {
    Promise.all([
      fetchMangakaDashboardStats(),
      fetchMangakaDeadlines(),
      fetchMangakaTopSeries(),
      fetchMySeries(),
      fetchActiveAssistants(),
    ])
      .then(([s, d, r, sr, a]) => {
        setStats(s);
        setDeadlines(d);
        setRanking(r);
        setSeries(sr);
        setAssistants(a);
      })
      .catch(() => setError("Không thể tải dữ liệu. Vui lòng thử lại."))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="md-page md-page--center">
        <Loader2 size={22} className="md-spin" />
        Đang tải dữ liệu...
      </div>
    );

  if (error)
    return (
      <div className="md-page md-page--center md-page--error">
        <AlertTriangle size={18} />
        {error}
      </div>
    );

  const statCards: {
    label: string;
    value: number;
    icon: typeof Timer;
    tone: string;
    sub: string;
    action?: () => void;
  }[] = [
    {
      label: "Deadline gấp",
      value: stats?.urgentDeadlineCount ?? 0,
      icon: Timer,
      tone: (stats?.urgentDeadlineCount ?? 0) > 0 ? "red" : "green",
      sub:
        (stats?.urgentDeadlineCount ?? 0) > 0
          ? "Quá hạn hoặc đến hạn hôm nay"
          : "Không có deadline gấp",
      action: () => navigate("/mangaka/schedule"),
    },
    {
      label: "Cần chỉnh sửa",
      value: stats?.revisionCount ?? 0,
      icon: FileEdit,
      tone: (stats?.revisionCount ?? 0) > 0 ? "orange" : "green",
      sub:
        (stats?.revisionCount ?? 0) > 0
          ? "Tantou yêu cầu sửa lại"
          : "Không có gì cần sửa",
      action: () => navigate("/mangaka/schedule"),
    },
    {
      label: "Chờ bạn duyệt",
      value: stats?.pendingReviewCount ?? 0,
      icon: Users,
      tone: (stats?.pendingReviewCount ?? 0) > 0 ? "blue" : "green",
      sub: "Bài nộp từ Trợ lý",
      action: () => navigate("/mangaka/series"),
    },
    {
      label: "Series đang quản lý",
      value: stats?.totalSeries ?? 0,
      icon: BookOpen,
      tone: "indigo",
      sub: `${series.reduce((sum, s) => sum + s.chapterCount, 0)} chương tổng cộng`,
      action: () => navigate("/mangaka/series"),
    },
  ];

  // Gộp deadline + revision thành 1 danh sách "cần xử lý ngay", ưu tiên
  // overdue/due trước, tối đa 4 mục để không tràn card
  const actionItems = deadlines
    .filter((d) => d.labelType === "overdue" || d.labelType === "due")
    .slice(0, 4);

  return (
    <div className="md-page">
      <div className="md-header">
        <div className="md-header__left">
          <h1>Bảng điều khiển</h1>
          <p>Tổng quan studio của bạn hôm nay.</p>
        </div>
        <div className="md-header__badge">
          <CalendarDays size={14} strokeWidth={2} />
          {dateLabel}
        </div>
      </div>

      <div className="md-stats">
        {statCards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className={`md-stat md-stat--${c.tone} ${c.action ? "md-stat--clickable" : ""}`}
              onClick={c.action}
            >
              <div className="md-stat__top">
                <span className="md-stat__label">{c.label}</span>
                <div className="md-stat__icon">
                  <Icon size={17} strokeWidth={2} />
                </div>
              </div>
              <div className="md-stat__value">{c.value}</div>
              <div className="md-stat__sub">{c.sub}</div>
              {c.action && (
                <div className="md-stat__link">
                  Xem chi tiết <ChevronRight size={12} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="md-grid">
        <div className="md-col">
          <div className="md-card md-pending">
            <div className="md-pending__header">
              <AlertTriangle size={17} strokeWidth={2.5} />
              <span>Cần xử lý ngay</span>
            </div>
            <div className="md-pending__list">
              {actionItems.map((d) => (
                <button
                  key={d.deadlineId}
                  className={`md-pending__item md-pending__item--${d.labelType === "overdue" ? "red" : "orange"}`}
                  onClick={() => navigate("/mangaka/schedule")}
                >
                  <span className="md-pending__item-dot" />
                  <div>
                    <strong>{d.title}</strong>
                    <span>
                      {d.series} · {d.timeTag}
                    </span>
                  </div>
                  <ChevronRight size={14} />
                </button>
              ))}
              {(stats?.revisionCount ?? 0) > 0 && (
                <button
                  className="md-pending__item md-pending__item--orange"
                  onClick={() => navigate("/mangaka/schedule")}
                >
                  <span className="md-pending__item-dot" />
                  <div>
                    <strong>{stats?.revisionCount} nhóm trang</strong>
                    <span>Tantou yêu cầu chỉnh sửa lại</span>
                  </div>
                  <ChevronRight size={14} />
                </button>
              )}
              {actionItems.length === 0 &&
                (stats?.revisionCount ?? 0) === 0 && (
                  <div className="md-pending__empty">
                    <CheckCircle2 size={20} />
                    <span>Không có mục nào cần xử lý!</span>
                  </div>
                )}
            </div>
          </div>

          <div className="md-card">
            <RecentActivityWidget />
          </div>
        </div>

        <div className="md-col">
          <div className="md-card md-progress">
            <div className="md-card__head">
              <div className="md-card__title">
                <BarChart3 size={15} strokeWidth={2} />
                Tiến độ các series
              </div>
            </div>
            <div className="md-progress__list">
              {series.length === 0 ? (
                <div className="md-progress__empty">Chưa có series nào.</div>
              ) : (
                series.slice(0, 5).map((s) => {
                  const total = s.totalPageDeadlines;
                  const submitted = s.submittedPageDeadlines;
                  const pct =
                    total > 0 ? Math.round((submitted / total) * 100) : 0;
                  return (
                    <div className="md-progress__item" key={s.seriesId}>
                      <div className="md-progress__top">
                        <strong>{s.title}</strong>
                        <span>
                          {total > 0
                            ? `${submitted}/${total} trang`
                            : "Chưa có deadline"}
                        </span>
                      </div>
                      <div className="md-progress__bar">
                        <div
                          className={`md-progress__fill ${pct >= 80 ? "md-progress__fill--high" : ""}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="md-card md-collab">
            <div className="md-card__head">
              <div className="md-card__title">
                <Users size={15} strokeWidth={2} />
                Trợ lý đang cộng tác
              </div>
            </div>
            <div className="md-collab__list">
              {assistants.length === 0 ? (
                <div className="md-collab__empty">Chưa có trợ lý nào.</div>
              ) : (
                assistants.map((a) => (
                  <div className="md-collab__item" key={a.assignmentId}>
                    {a.assistantAvatarUrl ? (
                      <img
                        className="md-collab__avatar"
                        src={a.assistantAvatarUrl}
                        alt={a.assistantName}
                      />
                    ) : (
                      <div
                        className="md-collab__avatar md-collab__avatar--initials"
                        style={{ background: getAvatarColor(a.assistantName) }}
                      >
                        {getInitials(a.assistantName)}
                      </div>
                    )}
                    <span>{a.assistantName}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="md-card md-ranking">
            <div className="md-card__head">
              <div className="md-card__title">
                <Star size={15} strokeWidth={2} />
                Bảng xếp hạng series của bạn
              </div>
            </div>
            <div className="md-ranking__list">
              {ranking.length === 0 ? (
                <div className="md-ranking__empty">
                  Chưa có dữ liệu xếp hạng.
                </div>
              ) : (
                ranking.map((r, idx) => (
                  <div
                    key={r.seriesId}
                    className={`md-rank-item ${idx === 0 ? "md-rank-item--top" : ""}`}
                  >
                    <span className="md-rank-item__num">#{idx + 1}</span>
                    <div className="md-rank-item__body">
                      <strong>{r.title}</strong>
                      <span>
                        {r.latestChapter != null
                          ? `Ch.${r.latestChapter}`
                          : "Chưa có chương"}
                        {" · "}
                        {r.voteCount.toLocaleString()} vote
                        {r.rating > 0 ? ` · ⭐ ${r.rating.toFixed(1)}` : ""}
                      </span>
                    </div>
                    <div
                      className={`md-rank-item__trend ${r.voteCount > 0 ? "md-rank-item__trend--voted" : ""}`}
                    >
                      {r.voteCount > 0 ? (
                        <Star size={13} />
                      ) : (
                        <Minus size={13} />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
