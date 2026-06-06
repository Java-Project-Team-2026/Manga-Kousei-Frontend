import { useNavigate } from "react-router-dom";
import { ShieldX, ArrowLeft, LayoutDashboard } from "lucide-react";
import "./Unauthorized.scss";

export const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-fullscreen">
      <div className="watermark">403</div>

      <div className="content-area">
        <ShieldX className="icon-alert" size={72} strokeWidth={1} />

        <h1 className="title">Khu vực hạn chế</h1>

        <div className="divider-line"></div>

        <p className="description">
          Tài khoản của bạn không có quyền truy cập vào khu vực này.
          <br />
          Vui lòng quay lại hoặc trở về không gian làm việc của mình.
        </p>

        <div className="action-row">
          <button className="btn btn-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} strokeWidth={1.5} />
            <span>Quay lại</span>
          </button>

          <button className="btn btn-dashboard" onClick={() => navigate("/")}>
            <LayoutDashboard size={20} strokeWidth={1.5} />
            <span>Về Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
