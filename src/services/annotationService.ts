import api from "./api";

interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface AnnotationRes {
  annotationId: number;
  pageId: number;
  x: number;
  y: number;
  width: number;
  height: number;
  commentText: string;
  annotationTypeId: number | null;
  annotationTypeName: string | null;
  status: "open" | "resolved" | string;
  editorId: number | null;
  editorName: string | null;
  createdAt: string;
}

export interface LookupItem {
  id: number;
  name: string;
}

export const fetchAnnotationTypes = (): Promise<LookupItem[]> =>
  api
    .get<ApiResponse<LookupItem[]>>("/annotation-types")
    .then((r) => r.data.data ?? []);

export const fetchTantouAnnotations = (
  pageId: number,
): Promise<AnnotationRes[]> =>
  api
    .get<ApiResponse<AnnotationRes[]>>(`/tantou/pages/${pageId}/annotations`)
    .then((r) => r.data.data ?? []);

export const createAnnotation = (body: {
  pageId: number;
  x: number;
  y: number;
  width: number;
  height: number;
  annotationTypeId: number;
  commentText: string;
}): Promise<AnnotationRes> =>
  api
    .post<ApiResponse<AnnotationRes>>("/tantou/annotations", body)
    .then((r) => r.data.data);

export const resolveTantouAnnotation = (
  annotationId: number,
): Promise<AnnotationRes> =>
  api
    .patch<ApiResponse<AnnotationRes>>(
      `/tantou/annotations/${annotationId}/resolve`,
    )
    .then((r) => r.data.data);

export const fetchMangakaAnnotations = (
  pageId: number,
): Promise<AnnotationRes[]> =>
  api
    .get<ApiResponse<AnnotationRes[]>>(`/mangaka/pages/${pageId}/annotations`)
    .then((r) => r.data.data ?? []);

export const resolveMangakaAnnotation = (
  annotationId: number,
): Promise<AnnotationRes> =>
  api
    .patch<ApiResponse<AnnotationRes>>(
      `/mangaka/annotations/${annotationId}/resolve`,
    )
    .then((r) => r.data.data);
