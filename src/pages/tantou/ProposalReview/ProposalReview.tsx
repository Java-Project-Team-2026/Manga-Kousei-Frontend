import { useEffect, useState } from "react";
import {
  Sparkles,
  Clock,
  ChevronRight,
  Users,
  BookOpen,
  ImageIcon,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Send,
  Tag,
  X,
  FileText,
  Search,
  Calendar,
} from "lucide-react";
import "./ProposalReview.scss";
import { formatDate, timeAgo } from "../../../utils/date";
import Section from "./Section";
import {
  fetchProposals,
  reopenProposal,
  reviewProposal,
} from "../../../services/tantouService";
import { getAvatarColor, getInitials } from "../../../utils";
import type {
  ProposalStatus,
  SeriesProposal,
} from "../../../types/SeriesProposal";
import { useNavigate, useParams } from "react-router-dom";

const STATUS_META: Record<
  ProposalStatus,
  { label: string; className: string; icon: React.ReactNode }
> = {
  pending: {
    label: "CHỜ DUYỆT",
    className: "pr-badge--pending",
    icon: <Clock size={11} />,
  },
  approved: {
    label: "ĐÃ DUYỆT",
    className: "pr-badge--approved",
    icon: <CheckCircle2 size={11} />,
  },
  revision: {
    label: "CẦN SỬA",
    className: "pr-badge--revision",
    icon: <RotateCcw size={11} />,
  },
  rejected: {
    label: "TỪ CHỐI",
    className: "pr-badge--rejected",
    icon: <XCircle size={11} />,
  },
  pending_admin: {
    label: "CHỜ ADMIN",
    className: "pr-badge--pending-admin",
    icon: <Clock size={11} />,
  },
};

