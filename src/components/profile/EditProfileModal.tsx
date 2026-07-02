import { useRef, useState } from "react";
import { X, Loader2, Camera, AlertTriangle, CheckCircle2 } from "lucide-react";
import axios from "axios";
import {
  updateMyProfile,
  changeMyPassword,
} from "../../services/userProfileService";
import { uploadImageToCloudinary } from "../../utils/imageUpload";
import { getAvatarColor, getInitials } from "../../utils";
import "./EditProfileModal.scss";

interface Props {
  currentFullName: string;
  currentAvatarUrl: string | null;
  currentPhone: string | null;
  currentBio: string | null;
  onClose: () => void;
  onSaved: (result: {
    fullName: string;
    avatarUrl: string | null;
    phone: string | null;
    bio: string | null;
  }) => void;
}

type Tab = "info" | "password";

const MAX_AVATAR_MB = 5;

export default function EditProfileModal({
  currentFullName,
  currentAvatarUrl,
  currentPhone,
  currentBio,
  onClose,
  onSaved,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<Tab>("info");

  // ─── Tab "Thông tin" ───
  const [fullName, setFullName] = useState(currentFullName);
  const [phone, setPhone] = useState(currentPhone ?? "");
  const [bio, setBio] = useState(currentBio ?? "");
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [savingInfo, setSavingInfo] = useState(false);
  const [infoError, setInfoError] = useState<string | null>(null);

  // ─── Tab "Mật khẩu" ───
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setInfoError("Vui lòng chọn 1 file ảnh.");
      return;
    }
    if (file.size > MAX_AVATAR_MB * 1024 * 1024) {
      setInfoError(`Ảnh tối đa ${MAX_AVATAR_MB}MB.`);
      return;
    }

    setInfoError(null);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSaveInfo = async () => {
    const trimmedName = fullName.trim();
    if (trimmedName.length < 2) {
      setInfoError("Họ tên phải có ít nhất 2 ký tự.");
      return;
    }
    const trimmedPhone = phone.trim();
    if (trimmedPhone && !/^[0-9+\-\s]{8,15}$/.test(trimmedPhone)) {
      setInfoError("Số điện thoại không hợp lệ.");
      return;
    }

    setSavingInfo(true);
    setInfoError(null);
    try {
      let avatarUrl: string | undefined;
      if (selectedFile) {
        avatarUrl = await uploadImageToCloudinary(selectedFile);
      }

      const result = await updateMyProfile({
        fullName: trimmedName,
        phone: trimmedPhone,
        bio: bio.trim(),
        ...(avatarUrl ? { avatarUrl } : {}),
      });

      onSaved({
        fullName: result.fullName,
        avatarUrl: result.avatarUrl,
        phone: result.phone,
        bio: result.bio,
      });
    } catch (err) {
      console.error("Cập nhật hồ sơ thất bại", err);
      setInfoError("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setSavingInfo(false);
    }
  };

  const handleSavePassword = async () => {
    setPasswordError(null);
    setPasswordSuccess(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Vui lòng nhập đủ 3 trường.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Xác nhận mật khẩu không khớp.");
      return;
    }

    setSavingPassword(true);
    try {
      await changeMyPassword({ currentPassword, newPassword });
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 400) {
        setPasswordError("Mật khẩu hiện tại không đúng.");
      } else {
        setPasswordError("Đổi mật khẩu thất bại. Vui lòng thử lại.");
      }
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="epm-overlay" onClick={onClose}>
      <div className="epm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="epm-header">
          <h2>Chỉnh sửa hồ sơ</h2>
          <button type="button" onClick={onClose} aria-label="Đóng">
            <X size={18} />
          </button>
        </div>

        <div className="epm-tabs">
          <button
            type="button"
            className={tab === "info" ? "epm-tab epm-tab--active" : "epm-tab"}
            onClick={() => setTab("info")}
          >
            Thông tin
          </button>
          <button
            type="button"
            className={
              tab === "password" ? "epm-tab epm-tab--active" : "epm-tab"
            }
            onClick={() => setTab("password")}
          >
            Mật khẩu
          </button>
        </div>

        {tab === "info" ? (
          <>
            <div className="epm-body">
              <div className="epm-avatar-section">
                <div
                  className="epm-avatar"
                  style={{ background: getAvatarColor(fullName) }}
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="Avatar preview" />
                  ) : (
                    <span>{getInitials(fullName)}</span>
                  )}
                </div>
                <button
                  type="button"
                  className="epm-avatar-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera size={14} />
                  Đổi ảnh
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                />
              </div>

              <label className="epm-field">
                <span>Họ và tên</span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  maxLength={100}
                  placeholder="Nhập họ tên"
                />
              </label>

              <label className="epm-field">
                <span>Số điện thoại</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={15}
                  placeholder="Chưa cập nhật"
                />
              </label>

              <label className="epm-field">
                <span>
                  Giới thiệu
                  <em className="epm-field__count">{bio.length}/500</em>
                </span>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={500}
                  rows={4}
                  placeholder="Vài dòng giới thiệu về bạn..."
                />
              </label>

              {infoError && (
                <div className="epm-error">
                  <AlertTriangle size={14} />
                  {infoError}
                </div>
              )}
            </div>

            <div className="epm-footer">
              <button
                type="button"
                className="epm-btn epm-btn--ghost"
                onClick={onClose}
                disabled={savingInfo}
              >
                Huỷ
              </button>
              <button
                type="button"
                className="epm-btn epm-btn--primary"
                onClick={handleSaveInfo}
                disabled={savingInfo}
              >
                {savingInfo ? <Loader2 size={15} className="epm-spin" /> : null}
                {savingInfo ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="epm-body">
              <label className="epm-field">
                <span>Mật khẩu hiện tại</span>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </label>

              <label className="epm-field">
                <span>Mật khẩu mới</span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Ít nhất 6 ký tự"
                />
              </label>

              <label className="epm-field">
                <span>Xác nhận mật khẩu mới</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                />
              </label>

              {passwordError && (
                <div className="epm-error">
                  <AlertTriangle size={14} />
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="epm-success">
                  <CheckCircle2 size={14} />
                  Đổi mật khẩu thành công!
                </div>
              )}
            </div>

            <div className="epm-footer">
              <button
                type="button"
                className="epm-btn epm-btn--ghost"
                onClick={onClose}
                disabled={savingPassword}
              >
                Đóng
              </button>
              <button
                type="button"
                className="epm-btn epm-btn--primary"
                onClick={handleSavePassword}
                disabled={savingPassword}
              >
                {savingPassword ? (
                  <Loader2 size={15} className="epm-spin" />
                ) : null}
                {savingPassword ? "Đang đổi..." : "Đổi mật khẩu"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
