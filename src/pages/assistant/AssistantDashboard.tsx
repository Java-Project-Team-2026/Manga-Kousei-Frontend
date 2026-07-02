import React, { useEffect, useMemo, useState } from "react";
import {
  BellRing,
  AlertTriangle,
  FileText,
  SquarePen,
  Wallet,
  Clock,
  Hourglass,
  CheckCircle2,
  MoreHorizontal,
  Download,
  Upload,
  Megaphone,
  Users,
  MessageSquareText,
} from "lucide-react";
import styles from "./AssistantDashboard.module.scss";
import {
  fetchMyTasks,
  type AssistantTaskRes,
} from "../../services/taskSubmissionService";
import {
  fetchMyNotifications,
  type NotificationItem,
} from "../../services/notificationService";
import api from "../../services/api";
import {
  fetchMyActiveCollaborations,
  type AssistantAssignmentRes,
} from "../../services/assistantAssignmentService";
import {
  fetchConversations,
  type ConversationItem,
} from "../../services/chatService";
import { getAvatarColor, getInitials } from "../../utils";
import ChatWindow from "../../components/chat/ChatWindow";

interface Notification {
  icon: "edit" | "file";
  title: string;
  desc: string;
  time: string;
}

interface KanbanCard {
  tag: string;
  chapter: string;
  title: string;
  deadline?: string;
  submittedAt?: string;
  warning?: boolean;
  urgent?: boolean;
  done?: boolean;
  action?: "Tài nguyên" | "Nộp kết quả";
}

interface KanbanColumn {
  id: "todo" | "doing" | "review" | "done";
  label: string;
  count: number;
  cards: KanbanCard[];
}

interface IncomeMonthRes {
  month: string;
  monthLabel: string;
  totalAmount: number;
  prevMonthAmount: number;
  taskCount: number;
}

interface ApiResp<T> {
  data: T;
}

const columnLabels: Record<KanbanColumn["id"], string> = {
  todo: "CHỜ LÀM",
  doing: "ĐANG LÀM",
  review: "CHỜ DUYỆT",
  done: "HOÀN THÀNH",
};

const formatVnd = (value: number) => `${value.toLocaleString("vi-VN")} ₫`;

