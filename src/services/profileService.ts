import api from "./api";

export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  roles: string[];
  avatarUrl: string | null;
}

export interface UpdateProfilePayload {
  fullName?: string;
  avatarUrl?: string | null;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const updateMyProfile = async (
  payload: UpdateProfilePayload,
): Promise<UserProfile> => {
  const response = await api.patch<ApiResponse<UserProfile>>(
    "/users/me",
    payload,
  );

  return response.data.data;
};

export const changeMyPassword = async (
  payload: ChangePasswordPayload,
): Promise<void> => {
  await api.patch<ApiResponse<void>>("/users/me/password", payload);
};
