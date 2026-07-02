import { useEffect, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock,
  Loader2,
  Star,
  Minus,
} from "lucide-react";
import "./MangakaReports.scss";
import {
  fetchMangakaReportStats,
  fetchMangakaDailyProduction,
  type MangakaReportStats,
  type DailyProductionItem,
} from "../../services/mangakaReportService";
import {
  fetchMangakaTopSeries,
  type SeriesRankItem,
} from "../../services/mangakaDashboardService";

export default function MangakaReports() {
  const [stats, setStats] = useState<MangakaReportStats | null>(null);
  const [daily, setDaily] = useState<DailyProductionItem[]>([]);
  const [ranking, setRanking] = useState<SeriesRankItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetchMangakaReportStats(),
      fetchMangakaDailyProduction(),
      fetchMangakaTopSeries(),
    ])
      .then(([s, d, r]) => {
        setStats(s);
        setDaily(d);
        setRanking(r);
      })
      .catch(() => setError("Không thể tải dữ liệu báo cáo. Vui lòng thử lại."))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="mr-page mr-page--center">
        <Loader2 size={22} className="mr-spin" />
        Đang tải dữ liệu...
      </div>
    );

  if (error)
    return (
      <div className="mr-page mr-page--center mr-page--error">
        <AlertTriangle size={18} />
        {error}
      </div>
    );

  const maxDaily = Math.max(1, ...daily.map((d) => d.submittedCount));

  return (
    <div className="mr-page">
      <div className="mr-header">
        <div className="mr-header__left">
          <h1>Báo cáo sản xuất</h1>
          <p>Số liệu thật từ hoạt động của bạn trên hệ thống.</p>
        </div>
      </div>

      <div className="mr-stats">
        <div className="mr-stat mr-stat--blue">
          <div className="mr-stat__top">
            <span className="mr-stat__label">Tổng số trang</span>
            <div className="mr-stat__icon">
              <BookOpen size={17} strokeWidth={2} />
            </div>
          </div>
          <div className="mr-stat__value">{stats?.totalPages ?? 0}</div>
          <div className="mr-stat__sub">
            Trong {stats?.totalSeries ?? 0} series đang quản lý
          </div>
        </div>

        <div className="mr-stat mr-stat--green">
          <div className="mr-stat__top">
            <span className="mr-stat__label">Nhóm trang đã nộp</span>
            <div className="mr-stat__icon">
              <CheckCircle2 size={17} strokeWidth={2} />
            </div>
          </div>
          <div className="mr-stat__value">{stats?.submittedDeadlines ?? 0}</div>
          <div className="mr-stat__sub">
            / {stats?.totalDeadlines ?? 0} tổng nhóm trang có deadline
          </div>
        </div>

        <div className="mr-stat mr-stat--orange">
          <div className="mr-stat__top">
            <span className="mr-stat__label">Đang chờ nộp</span>
            <div className="mr-stat__icon">
              <Clock size={17} strokeWidth={2} />
            </div>
          </div>
          <div className="mr-stat__value">{stats?.pendingDeadlines ?? 0}</div>
          <div className="mr-stat__sub">Nhóm trang chưa nộp hoặc đang sửa</div>
        </div>

        <div className="mr-stat mr-stat--indigo">
          <div className="mr-stat__top">
            <span className="mr-stat__label">Tỉ lệ hoàn thành</span>
            <div className="mr-stat__icon">
              <BarChart3 size={17} strokeWidth={2} />
            </div>
          </div>
          <div className="mr-stat__value">{stats?.completionRate ?? 0}%</div>
          <div className="mr-stat__sub">Nhóm trang đã nộp / tổng</div>
        </div>
      </div>

      <div className="mr-grid">
        <div className="mr-card mr-production">
          <div className="mr-card__head">
            <div className="mr-card__title">
              <BarChart3 size={15} strokeWidth={2} />
              Số nhóm trang nộp theo ngày (7 ngày gần nhất)
            </div>
          </div>
          <div className="mr-bar-chart">
            {daily.map((d) => (
              <div className="mr-bar-column" key={d.date}>
                <div className="mr-bar-track">
                  <span
                    className="mr-bar-fill"
                    style={{
                      height: `${Math.max(4, (d.submittedCount / maxDaily) * 100)}%`,
                    }}
                    title={`${d.submittedCount} nhóm trang`}
                  />
                </div>
                <strong>{d.dayLabel}</strong>
                <span className="mr-bar-count">{d.submittedCount}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mr-card mr-interaction">
          <div className="mr-card__head">
            <div className="mr-card__title">
              <Star size={15} strokeWidth={2} />
              Tương tác Series (vote / rating độc giả)
            </div>
          </div>
          <div className="mr-ranking__list">
            {ranking.length === 0 ? (
              <div className="mr-empty">Chưa có dữ liệu tương tác.</div>
            ) : (
              ranking.map((r, idx) => (
                <div
                  key={r.seriesId}
                  className={`mr-rank-item ${idx === 0 ? "mr-rank-item--top" : ""}`}
                >
                  <span className="mr-rank-item__num">#{idx + 1}</span>
                  <div className="mr-rank-item__body">
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
                    className={`mr-rank-item__trend ${r.voteCount > 0 ? "mr-rank-item__trend--voted" : ""}`}
                  >
                    {r.voteCount > 0 ? <Star size={13} /> : <Minus size={13} />}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
