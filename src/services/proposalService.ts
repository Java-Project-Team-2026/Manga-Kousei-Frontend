import api from "./api";
import type { SeriesProposal } from "../types/SeriesProposal";
import type { SeriesProposalDTO } from "../types/dtos/SeriesProposalDto";

interface ApiResponse<T> {
  data: T;
  message: string;
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
    status: item.status as SeriesProposal["status"],
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

export const fetchMyProposalDetail = (id: number): Promise<SeriesProposal> =>
  api
    .get<ApiResponse<SeriesProposalDTO>>(`/proposals/${id}`)
    .then((r) => mapDTO(r.data.data));

export interface UpdateProposalBody {
  workingTitle: string;
  synopsis: string;
  targetAudience: string;
  nameSummary?: string;
  sketchImageUrl?: string;
  genreIds: number[];
  characters: { characterName: string; role: string; description?: string }[];
}

export const updateProposal = (
  id: number,
  body: UpdateProposalBody,
): Promise<SeriesProposal> =>
  api
    .put<ApiResponse<SeriesProposalDTO>>(`/proposals/${id}`, body)
    .then((r) => mapDTO(r.data.data));
