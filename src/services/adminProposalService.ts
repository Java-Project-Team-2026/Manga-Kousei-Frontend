import api from "./api";
import type { SeriesProposal } from "../types/SeriesProposal";

interface ApiResponse<T> {
  data: T;
  message: string;
}

interface ProposalGenreDTO {
  genre_id: number;
  name: string;
}

interface ProposalCharacterDTO {
  character_id: number;
  character_name: string;
  role: string;
  description?: string | null;
}

interface SeriesProposalDTO {
  proposalId: number;
  createdAt: string;
  workingTitle: string;
  synopsis: string;
  targetAudience: string;
  nameSummary?: string | null;
  sketchImageUrl?: string | null;
  status: string;
  rejectionReason?: string | null;
  revisionFeedback?: string | null;
  mangaka: {
    userId: number;
    fullName: string;
    avatarUrl?: string | null;
  };
  genres: ProposalGenreDTO[];
  characters: ProposalCharacterDTO[];
}

type ProposalStatus =
  | "pending"
  | "pending_admin"
  | "approved"
  | "revision"
  | "rejected";

function validateStatus(s: string): ProposalStatus {
  const valid: ProposalStatus[] = [
    "pending",
    "approved",
    "revision",
    "rejected",
    "pending_admin",
  ];
  return valid.includes(s as ProposalStatus)
    ? (s as ProposalStatus)
    : "pending";
}

function mapDTO(item: SeriesProposalDTO): SeriesProposal {
  return {
    proposal_id: item.proposalId,
    created_at: item.createdAt,
    working_title: item.workingTitle,
    synopsis: item.synopsis,
    target_audience: item.targetAudience,
    name_summary: item.nameSummary || null,
    sketch_image_url: item.sketchImageUrl || null,
    status: validateStatus(item.status),
    rejection_reason: item.rejectionReason || null,
    revision_feedback: item.revisionFeedback || null,
    mangaka: {
      user_id: item.mangaka?.userId,
      fullName: item.mangaka?.fullName,
      avatarUrl: item.mangaka?.avatarUrl || null,
    },
    genres: (item.genres || []).map((g) => ({
      genre_id: g.genre_id,
      name: g.name,
    })),
    characters: (item.characters || []).map((c) => ({
      character_id: c.character_id,
      character_name: c.character_name,
      role: c.role,
      description: c.description || null,
    })),
  };
}

export const fetchAdminPendingProposals = async (): Promise<
  SeriesProposal[]
> => {
  return api
    .get<ApiResponse<SeriesProposalDTO[]>>("/admin/proposals/pending")
    .then((res) => {
      const rawData = res.data.data;
      if (!Array.isArray(rawData)) return [];
      return rawData.map(mapDTO);
    })
    .catch(() => []);
};

export const adminReviewProposal = (
  id: number,
  body: {
    decision: "approve" | "reject";
    reason?: string;
  },
) => api.patch(`/admin/proposals/${id}/review`, body);

export const cancelApprove = (proposalId: number) =>
  api.patch(`/admin/proposals/${proposalId}/cancel-approve`);
