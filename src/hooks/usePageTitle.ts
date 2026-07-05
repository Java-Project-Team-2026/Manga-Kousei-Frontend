import { useEffect } from "react";

const BASE_TITLE = "Manga Kousei";

export function usePageTitle(pageTitle?: string) {
  useEffect(() => {
    document.title = pageTitle ? `${pageTitle} — ${BASE_TITLE}` : BASE_TITLE;
  }, [pageTitle]);
}
