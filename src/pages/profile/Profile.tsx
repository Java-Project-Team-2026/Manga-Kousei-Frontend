import {
  BadgeCheck,
  Bell,
  CalendarDays,
  Camera,
  CheckCircle2,
  Clock3,
  Edit3,
  FileText,
  Globe2,
  KeyRound,
  Mail,
  MapPin,
  Palette,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { getAvatarColor, getInitials } from "../../utils";
import "./Profile.scss";

const roleLabels = {
  ADMIN: "Administrator",
  TANTOU: "Tantou Editor",
  MANGAKA: "Mangaka",
  ASSISTANT: "Production Assistant",
} as const;

const roleDescriptions = {
  ADMIN: "Full access to studio operations, approvals, contracts, and reports.",
  TANTOU: "Manages manga proposals, editorial reviews, creator assignments, and publication flow.",
  MANGAKA: "Creates proposals, manages series progress, coordinates with editors and assistants.",
  ASSISTANT: "Supports assigned production tasks, resources, delivery, and income tracking.",
} as const;

const profileStats = [
  { label: "Active Works", value: "08", tone: "blue" },
  { label: "Pending Reviews", value: "14", tone: "amber" },
  { label: "Completed Tasks", value: "126", tone: "green" },
  { label: "On-time Rate", value: "96%", tone: "indigo" },
];

const securityItems = [
  { label: "Password", value: "Updated 18 days ago", icon: KeyRound },
  { label: "Two-factor Auth", value: "Ready to enable", icon: ShieldCheck },
  { label: "Notifications", value: "Email and in-app alerts", icon: Bell },
];

const activityItems = [
  {
    title: "Proposal workflow synced",
    detail: "Kousei editorial pipeline refreshed with latest review states.",
    time: "Today, 09:24",
  },
  {
    title: "Profile verification checked",
    detail: "Account identity and role permissions are aligned.",
    time: "Yesterday, 16:10",
  },
  {
    title: "Production preferences updated",
    detail: "Dashboard language, timezone, and delivery alerts confirmed.",
    time: "Jun 12, 2026",
  },
];

function Profile() {
  const { user } = useAuth();

  const displayName = user?.fullName || "MangaKousei User";
  const email = user?.email || "user@mangakousei.local";
  const role = user?.role || "MANGAKA";
  const initials = getInitials(displayName);
  const avatarColor = getAvatarColor(displayName);

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
            <button className="profile-avatar__action" type="button" aria-label="Update avatar">
              <Camera size={16} />
            </button>
          </div>

          <div className="profile-hero__copy">
            <span className="profile-eyebrow">Your Profile</span>
            <div className="profile-title-row">
              <h1>{displayName}</h1>
              <span className="profile-verified">
                <BadgeCheck size={16} />
                Verified
              </span>
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
              <span>
                <MapPin size={15} />
                Tokyo Production Hub
              </span>
            </div>
          </div>
        </div>

        <div className="profile-hero__actions">
          <button className="profile-btn profile-btn--ghost" type="button">
            <ShieldCheck size={16} />
            Security
          </button>
          <button className="profile-btn profile-btn--primary" type="button">
            <Edit3 size={16} />
            Edit Profile
          </button>
        </div>
      </section>

      <section className="profile-stats-grid" aria-label="Profile production overview">
        {profileStats.map((stat) => (
          <article className={`profile-stat profile-stat--${stat.tone}`} key={stat.label}>
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
              <button className="profile-icon-btn" type="button" aria-label="Edit personal information">
                <Edit3 size={17} />
              </button>
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
                <span>Member ID</span>
                <strong>MK-{String(user?.id || 1024).padStart(5, "0")}</strong>
              </div>
              <div className="profile-info-item">
                <span>Timezone</span>
                <strong>Asia/Tokyo UTC+09</strong>
              </div>
              <div className="profile-info-item">
                <span>Language</span>
                <strong>English / Japanese</strong>
              </div>
            </div>
          </article>

          <article className="profile-panel">
            <div className="profile-panel__header">
              <div>
                <span className="profile-section-kicker">Production</span>
                <h2>Current Workspace</h2>
              </div>
              <span className="profile-status-pill">In Sync</span>
            </div>

            <div className="profile-workspace">
              <div className="profile-workspace__card">
                <div className="profile-workspace__icon">
                  <Palette size={21} />
                </div>
                <div>
                  <span>Creative Team</span>
                  <strong>MangaKousei Studio A</strong>
                  <p>Editorial planning, manuscript review, chapter tracking, and resource coordination.</p>
                </div>
              </div>

              <div className="profile-progress">
                <div className="profile-progress__top">
                  <span>Monthly Production Health</span>
                  <strong>82%</strong>
                </div>
                <div className="profile-progress__bar" aria-hidden="true">
                  <span />
                </div>
              </div>
            </div>
          </article>

          <article className="profile-panel">
            <div className="profile-panel__header">
              <div>
                <span className="profile-section-kicker">Activity</span>
                <h2>Recent Profile Events</h2>
              </div>
              <Clock3 size={18} />
            </div>

            <div className="profile-timeline">
              {activityItems.map((item) => (
                <div className="profile-timeline__item" key={item.title}>
                  <span className="profile-timeline__dot" />
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.detail}</p>
                    <time>{item.time}</time>
                  </div>
                </div>
              ))}
            </div>
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
              {securityItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div className="profile-security-item" key={item.label}>
                    <span className="profile-security-item__icon">
                      <Icon size={17} />
                    </span>
                    <div>
                      <strong>{item.label}</strong>
                      <p>{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>

          <article className="profile-card">
            <div className="profile-card__header">
              <h2>Preferences</h2>
              <Globe2 size={18} />
            </div>

            <div className="profile-preferences">
              <div>
                <CalendarDays size={17} />
                <span>Deadline reminders</span>
                <strong>On</strong>
              </div>
              <div>
                <FileText size={17} />
                <span>Review digest</span>
                <strong>Daily</strong>
              </div>
              <div>
                <Bell size={17} />
                <span>System alerts</span>
                <strong>Priority</strong>
              </div>
            </div>
          </article>
        </aside>
      </section>
    </main>
  );
}

export default Profile;
