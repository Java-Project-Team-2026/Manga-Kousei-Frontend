import api from "./api";
import type { UserProfile, UserStats, UpdateProfileData, ChangePasswordData, UserFullProfile} from "../types/userType";
export const fetchUserById = (userId: number): Promise<UserProfile> =>
    api.get(`/users/${userId}`).then((res) => {
        console.log("User data", res);
        return res.data.data as UserProfile;
    });
export const fetchUserStats = (userId: number): Promise<UserStats> =>
    api.get(`/users/${userId}/stats`).then((res) => {
        console.log("User Stats", res);
        return res.data.data as UserStats;
    });
export const updateMyProfile = (data: UpdateProfileData): Promise<UserProfile> => 
    api.patch(`/users/me`, data).then((res) => {
        console.log("Update User response", res);
        return res.data.data as UserProfile;
    });
export const uploadMyAvatar = (file: File): Promise<{ avatarUrl: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post(`/users/me/avatar`, formData, {
        headers: { 'Content-Type': "multipart/form-data" },
    }).then((res) => {
        console.log("Upload Avatar Response", res);
        return res.data.data as { avatarUrl: string };
    });
};
export const changeMyPassword = (data: ChangePasswordData): Promise<void> =>
    api.patch(`/users/me/password`, data).then((res) => {
        console.log("Change Password Response", res);
        return res.data;
    });
export const fetchUserFullProfile = (userId: number): Promise<UserFullProfile> =>
  api.get(`/users/${userId}/full-profile`).then((res) => {
    console.log("Fetch Full User Data Response", res);
    return res.data.data as UserFullProfile;
  })