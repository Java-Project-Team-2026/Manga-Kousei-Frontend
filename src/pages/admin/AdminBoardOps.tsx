import { useEffect, useMemo, useState } from "react";
import {
  createSeriesDecision,
  fetchLatestRanking,
  fetchSeriesRisks,
  importVoteBatch,
  type SeriesRankingRes,
  type SeriesRiskRes,
} from "../../services/adminBoardService";
import "./AdminBoardOps.scss";

interface VoteDraft {
  seriesId: string;
  voteCount: string;
  surveyScore: string;
  salesCount: string;
  commentCount: string;
}

const emptyVote: VoteDraft = {
  seriesId: "",
  voteCount: "",
  surveyScore: "",
  salesCount: "",
  commentCount: "",
};

export default function AdminBoardOps() {
  const [ranking, setRanking] = useState<SeriesRankingRes[]>([]);
  const [risks, setRisks] = useState<SeriesRiskRes[]>([]);
  const [issueCodeName, setIssueCodeName] = useState("");
  const [note, setNote] = useState("");
  const [votes, setVotes] = useState<VoteDraft[]>([{ ...emptyVote }]);
  const [decisionSeriesId, setDecisionSeriesId] = useState("");
  const [decisionType, setDecisionType] = useState<
    "continue" | "cancel" | "change_schedule"
  >("continue");
  const [decisionReason, setDecisionReason] = useState("");
  const [scheduleType, setScheduleType] = useState<"weekly" | "monthly">(
    "weekly",
  );
  const [dayValue, setDayValue] = useState("1");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    const [rankingData, riskData] = await Promise.all([
      fetchLatestRanking(),
      fetchSeriesRisks(),
    ]);
    setRanking(rankingData);
    setRisks(riskData);
  };

  useEffect(() => {
    load().catch(console.error);
  }, []);

  const selectedSeries = useMemo(
    () => ranking.find((r) => String(r.seriesId) === decisionSeriesId),
    [ranking, decisionSeriesId],
  );

  const updateVote = (idx: number, patch: Partial<VoteDraft>) => {
    setVotes((prev) => prev.map((v, i) => (i === idx ? { ...v, ...patch } : v)));
  };

  const handleImport = async () => {
    setBusy(true);
    setMessage("");
    try {
      await importVoteBatch({
        issueCodeName,
        note,
        votes: votes
          .filter((v) => v.seriesId && v.voteCount)
          .map((v) => ({
            seriesId: Number(v.seriesId),
            voteCount: Number(v.voteCount),
            surveyScore: v.surveyScore ? Number(v.surveyScore) : undefined,
            salesCount: v.salesCount ? Number(v.salesCount) : undefined,
            commentCount: v.commentCount ? Number(v.commentCount) : undefined,
          })),
      });
      setMessage("Đã nhập bình chọn và tính lại bảng xếp hạng.");
      setVotes([{ ...emptyVote }]);
      await load();
    } catch (err) {
      console.error(err);
      setMessage("Nhập bình chọn thất bại.");
    } finally {
      setBusy(false);
    }
  };

  const handleDecision = async () => {
    if (!decisionSeriesId) return;
    setBusy(true);
    setMessage("");
    try {
      await createSeriesDecision(Number(decisionSeriesId), {
        decisionType,
        reason: decisionReason,
        scheduleType:
          decisionType === "change_schedule" ? scheduleType : undefined,
        dayValue: decisionType === "change_schedule" ? Number(dayValue) : undefined,
      });
      setMessage("Đã lưu quyết định board.");
      setDecisionReason("");
      await load();
    } catch (err) {
      console.error(err);
      setMessage("Lưu quyết định thất bại.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="abo-page">
      <div className="abo-header">
        <h1>Editorial Board</h1>
        <p>Nhập bình chọn, xem nguy cơ và ra quyết định xuất bản.</p>
      </div>

      {message && <div className="abo-message">{message}</div>}

      <section className="abo-section">
        <h2>Nhập bình chọn kỳ phát hành</h2>
        <div className="abo-form-grid">
          <input
            placeholder="Mã kỳ phát hành"
            value={issueCodeName}
            onChange={(e) => setIssueCodeName(e.target.value)}
          />
          <input
            placeholder="Ghi chú"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <div className="abo-vote-table">
          {votes.map((vote, idx) => (
            <div className="abo-vote-row" key={idx}>
              <input
                placeholder="Series ID"
                value={vote.seriesId}
                onChange={(e) => updateVote(idx, { seriesId: e.target.value })}
              />
              <input
                placeholder="Vote"
                value={vote.voteCount}
                onChange={(e) => updateVote(idx, { voteCount: e.target.value })}
              />
              <input
                placeholder="Điểm"
                value={vote.surveyScore}
                onChange={(e) =>
                  updateVote(idx, { surveyScore: e.target.value })
                }
              />
              <input
                placeholder="Sales"
                value={vote.salesCount}
                onChange={(e) => updateVote(idx, { salesCount: e.target.value })}
              />
              <input
                placeholder="Comment"
                value={vote.commentCount}
                onChange={(e) =>
                  updateVote(idx, { commentCount: e.target.value })
                }
              />
            </div>
          ))}
        </div>
        <div className="abo-actions">
          <button onClick={() => setVotes((prev) => [...prev, { ...emptyVote }])}>
            Thêm dòng
          </button>
          <button
            className="abo-primary"
            onClick={handleImport}
            disabled={busy || !issueCodeName || !note}
          >
            Nhập bình chọn
          </button>
        </div>
      </section>

      <section className="abo-section">
        <h2>Bảng xếp hạng mới nhất</h2>
        <div className="abo-ranking">
          {ranking.map((r) => (
            <button
              key={r.seriesId}
              className="abo-rank-row"
              onClick={() => setDecisionSeriesId(String(r.seriesId))}
            >
              <span>#{r.rankingPosition}</span>
              <strong>{r.title}</strong>
              <span>{r.voteCount.toLocaleString()} vote</span>
              <span>{r.surveyScore ? Number(r.surveyScore).toFixed(1) : "-"}</span>
            </button>
          ))}
          {ranking.length === 0 && <div>Chưa có dữ liệu ranking.</div>}
        </div>
      </section>

      <section className="abo-section">
        <h2>Series cần theo dõi</h2>
        <div className="abo-risk-list">
          {risks.map((risk) => (
            <button
              key={risk.seriesId}
              className={`abo-risk abo-risk--${risk.riskLevel}`}
              onClick={() => setDecisionSeriesId(String(risk.seriesId))}
            >
              <strong>{risk.title}</strong>
              <span>{risk.riskLevel}</span>
              <small>{risk.reason}</small>
            </button>
          ))}
          {risks.length === 0 && <div>Không có series trong vùng nguy cơ.</div>}
        </div>
      </section>

      <section className="abo-section">
        <h2>Ra quyết định</h2>
        <div className="abo-form-grid">
          <input
            placeholder="Series ID"
            value={decisionSeriesId}
            onChange={(e) => setDecisionSeriesId(e.target.value)}
          />
          <select
            value={decisionType}
            onChange={(e) =>
              setDecisionType(
                e.target.value as "continue" | "cancel" | "change_schedule",
              )
            }
          >
            <option value="continue">Tiếp tục theo dõi</option>
            <option value="cancel">Huỷ series</option>
            <option value="change_schedule">Đổi lịch xuất bản</option>
          </select>
          {decisionType === "change_schedule" && (
            <>
              <select
                value={scheduleType}
                onChange={(e) =>
                  setScheduleType(e.target.value as "weekly" | "monthly")
                }
              >
                <option value="weekly">Hàng tuần</option>
                <option value="monthly">Hàng tháng</option>
              </select>
              <input
                placeholder="Ngày"
                value={dayValue}
                onChange={(e) => setDayValue(e.target.value)}
              />
            </>
          )}
        </div>
        {selectedSeries && (
          <p className="abo-selected">
            Đang chọn: #{selectedSeries.rankingPosition} {selectedSeries.title}
          </p>
        )}
        <textarea
          rows={3}
          placeholder="Lý do quyết định"
          value={decisionReason}
          onChange={(e) => setDecisionReason(e.target.value)}
        />
        <div className="abo-actions">
          <button
            className="abo-primary"
            onClick={handleDecision}
            disabled={busy || !decisionSeriesId || !decisionReason}
          >
            Lưu quyết định
          </button>
        </div>
      </section>
    </div>
  );
}
