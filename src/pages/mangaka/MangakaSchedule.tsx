import { useEffect, useMemo, useState } from "react";
import {
  fetchMySeries,
  type MangakaSeries,
} from "../../services/mangakaSeriesService";
import "./MangakaSchedule.scss";

type CalendarEvent = {
  label: string;
  tone: "blue" | "indigo" | "red";
};

type CalendarDay = {
  date: Date;
  day: string;
  muted?: boolean;
  today?: boolean;
  events: CalendarEvent[];
};

const WEEKDAY_LABELS: Record<number, string> = {
  1: "Thứ 2",
  2: "Thứ 3",
  3: "Thứ 4",
  4: "Thứ 5",
  5: "Thứ 6",
  6: "Thứ 7",
  7: "CN",
};

function getWeekdayValue(date: Date) {
  const day = date.getDay();
  return day === 0 ? 7 : day;
}

function sameDate(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildCalendarDays(month: Date, seriesList: MangakaSeries[]): CalendarDay[] {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1);
  const firstGridOffset = (getWeekdayValue(firstDay) + 6) % 7;
  const gridStart = new Date(year, monthIndex, 1 - firstGridOffset);
  const today = new Date();

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(
      gridStart.getFullYear(),
      gridStart.getMonth(),
      gridStart.getDate() + index,
    );

    const events = seriesList
      .filter((series) => {
        if (!series.scheduleType || series.dayValue === null) return false;
        if (series.scheduleType === "weekly") {
          return getWeekdayValue(date) === series.dayValue;
        }
        return date.getDate() === series.dayValue;
      })
      .map<CalendarEvent>((series) => ({
        label: `Xuất bản ${series.title}`,
        tone: series.scheduleType === "monthly" ? "indigo" : "blue",
      }));

    return {
      date,
      day: String(date.getDate()),
      muted: date.getMonth() !== monthIndex,
      today: sameDate(date, today),
      events,
    };
  });
}

function scheduleLabel(series: MangakaSeries) {
  if (!series.scheduleType || series.dayValue === null) return "Chưa có lịch";
  if (series.scheduleType === "weekly") {
    return `${WEEKDAY_LABELS[series.dayValue] ?? `Thứ ${series.dayValue}`} hằng tuần`;
  }
  return `Ngày ${series.dayValue} hằng tháng`;
}

export default function MangakaSchedule() {
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [seriesList, setSeriesList] = useState<MangakaSeries[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMySeries()
      .then(setSeriesList)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const calendarDays = useMemo(
    () => buildCalendarDays(currentMonth, seriesList),
    [currentMonth, seriesList],
  );

  const scheduledSeries = seriesList.filter(
    (series) => series.scheduleType && series.dayValue !== null,
  );

  const visibleMonthEvents = calendarDays.reduce(
    (total, day) => total + (!day.muted ? day.events.length : 0),
    0,
  );

  const productionRows = seriesList.slice(0, 2).map((series, index) => ({
    chapter: series.title,
    stage: `Lịch: ${scheduleLabel(series)}`,
    percent: Math.min(100, Math.max(10, series.chapterCount * 10)),
    tone: index % 2 === 0 ? "blue" : "indigo",
    labels: ["Đề xuất", "Đang sản xuất", "Lên lịch", "Xuất bản"],
  }));

  const goPrevMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const goNextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  };

  return (
    <section className="mangaka-schedule">
      <div className="schedule-main">
        <article className="calendar-panel">
          <header className="schedule-card-header">
            <div>
              <h1>
                Tháng {currentMonth.getMonth() + 1}, {currentMonth.getFullYear()}
              </h1>
              <p>Dự kiến {visibleMonthEvents} lượt phát hành</p>
            </div>
            <div className="calendar-controls" aria-label="Điều hướng tháng">
              <button type="button" aria-label="Tháng trước" onClick={goPrevMonth}>
                ‹
              </button>
              <button type="button" aria-label="Tháng sau" onClick={goNextMonth}>
                ›
              </button>
            </div>
          </header>

          {loading ? (
            <div className="schedule-empty">Đang tải lịch...</div>
          ) : (
            <div
              className="calendar-grid"
              aria-label={`Lịch sản xuất tháng ${currentMonth.getMonth() + 1}`}
            >
              {calendarDays.map((item) => (
                <div
                  className={`calendar-day${item.muted ? " is-muted" : ""}${
                    item.today ? " is-today" : ""
                  }${item.events.some((event) => event.tone === "red") ? " is-danger" : ""}`}
                  key={item.date.toISOString()}
                >
                  <span className="calendar-day__number">{item.day}</span>
                  <div className="calendar-day__events">
                    {item.events.map((event) => (
                      <span
                        className={`calendar-event calendar-event--${event.tone}`}
                        key={event.label}
                      >
                        {event.label}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="production-panel">
          <h2>Tiến độ sản xuất series</h2>
          {productionRows.length === 0 && !loading ? (
            <div className="schedule-empty">Chưa có series đang sản xuất.</div>
          ) : (
            <div className="production-list">
              {productionRows.map((row) => (
                <div className="production-item" key={row.chapter}>
                  <div className="production-item__head">
                    <h3>{row.chapter}</h3>
                    <span>{row.stage}</span>
                  </div>
                  <div className="production-track" aria-label={`${row.chapter} ${row.percent}%`}>
                    <span
                      className={`production-track__fill production-track__fill--${row.tone}`}
                      style={{ width: `${row.percent}%` }}
                    />
                  </div>
                  <div className="production-labels">
                    {row.labels.map((label, labelIndex) => (
                      <span className={labelIndex < 2 ? "is-active" : ""} key={label}>
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>

      <aside className="schedule-sidebar" aria-label="Công việc và lịch xuất bản">
        <article className="priority-panel">
          <h2>
            <span aria-hidden="true">!</span>
            Lịch xuất bản
          </h2>
          <div className="priority-list">
            {scheduledSeries.length === 0 && !loading ? (
              <div className="schedule-empty">Chưa có lịch xuất bản.</div>
            ) : (
              scheduledSeries.slice(0, 4).map((series) => (
                <label className="priority-task priority-task--blue" key={series.seriesId}>
                  <input type="checkbox" readOnly />
                  <span>
                    <strong>{series.title}</strong>
                    <small>{series.tantouName ? `Tantou: ${series.tantouName}` : "Chưa có Tantou"}</small>
                    <em>{scheduleLabel(series)}</em>
                  </span>
                </label>
              ))
            )}
          </div>
          <button className="view-all-button" type="button">
            Xem tất cả {scheduledSeries.length} lịch
          </button>
        </article>

        <article className="cover-panel">
          <h2>{seriesList[0]?.title ?? "Series mới nhất"}</h2>
          <p>
            Trạng thái:{" "}
            {seriesList[0]?.seriesStatus ? seriesList[0].seriesStatus : "Chưa có dữ liệu"}
          </p>
          <div className="cover-art" aria-label="Bìa minh họa series">
            <div className="cover-art__figure" />
            <span className="cover-art__slash cover-art__slash--one" />
            <span className="cover-art__slash cover-art__slash--two" />
          </div>
          <button type="button">Xem chi tiết</button>
        </article>
      </aside>
    </section>
  );
}
