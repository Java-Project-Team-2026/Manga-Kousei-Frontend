import api from "./api";

interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface SeriesRankingRes {
  seriesId: number;
  title: string;
  mangakaName: string | null;
  rankingPosition: number;
  previousRankingPosition: number | null;
  voteCount: number;
  surveyScore: number;
  salesCount: number;
  commentCount: number;
  calculatedAt: string;
}

export interface SeriesRiskRes {
  seriesId: number;
  title: string;
  mangakaName: string | null;
  rankingPosition: number;
  previousRankingPosition: number | null;
  voteCount: number;
  riskLevel: "watch" | "at_risk" | "safe";
  reason: string;
}

export interface ReaderVoteBatchRes {
  batchId: number;
  issueCodeName: string;
  note: string;
  importedAt: string;
  importedById: number | null;
  importedByName: string | null;
  voteItemCount: number;
  ranking: SeriesRankingRes[];
  risks: SeriesRiskRes[];
}

export interface VoteItemReq {
  seriesId: number;
  voteCount: number;
  surveyScore?: number;
  salesCount?: number;
  commentCount?: number;
}

export const importVoteBatch = (body: {
  issueCodeName: string;
  note: string;
  votes: VoteItemReq[];
}): Promise<ReaderVoteBatchRes> =>
  api
    .post<ApiResponse<ReaderVoteBatchRes>>("/admin/vote-batches", body)
    .then((r) => r.data.data);

export const fetchLatestRanking = (): Promise<SeriesRankingRes[]> =>
  api
    .get<ApiResponse<SeriesRankingRes[]>>("/admin/rankings/latest")
    .then((r) => r.data.data ?? []);

export const fetchSeriesRisks = (): Promise<SeriesRiskRes[]> =>
  api
    .get<ApiResponse<SeriesRiskRes[]>>("/admin/series/risks")
    .then((r) => r.data.data ?? []);

export const createSeriesDecision = (
  seriesId: number,
  body: {
    decisionType: "cancel" | "change_schedule" | "continue";
    reason: string;
    scheduleType?: "weekly" | "monthly";
    dayValue?: number;
  },
) => api.post(`/admin/series/${seriesId}/decisions`, body);
