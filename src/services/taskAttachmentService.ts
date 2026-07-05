import api from "./api";

interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface TaskAttachmentRes {
  attachmentId: number;
  taskId: number;
  fileUrl: string;
  fileName: string;
  fileType: string | null;
  uploadedById: number | null;
  uploadedByName: string | null;
  createdAt: string;
}

export const fetchAssistantTaskAttachments = (
  taskId: number,
): Promise<TaskAttachmentRes[]> =>
  api
    .get<ApiResponse<TaskAttachmentRes[]>>(
      `/assistant/tasks/${taskId}/attachments`,
    )
    .then((r) => r.data.data ?? []);

export const fetchMangakaTaskAttachments = (
  taskId: number,
): Promise<TaskAttachmentRes[]> =>
  api
    .get<ApiResponse<TaskAttachmentRes[]>>(`/mangaka/tasks/${taskId}/attachments`)
    .then((r) => r.data.data ?? []);

export const createTaskAttachment = (
  taskId: number,
  body: { fileUrl: string; fileName: string; fileType?: string },
): Promise<TaskAttachmentRes> =>
  api
    .post<ApiResponse<TaskAttachmentRes>>(
      `/mangaka/tasks/${taskId}/attachments`,
      body,
    )
    .then((r) => r.data.data);

export const deleteTaskAttachment = (
  taskId: number,
  attachmentId: number,
): Promise<void> =>
  api.delete(`/mangaka/tasks/${taskId}/attachments/${attachmentId}`);
