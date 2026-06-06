import {
  ChevronRight,
  Plus,
  Download,
  Search,
  Filter,
  Eye,
  Users,
  Send,
  ChevronLeft,
} from "lucide-react";
import "./MangakaSeries.scss";

export default function MangakaSeries() {
  const works = [
    {
      id: 1,
      title: "Kiếm Sĩ Cuối Cùng (The Last Swordsman)",
      image:
        "https://images.unsplash.com/photo-1605557202138-096eeceb43f9?q=80&w=600&auto=format&fit=crop", // Ảnh rồng/fantasy
      badges: [{ text: "ĐANG LÀM", type: "primary" }],
      details: [
        "Chương 42 (Bản Name) • Cập nhật: 2 giờ trước",
        "Tantou: Nguyen Van A | 42 Chương | 3 Trợ lý",
      ],
      deadline: "2 ngày nữa",
    },
    {
      id: 2,
      title: "Thành Phố Bóng Đêm (City of Shadows)",
      image:
        "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=600&auto=format&fit=crop", // Ảnh thành phố
      badges: [{ text: "HOÀN THÀNH", type: "success" }],
      details: [
        "Hoàn tất Chương 100 • Xuất bản: 1 tuần trước",
        "Tantou: Tran Thi Binh | 100 Chương",
      ],
    },
    {
      id: 3,
      title: "Dự án S24 (TBD)",
      image:
        "https://images.unsplash.com/photo-1544207963-30536412f9ce?q=80&w=600&auto=format&fit=crop", // Ảnh phác thảo
      badges: [
        { text: "CONCEPT", type: "secondary" },
        { text: "CHỜ DUYỆT CẤP CAO", type: "secondary" },
      ],
      details: [
        "Chương 1 (Concept) • Đã nộp: 5 ngày trước",
        "Tantou: Le Van B | 1 Chương",
      ],
    },
    {
      id: 4,
      title: "Ngôi Làng Cổ Tích",
      image:
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop",
      badges: [{ text: "ĐANG LÀM", type: "primary" }],
      details: [
        "Chương 42 (Bản Name) • Cập nhật: 2 giờ trước",
        "Tantou: Nguyen Van A | 42 Chương | 3 Trợ lý",
      ],
    },
    {
      id: 5,
      title: "Học Viện Pháp Sư",
      image:
        "https://images.unsplash.com/photo-1514190051997-ec4b840e6118?q=80&w=600&auto=format&fit=crop",
      badges: [{ text: "HOÀN THÀNH", type: "success" }],
      details: [
        "Hoàn tất Chương 100 • Xuất bản: 1 tuần trước",
        "Tantou: Tran Thi Binh | 100 Chương",
      ],
    },
    {
      id: 6,
      title: "Dự án S24 (TBD)",
      image:
        "https://images.unsplash.com/photo-1544207963-30536412f9ce?q=80&w=600&auto=format&fit=crop",
      badges: [{ text: "CHỜ DUYỆT CẤP CAO", type: "secondary" }],
      details: [
        "Chương 1 (Concept) • Đã nộp: 5 ngày trước",
        "Tantou: Le Van B | 1 Chương",
      ],
    },
    {
      id: 7,
      title: "Ngôi Làng Cổ Tích",
      image:
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop",
      badges: [{ text: "ĐANG LÀM", type: "primary" }],
      details: [
        "Chương 42 (Bản Name) • Cập nhật: 2 giờ trước",
        "Tantou: Nguyen Van A | 42 Chương | 3 Trợ lý",
      ],
    },
    {
      id: 8,
      title: "Học Viện Pháp Sư",
      image:
        "https://images.unsplash.com/photo-1514190051997-ec4b840e6118?q=80&w=600&auto=format&fit=crop",
      badges: [{ text: "HOÀN THÀNH", type: "success" }],
      details: [
        "Hoàn tất Chương 100 • Xuất bản: 1 tuần trước",
        "Tantou: Tran Thi Binh | 100 Chương",
      ],
    },
    {
      id: 9,
      title: "Dự án S24 (TBD)",
      image:
        "https://images.unsplash.com/photo-1544207963-30536412f9ce?q=80&w=600&auto=format&fit=crop",
      badges: [{ text: "CHỜ DUYỆT CẤP CAO", type: "secondary" }],
      details: [
        "Chương 1 (Concept) • Đã nộp: 5 ngày trước",
        "Tantou: Le Van B | 1 Chương",
      ],
    },
  ];

  return (
    <div className="works-repository-page">
      <div className="page-header">
        <div className="breadcrumb">
          Tác phẩm <ChevronRight size={14} className="icon-arrow" />
        </div>

        <div className="header-actions">
          <h1 className="page-title">Kho Tác Phẩm Production Studio</h1>
          <div className="button-group">
            <button className="btn btn-primary">
              <Plus size={18} />
              Tạo Series Mới
            </button>
            <button className="btn btn-outline">
              <Download size={18} />
              Tải xuống báo cáo tổng
            </button>
          </div>
        </div>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Tìm series, Tantou..." />
        </div>
        <button className="btn-filter">
          <Filter size={18} />
        </button>
      </div>

      <div className="works-grid">
        {works.map((work) => (
          <div className="work-card" key={work.id}>
            <div className="card-image-wrapper">
              <img src={work.image} alt={work.title} className="cover-img" />
              <div className="badges-container">
                {work.badges.map((badge, index) => (
                  <span key={index} className={`badge badge-${badge.type}`}>
                    {badge.text}
                  </span>
                ))}
              </div>
            </div>

            <div className="card-content">
              <h3 className="work-title">{work.title}</h3>
              <div className="work-details">
                {work.details.map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
                {work.deadline && (
                  <p className="deadline-text">
                    Deadline: <span>{work.deadline}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="card-actions">
              <button className="action-btn" title="Xem chi tiết">
                <Eye size={20} strokeWidth={1.5} />
              </button>
              <button className="action-btn" title="Quản lý nhân sự">
                <Users size={20} strokeWidth={1.5} />
              </button>
              <button className="action-btn" title="Gửi / Xuất bản">
                <Send size={18} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button className="page-btn">
          <ChevronLeft size={16} />
        </button>
        <button className="page-btn active">1</button>
        <button className="page-btn">2</button>
        <button className="page-btn">3</button>
        <button className="page-btn">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
