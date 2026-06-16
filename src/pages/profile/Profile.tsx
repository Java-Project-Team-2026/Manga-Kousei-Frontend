// src/pages/profile/Profile.tsx
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useUserProfile } from '../../hooks/useUser';
import { ChangePasswordModal } from './ChangePassword';
import { User, Mail, Briefcase, Edit2, Save, X, Camera, Key, BookOpen, ChevronRight } from 'lucide-react';
import type { UserFullProfile } from '../../types/userType';
import './Profile.scss';

export const Profile = () => {
  const { user: authUser } = useAuth();
  const userId = authUser?.id ?? null;

  const { profile, stats, loading, error, updateProfile, uploadAvatar, changePassword, refetch } = useUserProfile(userId);

  const [isEditing, setIsEditing] = useState(false);
  const [isChangePwOpen, setIsChangePwOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🔒 Chỉ fetch một lần khi userId có
  const hasLoaded = useRef(false);
  useEffect(() => {
    if (userId && !hasLoaded.current) {
      hasLoaded.current = true;
      refetch(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Đồng bộ fullName với profile (chỉ khi không edit)
  useEffect(() => {
    if (profile && !isEditing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFullName(profile.fullName);
    }
  }, [profile, isEditing]);

  const handleSave = async () => {
    if (!profile) return;
    setUpdating(true);
    try {
      if (fullName !== profile.fullName) {
        await updateProfile({ fullName });
      }
      if (avatarFile) {
        await uploadAvatar(avatarFile);
      }
      await refetch(true);
      setIsEditing(false);
      alert('Cập nhật thành công!');
    } catch (err) {
      console.error('Update error:', err);
      alert(err instanceof Error ? err.message : 'Cập nhật thất bại');
    } finally {
      setUpdating(false);
    }
  };

  const handleStartEdit = () => {
    if (profile) {
      setFullName(profile.fullName);
      setAvatarPreview(null);
      setAvatarFile(null);
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setAvatarFile(null);
    setAvatarPreview(null);
    if (profile) setFullName(profile.fullName);
  };

  const handleAvatarClick = () => {
    if (isEditing) fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleChangePassword = async (oldPw: string, newPw: string) => {
    try {
      await changePassword({ currentPassword: oldPw, newPassword: newPw });
      alert('Đổi mật khẩu thành công');
      setIsChangePwOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Đổi mật khẩu thất bại');
      throw err;
    }
  };

  if (loading && !profile) {
    return <div className="profile-loading">Đang tải thông tin...</div>;
  }

  if (error) {
    return <div className="profile-error">Lỗi: {error}</div>;
  }

  if (!profile) return null;

  const avatarUrl = avatarPreview || profile.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName)}&background=3b82f6&color=fff`;

  // Lấy role: ưu tiên từ authUser (đảm bảo đúng role hiện tại)
  let mainRole = 'MEMBER';
  if (authUser?.role) {
    mainRole = authUser.role;
  } else if (profile.roles && profile.roles.length > 0) {
    const adminRole = profile.roles.find(r => r.roleName.toUpperCase() === 'ADMIN');
    mainRole = adminRole ? adminRole.roleName : profile.roles[0].roleName;
  }

  const isFullProfile = 'createdSeries' in profile && Array.isArray(profile.createdSeries);
  const fullProfile = isFullProfile ? (profile as UserFullProfile) : null;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Hồ sơ cá nhân</h1>
        <div className="header-actions">
          <button className="change-pw-btn" onClick={() => setIsChangePwOpen(true)}>
            <Key size={16} /> Đổi mật khẩu
          </button>
          {!isEditing ? (
            <button className="edit-btn" onClick={handleStartEdit}>
              <Edit2 size={16} /> Chỉnh sửa
            </button>
          ) : (
            <div className="edit-actions">
              <button className="cancel-btn" onClick={handleCancelEdit} disabled={updating}>
                <X size={16} /> Hủy
              </button>
              <button className="save-btn" onClick={handleSave} disabled={updating}>
                <Save size={16} /> {updating ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="avatar-wrapper" onClick={handleAvatarClick}>
            <img src={avatarUrl} alt="avatar" className="profile-avatar" />
            {isEditing && (
              <div className="avatar-overlay">
                <Camera size={24} />
                <span>Đổi ảnh</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>
          <div className="info-badge">
            <span className="user-role-badge">{mainRole}</span>
            <p className="user-id">ID: {profile.id}</p>
          </div>

          {stats && (
            <div className="stats-summary">
              <div className="stat-item">
                <span className="stat-value">{stats.createdSeriesCount}</span>
                <span className="stat-label">Sáng tác</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.editedSeriesCount}</span>
                <span className="stat-label">Biên tập</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.manuscriptCount}</span>
                <span className="stat-label">Bản thảo</span>
              </div>
            </div>
          )}
        </div>

        <div className="profile-form">
          <div className="form-group">
            <label><User size={16} /> Họ và tên</label>
            {isEditing ? (
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nhập họ tên"
              />
            ) : (
              <p>{profile.fullName}</p>
            )}
          </div>

          <div className="form-group">
            <label><Mail size={16} /> Email</label>
            <p>{profile.email}</p>
            <small className="field-note">Không thể thay đổi email</small>
          </div>

          <div className="form-group">
            <label><Briefcase size={16} /> Vai trò</label>
            <p>{profile.roles.map(r => r.roleName).join(', ')}</p>
          </div>

          {fullProfile && (
            <>
              <div className="form-group full-width series-section">
                <label><BookOpen size={16} /> Tác phẩm đã tạo</label>
                {fullProfile.createdSeries.length === 0 ? (
                  <p className="empty">Chưa có tác phẩm nào</p>
                ) : (
                  <ul className="series-list">
                    {fullProfile.createdSeries.map((series) => (
                      <li key={series.seriesId}>
                        <span>{series.title}</span>
                        <span className="series-status">{series.seriesStatus}</span>
                        <ChevronRight size={14} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="form-group full-width series-section">
                <label><BookOpen size={16} /> Tác phẩm đã biên tập</label>
                {fullProfile.editedSeries.length === 0 ? (
                  <p className="empty">Chưa có tác phẩm nào</p>
                ) : (
                  <ul className="series-list">
                    {fullProfile.editedSeries.map((series) => (
                      <li key={series.seriesId}>
                        <span>{series.title}</span>
                        <span className="series-status">{series.seriesStatus}</span>
                        <ChevronRight size={14} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isChangePwOpen}
        onClose={() => setIsChangePwOpen(false)}
        onChangePassword={handleChangePassword}
      />
    </div>
  );
};
