import { useQuery } from "@tanstack/react-query";
import { fetchRecentLogs } from "../services/activityLogService";

export function useRecentLogs() {
  const { data: logs = [], isLoading: loading } = useQuery({
    queryKey: ["recent-activity-logs"],
    queryFn: fetchRecentLogs,
  });

  return { logs, loading };
}
