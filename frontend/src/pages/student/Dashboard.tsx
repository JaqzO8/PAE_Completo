// src/pages/student/Dashboard.tsx
import { 
  Card, CardContent, CardHeader, CardTitle, Skeleton 
} from "../../desingSystem/primitives";
import { BookOpen, Users, Target, TrendingUp, Star, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useStudentStats } from "../../features/dashboard/hooks/useStudentStats";

const StudentDashboard = () => {
  const { user } = useAuth();
  const { stats, isLoading } = useStudentStats();

  // Extraer el primer nombre del usuario
  const firstName = user?.nombres?.split(" ")[0] || "Estudiante";

  const quickActions = [
    {
      title: "Explorar Repositorios",
      description: "Descubre material educativo",
      icon: BookOpen,
      to: "/estudiante/explorar",
      color: "bg-blue-500",
    },
    {
      title: "Mis Comunidades",
      description: "Grupos de estudio activos",
      icon: Users,
      to: "/estudiante/grupos/mis-grupos",
      color: "bg-success-progress",
    },
    {
      title: "Simulacros",
      description: "Practica para tus exámenes",
      icon: Target,
      to: "/estudiante/aprendizaje/simulacros",
      color: "bg-brand-action",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-primary-contrast">
          ¡Bienvenido, {firstName}!
        </h1>
        <p className="text-neutral-600">
          Aquí tienes un resumen de tu progreso académico.
        </p>
      </div>
      
      {/* Grid de Estadísticas - DATOS REALES */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Tarjeta 1: Recursos Guardados */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-small font-medium">Recursos Guardados</CardTitle>
            <Star className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-h2 font-bold">{stats?.savedResources || 0}</div>
                <p className="text-small text-neutral-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-success-progress" />
                  <span className="text-success-progress">+{stats?.weeklyGrowth || 0}</span> esta semana
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Tarjeta 2: Comunidades Activas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-small font-medium">Mis Comunidades</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-h2 font-bold">{stats?.activeCommunities || 0}</div>
                <p className="text-small text-neutral-600 mt-1">Grupos activos</p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Tarjeta 3: Tiempo de Estudio */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-small font-medium">Tiempo de Estudio</CardTitle>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.studyHours || 0}h</div>
                <p className="text-xs text-muted-foreground mt-1">Esta semana</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Acciones Rápidas */}
      <div>
        <h2 className="text-h2 font-bold text-primary-contrast mb-4">Acciones Rápidas</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map((action) => (
            <Link key={action.to} to={action.to}>
              <Card className="hover:shadow-lg transition-all cursor-pointer hover:border-brand-action/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg">
                    <div className={`p-3 rounded-lg ${action.color}`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-h3 font-semibold text-primary-contrast mb-1">
                        {action.title}
                      </h3>
                      <p className="text-small text-neutral-600">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;