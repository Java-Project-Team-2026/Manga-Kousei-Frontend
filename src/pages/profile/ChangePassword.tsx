// src/components/profile/ChangePasswordModal.tsx
import React, { useState } from 'react';
import './ChangePassword.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onChangePassword: (oldPw: string, newPw: string) => Promise<void>;
}

export const ChangePasswordModal: React.FC<Props> = ({ isOpen, onClose, onChangePassword }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới không khớp');
      return;
    }
    if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    setLoading(true);
    try {
      await onChangePassword(oldPassword, newPassword);
      onClose();
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đổi mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Đổi mật khẩu</h3>
        <form onSubmit={handleSubmit}>
          <input type="password" placeholder="Mật khẩu hiện tại" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
          <input type="password" placeholder="Mật khẩu mới" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
          <input type="password" placeholder="Xác nhận mật khẩu mới" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          {error && <div className="error">{error}</div>}
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Hủy</button>
            <button type="submit" disabled={loading}>{loading ? 'Đang xử lý...' : 'Xác nhận'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};