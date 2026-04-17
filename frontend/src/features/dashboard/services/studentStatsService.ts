// src/features/dashboard/services/studentStatsService.ts
import { api } from "../../../services/api";

export interface StudentDashboardStats {
    savedResources: number;
    activeCommunities: number;
    studyHours: number;
    weeklyGrowth: number;
}

export const getStudentStats = async (): Promise<StudentDashboardStats> => {
    try {
        const response = await api.get("/content/stats/student");
        return response.data.data;
    } catch (error) {
        console.error("Error obteniendo stats de estudiante:", error);
        // Fallback temporal
        return {
            savedResources: 0,
            activeCommunities: 0,
            studyHours: 0,
            weeklyGrowth: 0,
        };
    }
};