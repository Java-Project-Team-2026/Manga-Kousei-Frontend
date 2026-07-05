import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMyLogs } from "../services/activityLogService";
import type {
  ActivityLogItem,
  LogCategory,
  PagedResponse,
} from "../services/activityLogService";

interface UseActivityLogsParams {
  category: LogCategory | "all";
  page: number;
  size?: number;
}

export function useActivityLogs({
  category,
  page,
  size = 20,
}: UseActivityLogsParams) {
  const queryClient = useQueryClient();
  const queryKey = ["activity-logs", category, page, size];

  const {
    data,
    isLoading: loading,
    isError,
  } = useQuery<PagedResponse<ActivityLogItem>>({
    queryKey,
    queryFn: () => fetchMyLogs({ category, page, size }),
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey });

  return {
    data: data ?? null,
    loading,
    error: isError ? "Không thể tải lịch sử hoạt động." : null,
    refresh,
  };
}
