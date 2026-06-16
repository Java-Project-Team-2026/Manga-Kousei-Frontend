export interface SeriesStatus {
  statusId: number;
  statusName: 'ONGOING' | 'COMPLETED' | 'HIATUS' | 'CANCELLED';
}
export interface ChapterStatus {
  statusId: number;
  statusName: 'DRAFT' | 'PUBLISHED' | 'LOCKED';
}
export interface ManuscriptStatus {
  statusId: number;
  statusName: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
}
export interface UserStatus {
  statusId: number;
  statusName: 'ACTIVE' | 'INACTIVE' | 'BANNED';
}
export interface Role {
  roleId: number;
  roleName: 'ADMIN' | 'MANAGER' | 'EDITOR' | 'MANGAKA' | 'ASSISTANT' | 'READER';
}
export interface Genre {
  genreId: number;
  genreName: string;
}
export interface Page {
  pageId: number;
  pageNumber: number;
  fileUrl: string;
  createdAt: string;
}
export interface Chapter {
  chapterId: number;
  chapterNumber: number;
  title: string | null;
  deadline: string | null;
  createdAt: string;
  chapterStatus: ChapterStatus;
  pages: Page[];
}
export interface Series {
  seriesId: number;
  title: string;
  description: string;
  createdAt: string;
  approvedAt: string | null;
  seriesStatus: SeriesStatus;
  genres: Genre[];
  creator?: User;
  editor?: User;
  chapters?: Chapter[];
}
export interface Manuscript {
  manuscriptId: number;
  versionNo: number;
  urlField: string;
  submittedAt: string;
  series: Series;
  chapter: Chapter;
  submitter?: User;
  manuscriptStatus: ManuscriptStatus;
}
export interface User {
  userId: number;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  roles: Role[];
  createdSeries: Series[];
  editedSeries: Series[];
}
export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  roles: Role[];          
  avatarUrl: string | null;
  editedSeries: number;     
  createdSeries: number;   
}
export interface UserStats {
  createdSeriesCount: number;
  editedSeriesCount: number;
  manuscriptCount: number;
  totalPagesCreated?: number;
  totalChaptersCreated?: number;
}
export interface UpdateProfileData {
  fullName?: string;
  avatarUrl?: string;
}
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}
export interface SeriesSummary {
  seriesId: number;
  title: string;
  description: string;
  createdAt: string;
  approvedAt: string | null;
  seriesStatus: string;
  genres: Genre[];
}

export interface UserFullProfile {
  id: number;
  fullName: string;
  email: string;
  roles: Role[];
  avatarUrl: string | null;
  createdSeries: SeriesSummary[];
  editedSeries: SeriesSummary[];
}