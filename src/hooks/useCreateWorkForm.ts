import { useReducer, useCallback, useMemo, useState, useEffect } from "react";
import api from "../services/api";
import { uploadImageToCloudinary } from "../utils/imageUpload";
import { useGenres } from "./useGenres";
import type { Character, CreateWorkFormData } from "../types/createWork";
import { peekDraftSavedAt, useDraftAutosave } from "./useDraftAutosave";
import {
  fetchMyProposalDetail,
  updateProposal,
} from "../services/proposalService";

type FormAction =
  | {
      type: "UPDATE_FIELD";
      key: keyof CreateWorkFormData;
      value: CreateWorkFormData[keyof CreateWorkFormData];
    }
  | { type: "ADD_CHARACTER" }
  | { type: "REMOVE_CHARACTER"; id: number }
  | {
      type: "UPDATE_CHARACTER";
      id: number;
      key: keyof Character;
      value: string;
    }
  | { type: "RESET_FORM" }
  | { type: "LOAD_DRAFT"; data: Partial<CreateWorkFormData> }
  | { type: "LOAD_EXISTING"; data: CreateWorkFormData };

const initialState: CreateWorkFormData = {
  title: "",
  genreIds: [],
  targetAudience: "",
  synopsis: "",
  characters: [{ id: Date.now(), name: "", role: "", description: "" }],
  nameSummary: "",
  sketchImage: null,
  sketchPreview: "",
};

const formReducer = (
  state: CreateWorkFormData,
  action: FormAction,
): CreateWorkFormData => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.key]: action.value };
    case "ADD_CHARACTER":
      return {
        ...state,
        characters: [
          ...state.characters,
          { id: Date.now(), name: "", role: "", description: "" },
        ],
      };
    case "REMOVE_CHARACTER":
      return {
        ...state,
        characters: state.characters.filter((c) => c.id !== action.id),
      };
    case "UPDATE_CHARACTER":
      return {
        ...state,
        characters: state.characters.map((c) =>
          c.id === action.id ? { ...c, [action.key]: action.value } : c,
        ),
      };
    case "RESET_FORM":
      return initialState;
    case "LOAD_DRAFT":
      return { ...state, ...action.data };
    case "LOAD_EXISTING":
      return action.data;
    default:
      return state;
  }
};

const TOTAL_STEPS = 5;