export default function ProposalReview() {
  const { proposalId } = useParams<{ proposalId?: string }>();
  const navigate = useNavigate();

  const [proposals, setProposals] = useState<SeriesProposal[]>([]);
  // const [selected, setSelected] = useState<SeriesProposal | null>(null);
  const selected = proposalId
    ? (proposals.find((p) => p.proposal_id === Number(proposalId)) ?? null)
    : null;
  const [filter, setFilter] = useState<ProposalStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [revisionText, setRevisionText] = useState("");
  const [rejectionText, setRejectionText] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!proposalId && proposals.length > 0 && !selected) {
      navigate(`/tantou/proposal-review/${proposals[0].proposal_id}`, {
        replace: true,
      });
    }
  }, [proposalId, proposals, selected, navigate]);

  useEffect(() => {
    const loadProposals = async () => {
      try {
        setLoading(true);
        const data = await fetchProposals();
        setProposals(data);
      } catch (err) {
        console.error("unsuccessful fetch data proposals", err);
      } finally {
        setLoading(false);
      }
    };
    loadProposals();
  }, []);

  const counts = {
    all: proposals.length,
    pending: proposals.filter((p) => p.status === "pending").length,
    pending_admin: proposals.filter((p) => p.status === "pending_admin").length,
    approved: proposals.filter((p) => p.status === "approved").length,
    revision: proposals.filter((p) => p.status === "revision").length,
    rejected: proposals.filter((p) => p.status === "rejected").length,
  };

  const visible = proposals.filter((p) => {
    const matchFilter = filter === "all" || p.status === filter;
    const matchSearch =
      p.working_title.toLowerCase().includes(search.toLowerCase()) ||
      p.mangaka.fullName.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const approve = async (id: number) => {
    setSubmitting(true);
    try {
      await reviewProposal(id, { decision: "approve" });
      setProposals((prev) =>
        prev.map((p) =>
          p.proposal_id === id
            ? { ...p, status: "pending_admin", rejection_reason: null }
            : p,
        ),
      );
      setShowRejectForm(false);
      setShowRevisionForm(false);
    } catch (err) {
      console.error("Phê duyệt thất bại", err);
    } finally {
      setSubmitting(false);
    }
  };

  const sendRevision = async (id: number) => {
    if (!revisionText.trim()) return;
    setSubmitting(true);
    try {
      await reviewProposal(id, {
        decision: "revision",
        feedback: revisionText.trim(),
      });

      setProposals((prev) =>
        prev.map((p) =>
          p.proposal_id === id
            ? {
                ...p,
                status: "revision",
                revision_feedback: revisionText.trim(),
              }
            : p,
        ),
      );

      setRevisionText("");
      setShowRevisionForm(false);
    } catch (err) {
      console.error("Yêu cầu sửa thất bại", err);
    } finally {
      setSubmitting(false);
    }
  };

  const sendRejection = async (id: number) => {
    if (!rejectionText.trim()) return;
    setSubmitting(true);
    try {
      await reviewProposal(id, {
        decision: "reject",
        reason: rejectionText.trim(),
      });

      setProposals((prev) =>
        prev.map((p) =>
          p.proposal_id === id
            ? {
                ...p,
                status: "rejected",
                rejection_reason: rejectionText.trim(),
              }
            : p,
        ),
      );

      setRejectionText("");
      setShowRejectForm(false);
    } catch (err) {
      console.error("Từ chối thất bại", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReopen = async (id: number) => {
    setSubmitting(true);
    try {
      await reopenProposal(id);
      setProposals((prev) =>
        prev.map((p) =>
          p.proposal_id === id
            ? {
                ...p,
                status: "pending",
                rejection_reason: null,
                revision_feedback: null,
              }
            : p,
        ),
      );
    } catch (err) {
      console.error("Mở lại thất bại", err);
    } finally {
      setSubmitting(false);
    }
  };

  const openDetail = (p: SeriesProposal) => {
    navigate(`/tantou/proposal-review/${p.proposal_id}`);

    setShowRejectForm(false);
    setShowRevisionForm(false);
    setRevisionText("");
    setRejectionText("");
  };

  return (
    <div className="pr-root">
      <div className="pr-list-col">
        <div className="pr-list-header">
          <div className="pr-list-header__top">
            <div className="pr-list-header__title">
              <Sparkles size={18} strokeWidth={1.75} />
              Đề xuất Series Mới
            </div>
            <span className="pr-new-badge">{counts.pending} mới</span>
          </div>
          <p className="pr-list-header__sub">
            Bản Name ý tưởng từ Mangaka gửi lên xét duyệt
          </p>

          <div className="pr-search">
            <Search size={15} className="pr-search__icon" />
            <input
              className="pr-search__input"
              placeholder="Tìm tên truyện, tác giả..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="pr-filter-tabs">
          {(
            [
              "all",
              "pending",
              "pending_admin",
              "revision",
              "approved",
              "rejected",
            ] as const
          ).map((f) => (
            <button
              key={f}
              className={`pr-filter-tab ${filter === f ? "pr-filter-tab--on" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "all"
                ? "Tất cả"
                : f === "pending"
                  ? "Chờ duyệt"
                  : f === "pending_admin"
                    ? "Chờ Admin"
                    : f === "revision"
                      ? "Cần sửa"
                      : f === "approved"
                        ? "Đã duyệt"
                        : "Từ chối"}
              <span className="pr-filter-tab__count">{counts[f]}</span>
            </button>
          ))}
        </div>

        <div className="pr-cards">
          {visible.length === 0 && (
            <div className="pr-cards__empty">
              <FileText size={28} strokeWidth={1} />
              <p>Không có đề xuất nào.</p>
            </div>
          )}

          {visible.map((p) => {
            const isActive = selected?.proposal_id === p.proposal_id;
            const sm = STATUS_META[p.status];
            return (
              <button
                key={p.proposal_id}
                className={`pr-card ${isActive ? "pr-card--active" : ""} pr-card--${p.status}`}
                onClick={() => openDetail(p)}
              >
                <div className="pr-card__bar" />

                <div className="pr-card__content">
                  <div className="pr-card__row1">
                    <span className="pr-card__title">{p.working_title}</span>
                    <span className={`pr-badge ${sm.className}`}>
                      {sm.icon}
                      {sm.label}
                    </span>
                  </div>

                  <div className="pr-card__row2">
                    <div className="pr-card__author">
                      {p.mangaka.avatarUrl ? (
                        <img
                          className="pr-avatar pr-avatar--sm"
                          src={p.mangaka.avatarUrl}
                          alt={p.mangaka.fullName}
                        />
                      ) : (
                        <div
                          className="pr-avatar pr-avatar--sm"
                          style={{
                            background: getAvatarColor(p.mangaka.fullName),
                          }}
                        >
                          {getInitials(p.mangaka.fullName)}
                        </div>
                      )}
                      <span>{p.mangaka.fullName}</span>
                    </div>
                    <span className="pr-card__date">
                      <Calendar size={11} />
                      {timeAgo(p.created_at)}
                    </span>
                  </div>

                  <div className="pr-card__genres">
                    {p.genres.map((g, index) => (
                      <span
                        key={g.genre_id ?? `genre-${index}`}
                        className="pr-genre-chip"
                      >
                        {g.name}
                      </span>
                    ))}
                    <span className="pr-audience-chip">
                      {p.target_audience}
                    </span>
                  </div>
                </div>

                <ChevronRight size={16} className="pr-card__arrow" />
              </button>
            );
          })}
        </div>
      </div>

      <div className={`pr-detail ${selected ? "pr-detail--open" : ""}`}>
        {!selected ? (
          <div className="pr-detail__empty">
            <div className="pr-detail__empty-icon">
              <Sparkles size={36} strokeWidth={1} />
            </div>
            <p>Chọn một đề xuất để xem chi tiết</p>
          </div>
        ) : (
          <>
            <div className="pr-detail__head">
              <div className="pr-detail__head-main">
                <div>
                  <div className="pr-detail__eyebrow">
                    ĐỀ XUẤT #{selected.proposal_id.toString().padStart(4, "0")}{" "}
                    · {formatDate(selected.created_at)}
                  </div>
                  <h2 className="pr-detail__title">{selected.working_title}</h2>
                </div>
                <button
                  className="pr-detail__close"
                  onClick={() => navigate("/tantou/proposal-review")}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="pr-detail__author-row">
                {selected.mangaka.avatarUrl ? (
                  <img
                    className="pr-avatar"
                    src={selected.mangaka.avatarUrl}
                    alt={selected.mangaka.fullName}
                  />
                ) : (
                  <div
                    className="pr-avatar"
                    style={{
                      background: getAvatarColor(selected.mangaka.fullName),
                    }}
                  >
                    {getInitials(selected.mangaka.fullName)}
                  </div>
                )}
                <div>
                  <div className="pr-detail__author-name">
                    {selected.mangaka.fullName}
                  </div>
                  <div className="pr-detail__author-role">Mangaka</div>
                </div>
                <span
                  className={`pr-badge pr-badge--lg ${STATUS_META[selected.status].className}`}
                >
                  {STATUS_META[selected.status].icon}
                  {STATUS_META[selected.status].label}
                </span>
              </div>

              <div className="pr-detail__chips">
                {selected.genres.map((g, index) => (
                  <span
                    key={g.genre_id ?? `genre-${index}`}
                    className="pr-genre-chip pr-genre-chip--lg"
                  >
                    <Tag size={11} /> {g.name}
                  </span>
                ))}
                <span className="pr-audience-chip pr-audience-chip--lg">
                  <Users size={11} /> {selected.target_audience}
                </span>
              </div>
            </div>

            <div className="pr-detail__body">
              <Section title="Tóm tắt cốt truyện" icon={<BookOpen size={13} />}>
                <p className="pr-text">{selected.synopsis}</p>
              </Section>

              {selected.name_summary && (
                <Section
                  title="Bản Name phác thảo"
                  icon={<FileText size={13} />}
                >
                  <div className="pr-name-summary">
                    {selected.name_summary.split("\n").map((line, i) => (
                      <div key={i} className="pr-name-summary__line">
                        <span className="pr-name-summary__dot" />
                        <span>{line}</span>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {selected.characters.length > 0 && (
                <Section
                  title={`Nhân vật (${selected.characters.length})`}
                  icon={<Users size={13} />}
                >
                  <div className="pr-characters">
                    {selected.characters.map((c, index) => (
                      <div
                        key={c.character_id ?? `char-${index}`}
                        className="pr-character"
                      >
                        <div className="pr-character__head">
                          <span className="pr-character__name">
                            {c.character_name}
                          </span>
                          <span className="pr-character__role">{c.role}</span>
                        </div>
                        {c.description && (
                          <p className="pr-character__desc">{c.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {selected.sketch_image_url ? (
                <Section title="Ảnh phác thảo" icon={<ImageIcon size={13} />}>
                  <div className="pr-sketch">
                    <img
                      src={selected.sketch_image_url}
                      alt="Phác thảo"
                      className="pr-sketch__img"
                    />
                  </div>
                </Section>
              ) : (
                <Section
                  title="Ảnh phác thảo"
                  icon={<ImageIcon size={13} />}
                  defaultOpen={false}
                >
                  <div className="pr-sketch pr-sketch--empty">
                    <ImageIcon size={24} strokeWidth={1} />
                    <span>Tác giả chưa đính kèm ảnh phác thảo</span>
                  </div>
                </Section>
              )}

              {selected.revision_feedback && (
                <div className="pr-prev-feedback pr-prev-feedback--revision">
                  <div className="pr-prev-feedback__label">
                    <RotateCcw size={12} /> Phản hồi yêu cầu sửa (trước đó)
                  </div>
                  <p>{selected.revision_feedback}</p>
                </div>
              )}
              {selected.rejection_reason && (
                <div className="pr-prev-feedback pr-prev-feedback--rejected">
                  <div className="pr-prev-feedback__label">
                    <XCircle size={12} /> Lý do từ chối
                  </div>
                  <p>{selected.rejection_reason}</p>
                </div>
              )}
            </div>

            {selected.status === "pending" || selected.status === "revision" ? (
              <div className="pr-detail__footer">
                {showRevisionForm && (
                  <div className="pr-feedback-form pr-feedback-form--revision">
                    <div className="pr-feedback-form__label">
                      <RotateCcw size={13} /> Yêu cầu chỉnh sửa
                    </div>
                    <textarea
                      className="pr-feedback-form__area"
                      rows={3}
                      placeholder="Mô tả cụ thể những gì tác giả cần chỉnh sửa hoặc bổ sung..."
                      value={revisionText}
                      onChange={(e) => setRevisionText(e.target.value)}
                      autoFocus
                    />
                    <div className="pr-feedback-form__actions">
                      <button
                        className="pr-btn pr-btn--ghost"
                        onClick={() => {
                          setShowRevisionForm(false);
                          setRevisionText("");
                        }}
                      >
                        Hủy
                      </button>
                      <button
                        className="pr-btn pr-btn--revision"
                        onClick={() => sendRevision(selected.proposal_id)}
                        disabled={!revisionText.trim()}
                      >
                        <Send size={14} /> Gửi yêu cầu sửa
                      </button>
                    </div>
                  </div>
                )}

                {showRejectForm && (
                  <div className="pr-feedback-form pr-feedback-form--reject">
                    <div className="pr-feedback-form__label">
                      <XCircle size={13} /> Lý do từ chối
                    </div>
                    <textarea
                      className="pr-feedback-form__area"
                      rows={3}
                      placeholder="Giải thích lý do từ chối để tác giả hiểu và cải thiện trong lần sau..."
                      value={rejectionText}
                      onChange={(e) => setRejectionText(e.target.value)}
                      autoFocus
                    />
                    <div className="pr-feedback-form__actions">
                      <button
                        className="pr-btn pr-btn--ghost"
                        onClick={() => {
                          setShowRejectForm(false);
                          setRejectionText("");
                        }}
                      >
                        Hủy
                      </button>
                      <button
                        className="pr-btn pr-btn--reject"
                        onClick={() => sendRejection(selected.proposal_id)}
                        disabled={!rejectionText.trim()}
                      >
                        <XCircle size={14} /> Xác nhận từ chối
                      </button>
                    </div>
                  </div>
                )}

                {!showRevisionForm && !showRejectForm && (
                  <div className="pr-detail__actions">
                    <button
                      className="pr-btn pr-btn--ghost pr-btn--icon"
                      onClick={() => setShowRejectForm(true)}
                    >
                      <XCircle size={16} strokeWidth={1.75} /> Từ chối
                    </button>
                    <button
                      className="pr-btn pr-btn--revision pr-btn--icon"
                      onClick={() => setShowRevisionForm(true)}
                    >
                      <RotateCcw size={15} strokeWidth={1.75} /> Yêu cầu sửa
                    </button>
                    <button
                      className="pr-btn pr-btn--approve pr-btn--icon"
                      disabled={submitting}
                      onClick={() => approve(selected.proposal_id)}
                    >
                      <CheckCircle2 size={16} strokeWidth={1.75} /> Phê duyệt
                    </button>
                  </div>
                )}
              </div>
            ) : selected.status === "pending_admin" ? (
              <div className="pr-detail__footer pr-detail__footer--decided">
                <span className="pr-badge pr-badge--lg pr-badge--pending-admin">
                  <Clock size={11} /> CHỜ ADMIN DUYỆT
                </span>
                <p className="pr-detail__footer-note">
                  Đề xuất đã được bạn phê duyệt và đang chờ Admin xét duyệt lần
                  cuối.
                </p>
                <button
                  className="pr-btn pr-btn--ghost"
                  disabled={submitting}
                  onClick={() => handleReopen(selected.proposal_id)}
                >
                  Mở lại xét duyệt
                </button>
              </div>
            ) : (
              <div className="pr-detail__footer pr-detail__footer--decided">
                <span
                  className={`pr-badge pr-badge--lg ${STATUS_META[selected.status].className}`}
                >
                  {STATUS_META[selected.status].icon}
                  {STATUS_META[selected.status].label}
                </span>
                {(selected.status === "rejected" ||
                  selected.status === "approved") && (
                  <button
                    className="pr-btn pr-btn--ghost"
                    disabled={submitting}
                    onClick={() => handleReopen(selected.proposal_id)}
                  >
                    Mở lại xét duyệt
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
