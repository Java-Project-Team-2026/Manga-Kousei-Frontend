import { X, Trash2 } from "lucide-react";
import type { NotificationItem } from "../../services/notificationService";
import "./NotificationDetailModal.scss";

interface Props {
  notif: NotificationItem;
  onClose: () => void;
  onDelete: (id: number) => void;
}

export default function NotificationDetailModal({
  notif,
  onClose,
  onDelete,
}: Props) {
  return (
    <div className="notif-detail-overlay" onClick={onClose}>
      <div className="notif-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="notif-detail-header">
          <span className="notif-detail-type">{notif.notificationType}</span>
          <button type="button" onClick={onClose} aria-label="Đóng">
            <X size={18} />
          </button>
        </div>

        <h3 className="notif-detail-title">{notif.title}</h3>
        <time className="notif-detail-time">{notif.createdAt}</time>
        <p className="notif-detail-message">{notif.message}</p>

        <div className="notif-detail-footer">
          <button
            type="button"
            className="notif-detail-delete"
            onClick={() => {
              onDelete(notif.notificationId);
              onClose();
            }}
          >
            <Trash2 size={15} />
            Xoá thông báo
          </button>
        </div>
      </div>
    </div>
  );
}
