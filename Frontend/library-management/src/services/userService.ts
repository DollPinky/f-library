import type { UserProfile } from "@/types/User";
import axiosClient from "./axiosClient";
import type { StandardResponse } from "@/types";

export const userProfile = async (): Promise<UserProfile | undefined> => {
  try {
    const response = await axiosClient.get("/accounts/get-info");

    const apiResponse = response.data as StandardResponse<UserProfile>;

    if (!apiResponse.success || !apiResponse.data) {
      throw new Error(apiResponse.message || "Login failed");
    }

    return apiResponse.data;
  } catch (error: unknown) {
    console.log(error);
    return undefined;
  }
};
