import { useCallback, useEffect, useRef } from "react";

const SETTINGS_KEY = "manga-kousei-settings";
const DRAFT_PREFIX = "manga-kousei-draft:";

function isAutoSaveEnabled(): boolean {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return true;
    const parsed = JSON.parse(raw);
    return parsed.autoSaveDrafts ?? true;
  } catch {
    return true;
  }
}

interface DraftEnvelope<T> {
  data: T;
  savedAt: number;
}

export function peekDraftSavedAt(draftKey: string): number | null {
  try {
    const raw = localStorage.getItem(DRAFT_PREFIX + draftKey);
    if (!raw) return null;
    const parsed: DraftEnvelope<unknown> = JSON.parse(raw);
    return parsed.savedAt ?? null;
  } catch {
    return null;
  }
}

export function useDraftAutosave<T>(
  draftKey: string,
  data: T,
  delayMs = 1000,
  enabled = true,
) {
  const storageKey = DRAFT_PREFIX + draftKey;
  const debounceRef = useRef<number | null>(null);

  const dataRef = useRef(data);
  useEffect(() => {
    dataRef.current = data;
  });

  const enabledRef = useRef(enabled);
  useEffect(() => {
    enabledRef.current = enabled;
  });

  const saveNow = useCallback(() => {
    if (!enabledRef.current || !isAutoSaveEnabled()) return;
    try {
      const envelope: DraftEnvelope<T> = {
        data: dataRef.current,
        savedAt: Date.now(),
      };
      localStorage.setItem(storageKey, JSON.stringify(envelope));
    } catch {
      //
    }
  }, [storageKey]);

  useEffect(() => {
    if (!enabled || !isAutoSaveEnabled()) return;

    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(saveNow, delayMs);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(data), delayMs, saveNow, enabled]);

  useEffect(() => {
    return () => {
      saveNow();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handler = () => saveNow();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [saveNow]);

  const loadDraft = useCallback((): T | null => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      const parsed: DraftEnvelope<T> = JSON.parse(raw);
      return parsed.data;
    } catch {
      return null;
    }
  }, [storageKey]);

  const getDraftSavedAt = useCallback((): number | null => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      const parsed: DraftEnvelope<T> = JSON.parse(raw);
      return parsed.savedAt ?? null;
    } catch {
      return null;
    }
  }, [storageKey]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  return { loadDraft, getDraftSavedAt, clearDraft };
}
