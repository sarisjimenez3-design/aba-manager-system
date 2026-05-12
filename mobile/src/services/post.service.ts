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
}) => {
  const response = await api.post("/api/posts", payload);
  return response.data;
};