import type { CSSProperties } from "react";
import { Skeleton } from "./Skeleton";
import "./ListSkeleton.scss";

interface ListSkeletonProps {
  rows?: number;
  avatar?: boolean;
  className?: string;
  style?: CSSProperties;
}

export const ListSkeleton = ({
  rows = 6,
  avatar = false,
  className,
  style,
}: ListSkeletonProps) => {
  return (
    <div
      className={`list-skeleton${className ? ` ${className}` : ""}`}
      role="status"
      aria-label="Đang tải danh sách"
      style={style}
    >
      {Array.from({ length: rows }).map((_, i) => (
        <div className="list-skeleton__row" key={i}>
          {avatar && <Skeleton variant="circle" width={40} height={40} />}
          <div className="list-skeleton__lines">
            <Skeleton variant="text" width="55%" height={14} />
            <Skeleton variant="text" width="35%" height={12} />
          </div>
        </div>
      ))}
    </div>
  );
};
