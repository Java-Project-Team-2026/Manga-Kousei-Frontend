import { useState, useCallback, useEffect } from "react";
import {
  fetchUserById,
  fetchUserStats,
  fetchUserFullProfile,
  updateMyProfile,
  uploadMyAvatar,
  changeMyPassword,
} from "../services/userProfileService";
import type { 
  UserProfile, 
  UserStats, 
  UserFullProfile, 
  UpdateProfileData, 
  ChangePasswordData 
} from "../types/userType";

interface UseUserProfileReturn {
  profile: UserProfile | UserFullProfile | null;
  stats: UserStats | null;
  loading: boolean;
  error: string | null;
  updateProfile: (data: UpdateProfileData) => Promise<UserProfile>;
  uploadAvatar: (file: File) => Promise<string>;
  changePassword: (data: ChangePasswordData) => Promise<void>;
  // Truyền true vào refetch(true) nếu muốn lấy FullProfile kèm SeriesSummary
  refetch: (full?: boolean) => Promise<void>;
}
export const useUserProfile = (userId: number | null): UseUserProfileReturn => {
  const [profile, setProfile] = useState<UserProfile | UserFullProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const loadData = useCallback(async (full: boolean = false) => {
    if (!userId) {
      setProfile(null);
      setStats(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [profileData, statsData] = await Promise.all([
        full ? fetchUserFullProfile(userId) : fetchUserById(userId),
        fetchUserStats(userId),
      ]);
      setProfile(profileData);
      setStats(statsData);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load user profile";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [userId]);
  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateProfile = async (data: UpdateProfileData): Promise<UserProfile> => {
    try {
      const updated = await updateMyProfile(data);
      setProfile((prev) => (prev ? { ...prev, ...updated } : updated));
      return updated;
    } catch (err: unknown) {
      throw new Error(err instanceof Error ? err.message : "Update failed", { cause: err });
    }
  };
  const uploadAvatar = async (file: File): Promise<string> => {
    try {
      const { avatarUrl } = await uploadMyAvatar(file);
      setProfile((prev) => (prev ? { ...prev, avatarUrl } : null));
      return avatarUrl;
    } catch (err: unknown) {
      throw new Error(err instanceof Error ? err.message : "Upload avatar failed", { cause: err });
    }
  };
  const changePassword = async (data: ChangePasswordData): Promise<void> => {
    try {
      await changeMyPassword(data);
    } catch (err: unknown) {
      throw new Error(err instanceof Error ? err.message : "Change password failed", { cause: err });
    }
  };
  return {
    profile,
    stats,
    loading,
    error,
    updateProfile,
    uploadAvatar,
    changePassword,
    refetch: (full = false) => loadData(full),
  };
};