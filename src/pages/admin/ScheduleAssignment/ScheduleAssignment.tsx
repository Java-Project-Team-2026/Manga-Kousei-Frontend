import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Calendar,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Sparkles,
  XCircle,
} from "lucide-react";
import {
  fetchAllSchedules,
  confirmSchedule,
  type ScheduleEntry,
} from "../../../services/adminScheduleService";
import { cancelApprove } from "../../../services/adminProposalService";
import "./ScheduleAssignment.scss";

const WEEKDAYS = [
  { value: 1, label: "Thứ 2" },
  { value: 2, label: "Thứ 3" },
  { value: 3, label: "Thứ 4" },
  { value: 4, label: "Thứ 5" },
  { value: 5, label: "Thứ 6" },
  { value: 6, label: "Thứ 7" },
  { value: 7, label: "CN" },
];

const MONTH_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

const SERIES_COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f97316",
  "#10b981",
  "#14b8a6",
  "#f59e0b",
  "#ef4444",
  "#6366f1",
  "#84cc16",
];

export default function ScheduleAssignment() {
  const { proposalId } = useParams<{ proposalId: string }>();
  const navigate = useNavigate();

  const [schedules, setSchedules] = useState<ScheduleEntry[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [saved, setSaved] = useState(false);

  const [scheduleType, setScheduleType] = useState<"weekly" | "monthly">(
    "weekly",
  );
  const [dayValue, setDayValue] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAllSchedules();
        setSchedules(data);
      } catch (err) {
        console.error("Không thể tải schedules", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const colorMap = new Map<number, string>();
  schedules.forEach((s, i) => {
    if (!colorMap.has(s.seriesId)) {
      colorMap.set(s.seriesId, SERIES_COLORS[i % SERIES_COLORS.length]);
    }
  });

  const weeklyMap = new Map<number, ScheduleEntry[]>();
  const monthlyMap = new Map<number, ScheduleEntry[]>();
  schedules.forEach((s) => {
    const map = s.scheduleType === "weekly" ? weeklyMap : monthlyMap;
    if (!map.has(s.dayValue)) map.set(s.dayValue, []);
    map.get(s.dayValue)!.push(s);
  });

  const handleConfirm = async () => {
    if (!proposalId || dayValue === null) return;
    setSubmitting(true);
    try {
      await confirmSchedule({
        proposalId: Number(proposalId),
        scheduleType,
        dayValue,
      });
      setSaved(true);
      setTimeout(() => navigate("/admin/proposal-review"), 1500);
    } catch (err) {
      console.error("Xác nhận lịch thất bại", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelApprove = async () => {
    if (!proposalId) return;
    setCancelling(true);
    try {
      await cancelApprove(Number(proposalId));
      navigate("/admin/proposal-review");
    } catch (err) {
      console.error("Huỷ duyệt thất bại", err);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="sa-root">
      <div className="sa-header">
        <div className="sa-header__top">
          <button
            className="sa-back"
            onClick={handleCancelApprove}
            disabled={cancelling || submitting}
          >
            <ChevronLeft size={16} />
            {cancelling ? "Đang huỷ..." : "Huỷ duyệt & quay lại"}
          </button>
        </div>
        <div className="sa-header__title">
          <Calendar size={18} strokeWidth={1.75} />
          Phân lịch xuất bản
        </div>
        <p className="sa-header__sub">
          Đặt lịch xuất bản để hoàn tất phê duyệt series — đối chiếu với các
          series đang hoạt động bên trái
        </p>
      </div>

      <div className="sa-body">
        <div className="sa-grid-col">
          <div className="sa-grid-section">
            <div className="sa-grid-section__label">
              <Clock size={13} /> Lịch hàng tuần
            </div>
            <div className="sa-weekly-grid">
              {WEEKDAYS.map((day) => {
                const entries = weeklyMap.get(day.value) ?? [];
                const isSelected =
                  scheduleType === "weekly" && dayValue === day.value;
                return (
                  <div
                    key={day.value}
                    className={`sa-day-col ${isSelected ? "sa-day-col--selected" : ""}`}
                  >
                    <div className="sa-day-col__header">{day.label}</div>
                    <div className="sa-day-col__body">
                      {entries.map((e) => (
                        <div
                          key={e.seriesId}
                          className="sa-series-chip"
                          style={{
                            background: colorMap.get(e.seriesId) + "22",
                            borderColor: colorMap.get(e.seriesId),
                            color: colorMap.get(e.seriesId),
                          }}
                          title={`${e.seriesTitle} — ${e.mangakaName}`}
                        >
                          {e.seriesTitle}
                        </div>
                      ))}
                      {entries.length === 0 && (
                        <div className="sa-day-col__empty">—</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="sa-grid-section">
            <div className="sa-grid-section__label">
              <Calendar size={13} /> Lịch hàng tháng
            </div>
            <div className="sa-monthly-grid">
              {MONTH_DAYS.map((d) => {
                const entries = monthlyMap.get(d) ?? [];
                const isSelected = scheduleType === "monthly" && dayValue === d;
                return (
                  <div
                    key={d}
                    className={`sa-month-cell ${isSelected ? "sa-month-cell--selected" : ""} ${entries.length > 0 ? "sa-month-cell--occupied" : ""}`}
                  >
                    <span className="sa-month-cell__day">{d}</span>
                    {entries.map((e) => (
                      <div
                        key={e.seriesId}
                        className="sa-month-chip"
                        style={{
                          background: colorMap.get(e.seriesId) + "22",
                          borderColor: colorMap.get(e.seriesId),
                          color: colorMap.get(e.seriesId),
                        }}
                        title={`${e.seriesTitle} — ${e.mangakaName}`}
                      >
                        {e.seriesTitle}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="sa-form-col">
          <div className="sa-form">
            <div className="sa-form__title">
              <Sparkles size={15} />
              Đặt lịch xuất bản
            </div>
            <p className="sa-form__sub">
              Proposal #{proposalId} · Bắt buộc để hoàn tất phê duyệt
            </p>

            <div className="sa-form__field">
              <label className="sa-form__label">Kiểu lịch</label>
              <div className="sa-type-toggle">
                <button
                  className={`sa-type-btn ${scheduleType === "weekly" ? "sa-type-btn--on" : ""}`}
                  onClick={() => {
                    setScheduleType("weekly");
                    setDayValue(null);
                  }}
                  disabled={submitting}
                >
                  <Clock size={14} /> Hàng tuần
                </button>
                <button
                  className={`sa-type-btn ${scheduleType === "monthly" ? "sa-type-btn--on" : ""}`}
                  onClick={() => {
                    setScheduleType("monthly");
                    setDayValue(null);
                  }}
                  disabled={submitting}
                >
                  <Calendar size={14} /> Hàng tháng
                </button>
              </div>
            </div>

            <div className="sa-form__field">
              <label className="sa-form__label">
                {scheduleType === "weekly"
                  ? "Chọn thứ"
                  : "Chọn ngày trong tháng"}
              </label>

              {scheduleType === "weekly" ? (
                <div className="sa-weekday-picker">
                  {WEEKDAYS.map((d) => (
                    <button
                      key={d.value}
                      className={`sa-weekday-btn ${dayValue === d.value ? "sa-weekday-btn--on" : ""}`}
                      onClick={() => setDayValue(d.value)}
                      disabled={submitting}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="sa-monthday-picker">
                  {MONTH_DAYS.map((d) => (
                    <button
                      key={d}
                      className={`sa-monthday-btn ${dayValue === d ? "sa-monthday-btn--on" : ""}`}
                      onClick={() => setDayValue(d)}
                      disabled={submitting}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {dayValue !== null && (
              <div className="sa-preview">
                <CheckCircle2 size={13} />
                Xuất bản{" "}
                {scheduleType === "weekly"
                  ? `vào ${WEEKDAYS.find((d) => d.value === dayValue)?.label} hàng tuần`
                  : `vào ngày ${dayValue} hàng tháng`}
              </div>
            )}

            {dayValue === null && (
              <div className="sa-warning">
                Chọn lịch xuất bản để hoàn tất phê duyệt. Nhấn "Huỷ duyệt" nếu
                muốn xem xét lại.
              </div>
            )}

            <div className="sa-form__actions">
              <button
                className="sa-btn sa-btn--cancel"
                onClick={handleCancelApprove}
                disabled={submitting || cancelling || saved}
              >
                <XCircle size={14} />
                {cancelling ? "Đang huỷ..." : "Huỷ duyệt"}
              </button>
              <button
                className={`sa-btn sa-btn--save ${saved ? "sa-btn--saved" : ""}`}
                onClick={handleConfirm}
                disabled={
                  dayValue === null || submitting || cancelling || saved
                }
              >
                {saved ? (
                  <>
                    <CheckCircle2 size={14} /> Đã xác nhận!
                  </>
                ) : submitting ? (
                  <>Đang lưu...</>
                ) : (
                  <>
                    <Calendar size={14} /> Xác nhận & Phê duyệt
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
