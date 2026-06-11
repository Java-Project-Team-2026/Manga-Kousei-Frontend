export type ProposalStatusDTO =
  | "pending"
  | "approved"
  | "revision"
  | "rejected";

export interface ProposalGenreDTO {
  genreId: number;
  name: string;
}

export interface ProposalCharacterDTO {
  characterId: number;
  characterName: string;
  role: string;
  description: string | null;
}

export interface SeriesProposalDTO {
  proposalId: number;
  createdAt: string;
  workingTitle: string;
  synopsis: string;
  targetAudience: string;
  nameSummary: string | null;
  sketchImageUrl: string | null;
  status: ProposalStatusDTO;
  rejectionReason: string | null;
  revisionFeedback: string | null;
  mangaka: {
    userId: number;
    fullName: string;
    avatarUrl: string | null;
  };
  genres: ProposalGenreDTO[];
  characters: ProposalCharacterDTO[];
}
