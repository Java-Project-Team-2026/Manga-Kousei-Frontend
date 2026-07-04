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
import "./AssistantDashboard.scss";
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
import {
  onAssistantTaskDeleted,
  onAssistantTaskUpdate,
  onSubmissionUpdate,
} from "../../services/notificationSocket";

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
      return <SquarePen size={15} className="notifIconEdit" />;
    case "file":
      return <FileText size={15} className="notifIconFile" />;
    default:
      return null;
  }
};

const DeadlineAlert: React.FC<{ count: number }> = ({ count }) => (
  <div className="deadlineAlert">
    <div className="deadlineTop">
      <span className="deadlineBadge">
        <BellRing size={14} strokeWidth={2.5} className="deadlineIcon" />
        DEADLINE GẤP (24H)
      </span>
    </div>
    <div className="deadlineCount">{count}</div>
    <div className="deadlineLabel">Trang cần nộp hôm nay</div>
    <div className="deadlineDivider" />
    <button className="deadlineLink">Xem chi tiết →</button>
  </div>
);

const NotificationPanel: React.FC<{ notifications: Notification[] }> = ({
  notifications,
}) => (
  <div className="notifPanel">
    <div className="notifHeader">
      <Megaphone size={16} className="notifBellIcon" />
      <span className="notifTitle">THÔNG BÁO TỪ MANGAKA</span>
      <span className="notifBadge">{notifications.length} Mới</span>
    </div>
    <div className="notifList">
      {notifications.length === 0 ? (
        <div className="notifItem">
          <div className="notifItemBody">
            <div className="notifItemTitle">Chưa có thông báo mới</div>
            <div className="notifItemDesc">
              Các cập nhật từ Mangaka sẽ xuất hiện tại đây.
            </div>
          </div>
        </div>
      ) : (
        notifications.map((n, i) => (
          <div key={i} className="notifItem">
            <div className="notifItemIconWrapper">
              {renderNotifIcon(n.icon)}
            </div>
            <div className="notifItemBody">
              <div className="notifItemTitle">{n.title}</div>
              <div className="notifItemDesc">{n.desc}</div>
            </div>
            <span className="notifTime">{n.time}</span>
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
    className={`kanbanCard ${card.action === "Nộp kết quả" ? "kanbanCardActiveStyle" : ""} ${card.done ? "kanbanCardDone" : ""}`}
  >
    <div className="kanbanCardTop">
      <span className="kanbanTag">{card.tag}</span>
      {card.warning && (
        <AlertTriangle size={15} strokeWidth={2.5} className="kanbanWarning" />
      )}
      {card.urgent && (
        <Hourglass size={15} strokeWidth={2.5} className="kanbanUrgentIcon" />
      )}
      {colId === "todo" && <MoreHorizontal size={16} className="kanbanMenu" />}
    </div>

    {card.done ? (
      <div className="titleWrapper">
        <div className="kanbanDoneCheckRow">
          {card.done && (
            <CheckCircle2
              size={16}
              strokeWidth={2.5}
              className="innerDoneIcon"
            />
          )}
          <div className={`kanbanTitle kanbanTitleDone`}>{card.title}</div>
        </div>
        <div className="kanbanChapterDone">{card.chapter}</div>
      </div>
    ) : (
      <div className="titleWrapper">
        <div className="kanbanChapter">{card.chapter}</div>
        <div className="kanbanTitle">{card.title}</div>
      </div>
    )}

    {card.deadline && (
      <div className="kanbanDeadline">
        <Clock size={12} strokeWidth={2.5} className="kanbanClockIcon" />
        Hạn: {card.deadline}
      </div>
    )}
    {card.submittedAt && (
      <div className="kanbanSubmitted">{card.submittedAt}</div>
    )}
    {card.action && (
      <button
        className={`kanbanAction ${colId === "doing" ? "kanbanActionPrimary" : "kanbanActionSecondary"}`}
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
  <section className="kanbanSection">
    <div className="kanbanSectionHeader">
      <h2 className="sectionTitle">Tiến độ công việc</h2>
      <button className="kanbanFullscreen">Mở toàn màn hình</button>
    </div>
    <div className="kanbanWrapperContainer">
      <div className="circleBgDecoration" />

      <div className="kanbanBoard">
        {columns.map((col) => (
          <div key={col.id} className={`kanbanCol ${`kanbanCol_${col.id}`}`}>
            <div className="kanbanColHeader">
              <span className={`kanbanColLabel ${`kanbanColLabel_${col.id}`}`}>
                {col.label}
              </span>
              <span className={`kanbanColCount ${`kanbanColCount_${col.id}`}`}>
                {col.count}
              </span>
            </div>
            <div className="kanbanCards">
              {col.cards.length === 0 ? (
                <div className="kanbanCard">
                  <div className="kanbanTitle">Không có task</div>
                  <div className="kanbanChapter">
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
  <div className="resourceCard">
    <div className="resourceHeader">
      <Users size={18} className="resourceIcon" />
      <h3 className="resourceTitle">Đang cộng tác cùng</h3>
      <span className="collabCount">{collaborators.length}</span>
    </div>

    {collaborators.length === 0 ? (
      <div className="collabEmpty">
        Bạn chưa cộng tác cùng Mangaka nào. Chờ lời mời từ Mangaka nhé!
      </div>
    ) : (
      <div className="collabList">
        {collaborators.map((c) => {
          const conv = conversations.find(
            (cv) => cv.otherUserId === c.mangakaId,
          );

          return (
            <div key={c.assignmentId} className="collabItem">
              {c.mangakaAvatarUrl ? (
                <img
                  className="collabAvatar"
                  src={c.mangakaAvatarUrl}
                  alt={c.mangakaName}
                />
              ) : (
                <div
                  className="collabAvatar"
                  style={{ background: getAvatarColor(c.mangakaName) }}
                >
                  {getInitials(c.mangakaName)}
                </div>
              )}

              <div className="collabInfo">
                <strong>{c.mangakaName}</strong>
                <span>Mangaka</span>
              </div>

              {conv && (
                <button
                  type="button"
                  className="collabChatBtn"
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
  <div className="incomeCard">
    <div className="incomeHeader">
      <Wallet size={18} className="incomeIcon" />
      <h3 className="incomeTitle">Thu nhập tháng này</h3>
    </div>
    <div className="incomeLabel">DỰ KIẾN NHẬN</div>
    <div className="incomeMain">
      <div className="incomeAmount">{formatVnd(income?.totalAmount ?? 0)}</div>
      <div className="incomeBreakdown">
        <span>{income?.taskCount ?? 0} task đã duyệt</span>
        <span className="incomeBonus">
          {income?.monthLabel ?? "Tháng hiện tại"}
        </span>
      </div>
    </div>
    <div className="incomeTrack">
      <div
        className="incomeFill"
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
    <div className="incomeGoal">
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

  useEffect(() => {
    const offTask = onAssistantTaskUpdate((updatedTask) => {
      setTasks((prev) => {
        const exists = prev.some((t) => t.taskId === updatedTask.taskId);
        return exists
          ? prev.map((t) => (t.taskId === updatedTask.taskId ? updatedTask : t))
          : [updatedTask, ...prev];
      });
    });

    const offDeleted = onAssistantTaskDeleted((taskId) => {
      setTasks((prev) => prev.filter((t) => t.taskId !== taskId));
    });

    const offSub = onSubmissionUpdate(() => {});

    return () => {
      offTask();
      offDeleted();
      offSub();
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
    <div className="assistant-dashboard">
      <div className="page">
        <div className="pageHeader">
          <h1 className="pageTitle">Bảng điều khiển</h1>
          <p className="pageSubtitle">
            {loading
              ? "Đang tải dữ liệu công việc của bạn..."
              : error ||
                "Chào buổi sáng, đây là tóm tắt công việc của bạn hôm nay."}
          </p>
        </div>

        <div className="topRow">
          <DeadlineAlert count={urgentDeadlineCount} />
          <NotificationPanel notifications={notifications} />
        </div>

        <KanbanBoard columns={kanbanColumns} />

        <div className="bottomRow">
          <CollaboratorsCard
            collaborators={collaborators}
            conversations={conversations}
            onOpenChat={setOpenChat}
          />
          <IncomeCard income={income} />
        </div>
        {openChat && (
          <ChatWindow
            conversation={openChat}
            onClose={() => setOpenChat(null)}
          />
        )}
      </div>
    </div>
  );
};

export default AssistantDashboard;
