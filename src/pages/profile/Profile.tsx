import { useEffect, useState } from "react";
import {
  Camera,
  CheckCircle2,
  Clock3,
  Edit3,
  KeyRound,
  Loader2,
  AlertTriangle,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { getAvatarColor, getInitials } from "../../utils";
import api from "../../services/api";
import {
  fetchMyLogs,
  type ActivityLogItem,
} from "../../services/activityLogService";
import { fetchMangakaReportStats } from "../../services/mangakaReportService";
import EditProfileModal from "../../components/profile/EditProfileModal";
import "./Profile.scss";

interface ApiResp<T> {
  data: T;
  message: string;
}

interface UserDetail {
  id: number;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  phone: string | null;
  roles: string[];
  createdSeries: number;
  editedSeries: number;
  createdAt: string | null;
  passwordChangedAt: string | null;
}

interface ProfileStat {
  label: string;
  value: string;
  tone: "blue" | "amber" | "green" | "indigo";
}

interface TantouReportStats {
  totalSeries: number;
  pendingReviewChapters: number;
  publishedChapters: number;
  totalDeadlines: number;
  overdueDeadlines: number;
  submittedDeadlines: number;
}

interface AssistantIncome {
  totalAmount: number;
  taskCount?: number;
}

interface AssistantTaskItem {
  taskId: number;
  taskStatus: "todo" | "doing" | "review" | "done" | string;
}

interface AdminDashboardStats {
  totalSeries: number;
  pendingAdminProposals: number;
  publishedChapters: number;
  totalMangaka: number;
  totalTantou: number;
  totalAssistant: number;
}

const roleLabels = {
  ADMIN: "Administrator",
  TANTOU: "Tantou Editor",
  MANGAKA: "Mangaka",
  ASSISTANT: "Production Assistant",
} as const;

const roleDescriptions = {
  ADMIN: "Full access to studio operations, approvals, contracts, and reports.",
  TANTOU:
    "Manages manga proposals, editorial reviews, creator assignments, and publication flow.",
  MANGAKA:
    "Creates proposals, manages series progress, coordinates with editors and assistants.",
  ASSISTANT:
    "Supports assigned production tasks, resources, delivery, and income tracking.",
} as const;

const fetchUserDetail = (userId: number): Promise<UserDetail> =>
  api.get<ApiResp<UserDetail>>(`/users/${userId}`).then((r) => r.data.data);

async function fetchRoleStats(role: string): Promise<ProfileStat[]> {
  switch (role) {
    case "MANGAKA": {
      const s = await fetchMangakaReportStats();
      return [
        {
          label: "Series đang quản lý",
          value: String(s.totalSeries),
          tone: "blue",
        },
        {
          label: "Đang chờ nộp",
          value: String(s.pendingDeadlines),
          tone: "amber",
        },
        { label: "Đã nộp", value: String(s.submittedDeadlines), tone: "green" },
        {
          label: "Tỉ lệ hoàn thành",
          value: `${s.completionRate}%`,
          tone: "indigo",
        },
      ];
    }
    case "TANTOU": {
      const s = await api
        .get<ApiResp<TantouReportStats>>("/tantou/reports/stats")
        .then((r) => r.data.data);
      const onTimePct =
        s.totalDeadlines > 0
          ? Math.round(
              ((s.totalDeadlines - s.overdueDeadlines) / s.totalDeadlines) *
                100,
            )
          : 0;
      return [
        {
          label: "Series phụ trách",
          value: String(s.totalSeries),
          tone: "blue",
        },
        {
          label: "Chương chờ duyệt",
          value: String(s.pendingReviewChapters),
          tone: "amber",
        },
        {
          label: "Chương đã đăng",
          value: String(s.publishedChapters),
          tone: "green",
        },
        { label: "Tỉ lệ đúng hạn", value: `${onTimePct}%`, tone: "indigo" },
      ];
    }
    case "ASSISTANT": {
      const [income, tasks] = await Promise.all([
        api
          .get<ApiResp<AssistantIncome>>("/assistant/income")
          .then((r) => r.data.data),
        api
          .get<ApiResp<AssistantTaskItem[]>>("/assistant/tasks")
          .then((r) => r.data.data ?? []),
      ]);
      const doing = tasks.filter((t) => t.taskStatus === "doing").length;
      const review = tasks.filter((t) => t.taskStatus === "review").length;
      const done = tasks.filter((t) => t.taskStatus === "done").length;
      return [
        { label: "Task đang làm", value: String(doing), tone: "blue" },
        { label: "Chờ duyệt", value: String(review), tone: "amber" },
        { label: "Đã hoàn thành", value: String(done), tone: "green" },
        {
          label: "Thu nhập tháng này",
          value:
            new Intl.NumberFormat("vi-VN").format(income.totalAmount ?? 0) +
            " ₫",
          tone: "indigo",
        },
      ];
    }
    case "ADMIN": {
      const s = await api
        .get<ApiResp<AdminDashboardStats>>("/admin/dashboard/stats")
        .then((r) => r.data.data);
      return [
        { label: "Tổng series", value: String(s.totalSeries), tone: "blue" },
        {
          label: "Proposal chờ duyệt",
          value: String(s.pendingAdminProposals),
          tone: "amber",
        },
        {
          label: "Chương đã đăng",
          value: String(s.publishedChapters),
          tone: "green",
        },
        {
          label: "Tổng nhân sự",
          value: String(s.totalMangaka + s.totalTantou + s.totalAssistant),
          tone: "indigo",
        },
      ];
    }
    default:
      return [];
  }
}

function formatRelativeDays(dateStr: string | null): string {
  if (!dateStr) return "Chưa rõ";
  const [d, m, y] = dateStr.split("/").map(Number);
  const date = new Date(y, m - 1, d);
  const diffDays = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (diffDays <= 0) return "Hôm nay";
  if (diffDays === 1) return "Hôm qua";
  return `${diffDays} ngày trước`;
}

function Profile() {
  const { user, updateUser } = useAuth();
  const [detail, setDetail] = useState<UserDetail | null>(null);
  const [stats, setStats] = useState<ProfileStat[]>([]);
  const [recentLogs, setRecentLogs] = useState<ActivityLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const displayName = user?.fullName || "MangaKousei User";
  const email = user?.email || "user@mangakousei.local";
  const role = (user?.role ?? "MANGAKA") as keyof typeof roleLabels;
  const initials = getInitials(displayName);
  const avatarColor = getAvatarColor(displayName);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetchUserDetail(user.id),
      fetchRoleStats(role),
      fetchMyLogs({ category: "account", page: 0, size: 5 }),
    ])
      .then(([d, s, logs]) => {
        setDetail(d);
        setStats(s);
        setRecentLogs(logs.content);
      })
      .catch(() => setError("Không thể tải dữ liệu hồ sơ. Vui lòng thử lại."))
      .finally(() => setLoading(false));
  }, [user, role]);

  if (loading) {
    return (
      <main className="profile-page profile-page--center">
        <Loader2 size={22} className="profile-spin" />
        Đang tải hồ sơ...
      </main>
    );
  }

  if (error) {
    return (
      <main className="profile-page profile-page--center profile-page--error">
        <AlertTriangle size={18} />
        {error}
      </main>
    );
  }

  return (
    <main className="profile-page">
      <section className="profile-hero">
        <div className="profile-hero__identity">
          <div className="profile-avatar" style={{ background: avatarColor }}>
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={`${displayName} avatar`} />
            ) : (
              <span>{initials}</span>
            )}
            <button
              className="profile-avatar__action"
              type="button"
              aria-label="Update avatar"
              title="Tính năng đổi avatar đang được hoàn thiện"
            >
              <Camera size={16} />
            </button>
          </div>

          <div className="profile-hero__copy">
            <span className="profile-eyebrow">Your Profile</span>
            <div className="profile-title-row">
              <h1>{displayName}</h1>
            </div>
            <p>{roleDescriptions[role]}</p>
            <div className="profile-meta">
              <span>
                <Mail size={15} />
                {email}
              </span>
              <span>
                <UserRound size={15} />
                {roleLabels[role]}
              </span>
            </div>
          </div>
        </div>

        <div className="profile-hero__actions">
          <button
            className="profile-btn profile-btn--primary"
            type="button"
            onClick={() => setShowEditModal(true)}
          >
            <Edit3 size={16} />
            Edit Profile
          </button>
        </div>
      </section>

      <section
        className="profile-stats-grid"
        aria-label="Profile production overview"
      >
        {stats.map((stat) => (
          <article
            className={`profile-stat profile-stat--${stat.tone}`}
            key={stat.label}
          >
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </section>

      <section className="profile-layout">
        <div className="profile-main">
          <article className="profile-panel">
            <div className="profile-panel__header">
              <div>
                <span className="profile-section-kicker">Account</span>
                <h2>Personal Information</h2>
              </div>
            </div>

            <div className="profile-info-grid">
              <div className="profile-info-item">
                <span>Full Name</span>
                <strong>{displayName}</strong>
              </div>
              <div className="profile-info-item">
                <span>Email Address</span>
                <strong>{email}</strong>
              </div>
              <div className="profile-info-item">
                <span>Primary Role</span>
                <strong>{roleLabels[role]}</strong>
              </div>
              <div className="profile-info-item">
                <span>Phone</span>
                <strong>{detail?.phone || "Chưa cập nhật"}</strong>
              </div>
              <div className="profile-info-item">
                <span>Member ID</span>
                <strong>{String(user?.id ?? 0).padStart(5, "0")}</strong>
              </div>
              <div className="profile-info-item">
                <span>Member Since</span>
                <strong>{detail?.createdAt ?? "—"}</strong>
              </div>
              <div className="profile-info-item">
                <span>Password Last Changed</span>
                <strong>
                  {formatRelativeDays(detail?.passwordChangedAt ?? null)}
                </strong>
              </div>
            </div>
          </article>

          <article className="profile-panel">
            <div className="profile-panel__header">
              <div>
                <span className="profile-section-kicker">Activity</span>
                <h2>Recent Account Events</h2>
              </div>
              <Clock3 size={18} />
            </div>

            {recentLogs.length === 0 ? (
              <p style={{ color: "#94a3b8", fontSize: 13 }}>
                Chưa có hoạt động tài khoản nào.
              </p>
            ) : (
              <div className="profile-timeline">
                {recentLogs.map((log) => (
                  <div className="profile-timeline__item" key={log.logId}>
                    <span className="profile-timeline__dot" />
                    <div>
                      <strong>
                        {log.actionType === "LOGIN"
                          ? "Đăng nhập"
                          : log.actionType === "UPDATE_PROFILE"
                            ? "Cập nhật hồ sơ"
                            : log.actionType === "CHANGE_PASSWORD"
                              ? "Đổi mật khẩu"
                              : log.actionType}
                      </strong>
                      <p>{log.detail}</p>
                      <time>{log.createdAt}</time>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>
        </div>

        <aside className="profile-sidebar" aria-label="Profile settings">
          <article className="profile-card profile-card--role">
            <div className="profile-card__icon">
              <Sparkles size={22} />
            </div>
            <span>Role Profile</span>
            <h2>{roleLabels[role]}</h2>
            <p>{roleDescriptions[role]}</p>
          </article>

          <article className="profile-card">
            <div className="profile-card__header">
              <h2>Security Center</h2>
              <CheckCircle2 size={18} />
            </div>

            <div className="profile-security-list">
              <div className="profile-security-item">
                <span className="profile-security-item__icon">
                  <KeyRound size={17} />
                </span>
                <div>
                  <strong>Password</strong>
                  <p>
                    Đổi lần cuối:{" "}
                    {formatRelativeDays(detail?.passwordChangedAt ?? null)}
                  </p>
                </div>
              </div>
              <div className="profile-security-item">
                <span className="profile-security-item__icon">
                  <ShieldCheck size={17} />
                </span>
                <div>
                  <strong>Xác thực</strong>
                  <p>JWT qua cookie httpOnly</p>
                </div>
              </div>
            </div>
          </article>
        </aside>
      </section>

      {showEditModal && (
        <EditProfileModal
          currentFullName={displayName}
          currentAvatarUrl={user?.avatarUrl ?? null}
          currentPhone={detail?.phone ?? null}
          onClose={() => setShowEditModal(false)}
          onSaved={({ fullName, avatarUrl, phone }) => {
            updateUser({ fullName, avatarUrl });
            setDetail((prev) => (prev ? { ...prev, fullName, phone } : prev));
            setShowEditModal(false);
          }}
        />
      )}
    </main>
  );
}

export default Profile;
