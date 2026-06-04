import { Loader2 } from "lucide-react";
import "./FullScreenLoader.scss";

interface FullScreenLoaderProps {
  text?: string;
}

export const FullScreenLoader = ({
  text = "Đang tải dữ liệu...",
}: FullScreenLoaderProps) => {
  return (
    <div className="full-screen-loading">
      <Loader2 className="spinner" size={48} strokeWidth={1.5} />
      <p>{text}</p>
    </div>
  );
};
