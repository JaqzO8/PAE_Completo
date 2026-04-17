// src/config/menus.ts

import { 
  BarChart3, FolderOpen, Users, Globe, Star, 
  LibraryBig, MessageSquare, ClipboardList, 
  Gamepad2, Zap, User, Home, BookOpen
} from "lucide-react";
import type { SidebarItem } from "../components/layout/Sidebar";

// --- 1. MENÚS PRINCIPALES (DASHBOARD) ---

export const TEACHER_MAIN_MENU: SidebarItem[] = [
  { label: "Dashboard", to: "/docente", icon: Home },
  { label: "Biblioteca de Repositorios", to: "/docente/repositorios", icon: LibraryBig }, 
  { label: "Cursos", to: "/docente/cursos", icon: BookOpen },
  { label: "Comunidades", to: "/docente/grupos", icon: Users },
  { label: "Simulacros", to: "/docente/aprendizaje/simulacros", icon: ClipboardList },
  { label: "Desafíos", to: "/docente/aprendizaje/desafios", icon: Gamepad2 },
  { label: "Trivia Diaria", to: "/docente/aprendizaje/trivia", icon: Zap },
  { label: "Mi Perfil", to: "/docente/perfil", icon: User },
];

export const STUDENT_MAIN_MENU: SidebarItem[] = [
  { label: "Dashboard", to: "/estudiante", icon: Home },
  { label: "Repositorios", to: "/estudiante/repositorios", icon: LibraryBig },
  { label: "Cursos", to: "/estudiante/cursos", icon: BookOpen },
  { label: "Comunidades", to: "/estudiante/grupos", icon: Users },
  { label: "Simulacros", to: "/estudiante/aprendizaje/simulacros", icon: ClipboardList },
  { label: "Desafíos", to: "/estudiante/aprendizaje/desafios", icon: Gamepad2 },
  { label: "Trivia Diaria", to: "/estudiante/aprendizaje/trivia", icon: Zap },
  { label: "Mi Perfil", to: "/estudiante/perfil", icon: User },
];

// --- 2. SUB-MENÚS: REPOSITORIO (Contextual) ---

export const REPO_MENU_TEACHER: SidebarItem[] = [
  { label: "Repositorios", to: "/docente/repositorios/explorar", icon: Globe },
  { label: "Mis Repositorios", to: "/docente/repositorios/mis-repos", icon: FolderOpen },
  { label: "Favoritos", to: "/docente/repositorios/favoritos", icon: Star },
];

export const REPO_MENU_STUDENT: SidebarItem[] = [
  { label: "Explorar Repositorios", to: "/estudiante/explorar", icon: Globe },
  { label: "Mis Favoritos", to: "/estudiante/biblioteca", icon: Star },
];

// --- 3. SUB-MENÚS: GRUPOS (Contextual) ---

export const GROUPS_MENU_TEACHER: SidebarItem[] = [
  { label: "Mis Comunidades", to: "/docente/grupos/mis-grupos", icon: Users },
  { label: "Explorar Comunidades", to: "/docente/grupos/explorar", icon: Globe },
  { label: "Foros", to: "/docente/grupos/foros", icon: MessageSquare },
  { label: "Mis Foros", to: "/docente/grupos/mis-foros", icon: ClipboardList },
];

export const GROUPS_MENU_STUDENT: SidebarItem[] = [
  { label: "Mis Comunidades", to: "/estudiante/grupos/mis-grupos", icon: Users },
  { label: "Explorar Comunidades", to: "/estudiante/grupos/explorar", icon: Globe },
  { label: "Foros Públicos", to: "/estudiante/grupos/foros", icon: MessageSquare },
  { label: "Mis Foros", to: "/estudiante/grupos/mis-foros", icon: ClipboardList },
];

export const LEARNING_MENU_TEACHER: SidebarItem[] = [
  { label: "Simulacros", to: "/docente/aprendizaje/simulacros", icon: ClipboardList },
  { label: "Desafíos", to: "/docente/aprendizaje/desafios", icon: Gamepad2 },
  { label: "Trivia Diaria", to: "/docente/aprendizaje/trivia", icon: Zap },
];

export const LEARNING_MENU_STUDENT: SidebarItem[] = [
  { label: "Simulacros", to: "/estudiante/aprendizaje/simulacros", icon: ClipboardList },
  { label: "Desafíos", to: "/estudiante/aprendizaje/desafios", icon: Gamepad2 },
  { label: "Trivia Diaria", to: "/estudiante/aprendizaje/trivia", icon: Zap },
];