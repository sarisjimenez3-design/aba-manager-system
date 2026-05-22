import { API_BASE_URL } from "../constants/env";

export const getImageUrl = (imageUrl?: string) => {
  if (!imageUrl) return undefined;

  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  return `${API_BASE_URL}${imageUrl}`;
};