const formatDateTime = (value?: string) => {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const isWithinNext24Hours = (value?: string) => {
  if (!value) return false;
  const deadline = new Date(value).getTime();
  if (Number.isNaN(deadline)) return false;

  const now = Date.now();
  return deadline >= now && deadline <= now + 24 * 60 * 60 * 1000;
};

const normalizeStatus = (status?: string): KanbanColumn["id"] => {
  const normalized = status?.toLowerCase();
  if (
    normalized === "todo" ||
    normalized === "doing" ||
    normalized === "review" ||
    normalized === "done"
  ) {
    return normalized;
  }

  return "todo";
};

const toNotification = (item: NotificationItem): Notification => ({
  icon: item.notificationType === "REVIEW" ? "edit" : "file",
  title: item.title,
  desc: item.message,
  time: item.createdAt,
});

const toKanbanCard = (task: AssistantTaskRes): KanbanCard => {
  const status = normalizeStatus(task.taskStatus);
  const chapter = [
    task.seriesTitle,
    task.chapterNumber != null ? `Chương ${task.chapterNumber}` : null,
    task.pageNumber != null ? `Trang ${task.pageNumber}` : null,
  ]
    .filter(Boolean)
    .join(" • ");

  return {
    tag: task.taskTypeName?.toUpperCase() || "TASK",
    chapter: chapter || "Chưa có thông tin chương",
    title: task.description || task.chapterTitle || "Công việc chưa có mô tả",
    deadline: formatDateTime(task.deadline),
    submittedAt:
      status === "review"
        ? task.latestSubmissionStatus
          ? `Trạng thái bài nộp: ${task.latestSubmissionStatus}`
          : "Đang chờ duyệt"
        : undefined,
    warning: status !== "done" && isWithinNext24Hours(task.deadline),
    urgent: status === "review",
    done: status === "done",
    action:
      status === "doing"
        ? "Nộp kết quả"
        : status === "todo" && task.pageFileUrl
          ? "Tài nguyên"
          : undefined,
  };
};

const buildKanbanColumns = (tasks: AssistantTaskRes[]): KanbanColumn[] => {
  const grouped: Record<KanbanColumn["id"], KanbanCard[]> = {
    todo: [],
    doing: [],
    review: [],
    done: [],
  };

  tasks.forEach((task) => {
    grouped[normalizeStatus(task.taskStatus)].push(toKanbanCard(task));
  });

  return (Object.keys(columnLabels) as KanbanColumn["id"][]).map((id) => ({
    id,
    label: columnLabels[id],
    count: grouped[id].length,
    cards: grouped[id],
  }));
};

const renderNotifIcon = (type: Notification["icon"]) => {
  switch (type) {
    case "edit":
      return <SquarePen size={15} className={styles.notifIconEdit} />;
    case "file":
      return <FileText size={15} className={styles.notifIconFile} />;
    default:
      return null;
  }
};

const DeadlineAlert: React.FC<{ count: number }> = ({ count }) => (
  <div className={styles.deadlineAlert}>
    <div className={styles.deadlineTop}>
      <span className={styles.deadlineBadge}>
        <BellRing size={14} strokeWidth={2.5} className={styles.deadlineIcon} />
        DEADLINE GẤP (24H)
      </span>
    </div>
    <div className={styles.deadlineCount}>{count}</div>
    <div className={styles.deadlineLabel}>Trang cần nộp hôm nay</div>
    <div className={styles.deadlineDivider} />
    <button className={styles.deadlineLink}>Xem chi tiết →</button>
  </div>
);

const NotificationPanel: React.FC<{ notifications: Notification[] }> = ({
  notifications,
}) => (
  <div className={styles.notifPanel}>
    <div className={styles.notifHeader}>
      <Megaphone size={16} className={styles.notifBellIcon} />
      <span className={styles.notifTitle}>THÔNG BÁO TỪ MANGAKA</span>
      <span className={styles.notifBadge}>{notifications.length} Mới</span>
    </div>
    <div className={styles.notifList}>
      {notifications.length === 0 ? (
        <div className={styles.notifItem}>
          <div className={styles.notifItemBody}>
            <div className={styles.notifItemTitle}>Chưa có thông báo mới</div>
            <div className={styles.notifItemDesc}>
              Các cập nhật từ Mangaka sẽ xuất hiện tại đây.
            </div>
          </div>
        </div>
      ) : (
        notifications.map((n, i) => (
          <div key={i} className={styles.notifItem}>
            <div className={styles.notifItemIconWrapper}>
              {renderNotifIcon(n.icon)}
            </div>
            <div className={styles.notifItemBody}>
              <div className={styles.notifItemTitle}>{n.title}</div>
              <div className={styles.notifItemDesc}>{n.desc}</div>
            </div>
            <span className={styles.notifTime}>{n.time}</span>
          </div>
        ))
      )}
    </div>
  </div>
);

const KanbanCardComponent: React.FC<{ card: KanbanCard; colId: string }> = ({
  card,
  colId,
}) => (
  <div
    className={`${styles.kanbanCard} ${card.action === "Nộp kết quả" ? styles.kanbanCardActiveStyle : ""} ${card.done ? styles.kanbanCardDone : ""}`}
  >
    <div className={styles.kanbanCardTop}>
      <span className={styles.kanbanTag}>{card.tag}</span>
      {card.warning && (
        <AlertTriangle
          size={15}
          strokeWidth={2.5}
          className={styles.kanbanWarning}
        />
      )}
      {card.urgent && (
        <Hourglass
          size={15}
          strokeWidth={2.5}
          className={styles.kanbanUrgentIcon}
        />
      )}
      {colId === "todo" && (
        <MoreHorizontal size={16} className={styles.kanbanMenu} />
      )}
    </div>

    {card.done ? (
      <div className={styles.titleWrapper}>
        <div className={styles.kanbanDoneCheckRow}>
          {card.done && (
            <CheckCircle2
              size={16}
              strokeWidth={2.5}
              className={styles.innerDoneIcon}
            />
          )}
          <div className={`${styles.kanbanTitle} ${styles.kanbanTitleDone}`}>
            {card.title}
          </div>
        </div>
        <div className={styles.kanbanChapterDone}>{card.chapter}</div>
      </div>
    ) : (
      <div className={styles.titleWrapper}>
        <div className={styles.kanbanChapter}>{card.chapter}</div>
        <div className={styles.kanbanTitle}>{card.title}</div>
      </div>
    )}

    {card.deadline && (
      <div className={styles.kanbanDeadline}>
        <Clock size={12} strokeWidth={2.5} className={styles.kanbanClockIcon} />
        Hạn: {card.deadline}
      </div>
    )}
    {card.submittedAt && (
      <div className={styles.kanbanSubmitted}>{card.submittedAt}</div>
    )}
    {card.action && (
      <button
        className={`${styles.kanbanAction} ${colId === "doing" ? styles.kanbanActionPrimary : styles.kanbanActionSecondary}`}
      >
        {card.action === "Nộp kết quả" ? (
          <Upload size={13} strokeWidth={2.5} />
        ) : (
          <Download size={13} strokeWidth={2.5} />
        )}
        {card.action}
      </button>
    )}
  </div>
);

const KanbanBoard: React.FC<{ columns: KanbanColumn[] }> = ({ columns }) => (
  <section className={styles.kanbanSection}>
    <div className={styles.kanbanSectionHeader}>
      <h2 className={styles.sectionTitle}>Tiến độ công việc</h2>
      <button className={styles.kanbanFullscreen}>Mở toàn màn hình</button>
    </div>
    <div className={styles.kanbanWrapperContainer}>
      <div className={styles.circleBgDecoration} />

      <div className={styles.kanbanBoard}>
        {columns.map((col) => (
          <div
            key={col.id}
            className={`${styles.kanbanCol} ${styles[`kanbanCol_${col.id}`]}`}
          >
            <div className={styles.kanbanColHeader}>
              <span
                className={`${styles.kanbanColLabel} ${styles[`kanbanColLabel_${col.id}`]}`}
              >
                {col.label}
              </span>
              <span
                className={`${styles.kanbanColCount} ${styles[`kanbanColCount_${col.id}`]}`}
              >
                {col.count}
              </span>
            </div>
            <div className={styles.kanbanCards}>
              {col.cards.length === 0 ? (
                <div className={styles.kanbanCard}>
                  <div className={styles.kanbanTitle}>Không có task</div>
                  <div className={styles.kanbanChapter}>
                    Cột này hiện chưa có công việc.
                  </div>
                </div>
              ) : (
                col.cards.map((card, i) => (
                  <KanbanCardComponent key={i} card={card} colId={col.id} />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CollaboratorsCard: React.FC<{
  collaborators: AssistantAssignmentRes[];
  conversations: ConversationItem[];
  onOpenChat: (conv: ConversationItem) => void;
}> = ({ collaborators, conversations, onOpenChat }) => (
  <div className={styles.resourceCard}>
    <div className={styles.resourceHeader}>
      <Users size={18} className={styles.resourceIcon} />
      <h3 className={styles.resourceTitle}>Đang cộng tác cùng</h3>
      <span className={styles.collabCount}>{collaborators.length}</span>
    </div>

    {collaborators.length === 0 ? (
      <div className={styles.collabEmpty}>
        Bạn chưa cộng tác cùng Mangaka nào. Chờ lời mời từ Mangaka nhé!
      </div>
    ) : (
      <div className={styles.collabList}>
        {collaborators.map((c) => {
          const conv = conversations.find(
            (cv) => cv.otherUserId === c.mangakaId,
          );

          return (
            <div key={c.assignmentId} className={styles.collabItem}>
              {c.mangakaAvatarUrl ? (
                <img
                  className={styles.collabAvatar}
                  src={c.mangakaAvatarUrl}
                  alt={c.mangakaName}
                />
              ) : (
                <div
                  className={styles.collabAvatar}
                  style={{ background: getAvatarColor(c.mangakaName) }}
                >
                  {getInitials(c.mangakaName)}
                </div>
              )}

              <div className={styles.collabInfo}>
                <strong>{c.mangakaName}</strong>
                <span>Mangaka</span>
              </div>

              {conv && (
                <button
                  type="button"
                  className={styles.collabChatBtn}
                  onClick={() => onOpenChat(conv)}
                >
                  <MessageSquareText size={14} />
                  Nhắn tin
                </button>
              )}
            </div>
          );
        })}
      </div>
    )}
  </div>
);

const IncomeCard: React.FC<{ income: IncomeMonthRes | null }> = ({
  income,
}) => (
  <div className={styles.incomeCard}>
    <div className={styles.incomeHeader}>
      <Wallet size={18} className={styles.incomeIcon} />
      <h3 className={styles.incomeTitle}>Thu nhập tháng này</h3>
    </div>
    <div className={styles.incomeLabel}>DỰ KIẾN NHẬN</div>
    <div className={styles.incomeMain}>
      <div className={styles.incomeAmount}>
        {formatVnd(income?.totalAmount ?? 0)}
      </div>
      <div className={styles.incomeBreakdown}>
        <span>{income?.taskCount ?? 0} task đã duyệt</span>
        <span className={styles.incomeBonus}>
          {income?.monthLabel ?? "Tháng hiện tại"}
        </span>
      </div>
    </div>
    <div className={styles.incomeTrack}>
      <div
        className={styles.incomeFill}
        style={{
          width:
            income && income.prevMonthAmount > 0
              ? `${Math.min((income.totalAmount / income.prevMonthAmount) * 100, 100)}%`
              : income && income.totalAmount > 0
                ? "100%"
                : "0%",
        }}
      />
    </div>
    <div className={styles.incomeGoal}>
      Tháng trước: {formatVnd(income?.prevMonthAmount ?? 0)}
    </div>
  </div>
);

const AssistantDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<AssistantTaskRes[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [income, setIncome] = useState<IncomeMonthRes | null>(null);
  const [loading, setLoading] = useState(true);
  const [collaborators, setCollaborators] = useState<AssistantAssignmentRes[]>(
    [],
  );
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [openChat, setOpenChat] = useState<ConversationItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError(null);

      try {
        const [
          taskData,
          notificationData,
          incomeRes,
          invitationData,
          conversationData,
        ] = await Promise.all([
          fetchMyTasks(),
          fetchMyNotifications(),
          api.get<ApiResp<IncomeMonthRes>>("/assistant/income"),
          fetchMyActiveCollaborations(),
          fetchConversations(),
        ]);

        if (!isMounted) return;

        setTasks(taskData);
        setNotifications(notificationData.slice(0, 3).map(toNotification));
        setIncome(incomeRes.data.data);
        setCollaborators(invitationData.filter((i) => i.status === "active"));
        setConversations(conversationData);
      } catch {
        if (isMounted) {
          setError("Không thể tải dữ liệu dashboard.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const kanbanColumns = useMemo(() => buildKanbanColumns(tasks), [tasks]);
  const urgentDeadlineCount = useMemo(
    () =>
      tasks.filter(
        (task) =>
          normalizeStatus(task.taskStatus) !== "done" &&
          isWithinNext24Hours(task.deadline),
      ).length,
    [tasks],
  );

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Bảng điều khiển</h1>
        <p className={styles.pageSubtitle}>
          {loading
            ? "Đang tải dữ liệu công việc của bạn..."
            : error ||
              "Chào buổi sáng, đây là tóm tắt công việc của bạn hôm nay."}
        </p>
      </div>

      <div className={styles.topRow}>
        <DeadlineAlert count={urgentDeadlineCount} />
        <NotificationPanel notifications={notifications} />
      </div>

      <KanbanBoard columns={kanbanColumns} />

      <div className={styles.bottomRow}>
        <CollaboratorsCard
          collaborators={collaborators}
          conversations={conversations}
          onOpenChat={setOpenChat}
        />
        <IncomeCard income={income} />
      </div>
      {openChat && (
        <ChatWindow conversation={openChat} onClose={() => setOpenChat(null)} />
      )}
    </div>
  );
};

export default AssistantDashboard;
