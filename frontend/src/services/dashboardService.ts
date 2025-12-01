import axiosClient from "@/services/axiosClient";
import type { StandardResponse } from "@/types";

export interface DashboardStats {
    totalBook: number;
    totalUsers: number;
    totalBorrow: number;
}

export const getDashboardStats = async (): Promise<StandardResponse<DashboardStats>> => {
    const res = await axiosClient.get('/admin/dashboard');
    return res.data;
};

export const getHomePageStats = async (): Promise<StandardResponse<DashboardStats>> => {
    const res = await axiosClient.get('public/homepage-stats');
    return res.data;
};

export const dashboardService = {
    getDashboardStats,
    getHomePageStats,
};

export default dashboardService;
