import React from "react";
import {
    Grid2X2,
    List,
    Download,
    UserRound,
    ChevronDown,
} from "lucide-react";
import styles from "./AssistantRecourceWarehouse.module.scss";
interface CategoryTab {
    id: string;
    label: string;
}

interface FeaturedResource {
    badgeLabel: string;
    updateLabel: string;
    image: string;
    title: string;
    author: string;
    size: string;
    format: string;
}

interface ResourceItem {
    badgeLabel: string;
    badgeVariant: "blue" | "red" | "purple" | "green";
    image: string;
    title: string;
    description: string;
    meta: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const categoryTabs: CategoryTab[] = [
    { id: "all", label: "Tất cả" },
    { id: "characters", label: "Bảng nhân vật" },
    { id: "backgrounds", label: "Bối cảnh 3D" },
    { id: "brushes", label: "Cọ vẽ tùy chỉnh" },
    { id: "costumes", label: "Thiết kế trang phục" },
];

const featuredResource: FeaturedResource = {
    badgeLabel: "Bảng nhân vật",
    updateLabel: "Cập nhật Vol 2",
    image:
        "https://d26e3f10zvrezp.cloudfront.net/Gallery/20b8d818-2c4f-4a02-bde5-1e8e21f745b8-1024x1024.webp",
    title: "Nhân vật chính - Vol 2",
    author: "Kousei Team",
    size: "12MB",
    format: "PSD",
};

const resourceItems: ResourceItem[] = [
    {
        badgeLabel: "Bối cảnh 3D",
        badgeVariant: "blue",
        image:
            "data:image/jpeg;base64,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",
        title: "Bối cảnh lớp học 3D (Ban ngày)",
        description: "Góc nhìn từ cửa sổ, có thể import vào Clip Studio.",
        meta: ".CS3O · 45MB",
    },
    {
        badgeLabel: "Cọ vẽ tùy chỉnh",
        badgeVariant: "purple",
        image: "",
        title: "Gói cọ đánh bóng Halftone",
        description: "15 cọ xước và chấm bi dùng cho áo khoác ngoài.",
        meta: ".SUT · 2MB",
    },
    {
        badgeLabel: "Thiết kế trang phục",
        badgeVariant: "red",
        image:
            "https://i1.sndcdn.com/artworks-VSHMIydg6j3KBoWy-QtsFuA-t240x240.jpg",
        title: "Trang phục dạ hội (Nữ phụ)",
        description: "Chi tiết hoa văn ren và phụ kiện Chapter 15.",
        meta: "PDF · 8MB",
    },
    {
        badgeLabel: "Bối cảnh 3D",
        badgeVariant: "blue",
        image:
            "https://i.pinimg.com/564x/c1/be/3a/c1be3a4869c36fe034c4710f3122b907.jpg",
        title: "Phòng ngủ nam chính (Lộn xộn)",
        description: "Layout chi tiết bàn học và giá sách.",
        meta: ".CS3O · 52MB",
    },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const ResourceHeader: React.FC<{
    view: "grid" | "list";
    onViewChange: (v: "grid" | "list") => void;
}> = ({ view, onViewChange }) => (
    <div className={styles.header}>
        <div className={styles.headerText}>
            <h1 className={styles.title}>Kho tài nguyên</h1>
            <p className={styles.subtitle}>
                Truy cập thư viện tham khảo dùng chung cho toàn bộ dự án manga.
            </p>
        </div>
        <div className={styles.viewSwitch}>
            <button
                className={`${styles.viewButton} ${view === "grid" ? styles.viewButtonActive : ""}`}
                onClick={() => onViewChange("grid")}
                aria-label="Xem dạng lưới"
            >
                <Grid2X2 size={16} />
            </button>
            <button
                className={`${styles.viewButton} ${view === "list" ? styles.viewButtonActive : ""}`}
                onClick={() => onViewChange("list")}
                aria-label="Xem dạng danh sách"
            >
                <List size={16} />
            </button>
        </div>
    </div>
);

const CategoryTabs: React.FC<{
    activeId: string;
    onChange: (id: string) => void;
}> = ({ activeId, onChange }) => (
    <div className={styles.filterBar}>
        {categoryTabs.map((tab) => (
            <button
                key={tab.id}
                className={`${styles.filterButton} ${
                    activeId === tab.id ? styles.filterButtonActive : ""
                }`}
                onClick={() => onChange(tab.id)}
            >
                {tab.label}
            </button>
        ))}
    </div>
);

const FeaturedResourceCard: React.FC<{ resource: FeaturedResource }> = ({ resource }) => (
    <div className={styles.featuredCard}>
        <div className={styles.featuredCard__badges}>
            <span className={`${styles.badge} ${styles.badgeBlue}`}>{resource.badgeLabel}</span>
            <span className={`${styles.badge} ${styles.badgeRed}`}>{resource.updateLabel}</span>
        </div>

        <div className={styles.featuredCard__imageWrap}>
            <img
                src={resource.image}
                alt={resource.title}
                className={styles.featuredCard__image}
            />
        </div>

        <div className={styles.featuredCard__content}>
            <div className={styles.featuredCard__info}>
                <h3 className={styles.featuredCard__title}>{resource.title}</h3>
                <div className={styles.featuredCard__meta}>
                    <UserRound size={14} />
                    <span>{resource.author}</span>
                    <span className={styles.metaDot}>•</span>
                    <span>{resource.size}</span>
                    <span className={styles.metaDot}>•</span>
                    <span>{resource.format}</span>
                </div>
            </div>
            <button className={styles.downloadButton} aria-label="Tải xuống">
                <Download size={18} />
            </button>
        </div>
    </div>
);

const ResourceCard: React.FC<{ item: ResourceItem }> = ({ item }) => (
    <div className={styles.resourceCard}>
        <div className={styles.resourceCard__top}>
      <span
          className={`${styles.badge} ${styles[`badge${capitalize(item.badgeVariant)}`]}`}
      >
        {item.badgeLabel}
      </span>
        </div>

        <div className={styles.resourceCard__imageWrap}>
            {item.image ? (
                <img src={item.image} alt={item.title} className={styles.resourceCard__image} />
            ) : (
                <div className={styles.resourceCard__placeholder} />
            )}
        </div>

        <div className={styles.resourceCard__content}>
            <h4 className={styles.resourceCard__title}>{item.title}</h4>
            <p className={styles.resourceCard__description}>{item.description}</p>

            <div className={styles.resourceCard__footer}>
                <span className={styles.resourceCard__meta}>{item.meta}</span>
                <button className={styles.downloadButtonSmall} aria-label="Tải xuống">
                    <Download size={16} />
                </button>
            </div>
        </div>
    </div>
);

function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

const ResourceGrid: React.FC = () => (
    <div className={styles.resourceGrid}>
        <FeaturedResourceCard resource={featuredResource} />
        {resourceItems.map((item, i) => (
            <ResourceCard key={i} item={item} />
        ))}
    </div>
);

const LoadMoreButton: React.FC = () => (
    <div className={styles.loadMoreWrap}>
        <button className={styles.loadMoreButton}>
            Tải thêm tài nguyên
            <ChevronDown size={16} />
        </button>
    </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const ResourceLibraryPage: React.FC = () => {
    const [view, setView] = React.useState<"grid" | "list">("grid");
    const [activeTab, setActiveTab] = React.useState("all");

    return (
        <div className={styles.page}>
            <ResourceHeader view={view} onViewChange={setView} />
            <CategoryTabs activeId={activeTab} onChange={setActiveTab} />
            <ResourceGrid />
            <LoadMoreButton />
        </div>
    );
};

export default ResourceLibraryPage;