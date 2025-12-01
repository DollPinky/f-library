import { useIsMobile } from "@/hooks/use-mobile";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useEffect, useState, type JSX } from "react";
import { getHomePageStats } from "@/services/dashboardService";
import { toast } from "react-hot-toast";
import type { DashboardResponse } from "@/types";

export default function StatsList(): JSX.Element {
    const isMobile = useIsMobile();
    const [dashboardResponse, setDashboardResponse] = useState<DashboardResponse | null>(null);
    const [, setLoading] = useState<boolean>(false);
    const fetchStats = async (): Promise<void> => {
        setLoading(true);
        try {
            const res: any = await getHomePageStats();
            const data = res?.data ?? res;
            const entity = data?.content ? data.content : data;

            const normalized: DashboardResponse = {
                ...entity,
                totalBook: entity?.totalBook ?? "Unknown",
                totalUsers: entity?.totalUsers ?? "Unknown",
                date: entity?.date ?? "Unknown",
                month: entity?.month ?? "Unknown",
            };
            setDashboardResponse(normalized);
        } catch (err: any) {
            console.error("Failed to load data", err);
            toast.error(err?.response?.data?.message || "Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <div className={isMobile ? "space-y-4" : "grid gap-6 grid-cols-3"}>
            <Card className="md:m-0 m-3">
                <CardHeader className="py-3">
                    <CardTitle className={isMobile ? "text-sm" : "text-base"}>
                        Total Books
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className={isMobile ? "text-xl" : "text-2xl font-bold"}>
                        {dashboardResponse?.totalBook ?? 0}
                    </div>
                </CardContent>
            </Card>
            <Card className="md:m-0 m-3">
                <CardHeader className="py-3">
                    <CardTitle className={isMobile ? "text-sm" : "text-base"}>
                        Active Readers
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className={isMobile ? "text-xl" : "text-2xl font-bold"}>
                        {dashboardResponse?.totalUsers ?? 0}
                    </div>
                </CardContent>
            </Card>
            <Card className="md:m-0 m-3">
                <CardHeader className="py-3">
                    <CardTitle className={isMobile ? "text-sm" : "text-base"}>
                        Total Book Borrowed
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className={isMobile ? "text-xl" : "text-2xl font-bold"}>
                        {dashboardResponse?.totalBorrow ?? 0}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
