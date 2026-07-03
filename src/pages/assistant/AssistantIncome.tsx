import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Wallet,
  CheckCircle2,
  Download,
  ChevronLeft,
  ChevronRight,
  FileText,
  PenTool,
  Loader2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
} from "lucide-react";
import "./AssistantIncome.scss";
import api from "../../services/api";

interface PaymentItem {
  paymentId: number;
  taskId: number;
  taskTypeName: string | null;
  taskDescription: string | null;
  seriesTitle: string | null;
  chapterNumber: number | null;
  rate: number;
  amount: number;
  penaltyPct: number;
  daysLate: number;
  paymentMonth: string;
  paymentStatus: string;
  createdAt: string;
  taskDeadline: string;
  submittedAt: string | null;
}

interface IncomeMonthRes {
  month: string;
  monthLabel: string;
  totalAmount: number;
  prevMonthAmount: number;
  taskCount: number;
  payments: PaymentItem[];
}

interface ApiResp<T> {
  data: T;
}

const formatVnd = (n: number) => n.toLocaleString("vi-VN") + " ₫";

const formatPct = (pct: number) => (pct > 0 ? `${pct}%` : "—");

const prevMonthStr = (month: string) => {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y, m - 2, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const nextMonthStr = (month: string) => {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y, m, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const toMonthLabel = (month: string) => {
  const [y, m] = month.split("-").map(Number);
  return `Tháng ${m}, ${y}`;
};

const taskIcon = (typeName: string | null) =>
  typeName?.toLowerCase().includes("tone") ? (
    <PenTool size={14} />
  ) : (
    <FileText size={14} />
  );

const IncomeDashboard: React.FC = () => {
  const now = new Date();
  const initMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const [month, setMonth] = useState(initMonth);
  const [data, setData] = useState<IncomeMonthRes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (m: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<ApiResp<IncomeMonthRes>>(
        `/assistant/income?month=${m}`,
      );
      setData(res.data.data);
    } catch {
      setError("Không thể tải dữ liệu thu nhập.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load(month);
  }, [month, load]);

  const pct =
    data && data.prevMonthAmount > 0
      ? Math.round(
          ((data.totalAmount - data.prevMonthAmount) / data.prevMonthAmount) *
            100,
        )
      : null;

  const isCurrentMonth = month === initMonth;

  return (
    <div className="assistant-income">
      <div className="page">
        <div className="header">
          <div className="headerText">
            <span className="breadcrumb">KỲ LƯƠNG / PAYMENT PERIOD</span>
            <h1 className="title">Thu nhập</h1>
          </div>
          <div className="monthSelector">
            <Calendar size={16} className="monthSelectorIcon" />
            <span className="monthSelectorLabel">{toMonthLabel(month)}</span>
            <div className="monthSelectorNav">
              <button
                className="monthSelectorBtn"
                onClick={() => setMonth(prevMonthStr(month))}
                aria-label="Tháng trước"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                className="monthSelectorBtn"
                onClick={() => setMonth(nextMonthStr(month))}
                disabled={isCurrentMonth}
                aria-label="Tháng sau"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="stateBox">
            <Loader2 size={20} className="spin" />
            Đang tải...
          </div>
        ) : error ? (
          <div className={`stateBox stateError`}>
            <AlertTriangle size={18} /> {error}
          </div>
        ) : (
          <>
            <div className="statsRow">
              <div className="statCard">
                <div className="statCardTop">
                  <span className="statCardTitle">TỔNG THU NHẬP THÁNG NÀY</span>
                  <span className={`statCardIcon statCardIconPrimary`}>
                    <Wallet size={18} />
                  </span>
                </div>
                <div className="statCardValue">
                  {formatVnd(data?.totalAmount ?? 0)}
                </div>
                {pct !== null && (
                  <div
                    className={`statCardSub ${
                      pct >= 0 ? "statCardSubSuccess" : "statCardSubDanger"
                    }`}
                  >
                    {pct >= 0 ? (
                      <TrendingUp size={13} />
                    ) : pct < 0 ? (
                      <TrendingDown size={13} />
                    ) : (
                      <Minus size={13} />
                    )}
                    {pct >= 0 ? "+" : ""}
                    {pct}% so với tháng trước
                  </div>
                )}
                {pct === null && (
                  <div className="statCardSub">Chưa có dữ liệu tháng trước</div>
                )}
              </div>

              <div className="statCard">
                <div className="statCardTop">
                  <span className="statCardTitle">TASK ĐÃ HOÀN THÀNH</span>
                  <span className={`statCardIcon statCardIconSuccess`}>
                    <CheckCircle2 size={18} />
                  </span>
                </div>
                <div className="statCardValue">
                  {data?.taskCount ?? 0}
                  <span className="statCardUnit"> task</span>
                </div>
                <div className="statCardSub">được Mangaka duyệt tháng này</div>
              </div>

              <div className="statCard">
                <div className="statCardTop">
                  <span className="statCardTitle">THÁNG TRƯỚC</span>
                  <span className={`statCardIcon statCardIconNeutral`}>
                    <Clock size={18} />
                  </span>
                </div>
                <div className="statCardValue">
                  {formatVnd(data?.prevMonthAmount ?? 0)}
                </div>
                <div className="statCardSub">
                  {toMonthLabel(prevMonthStr(month))}
                </div>
              </div>
            </div>

            <div className="detailSection">
              <div className="detailSectionHeader">
                <h2 className="detailSectionTitle">Bảng kê chi tiết</h2>
                <button className="exportLink">
                  <Download size={14} /> Xuất PDF
                </button>
              </div>

              {data?.payments.length === 0 ? (
                <div className="emptyState">
                  <Wallet size={32} strokeWidth={1.2} />
                  <p>
                    Chưa có khoản thanh toán nào trong {toMonthLabel(month)}.
                  </p>
                  <small>
                    Hoàn thành task và được Mangaka duyệt để nhận lương.
                  </small>
                </div>
              ) : (
                <div className="tableWrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>NGÀY GHI NHẬN</th>
                        <th>TASK</th>
                        <th>ĐƠN GIÁ</th>
                        <th>PHẠT</th>
                        <th>THỰC NHẬN</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.payments.map((p) => (
                        <tr key={p.paymentId}>
                          <td className="tdDate">
                            {p.createdAt?.split(" ")[0] ?? "—"}
                          </td>
                          <td>
                            <div className="taskCell">
                              <span className="taskIcon">
                                {taskIcon(p.taskTypeName)}
                              </span>
                              <div>
                                <div className="taskName">
                                  {p.taskTypeName ?? "Task"}
                                  {p.chapterNumber != null &&
                                    ` – Ch.${p.chapterNumber}`}
                                </div>
                                {p.seriesTitle && (
                                  <div className="taskSeries">
                                    {p.seriesTitle}
                                  </div>
                                )}
                                {p.daysLate > 0 && (
                                  <div className="lateNote">
                                    Trễ {p.daysLate} ngày
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="tdAmount">{formatVnd(p.rate)}</td>
                          <td className="tdPenalty">
                            {p.penaltyPct > 0 ? (
                              <span className="penaltyBadge">
                                -{formatPct(p.penaltyPct)}
                              </span>
                            ) : (
                              <span className="noPenalty">—</span>
                            )}
                          </td>
                          <td className="tdTotal">{formatVnd(p.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default IncomeDashboard;
