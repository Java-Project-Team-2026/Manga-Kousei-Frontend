import axios from "axios";

export const getErrorMessage = (
  error: unknown,
  defaultMessage?: string,
): string => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      defaultMessage ||
      "Yêu cầu thất bại, vui lòng thử lại!"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return defaultMessage || "Đã xảy ra lỗi không xác định!";
};
