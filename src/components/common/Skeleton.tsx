import type { CSSProperties } from "react";
import "./Skeleton.scss";

type SkeletonVariant = "text" | "rect" | "circle";

interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  className?: string;
  style?: CSSProperties;
}

const toCssSize = (v?: number | string) =>
  typeof v === "number" ? `${v}px` : v;

export const Skeleton = ({
  variant = "text",
  width,
  height,
  radius,
  className,
  style,
}: SkeletonProps) => {
  return (
    <span
      className={`skeleton skeleton--${variant}${className ? ` ${className}` : ""}`}
      aria-hidden="true"
      style={{
        width: toCssSize(width),
        height: toCssSize(height),
        borderRadius: toCssSize(radius),
        ...style,
      }}
    />
  );
};
