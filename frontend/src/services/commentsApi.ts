import type {
  CommentResponse,
  CreateCommentRequest,
  StandardResponse,
} from "@/types";
import axiosClient from "./axiosClient";

export const createCommentBook = async (
  payload: CreateCommentRequest
): Promise<StandardResponse<CommentResponse>> => {
  const res = await axiosClient.post("/comments/create", payload);
  return res.data;
};
