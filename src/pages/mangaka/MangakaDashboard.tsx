import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Timer,
  FileEdit,
  Users,
  ArrowRight,
  MoreHorizontal,
  Star,
  Minus,
  Loader2,
  AlertTriangle,
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

const today = new Date();
const TODAY_LABEL = today.toLocaleDateString("vi-VN", {
  weekday: "long",
  day: "2-digit",
  month: "2-digit",
});

export default function MangakaDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState<MangakaDashboardStats | null>(null);
  const [deadlines, setDeadlines] = useState<MangakaDeadlineItem[]>([]);
  const [ranking, setRanking] = useState<SeriesRankItem[]>([]);
  const [series, setSeries] = useState<MangakaSeries[]>([]);
  const [assistants, setAssistants] = useState<AssistantAssignmentRes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      .catch(() =>
        setError("Không thể tải dữ liệu dashboard. Vui lòng thử lại."),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mangaka-dashboard mangaka-dashboard--center">
        <Loader2 size={22} className="md-spin" />
        Đang tải dữ liệu...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mangaka-dashboard mangaka-dashboard--center md-error">
        <AlertTriangle size={18} />
        {error}
      </div>
    );
  }

  const nearestDeadline = deadlines.find(
    (d) => d.labelType === "overdue" || d.labelType === "due",
  );

  const revisionDeadline = deadlines.find((d) => d.label === "SẮP ĐẾN") ?? null;

  return (
    <div className="mangaka-dashboard">
      <div className="dashboard-hero">
        <div className="hero-text">
          <h1>Bảng điều khiển</h1>
          <p>Chào buổi sáng! Đây là tổng quan studio của bạn hôm nay.</p>
        </div>
        <div className="hero-date">
          <span>HÔM NAY</span>
          <strong>{TODAY_LABEL}</strong>
        </div>
      </div>

      <div className="dashboard-layout">
        <div className="main-content">
          <div className="alert-cards-grid">
            <div
              className={`alert-card ${nearestDeadline ? "danger-card" : "info-card"}`}
            >
              <div className="card-header">
                <div className="icon-wrapper">
                  <Timer size={20} />
                </div>
                {nearestDeadline ? (
                  <span className="badge-urgent">KHẨN CẤP</span>
                ) : (
                  <span className="time-text">Ổn định</span>
                )}
              </div>
              {nearestDeadline ? (
                <>
                  <p className="alert-text">
                    <strong>
                      Deadline{" "}
                      {nearestDeadline.labelType === "overdue"
                        ? "quá hạn"
                        : "đến hạn"}
                    </strong>
                    <br />
                    {nearestDeadline.series} cần nộp {nearestDeadline.title} —{" "}
                    {nearestDeadline.timeTag}.
                  </p>
                  <button
                    className="btn-outline-danger"
                    onClick={() => navigate("/mangaka/schedule")}
                  >
                    Xử lý ngay
                  </button>
                </>
              ) : (
                <p className="alert-text">
                  <strong>Không có deadline gấp</strong>
                  <br />
                  Mọi trang đều trong hạn nộp.
                </p>
              )}
            </div>

            <div className="alert-card warning-card">
              <div className="card-header">
                <div className="icon-wrapper">
                  <FileEdit size={20} />
                </div>
                <span className="time-text">
                  {stats?.revisionCount ?? 0} cần sửa
                </span>
              </div>
              {(stats?.revisionCount ?? 0) > 0 ? (
                <>
                  <p className="alert-text">
                    <strong>Có nội dung cần chỉnh sửa</strong>
                    <br />
                    {revisionDeadline
                      ? `Tantou ${revisionDeadline.tantouName} yêu cầu sửa lại ${revisionDeadline.title} – ${revisionDeadline.series}.`
                      : `${stats?.revisionCount} nhóm trang đang chờ bạn sửa lại theo yêu cầu Tantou.`}
                  </p>
                  <a
                    href="#"
                    className="link-action"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/mangaka/schedule");
                    }}
                  >
                    Xem chi tiết <ArrowRight size={16} />
                  </a>
                </>
              ) : (
                <p className="alert-text">
                  <strong>Không có gì cần sửa</strong>
                  <br />
                  Tất cả bài nộp đều đã được chấp thuận.
                </p>
              )}
            </div>

            <div className="alert-card info-card">
              <div className="card-header">
                <div className="icon-wrapper">
                  <Users size={20} />
                </div>
              </div>
              <p className="alert-text">
                <strong>Bottlenecks</strong>
                <br />
                {(stats?.pendingReviewCount ?? 0) > 0
                  ? `${stats?.pendingReviewCount} bài nộp từ Trợ lý đang chờ duyệt.`
                  : "Không có bài nộp nào đang chờ duyệt."}
              </p>
              {(stats?.pendingReviewCount ?? 0) > 0 && (
                <button
                  className="btn-primary"
                  onClick={() => navigate("/mangaka/series")}
                >
                  Duyệt file ngay
                </button>
              )}
            </div>
          </div>

          <div className="bottom-grid">
            <div className="progress-card panel-card">
              <div className="panel-header">
                <h3>TIẾN ĐỘ CÁC SERIES</h3>
                <MoreHorizontal
                  className="icon-more"
                  size={20}
                  onClick={() => navigate("/mangaka/series")}
                  style={{ cursor: "pointer" }}
                />
              </div>

              <div className="progress-list">
                {series.length === 0 ? (
                  <div className="md-empty-inline">Chưa có series nào.</div>
                ) : (
                  series.slice(0, 5).map((s) => {
                    const total = s.totalPageDeadlines;
                    const submitted = s.submittedPageDeadlines;
                    const pct =
                      total > 0 ? Math.round((submitted / total) * 100) : 0;
                    return (
                      <div className="progress-item" key={s.seriesId}>
                        <div className="item-info">
                          <span className="series-name">{s.title}</span>
                          <span
                            className={`status-text ${pct >= 80 ? "highlight" : ""}`}
                          >
                            {total > 0
                              ? `${submitted}/${total} trang (${pct}%)`
                              : (s.seriesStatus ?? "Chưa có deadline")}
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className={`fill ${pct >= 80 ? "blue" : "light-blue"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="right-subgrid">
              <div className="assistant-card panel-card">
                <div className="panel-header line-gray">
                  <h3>TRỢ LÝ ĐANG CỘNG TÁC</h3>
                </div>
                <div className="assistant-list">
                  {assistants.length === 0 ? (
                    <div className="md-empty-inline">Chưa có trợ lý nào.</div>
                  ) : (
                    assistants.map((a) => (
                      <div className="assistant-item" key={a.assignmentId}>
                        <div className="avatar-container">
                          {a.assistantAvatarUrl ? (
                            <img
                              src={a.assistantAvatarUrl}
                              alt={a.assistantName}
                            />
                          ) : (
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: getAvatarColor(a.assistantName),
                                color: "#fff",
                                fontSize: 11,
                                fontWeight: 800,
                              }}
                            >
                              {getInitials(a.assistantName)}
                            </div>
                          )}
                        </div>
                        <span>{a.assistantName}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="ranking-card panel-card">
                <div className="panel-header bg-blue">
                  <h3>BẢNG XẾP HẠNG SERIES CỦA BẠN</h3>
                </div>
                <div className="ranking-list">
                  {ranking.length === 0 ? (
                    <div className="md-empty-inline">
                      Chưa có dữ liệu xếp hạng.
                    </div>
                  ) : (
                    ranking.map((r, idx) => (
                      <div
                        className={`ranking-item ${idx === 0 ? "top-1" : ""}`}
                        key={r.seriesId}
                      >
                        <span className="rank-num">{idx + 1}</span>
                        <span className="rank-name">
                          {r.title}
                          {r.latestChapter != null
                            ? ` · Ch.${r.latestChapter}`
                            : ""}
                        </span>
                        {r.voteCount > 0 ? (
                          <Star
                            className="trend-up"
                            size={16}
                            strokeWidth={2.5}
                          />
                        ) : (
                          <Minus
                            className="trend-flat"
                            size={16}
                            strokeWidth={2.5}
                          />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <RecentActivityWidget />
      </div>
    </div>
  );
}