export const useCreateWorkForm = (editingProposalId: number | null) => {
  const [form, dispatch] = useReducer(formReducer, initialState);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loadingExisting, setLoadingExisting] = useState(
    Boolean(editingProposalId),
  );

  const genresList = useGenres();

  useEffect(() => {
    if (!editingProposalId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoadingExisting(true);
    fetchMyProposalDetail(editingProposalId)
      .then((p) => {
        dispatch({
          type: "LOAD_EXISTING",
          data: {
            title: p.working_title,
            genreIds: p.genres.map((g) => g.genre_id),
            targetAudience: p.target_audience,
            synopsis: p.synopsis,
            characters: p.characters.map((c) => ({
              id: c.character_id,
              name: c.character_name,
              role: c.role,
              description: c.description ?? "",
            })),
            nameSummary: p.name_summary ?? "",
            sketchImage: null,
            sketchPreview: p.sketch_image_url ?? "",
          },
        });
      })
      .catch((err) => {
        console.error("Không tải được proposal để sửa", err);
        setSubmitError("Không tải được bản ý tưởng cần sửa.");
      })
      .finally(() => setLoadingExisting(false));
  }, [editingProposalId]);

  const draftPayload = useMemo(
    () => ({
      form: {
        title: form.title,
        genreIds: form.genreIds,
        targetAudience: form.targetAudience,
        synopsis: form.synopsis,
        characters: form.characters,
        nameSummary: form.nameSummary,
      },
      step,
    }),
    [form, step],
  );

  const [draftSavedAt, setDraftSavedAt] = useState<number | null>(() =>
    editingProposalId ? null : peekDraftSavedAt("create-work"),
  );

  const draftAutosaveEnabled = !editingProposalId && draftSavedAt === null;

  const { loadDraft, clearDraft } = useDraftAutosave(
    "create-work",
    draftPayload,
    1000,
    draftAutosaveEnabled,
  );

  const restoreDraft = useCallback(() => {
    const draft = loadDraft();
    if (draft) {
      dispatch({ type: "LOAD_DRAFT", data: draft.form });
      setStep(draft.step ?? 1);
    }
    setDraftSavedAt(null);
  }, [loadDraft]);

  const discardDraft = useCallback(() => {
    clearDraft();
    setDraftSavedAt(null);
  }, [clearDraft]);

  const updateField = useCallback(
    <K extends keyof CreateWorkFormData>(
      key: K,
      value: CreateWorkFormData[K],
    ) => {
      dispatch({ type: "UPDATE_FIELD", key, value });
    },
    [],
  );

  const addCharacter = useCallback(
    () => dispatch({ type: "ADD_CHARACTER" }),
    [],
  );

  const removeCharacter = useCallback((id: number) => {
    dispatch({ type: "REMOVE_CHARACTER", id });
  }, []);

  const updateCharacter = useCallback(
    (id: number, key: keyof Character, value: string) => {
      dispatch({ type: "UPDATE_CHARACTER", id, key, value });
    },
    [],
  );

  const resetForm = useCallback(() => {
    if (form.sketchPreview) URL.revokeObjectURL(form.sketchPreview);
    dispatch({ type: "RESET_FORM" });
    setSubmitted(false);
    setStep(1);
    setSubmitError(null);
    clearDraft();
  }, [form.sketchPreview, clearDraft]);

  const submitProposal = useCallback(
    async (tantouId: number | null) => {
      if (!editingProposalId && !tantouId) {
        alert("Vui lòng chọn Tantou phụ trách trước khi nộp.");
        return;
      }

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        let sketchImageUrl = form.sketchPreview || "";
        if (form.sketchImage) {
          sketchImageUrl = await uploadImageToCloudinary(form.sketchImage);
        }

        if (editingProposalId) {
          await updateProposal(editingProposalId, {
            workingTitle: form.title,
            synopsis: form.synopsis,
            targetAudience: form.targetAudience,
            nameSummary: form.nameSummary,
            sketchImageUrl,
            genreIds: form.genreIds,
            characters: form.characters.map((c) => ({
              characterName: c.name,
              role: c.role,
              description: c.description,
            })),
          });
        } else {
          const payload = {
            workingTitle: form.title,
            synopsis: form.synopsis,
            targetAudience: form.targetAudience,
            nameSummary: form.nameSummary,
            sketchImageUrl,
            genreIds: form.genreIds,
            tantouId,
            characters: form.characters.map((c) => ({
              characterName: c.name,
              role: c.role,
              description: c.description,
            })),
          };
          const response = await api.post("/proposals", payload);
          if (response.status !== 200 && response.status !== 201) {
            throw new Error(
              "Gửi proposal thất bại, mã lỗi: " + response.status,
            );
          }
        }

        setSubmitted(true);
        clearDraft();
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Có lỗi xảy ra khi gửi proposal";
        setSubmitError(message);
        alert(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [form, clearDraft, editingProposalId],
  );

  const canProceed = useMemo(() => {
    if (step === 1) {
      return Boolean(
        form.title.trim() &&
        form.genreIds.length &&
        form.targetAudience &&
        form.synopsis.trim(),
      );
    }
    if (step === 2) {
      return form.characters.every((c) =>
        Boolean(c.name.trim() && c.role.trim()),
      );
    }
    return true;
  }, [
    step,
    form.title,
    form.genreIds,
    form.targetAudience,
    form.synopsis,
    form.characters,
  ]);

  const handleSetStep = useCallback((dir: "inc" | "dec") => {
    setStep((prev) => {
      if (dir === "inc") return Math.min(TOTAL_STEPS, prev + 1);
      return Math.max(1, prev - 1);
    });
  }, []);

  return {
    form,
    step,
    submitted,
    isSubmitting,
    submitError,
    genresList,
    updateField,
    addCharacter,
    removeCharacter,
    updateCharacter,
    submitProposal,
    resetForm,
    setStep: handleSetStep,
    canProceed,
    draftSavedAt,
    restoreDraft,
    discardDraft,
    loadingExisting,
    isEditing: Boolean(editingProposalId),
  };
};
