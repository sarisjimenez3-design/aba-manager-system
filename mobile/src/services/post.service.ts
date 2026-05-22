import { api } from "../api/axios";
import { Post } from "../types/post.types";

export const getPostsRequest = async () => {
  const response = await api.get<{
    success: boolean;
    message: string;
    data: Post[];
  }>("/api/posts");

  return response.data;
};

export const createPostRequest = async (payload: {
  title: string;
  content: string;
  imageUri?: string;
}) => {
  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append("content", payload.content);

  if (payload.imageUri) {
    formData.append("image", {
      uri: payload.imageUri,
      name: "post-image.jpg",
      type: "image/jpeg",
    } as any);
  }

  const response = await api.post("/api/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};