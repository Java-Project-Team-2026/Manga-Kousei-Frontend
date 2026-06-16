import api from "./api";

interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface ScheduleEntry {
  scheduleId: number;
  seriesId: number;
  seriesTitle: string;
  mangakaName: string;
  scheduleType: "weekly" | "monthly";
  dayValue: number; // weekly: 1-7 | monthly: 1-31
}

export const fetchAllSchedules = async (): Promise<ScheduleEntry[]> => {
  return api
    .get<ApiResponse<ScheduleEntry[]>>("/admin/schedules")
    .then((res) => res.data.data ?? [])
    .catch(() => []);
};

export const setSchedule = (body: {
  seriesId: number;
  scheduleType: "weekly" | "monthly";
  dayValue: number;
}): Promise<ScheduleEntry> =>
  api
    .post<ApiResponse<ScheduleEntry>>("/admin/schedules", body)
    .then((res) => res.data.data);

export const confirmSchedule = (body: {
  proposalId: number;
  scheduleType: "weekly" | "monthly";
  dayValue: number;
}): Promise<{ seriesId: number }> =>
  api
    .post<ApiResponse<{ seriesId: number }>>("/admin/schedules/confirm", body)
    .then((res) => res.data.data);
