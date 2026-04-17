// src/pages/teacher/Dashboard.tsx
import { 
  Card, CardContent, CardHeader, CardTitle, Skeleton 
} from "../../desingSystem/primitives";
import { BarChart3, Users, FileText, TrendingUp, TrendingDown } from "lucide-react";
import { useTeacherStats } from "../../features/dashboard/hooks/useTeacherStats";
import { useAuth } from "../../context/AuthContext";

const TeacherDashboard = () => {
  const { stats, isLoading } = useTeacherStats();
  const { user } = useAuth();

  // Extraer el primer nombre o usar un saludo genérico
  const firstName = user?.nombres?.split(" ")[0] || "Profesor";

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Encabezado */}
      <div className="px-4 md:px-0">
        <h1 className="text-2xl md:text-3xl font-bold text-primary-contrast">
          Hola, {firstName}
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Aquí tienes el resumen de tu actividad reciente.
        </p>
      </div>
      
      {/* Grid de Estadísticas */}
      <div className="grid gap-4 px-4 md:px-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {/* Tarjeta 1: Estudiantes */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estudiantes Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.activeStudents || 0}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  {stats && stats.studentGrowth > 0 ? (
                    <>
                      <TrendingUp className="h-3 w-3 text-success-progress" />
                      <span className="text-success-progress">+{stats.studentGrowth}%</span>
                    </>
                  ) : stats && stats.studentGrowth < 0 ? (
                    <>
                      <TrendingDown className="h-3 w-3 text-red-500" />
                      <span className="text-red-500">{stats.studentGrowth}%</span>
                    </>
                  ) : (
                    <span className="text-neutral-500">Sin cambios</span>
                  )}
                  {' '}vs mes anterior
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Tarjeta 2: Repositorios */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mis Repositorios</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.totalRepositories || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats?.totalRepositories === 0 
                    ? "Crea tu primer repositorio" 
                    : stats?.totalRepositories === 1
                    ? "Repositorio creado"
                    : "Repositorios creados"
                  }
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Tarjeta 3: Evaluaciones */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Por Calificar</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.pendingEvaluations || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats?.pendingEvaluations === 0 
                    ? "Todo al día" 
                    : "Evaluaciones pendientes"
                  }
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actividad Reciente */}
      <Card className="mx-4 md:mx-0">
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats?.activeStudents && stats.activeStudents > 0 ? (
              <div className="flex items-center gap-4 p-3 bg-neutral-50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    {stats.activeStudents} {stats.activeStudents === 1 ? 'estudiante ha' : 'estudiantes han'} guardado tus repositorios
                  </p>
                  <p className="text-xs text-muted-foreground">Interacción activa</p>
                </div>
              </div>
            ) : null}

            {stats?.totalRepositories && stats.totalRepositories > 0 ? (
              <div className="flex items-center gap-4 p-3 bg-neutral-50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    Tienes {stats.totalRepositories} {stats.totalRepositories === 1 ? 'repositorio' : 'repositorios'} {stats.totalRepositories === 1 ? 'publicado' : 'publicados'}
                  </p>
                  <p className="text-xs text-muted-foreground">Contenido disponible</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 p-3 bg-amber-50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    Aún no has creado repositorios
                  </p>
                  <p className="text-xs text-muted-foreground">Comienza subiendo tu primer contenido</p>
                </div>
              </div>
            )}

            {stats?.pendingEvaluations && stats.pendingEvaluations > 0 ? (
              <div className="flex items-center gap-4 p-3 bg-neutral-50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    {stats.pendingEvaluations} {stats.pendingEvaluations === 1 ? 'evaluación pendiente' : 'evaluaciones pendientes'} de revisión
                  </p>
                  <p className="text-xs text-muted-foreground">Requiere atención</p>
                </div>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {/* Debug Info (solo en desarrollo) */}
      {import.meta.env.DEV && (
        <Card className="border-purple-200 bg-purple-50/50 mx-4 md:mx-0">
          <CardHeader>
            <CardTitle className="text-sm text-purple-800">
              🔍 Debug: Datos del Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="font-semibold">Usuario ID:</span> {user?.id}
              </div>
              <div>
                <span className="font-semibold">Repositorios:</span> {stats?.totalRepositories || 0}
              </div>
              <div>
                <span className="font-semibold">Estudiantes:</span> {stats?.activeStudents || 0}
              </div>
              <div>
                <span className="font-semibold">Crecimiento:</span> {stats?.studentGrowth || 0}%
              </div>
              <div className="col-span-2">
                <span className="font-semibold">Loading:</span> {isLoading ? 'Sí' : 'No'}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeacherDashboard;