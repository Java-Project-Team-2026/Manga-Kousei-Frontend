import api from "./api";

interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface MangakaReportStats {
  totalSeries: number;
  totalPages: number;
  totalDeadlines: number;
  submittedDeadlines: number;
  pendingDeadlines: number;
  completionRate: number;
}

export interface DailyProductionItem {
  date: string;
  dayLabel: string;
  submittedCount: number;
}

export interface SeriesRiskItem {
  seriesId: number;
  title: string;
  mangakaName: string | null;
  rankingPosition: number;
  previousRankingPosition: number | null;
  voteCount: number;
  riskLevel: "watch" | "at_risk" | "safe";
  reason: string;
}

export const fetchMangakaReportStats = (): Promise<MangakaReportStats> =>
  api
    .get<ApiResponse<MangakaReportStats>>("/mangaka/reports/stats")
    .then((r) => r.data.data);

export const fetchMangakaDailyProduction = (): Promise<DailyProductionItem[]> =>
  api
    .get<
      ApiResponse<DailyProductionItem[]>
    >("/mangaka/reports/daily-production")
    .then((r) => r.data.data ?? []);

export const fetchMangakaRisks = (): Promise<SeriesRiskItem[]> =>
  api
    .get<ApiResponse<SeriesRiskItem[]>>("/mangaka/reports/risks")
    .then((r) => r.data.data ?? []);
