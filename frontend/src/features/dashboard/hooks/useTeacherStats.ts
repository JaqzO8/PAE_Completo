import { useState, useEffect } from "react";
import { getTeacherStats, type DashboardStats } from "../services/teacherStatsService";
import { useToast } from "../../../hooks/useToast";

export const useTeacherStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await getTeacherStats();
        setStats(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar las estadísticas.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  return { stats, isLoading };
};