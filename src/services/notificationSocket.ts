import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import type { NotificationItem } from "./notificationService";
import type { ChatMessageItem } from "./chatService";
import type { AssistantAssignmentRes } from "./assistantAssignmentService";
import type { TaskRes } from "./pageService";
import type {
  AssistantTaskRes,
  TaskSubmissionRes,
} from "./taskSubmissionService";
import type { ChapterRes, PageDeadline } from "./chapterService";
import type { SeriesProposal } from "../types/SeriesProposal";
import type { AssignmentItem } from "./personnelService";

const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL ?? "http://localhost:8080";

type NotificationHandler = (n: NotificationItem) => void;
type ChatMessageHandler = (m: ChatMessageItem) => void;
type AssignmentUpdateHandler = (a: AssistantAssignmentRes) => void;
type TaskUpdateHandler = (t: TaskRes) => void;
type SubmissionUpdateHandler = (s: TaskSubmissionRes) => void;
type PageDeadlineUpdateHandler = (d: PageDeadline) => void;
type ProposalUpdateHandler = (p: SeriesProposal) => void;
type TantouAssignUpdateHandler = (a: AssignmentItem) => void;
type AssistantTaskUpdateHandler = (t: AssistantTaskRes) => void;
type AssistantTaskDeletedHandler = (taskId: number) => void;
type ChapterUpdateHandler = (chapter: ChapterRes) => void;

let client: Client | null = null;
const notificationHandlers = new Set<NotificationHandler>();
const chatMessageHandlers = new Set<ChatMessageHandler>();
const assignmentUpdateHandlers = new Set<AssignmentUpdateHandler>();
const taskUpdateHandlers = new Set<TaskUpdateHandler>();
const submissionUpdateHandlers = new Set<SubmissionUpdateHandler>();
const pageDeadlineUpdateHandlers = new Set<PageDeadlineUpdateHandler>();
const proposalUpdateHandlers = new Set<ProposalUpdateHandler>();
const tantouAssignUpdateHandlers = new Set<TantouAssignUpdateHandler>();
const assistantTaskUpdateHandlers = new Set<AssistantTaskUpdateHandler>();
const assistantTaskDeletedHandlers = new Set<AssistantTaskDeletedHandler>();
const chapterUpdateHandlers = new Set<ChapterUpdateHandler>();

function safeSubscribe<T>(
  destination: string,
  handlers: Set<(payload: T) => void>,
  label: string,
) {
  client?.subscribe(destination, (message: IMessage) => {
    try {
      const payload: T = JSON.parse(message.body);
      handlers.forEach((h) => h(payload));
    } catch (err) {
      console.error(`Không parse được ${label} realtime:`, err);
    }
  });
}

export function connectNotificationSocket() {
  if (client?.active) return;

  client = new Client({
    webSocketFactory: () => new SockJS(`${WS_BASE_URL}/ws`),
    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,

    onConnect: () => {
      safeSubscribe(
        "/user/queue/notifications",
        notificationHandlers,
        "notification",
      );
      safeSubscribe(
        "/user/queue/messages",
        chatMessageHandlers,
        "chat message",
      );
      safeSubscribe(
        "/user/queue/assignment-updates",
        assignmentUpdateHandlers,
        "assignment update",
      );
      safeSubscribe(
        "/user/queue/task-updates",
        taskUpdateHandlers,
        "task update",
      );
      safeSubscribe(
        "/user/queue/submission-updates",
        submissionUpdateHandlers,
        "submission update",
      );
      safeSubscribe(
        "/user/queue/page-deadline-updates",
        pageDeadlineUpdateHandlers,
        "page deadline update",
      );
      safeSubscribe(
        "/user/queue/proposal-updates",
        proposalUpdateHandlers,
        "proposal update",
      );
      safeSubscribe(
        "/user/queue/tantou-assign-updates",
        tantouAssignUpdateHandlers,
        "tantou assignment update",
      );
      safeSubscribe(
        "/user/queue/assistant-task-updates",
        assistantTaskUpdateHandlers,
        "assistant task update",
      );
      safeSubscribe(
        "/user/queue/assistant-task-deleted",
        assistantTaskDeletedHandlers,
        "assistant task deleted",
      );
      safeSubscribe(
        "/user/queue/page-deadline-updates",
        pageDeadlineUpdateHandlers,
        "page deadline update",
      );
      safeSubscribe(
        "/user/queue/chapter-updates",
        chapterUpdateHandlers,
        "chapter update",
      );
    },

    onStompError: (frame) => {
      console.error("STOMP error:", frame.headers["message"], frame.body);
    },
    onWebSocketClose: () => {
      console.warn("WebSocket đã đóng, sẽ tự reconnect...");
    },
  });

  client.activate();
}

export function disconnectNotificationSocket() {
  client?.deactivate();
  client = null;
  notificationHandlers.clear();
  chatMessageHandlers.clear();
  assignmentUpdateHandlers.clear();
  taskUpdateHandlers.clear();
  submissionUpdateHandlers.clear();
  pageDeadlineUpdateHandlers.clear();
  proposalUpdateHandlers.clear();
  tantouAssignUpdateHandlers.clear();
  assistantTaskUpdateHandlers.clear();
  assistantTaskDeletedHandlers.clear();
  pageDeadlineUpdateHandlers.clear();
  chapterUpdateHandlers.clear();
}

export function onNotification(handler: NotificationHandler): () => void {
  notificationHandlers.add(handler);
  return () => notificationHandlers.delete(handler);
}

export function onChatMessage(handler: ChatMessageHandler): () => void {
  chatMessageHandlers.add(handler);
  return () => chatMessageHandlers.delete(handler);
}

export function onAssignmentUpdate(
  handler: AssignmentUpdateHandler,
): () => void {
  assignmentUpdateHandlers.add(handler);
  return () => assignmentUpdateHandlers.delete(handler);
}

export function onTaskUpdate(handle: TaskUpdateHandler): () => void {
  taskUpdateHandlers.add(handle);
  return () => taskUpdateHandlers.delete(handle);
}

export function onAssistantTaskUpdate(
  handler: AssistantTaskUpdateHandler,
): () => void {
  assistantTaskUpdateHandlers.add(handler);
  return () => {
    assistantTaskUpdateHandlers.delete(handler);
  };
}

export function onSubmissionUpdate(h: SubmissionUpdateHandler) {
  submissionUpdateHandlers.add(h);
  return () => submissionUpdateHandlers.delete(h);
}

export function onProposalUpdate(h: ProposalUpdateHandler) {
  proposalUpdateHandlers.add(h);
  return () => proposalUpdateHandlers.delete(h);
}
export function onTantouAssignUpdate(h: TantouAssignUpdateHandler) {
  tantouAssignUpdateHandlers.add(h);
  return () => tantouAssignUpdateHandlers.delete(h);
}

export function onAssistantTaskDeleted(
  handler: AssistantTaskDeletedHandler,
): () => void {
  assistantTaskDeletedHandlers.add(handler);
  return () => {
    assistantTaskDeletedHandlers.delete(handler);
  };
}

export function onPageDeadlineUpdate(
  handler: PageDeadlineUpdateHandler,
): () => void {
  pageDeadlineUpdateHandlers.add(handler);
  return () => {
    pageDeadlineUpdateHandlers.delete(handler);
  };
}

export function onChapterUpdate(handler: ChapterUpdateHandler): () => void {
  chapterUpdateHandlers.add(handler);
  return () => {
    chapterUpdateHandlers.delete(handler);
  };
}
