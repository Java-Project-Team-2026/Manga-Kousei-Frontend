import api from "./api";

interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface MangakaDashboardStats {
  urgentDeadlineCount: number;
  revisionCount: number;
  pendingReviewCount: number;
  totalSeries: number;
}

export interface MangakaDeadlineItem {
  deadlineId: number;
  labelType: "overdue" | "due" | "soon";
  label: string;
  timeTag: string;
  title: string;
  tantouName: string;
  series: string;
  dueDate: string;
}

export interface SeriesRankItem {
  seriesId: number;
  title: string;
  mangakaName: string | null;
  latestChapter: number | null;
  latestChapterTitle: string | null;
  voteCount: number;
  rating: number;
  chapterCount: number;
}

export const fetchMangakaDashboardStats = (): Promise<MangakaDashboardStats> =>
  api
    .get<ApiResponse<MangakaDashboardStats>>("/mangaka/dashboard/stats")
    .then((r) => r.data.data);

export const fetchMangakaDeadlines = (): Promise<MangakaDeadlineItem[]> =>
  api
    .get<ApiResponse<MangakaDeadlineItem[]>>("/mangaka/dashboard/deadlines")
    .then((r) => r.data.data ?? []);

export const fetchMangakaTopSeries = (): Promise<SeriesRankItem[]> =>
  api
    .get<ApiResponse<SeriesRankItem[]>>("/mangaka/dashboard/top-series")
    .then((r) => r.data.data ?? []);
