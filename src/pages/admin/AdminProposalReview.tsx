import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  BookOpen,
  ChevronRight,
  FileText,
  ImageIcon,
  RotateCcw,
  Search,
  Send,
  Sparkles,
  Tag,
  Users,
  X,
  XCircle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { getAvatarColor, getInitials } from "../../utils";
import { formatDate } from "../../utils/date";
import {
  fetchAdminPendingProposals,
  adminReviewProposal,
} from "../../services/adminProposalService";
import type { SeriesProposal } from "../../types/SeriesProposal";
import "./AdminProposalReview.scss";

type ProposalStatus =
  | "pending"
  | "pending_admin"
  | "approved"
  | "revision"
  | "rejected";

const STATUS_META: Record<
  ProposalStatus,
  { label: string; className: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Chờ Tantou",
    className: "pr-badge--pending",
    icon: <Clock size={10} />,
  },
  pending_admin: {
    label: "Chờ Admin duyệt",
    className: "apr-badge--pending-admin",
    icon: <ShieldCheck size={10} />,
  },
  approved: {
    label: "Đã duyệt",
    className: "pr-badge--approved",
    icon: <CheckCircle2 size={10} />,
  },
  revision: {
    label: "Cần sửa",
    className: "pr-badge--revision",
    icon: <RotateCcw size={10} />,
  },
  rejected: {
    label: "Từ chối",
    className: "pr-badge--rejected",
    icon: <XCircle size={10} />,
  },
};

// ─── Collapsible section ──────────────────────────────────────────────────────
function Section({
  title,
  icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="pr-section">
      <button className="pr-section__head" onClick={() => setOpen((o) => !o)}>
        <span className="pr-section__icon">{icon}</span>
        <span className="pr-section__title">{title}</span>
        <ChevronRight
          size={14}
          style={{
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.15s",
          }}
        />
      </button>
      {open && <div className="pr-section__body">{children}</div>}
    </div>
  );
}

export default function AdminProposalReview() {
  const { proposalId } = useParams<{ proposalId?: string }>();
  const navigate = useNavigate();

  const [proposals, setProposals] = useState<SeriesProposal[]>([]);
  const [filter, setFilter] = useState<ProposalStatus | "all">("pending_admin");
  const [search, setSearch] = useState("");
  const [rejectionText, setRejectionText] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);

  const selected = proposalId
    ? (proposals.find((p) => p.proposal_id === Number(proposalId)) ?? null)
    : null;

  useEffect(() => {
    if (!proposalId && proposals.length > 0) {
      navigate(`/admin/proposal-review/${proposals[0].proposal_id}`, {
        replace: true,
      });
    }
  }, [proposalId, proposals, navigate]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchAdminPendingProposals();
        setProposals(data);
      } catch (err) {
        console.error("Không thể tải danh sách proposal", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const counts = {
    all: proposals.length,
    pending_admin: proposals.filter((p) => p.status === "pending_admin").length,
    approved: proposals.filter((p) => p.status === "approved").length,
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
      await adminReviewProposal(id, { decision: "approve" });
      setProposals((prev) =>
        prev.map((p) =>
          p.proposal_id === id ? { ...p, status: "approved" } : p,
        ),
      );
      setShowRejectForm(false);
    } catch (err) {
      console.error("Phê duyệt thất bại", err);
    } finally {
      setSubmitting(false);
    }
  };

  const sendRejection = async (id: number) => {
    if (!rejectionText.trim()) return;
    setSubmitting(true);
    try {
      await adminReviewProposal(id, {
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

  const openDetail = (p: SeriesProposal) => {
    navigate(`/admin/proposal-review/${p.proposal_id}`);
    setShowRejectForm(false);
    setRejectionText("");
  };

  return (
    <div className="pr-root">
      <div className="pr-list-col">
        <div className="pr-list-header">
          <div className="pr-list-header__top">
            <div className="pr-list-header__title">
              <ShieldCheck size={18} strokeWidth={1.75} />
              Duyệt Series (Admin)
            </div>
            <span className="apr-new-badge">
              {counts.pending_admin} chờ duyệt
            </span>
          </div>
          <p className="pr-list-header__sub">
            Bản Name đã được Tantou xét duyệt, chờ Admin phê duyệt cuối
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
          {(["all", "pending_admin", "approved", "rejected"] as const).map(
            (f) => (
              <button
                key={f}
                className={`pr-filter-tab ${filter === f ? "pr-filter-tab--on" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f === "all"
                  ? "Tất cả"
                  : f === "pending_admin"
                    ? "Chờ duyệt"
                    : f === "approved"
                      ? "Đã duyệt"
                      : "Từ chối"}
                <span className="pr-filter-tab__count">
                  {f === "all"
                    ? counts.all
                    : f === "pending_admin"
                      ? counts.pending_admin
                      : f === "approved"
                        ? counts.approved
                        : counts.rejected}
                </span>
              </button>
            ),
          )}
        </div>

        <div className="pr-list">
          {visible.map((p) => {
            const meta = STATUS_META[p.status];
            return (
              <button
                key={p.proposal_id}
                className={`pr-card ${selected?.proposal_id === p.proposal_id ? "pr-card--active" : ""} pr-card--${p.status}`}
                onClick={() => openDetail(p)}
              >
                <div className="pr-card__bar" />

                <div className="pr-card__content">
                  <div className="pr-card__row1">
                    <span className="pr-card__title">{p.working_title}</span>
                    <span className={`pr-badge ${meta.className}`}>
                      {meta.icon}
                      {meta.label}
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
                      {formatDate(p.created_at)}
                    </span>
                  </div>

                  <div className="pr-card__genres">
                    {p.genres.slice(0, 3).map((g, index) => (
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
            <p>Chọn một đề xuất để xem chi tiết và phê duyệt</p>
          </div>
        ) : (
          <>
            <div className="pr-detail__head apr-detail__head">
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
                  onClick={() => navigate("/admin/proposal-review")}
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
                    <RotateCcw size={12} /> Phản hồi chỉnh sửa từ Tantou
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

            <div className="pr-detail__footer">
              {selected.status === "pending_admin" ? (
                <>
                  {showRejectForm && (
                    <div className="pr-feedback-form pr-feedback-form--reject">
                      <div className="pr-feedback-form__label">
                        <XCircle size={13} /> Lý do từ chối (Admin)
                      </div>
                      <textarea
                        className="pr-feedback-form__area"
                        rows={3}
                        placeholder="Giải thích lý do Admin từ chối để tác giả hiểu và cải thiện..."
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
                          disabled={!rejectionText.trim() || submitting}
                        >
                          <Send size={14} /> Gửi từ chối
                        </button>
                      </div>
                    </div>
                  )}

                  {!showRejectForm && (
                    <div className="pr-detail__actions">
                      <button
                        className="pr-btn pr-btn--reject pr-btn--icon"
                        onClick={() => setShowRejectForm(true)}
                        disabled={submitting}
                      >
                        <XCircle size={14} /> Từ chối
                      </button>
                      <button
                        className="pr-btn pr-btn--approve pr-btn--icon apr-btn--approve"
                        onClick={() => approve(selected.proposal_id)}
                        disabled={submitting}
                      >
                        <CheckCircle2 size={14} /> Phê duyệt chính thức
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="pr-detail__footer--decided">
                  <span
                    className={`pr-badge pr-badge--lg ${STATUS_META[selected.status].className}`}
                  >
                    {STATUS_META[selected.status].icon}
                    {STATUS_META[selected.status].label}
                  </span>
                  <span className="apr-decided-note">
                    Đề xuất này đã được xử lý bởi Admin
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
