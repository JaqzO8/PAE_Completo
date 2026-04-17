// src/features/dashboard/services/teacherStatsService.ts
import { api } from "../../../services/api";

export interface DashboardStats {
  activeStudents: number;
  totalRepositories: number;
  pendingEvaluations: number;
  studentGrowth: number;
}

export const getTeacherStats = async (): Promise<DashboardStats> => {
    try {
        console.log('🔵 Solicitando estadísticas del docente...');
        
        const response = await api.get("/content/stats/teacher");
        
        console.log('✅ Estadísticas recibidas:', response.data.data);
        
        return {
            activeStudents: response.data.data.activeStudents || 0,
            totalRepositories: response.data.data.totalRepositories || 0,
            pendingEvaluations: response.data.data.pendingEvaluations || 0,
            studentGrowth: response.data.data.studentGrowth || 0,
        };
    } catch (error: any) {
        console.error("❌ Error obteniendo estadísticas de docente:", error);
        
        // Log detallado del error
        if (error.response) {
            console.error('Response error:', {
                status: error.response.status,
                data: error.response.data,
                url: error.config?.url
            });
        }
        
        // Retornar valores por defecto en caso de error
        return {
            activeStudents: 0,
            totalRepositories: 0,
            pendingEvaluations: 0,
            studentGrowth: 0,
        };
    }
};