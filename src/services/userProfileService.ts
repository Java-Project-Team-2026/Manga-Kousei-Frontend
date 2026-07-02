import api from "./api";

interface ApiResp<T> {
  data: T;
  message: string;
}

export interface UpdateProfileReq {
  fullName?: string;
  avatarUrl?: string;
  phone?: string;
}

export interface UserProfileRes {
  id: number;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  phone: string | null;
  roles: string[];
}

export interface ChangePasswordReq {
  currentPassword: string;
  newPassword: string;
}

export const updateMyProfile = (
  body: UpdateProfileReq,
): Promise<UserProfileRes> =>
  api
    .patch<ApiResp<UserProfileRes>>("/users/me", body)
    .then((r) => r.data.data);

// Tái dùng endpoint đã có sẵn từ trước (Settings.tsx cũ có thể đang gọi
// riêng lẻ) -- gộp vào chung modal Edit Profile cho tiện.
export const changeMyPassword = (body: ChangePasswordReq): Promise<void> =>
  api.patch("/users/me/password", body).then(() => undefined);
