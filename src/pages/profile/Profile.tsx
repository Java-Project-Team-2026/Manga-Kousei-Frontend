import { useMemo, useState } from "react";
import type { FormEvent } from "react";
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
  Loader2,
  Mail,
  MapPin,
  Palette,
  Save,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import {
  changeMyPassword,
  updateMyProfile,
  type UserProfile,
} from "../../services/profileService";
import type { AuthUser } from "../../types/auth";
import { getErrorMessage } from "../../utils/axios";
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
  TANTOU:
    "Manages manga proposals, editorial reviews, creator assignments, and publication flow.",
  MANGAKA:
    "Creates proposals, manages series progress, coordinates with editors and assistants.",
  ASSISTANT:
    "Supports assigned production tasks, resources, delivery, and income tracking.",
} as const;

const profileStats = [
  { label: "Active Works", value: "08", tone: "blue" },
  { label: "Pending Reviews", value: "14", tone: "amber" },
  { label: "Completed Tasks", value: "126", tone: "green" },
  { label: "On-time Rate", value: "96%", tone: "indigo" },
];

const securityItems = [
  { label: "Password", value: "Protected by encrypted credentials", icon: KeyRound },
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

const toAuthUser = (profile: UserProfile): AuthUser => ({
  id: profile.id,
  fullName: profile.fullName,
  email: profile.email,
  role:
    (profile.roles.at(0) as AuthUser["role"] | undefined) ?? "MANGAKA",
  avatarUrl: profile.avatarUrl,
});

function Profile() {
  const { user, updateUser, refreshUser } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const displayName = user?.fullName || "MangaKousei User";
  const email = user?.email || "user@mangakousei.local";
  const role = user?.role || "MANGAKA";
  const initials = getInitials(displayName);
  const avatarColor = useMemo(() => getAvatarColor(displayName), [displayName]);
  const previewAvatar = avatarUrl.trim() || user?.avatarUrl || "";

  const handleRefreshUser = async () => {
    setProfileError("");
    setProfileMessage("");

    try {
      const refreshedUser = await refreshUser();
      setFullName(refreshedUser.fullName);
      setAvatarUrl(refreshedUser.avatarUrl ?? "");
      setProfileMessage("Profile data refreshed.");
    } catch (error) {
      setProfileError(getErrorMessage(error, "Could not refresh profile data."));
    }
  };

  const handleProfileSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setProfileError("");
    setProfileMessage("");

    if (!fullName.trim()) {
      setProfileError("Full name cannot be blank.");
      return;
    }

    try {
      setProfileSubmitting(true);
      const updatedProfile = await updateMyProfile({
        fullName: fullName.trim(),
        avatarUrl: avatarUrl.trim() || null,
      });

      updateUser(toAuthUser(updatedProfile));
      setFullName(updatedProfile.fullName);
      setAvatarUrl(updatedProfile.avatarUrl ?? "");
      setProfileMessage("Profile updated successfully.");
    } catch (error) {
      setProfileError(getErrorMessage(error, "Could not update profile."));
    } finally {
      setProfileSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setPasswordError("");
    setPasswordMessage("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New password confirmation does not match.");
      return;
    }

    try {
      setPasswordSubmitting(true);
      await changeMyPassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage("Password changed successfully.");
    } catch (error) {
      setPasswordError(getErrorMessage(error, "Could not change password."));
    } finally {
      setPasswordSubmitting(false);
    }
  };

  return (
    <main className="profile-page">
      <section className="profile-hero">
        <div className="profile-hero__identity">
          <div className="profile-avatar" style={{ background: avatarColor }}>
            {previewAvatar ? (
              <img src={previewAvatar} alt={`${displayName} avatar`} />
            ) : (
              <span>{initials}</span>
            )}
            <button
              className="profile-avatar__action"
              type="button"
              aria-label="Update avatar"
            >
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
          <button
            className="profile-btn profile-btn--ghost"
            type="button"
            onClick={handleRefreshUser}
          >
            <ShieldCheck size={16} />
            Refresh
          </button>
          <button
            className="profile-btn profile-btn--primary"
            type="submit"
            form="profile-form"
            disabled={profileSubmitting}
          >
            {profileSubmitting ? <Loader2 size={16} /> : <Save size={16} />}
            Save Profile
          </button>
        </div>
      </section>

      <section
        className="profile-stats-grid"
        aria-label="Profile production overview"
      >
        {profileStats.map((stat) => (
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
              <Edit3 size={18} />
            </div>

            <form
              className="profile-form"
              id="profile-form"
              onSubmit={handleProfileSubmit}
            >
              <label className="profile-field">
                <span>Full Name</span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Enter your full name"
                  maxLength={100}
                />
              </label>

              <label className="profile-field">
                <span>Avatar URL</span>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(event) => setAvatarUrl(event.target.value)}
                  placeholder="https://example.com/avatar.png"
                  maxLength={500}
                />
              </label>

              <div className="profile-info-grid">
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
                  <span>Editable Fields</span>
                  <strong>Name and avatar only</strong>
                </div>
              </div>

              {(profileMessage || profileError) && (
                <p
                  className={`profile-feedback ${
                    profileError ? "profile-feedback--error" : ""
                  }`}
                >
                  {profileError || profileMessage}
                </p>
              )}
            </form>
          </article>

          <article className="profile-panel">
            <div className="profile-panel__header">
              <div>
                <span className="profile-section-kicker">Security</span>
                <h2>Change Password</h2>
              </div>
              <KeyRound size={18} />
            </div>

            <form className="profile-form" onSubmit={handlePasswordSubmit}>
              <label className="profile-field">
                <span>Current Password</span>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  placeholder="Enter current password"
                  autoComplete="current-password"
                />
              </label>

              <div className="profile-form__row">
                <label className="profile-field">
                  <span>New Password</span>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    minLength={8}
                  />
                </label>

                <label className="profile-field">
                  <span>Confirm New Password</span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Repeat new password"
                    autoComplete="new-password"
                    minLength={8}
                  />
                </label>
              </div>

              {(passwordMessage || passwordError) && (
                <p
                  className={`profile-feedback ${
                    passwordError ? "profile-feedback--error" : ""
                  }`}
                >
                  {passwordError || passwordMessage}
                </p>
              )}

              <button
                className="profile-btn profile-btn--primary profile-form__submit"
                type="submit"
                disabled={passwordSubmitting}
              >
                {passwordSubmitting ? <Loader2 size={16} /> : <KeyRound size={16} />}
                Change Password
              </button>
            </form>
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
                  <p>
                    Editorial planning, manuscript review, chapter tracking,
                    and resource coordination.
                  </p>
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
