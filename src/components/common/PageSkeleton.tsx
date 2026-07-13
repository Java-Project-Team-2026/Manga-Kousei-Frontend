import { Skeleton } from "./Skeleton";
import "./PageSkeleton.scss";

type PageSkeletonHeader = "profile" | "plain" | "none";

interface PageSkeletonProps {
  header?: PageSkeletonHeader;
  stats?: number;
  panels?: number;
}

export const PageSkeleton = ({
  header = "plain",
  stats = 4,
  panels = 2,
}: PageSkeletonProps) => {
  return (
    <div className="page-skeleton" role="status" aria-label="Đang tải nội dung">
      {header === "profile" && (
        <div className="page-skeleton__hero">
          <Skeleton variant="circle" width={72} height={72} />
          <div className="page-skeleton__hero-copy">
            <Skeleton variant="text" width={180} height={22} />
            <Skeleton variant="text" width="70%" height={14} />
            <Skeleton variant="text" width="50%" height={14} />
          </div>
          <Skeleton
            variant="rect"
            width={132}
            height={40}
            className="page-skeleton__hero-btn"
          />
        </div>
      )}

      {header === "plain" && (
        <div className="page-skeleton__header">
          <Skeleton variant="text" width={220} height={26} />
          <Skeleton variant="text" width={320} height={14} />
        </div>
      )}

      {stats > 0 && (
        <div className="page-skeleton__stats">
          {Array.from({ length: stats }).map((_, i) => (
            <div className="page-skeleton__stat" key={i}>
              <Skeleton variant="text" width="60%" height={12} />
              <Skeleton variant="text" width="40%" height={26} />
            </div>
          ))}
        </div>
      )}

      {panels > 0 && (
        <div className="page-skeleton__panels">
          {Array.from({ length: panels }).map((_, i) => (
            <div className="page-skeleton__panel" key={i}>
              <Skeleton variant="text" width={140} height={18} />
              <Skeleton variant="text" width="100%" height={14} />
              <Skeleton variant="text" width="92%" height={14} />
              <Skeleton variant="text" width="96%" height={14} />
              <Skeleton variant="text" width="80%" height={14} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
