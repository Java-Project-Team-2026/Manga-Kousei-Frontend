import api from "./api";

interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface TaskSubmissionRes {
  submissionId: number;
  fileUrl: string;
  note: string | null;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt: string | null;
  submittedById: number;
  submittedByName: string;
  submittedByAvatarUrl: string | null;
  reviewedById: number | null;
  reviewedByName: string | null;
  taskId: number;
  taskTypeName: string;
  taskDescription: string | null;
  pageId: number;
  pageNumber: number;
}

export interface AssistantTaskRes {
  taskId: number;
  taskTypeName: string;
  description: string | null;
  deadline: string;
  taskStatus: string; // todo | doing | review | done
  assignedByName: string;
  assignedByAvatarUrl: string | null;
  regionId: number;
  regionX: number;
  regionY: number;
  regionWidth: number;
  regionHeight: number;
  regionTypeName: string;
  regionNote: string | null;
  pageId: number;
  pageNumber: number;
  pageFileUrl: string;
  chapterId: number;
  chapterNumber: number;
  chapterTitle: string | null;
  seriesId: number;
  seriesTitle: string;
  submissionCount: number;
  latestSubmissionStatus: string | null;
  createdAt: string;
}

export const fetchMyTasks = (status?: string): Promise<AssistantTaskRes[]> =>
  api
    .get<
      ApiResponse<AssistantTaskRes[]>
    >(`/assistant/tasks${status ? `?status=${status}` : ""}`)
    .then((r) => r.data.data ?? []);

export const updateTaskStatus = (
  taskId: number,
  status: string,
): Promise<void> => api.patch(`/assistant/tasks/${taskId}/status`, { status });

export const submitWork = (body: {
  taskId: number;
  fileUrl: string;
  note?: string;
}): Promise<TaskSubmissionRes> =>
  api
    .post<ApiResponse<TaskSubmissionRes>>("/assistant/submissions", body)
    .then((r) => r.data.data);

export const fetchTaskSubmissions = (
  taskId: number,
): Promise<TaskSubmissionRes[]> =>
  api
    .get<
      ApiResponse<TaskSubmissionRes[]>
    >(`/assistant/tasks/${taskId}/submissions`)
    .then((r) => r.data.data ?? []);

export const fetchPendingReviews = (): Promise<TaskSubmissionRes[]> =>
  api
    .get<ApiResponse<TaskSubmissionRes[]>>("/mangaka/reviews/pending")
    .then((r) => r.data.data ?? []);

export const fetchSubmissionsByTask = (
  taskId: number,
): Promise<TaskSubmissionRes[]> =>
  api
    .get<
      ApiResponse<TaskSubmissionRes[]>
    >(`/mangaka/reviews/tasks/${taskId}/submissions`)
    .then((r) => r.data.data ?? []);

export const reviewSubmission = (
  submissionId: number,
  body: { decision: "approved" | "rejected"; feedback?: string },
): Promise<TaskSubmissionRes> =>
  api
    .patch<
      ApiResponse<TaskSubmissionRes>
    >(`/mangaka/reviews/${submissionId}`, body)
    .then((r) => r.data.data);
