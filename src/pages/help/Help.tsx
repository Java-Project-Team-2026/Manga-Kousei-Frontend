import { useMemo, useState } from "react";
import {
  ChevronDown,
  HelpCircle,
  KeyRound,
  Layers3,
  MessageCircleQuestion,
  Send,
  ShieldCheck,
  Users,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import "./Help.scss";

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const faqItems: FaqItem[] = [
  {
    id: "acc-1",
    category: "Tài khoản & Bảo mật",
    question: "Làm sao để đổi mật khẩu?",
    answer:
      "Vào trang Hồ sơ cá nhân > mục Security Center > chọn Password để đổi mật khẩu mới. Bạn cần nhập đúng mật khẩu hiện tại để xác nhận.",
  },
  {
    id: "series-1",
    category: "Series & Chương",
    question: "Làm sao để gửi đề xuất series mới?",
    answer:
      "Mangaka vào mục Tạo tác phẩm, điền working title, tóm tắt, đối tượng độc giả và chọn Tantou phụ trách, sau đó gửi đề xuất để Tantou xét duyệt.",
  },
  {
    id: "series-2",
    category: "Series & Chương",
    question: "Chapter của tôi đang ở trạng thái nào?",
    answer:
      "Bạn có thể theo dõi trạng thái chapter (đang vẽ, đã nộp trang, chờ Tantou duyệt, chờ Admin duyệt, đã xuất bản) trong trang quản lý Chapters của series tương ứng.",
  },
  {
    id: "series-3",
    category: "Series & Chương",
    question: "Vì sao chapter bị yêu cầu chỉnh sửa lại?",
    answer:
      "Khi Tantou review thấy nhóm trang chưa đạt, trạng thái sẽ chuyển sang 'revision' kèm ghi chú lý do. Mangaka cần sửa và nộp lại nhóm trang đó.",
  },
  {
    id: "collab-1",
    category: "Trợ lý & Cộng tác",
    question: "Làm sao để mời trợ lý tham gia dự án?",
    answer:
      "Mangaka vào mục Quản lý Nhân sự, bấm 'Mời trợ lý mới', tìm theo tên hoặc email rồi gửi lời mời. Trợ lý sẽ nhận thông báo và có thể chấp nhận trong mục Lời mời.",
  },
  {
    id: "collab-2",
    category: "Trợ lý & Cộng tác",
    question: "Tôi có thể ngừng cộng tác với một trợ lý không?",
    answer:
      "Có. Trong danh sách trợ lý đang hoạt động, chọn 'Ngừng cộng tác' tại trợ lý tương ứng. Thao tác này không xoá lịch sử công việc đã thực hiện trước đó.",
  },
  {
    id: "notif-1",
    category: "Thông báo & Tin nhắn",
    question: "Làm sao để nhắn tin trực tiếp với Admin?",
    answer:
      "Biên tập viên Tantou có thể bấm biểu tượng tin nhắn ở header, chọn dấu '+' để chọn một Admin và bắt đầu cuộc trò chuyện mới.",
  },
];

const categoryIcons: Record<string, typeof ShieldCheck> = {
  "Tài khoản & Bảo mật": ShieldCheck,
  "Series & Chương": Layers3,
  "Trợ lý & Cộng tác": Users,
  "Thông báo & Tin nhắn": MessageCircleQuestion,
};

const categories = Array.from(new Set(faqItems.map((f) => f.category)));

type SubmitState = "idle" | "loading" | "sent";

function Help() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [keyword, setKeyword] = useState("");
  const [openId, setOpenId] = useState<string | null>(faqItems[0]?.id ?? null);

  const [subject, setSubject] = useState("");
  const [supportCategory, setSupportCategory] = useState("Tài khoản & Bảo mật");
  const [message, setMessage] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  const filteredFaqs = useMemo(() => {
    return faqItems.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;
      const matchesKeyword =
        keyword.trim() === "" ||
        item.question.toLowerCase().includes(keyword.trim().toLowerCase()) ||
        item.answer.toLowerCase().includes(keyword.trim().toLowerCase());
      return matchesCategory && matchesKeyword;
    });
  }, [activeCategory, keyword]);

  const handleToggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setSubmitState("loading");
    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      setSubmitState("sent");
      setSubject("");
      setMessage("");
    } catch (err) {
      console.error("Không gửi được yêu cầu hỗ trợ", err);
      setSubmitState("idle");
    }
  };

  return (
    <main className="help-page">
      <section className="help-hero">
        <div className="help-hero__icon">
          <HelpCircle size={26} />
        </div>
        <div>
          <span className="help-kicker">Trung tâm trợ giúp</span>
          <h1>Chào {user?.fullName || "bạn"}, cần chúng tôi giúp gì?</h1>
          <p>
            Tìm câu trả lời nhanh trong FAQ bên dưới, hoặc gửi yêu cầu hỗ trợ
            nếu bạn chưa tìm thấy điều mình cần.
          </p>
        </div>
      </section>

      <div className="help-search">
        <input
          type="text"
          placeholder="Tìm câu hỏi, ví dụ: đổi mật khẩu, mời trợ lý..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      <div className="help-grid">
        <section className="help-faq">
          <div className="help-tabs" role="tablist">
            <button
              type="button"
              className={activeCategory === "all" ? "active" : ""}
              onClick={() => setActiveCategory("all")}
            >
              Tất cả
            </button>
            {categories.map((cat) => (
              <button
                type="button"
                key={cat}
                className={activeCategory === cat ? "active" : ""}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="help-faq-list">
            {filteredFaqs.length === 0 ? (
              <div className="help-faq-empty">
                <MessageCircleQuestion size={26} strokeWidth={1.3} />
                <span>Không tìm thấy câu hỏi phù hợp.</span>
              </div>
            ) : (
              filteredFaqs.map((item) => {
                const Icon = categoryIcons[item.category] ?? HelpCircle;
                const isOpen = openId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`help-faq-item ${isOpen ? "help-faq-item--open" : ""}`}
                  >
                    <button
                      type="button"
                      className="help-faq-item__head"
                      onClick={() => handleToggle(item.id)}
                      aria-expanded={isOpen}
                    >
                      <span className="help-faq-item__icon">
                        <Icon size={16} />
                      </span>
                      <span className="help-faq-item__question">
                        {item.question}
                      </span>
                      <ChevronDown
                        size={18}
                        className="help-faq-item__chevron"
                      />
                    </button>
                    {isOpen && (
                      <div className="help-faq-item__answer">
                        <p>{item.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>

        <aside className="help-contact">
          <div className="help-contact__header">
            <KeyRound size={18} />
            <div>
              <h2>Gửi yêu cầu hỗ trợ</h2>
              <p>Đội ngũ sẽ phản hồi trong thời gian sớm nhất.</p>
            </div>
          </div>

          {submitState === "sent" ? (
            <div className="help-contact__success">
              <CheckCircle2 size={30} />
              <strong>Đã gửi yêu cầu thành công</strong>
              <p>Cảm ơn bạn, chúng tôi sẽ liên hệ lại sớm nhất có thể.</p>
              <button type="button" onClick={() => setSubmitState("idle")}>
                Gửi yêu cầu khác
              </button>
            </div>
          ) : (
            <form className="help-contact-form" onSubmit={handleSubmit}>
              <label>
                <span>Chủ đề</span>
                <select
                  value={supportCategory}
                  onChange={(e) => setSupportCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="Khác">Khác</option>
                </select>
              </label>

              <label>
                <span>Tiêu đề</span>
                <input
                  type="text"
                  placeholder="Ví dụ: Không nhận được thông báo"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </label>

              <label>
                <span>Nội dung</span>
                <textarea
                  placeholder="Mô tả chi tiết vấn đề bạn đang gặp..."
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </label>

              <button
                type="submit"
                className="help-contact-form__submit"
                disabled={submitState === "loading"}
              >
                {submitState === "loading" ? (
                  <>
                    <Loader2 size={16} className="help-spin" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Gửi yêu cầu
                  </>
                )}
              </button>
            </form>
          )}
        </aside>
      </div>
    </main>
  );
}

export default Help;
