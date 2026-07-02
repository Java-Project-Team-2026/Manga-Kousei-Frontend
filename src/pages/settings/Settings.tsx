import { useEffect, useState } from "react";
import {
  Check,
  Globe2,
  LayoutDashboard,
  MonitorCog,
  Moon,
  RotateCcw,
  Save,
  Sun,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import "./Settings.scss";

type ThemeMode = "system" | "light" | "dark";
type DensityMode = "comfortable" | "compact";

interface SettingsState {
  theme: ThemeMode;
  density: DensityMode;
  language: string;
  timezone: string;
  dashboardLanding: string;
  autoSaveDrafts: boolean;
}

const defaultSettings: SettingsState = {
  theme: "system",
  density: "comfortable",
  language: "vi",
  timezone: "Asia/Ho_Chi_Minh",
  dashboardLanding: "dashboard",
  autoSaveDrafts: true,
};

const storageKey = "manga-kousei-settings";

const roleLabels: Record<string, string> = {
  ADMIN: "Quản trị viên",
  TANTOU: "Biên tập viên Tantou",
  MANGAKA: "Tác giả Mangaka",
  ASSISTANT: "Trợ lý sản xuất",
};

const themeLabels: Record<ThemeMode, string> = {
  system: "Theo hệ thống",
  light: "Sáng",
  dark: "Tối",
};

const densityLabels: Record<DensityMode, string> = {
  comfortable: "Thoáng",
  compact: "Gọn",
};

const languageLabels: Record<string, string> = {
  vi: "Tiếng Việt",
  en: "English",
  ja: "日本語",
};

function readStoredSettings(): SettingsState {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

function Settings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SettingsState>(readStoredSettings);
  const [saved, setSaved] = useState(false);

  const userRole = user?.role || "USER";
  const displayName = user?.fullName || "Manga Kousei User";

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (!saved) return;
    const timerId = window.setTimeout(() => setSaved(false), 1800);
    return () => window.clearTimeout(timerId);
  }, [saved]);

  const updateSetting = <Key extends keyof SettingsState>(
    key: Key,
    value: SettingsState[Key],
  ) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const handleSave = () => setSaved(true);

  const handleReset = () => {
    setSettings(defaultSettings);
    setSaved(true);
  };

  return (
    <main className="settings-page">
      <section className="settings-hero">
        <div>
          <span className="settings-kicker">Cài đặt hiển thị</span>
          <h1>Không gian làm việc của {displayName}</h1>
          <p>
            Tuỳ chỉnh giao diện và thao tác cho tài khoản{" "}
            {roleLabels[userRole] || userRole}. Các cài đặt này lưu trên trình
            duyệt hiện tại, không đồng bộ sang thiết bị khác.
          </p>
        </div>

        <div className="settings-hero__actions">
          <button
            className="settings-btn settings-btn--ghost"
            type="button"
            onClick={handleReset}
          >
            <RotateCcw size={17} />
            Khôi phục
          </button>
          <button
            className="settings-btn settings-btn--primary"
            type="button"
            onClick={handleSave}
          >
            {saved ? <Check size={17} /> : <Save size={17} />}
            {saved ? "Đã lưu" : "Lưu thay đổi"}
          </button>
        </div>
      </section>

      <section className="settings-summary" aria-label="Tổng quan cài đặt">
        <article>
          <span className="settings-summary__icon settings-summary__icon--blue">
            <MonitorCog size={20} />
          </span>
          <div>
            <strong>{themeLabels[settings.theme]}</strong>
            <p>Chế độ giao diện</p>
          </div>
        </article>
        <article>
          <span className="settings-summary__icon settings-summary__icon--green">
            <LayoutDashboard size={20} />
          </span>
          <div>
            <strong>{densityLabels[settings.density]}</strong>
            <p>Mật độ bảng điều khiển</p>
          </div>
        </article>
        <article>
          <span className="settings-summary__icon settings-summary__icon--violet">
            <Globe2 size={20} />
          </span>
          <div>
            <strong>{languageLabels[settings.language]}</strong>
            <p>Ngôn ngữ hiển thị</p>
          </div>
        </article>
      </section>

      <section className="settings-grid">
        <article className="settings-panel settings-panel--wide">
          <div className="settings-panel__header">
            <div>
              <span className="settings-kicker">Giao diện</span>
              <h2>Hiển thị & thao tác</h2>
            </div>
            <LayoutDashboard size={20} />
          </div>

          <div className="settings-field">
            <label>Chế độ màu</label>
            <div
              className="settings-segmented"
              role="group"
              aria-label="Chế độ màu"
            >
              <button
                className={settings.theme === "system" ? "active" : ""}
                type="button"
                onClick={() => updateSetting("theme", "system")}
              >
                <MonitorCog size={16} />
                Hệ thống
              </button>
              <button
                className={settings.theme === "light" ? "active" : ""}
                type="button"
                onClick={() => updateSetting("theme", "light")}
              >
                <Sun size={16} />
                Sáng
              </button>
              <button
                className={settings.theme === "dark" ? "active" : ""}
                type="button"
                onClick={() => updateSetting("theme", "dark")}
              >
                <Moon size={16} />
                Tối
              </button>
            </div>
          </div>

          <div className="settings-field">
            <label>Mật độ bảng điều khiển</label>
            <div
              className="settings-segmented"
              role="group"
              aria-label="Mật độ bảng điều khiển"
            >
              <button
                className={settings.density === "comfortable" ? "active" : ""}
                type="button"
                onClick={() => updateSetting("density", "comfortable")}
              >
                Thoáng
              </button>
              <button
                className={settings.density === "compact" ? "active" : ""}
                type="button"
                onClick={() => updateSetting("density", "compact")}
              >
                Gọn
              </button>
            </div>
          </div>

          <div className="settings-two-col">
            <label className="settings-select">
              <span>Trang mở mặc định</span>
              <select
                value={settings.dashboardLanding}
                onChange={(event) =>
                  updateSetting("dashboardLanding", event.target.value)
                }
              >
                <option value="dashboard">Bảng điều khiển</option>
                <option value="approvals">Không gian xét duyệt</option>
                <option value="schedule">Lịch trình</option>
                <option value="reports">Báo cáo</option>
              </select>
            </label>

            <div className="settings-toggle-row">
              <span className="settings-toggle-row__icon">
                <Save size={18} />
              </span>
              <div>
                <strong>Tự lưu bản nháp</strong>
                <p>Tự lưu biểu mẫu đang soạn khi chuyển màn hình.</p>
              </div>
              <button
                className={`settings-switch ${settings.autoSaveDrafts ? "settings-switch--on" : ""}`}
                type="button"
                role="switch"
                aria-checked={settings.autoSaveDrafts}
                onClick={() =>
                  updateSetting("autoSaveDrafts", !settings.autoSaveDrafts)
                }
              >
                <span />
              </button>
            </div>
          </div>
        </article>

        <article className="settings-panel">
          <div className="settings-panel__header">
            <div>
              <span className="settings-kicker">Khu vực</span>
              <h2>Ngôn ngữ</h2>
            </div>
            <Globe2 size={20} />
          </div>

          <label className="settings-select">
            <span>Ngôn ngữ hiển thị</span>
            <select
              value={settings.language}
              onChange={(event) =>
                updateSetting("language", event.target.value)
              }
            >
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
              <option value="ja">日本語</option>
            </select>
          </label>

          <label className="settings-select">
            <span>Múi giờ làm việc</span>
            <select
              value={settings.timezone}
              onChange={(event) =>
                updateSetting("timezone", event.target.value)
              }
            >
              <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh</option>
              <option value="Asia/Tokyo">Asia/Tokyo</option>
              <option value="UTC">UTC</option>
            </select>
          </label>
        </article>
      </section>
    </main>
  );
}

export default Settings;
