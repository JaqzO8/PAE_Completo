import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from '../components/ui/Toaster';
import { AuthProvider } from '../context/AuthContext';

// ... (Todos tus otros imports igual)
import { TeacherLayout } from '../components/layout/TeacherLayout';
import { StudentLayout } from '../components/layout/StudentLayout';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { PublicRoute } from '../components/layout/PublicRoute'; 

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Teacher pages
import TeacherDashboard from '../pages/teacher/Dashboard';
import TeacherRepoList from '../pages/teacher/repositories/List';
import TeacherExplore from '../pages/teacher/repositories/Explore';
import TeacherFavorites from '../pages/teacher/repositories/Favorites';
import TeacherRepoCreate from '../pages/teacher/repositories/Create';
import TeacherGroupsList from '../pages/teacher/groups/List';
import TeacherGroupDetail from '../pages/teacher/groups/Detail';
import TeacherGroupsExplore from '../pages/teacher/groups/Explore';
import TeacherForums from '../pages/teacher/groups/Forums';
import TeacherMyForums from '../pages/teacher/groups/MyForums';
import ManageRepository from '../pages/teacher/repositories/Manage';
import AddResource from '../pages/teacher/repositories/AddResource';

// Student pages
import StudentDashboard from '../pages/student/Dashboard';
import StudentExplore from '../pages/student/repositories/Explore'; 
import StudentFavorites from '../pages/student/repositories/Favorites';
import StudentGroupList from '../pages/student/groups/List';
import StudentGroupDetail from '../pages/student/groups/Detail';
import StudentGroupsExplore from '../pages/student/groups/Explore';
import StudentForums from '../pages/student/groups/Forums';
import StudentMyForums from '../pages/student/groups/MyForums';
import Courses from "../pages/student/Courses";
import CourseDetail from "../pages/student/CourseDetail";
import StudentRepositoryDetail from '../pages/student/repositories/Detail';

// Shared pages
import Simulacros from '../pages/learning/Simulacros';
import ExamView from '../pages/learning/ExamView';
import ExamResults from '../pages/learning/ExamResults';
import Desafios from '../pages/learning/Desafios';
import Trivia from '../pages/learning/Trivia';
import Profile from '../pages/Profile';
import Landing from '../pages/Landing';
import NotFound from '../pages/NotFound';
import Placeholder from '../pages/Placeholder';

const TeacherLayoutWrapper = () => <TeacherLayout><Outlet /></TeacherLayout>;
const StudentLayoutWrapper = () => <StudentLayout><Outlet /></StudentLayout>;

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* RUTAS PÚBLICAS GENERALES */}
          <Route path="/" element={<Landing />} />
          
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<Placeholder />} />
          </Route>

          {/* ZONA DOCENTE */}
          <Route element={<ProtectedRoute allowedRoles={['docente']} />}>
            <Route element={<TeacherLayoutWrapper />}>
              <Route path="/docente" element={<TeacherDashboard />} />
              <Route path="/docente/repositorios" element={<Navigate to="/docente/repositorios/explorar" replace />} />
              <Route path="/docente/repositorios/explorar" element={<TeacherExplore />} />
              <Route path="/docente/repositorios/mis-repos" element={<TeacherRepoList />} />
              <Route path="/docente/repositorios/favoritos" element={<TeacherFavorites />} />
              <Route path="/docente/crear-repositorio" element={<TeacherRepoCreate />} />
              <Route path="/docente/repositorios/gestionar/:id" element={<ManageRepository />} />
              <Route path="/docente/repositorios/gestionar/:id/agregar-recurso" element={<AddResource />} />

              <Route path="/docente/grupos" element={<Navigate to="/docente/grupos/mis-grupos" replace />} />
              <Route path="/docente/grupos/mis-grupos" element={<TeacherGroupsList />} />
              <Route path="/docente/grupos/:id" element={<TeacherGroupDetail />} />
              <Route path="/docente/grupos/explorar" element={<TeacherGroupsExplore />} />
              <Route path="/docente/grupos/foros" element={<TeacherForums />} />
              <Route path="/docente/grupos/mis-foros" element={<TeacherMyForums />} />
              
              <Route path="/docente/aprendizaje/simulacros" element={<Simulacros />} />
              <Route path="/docente/aprendizaje/simulacros/examen" element={<ExamView />} />
              <Route path="/docente/aprendizaje/simulacros/resultados" element={<ExamResults />} />
              <Route path="/docente/aprendizaje/desafios" element={<Desafios />} />
              <Route path="/docente/aprendizaje/trivia" element={<Trivia />} />
              
              <Route path="/docente/perfil" element={<Profile />} />
              <Route path="/docente/*" element={<Navigate to="/docente" replace />} />
            </Route>
          </Route>

          {/* ZONA ESTUDIANTE */}
          <Route element={<ProtectedRoute allowedRoles={['estudiante']} />}>
            <Route element={<StudentLayoutWrapper />}>
              <Route path="/estudiante" element={<StudentDashboard />} />
              
              <Route path="/estudiante/repositorios" element={<Navigate to="/estudiante/explorar" replace />} />
              <Route path="/estudiante/explorar" element={<StudentExplore />} />
              <Route path="/estudiante/biblioteca" element={<StudentFavorites />} />
              <Route path="/estudiante/repositorios/:id" element={<StudentRepositoryDetail />} />
              <Route path="/estudiante/grupos" element={<Navigate to="/estudiante/grupos/mis-grupos" replaces />} />
              <Route path="/estudiante/grupos/mis-grupos" element={<StudentGroupList />} />
              <Route path="/estudiante/grupos/:id" element={<StudentGroupDetail />} />
              <Route path="/estudiante/grupos/explorar" element={<StudentGroupsExplore />} />
              <Route path="/estudiante/grupos/foros" element={<StudentForums />} />
              <Route path="/estudiante/grupos/mis-foros" element={<StudentMyForums />} />
              
              <Route path="/estudiante/aprendizaje/simulacros" element={<Simulacros />} />
              <Route path="/estudiante/aprendizaje/simulacros/examen" element={<ExamView />} />
              <Route path="/estudiante/aprendizaje/simulacros/resultados" element={<ExamResults />} />
              <Route path="/estudiante/aprendizaje/desafios" element={<Desafios />} />
              <Route path="/estudiante/aprendizaje/trivia" element={<Trivia />} />
              
              <Route path="/estudiante/cursos" element={<Courses />} />
              <Route path="/estudiante/cursos/:courseTitle" element={<CourseDetail />} />

              <Route path="/estudiante/perfil" element={<Profile />} />
              <Route path="/estudiante/*" element={<Navigate to="/estudiante" replace />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
        
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
};