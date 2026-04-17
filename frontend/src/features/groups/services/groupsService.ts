// src/features/groups/services/groupsService.ts
import { api } from "../../../services/api";

// ========== INTERFACES ==========
// NOTA: Estas interfaces son compartidas entre docentes y estudiantes
export interface Group {
  id: string;
  name: string;
  subject: string;
  membersCount: number;
  avatar?: string;
  status?: string;
  lastActivity?: string;
}

export interface GroupMessage {
  id: string;
  author: string;
  authorRole: "docente" | "estudiante";
  content: string;
  timestamp: string;
  avatar?: string;
}

export interface GroupParticipant {
  id: string;
  name: string;
  role: "docente" | "estudiante";
  avatar?: string;
  email: string;
  joinedAt: string;
}

export interface ForumThread {
  id: string;
  title: string;
  author: string;
  authorAvatar?: string;
  replies: number;
  lastReply: string;
  isResolved: boolean;
}

export interface GroupAnalytics {
  totalMessages: number;
  activeMembers: number;
  avgResponseTime: string;
  participationRate: number;
  topContributors: Array<{
    name: string;
    messages: number;
    avatar?: string;
  }>;
}

export interface GroupDetail extends Group {
  description: string;
  createdAt: string;
  messages: GroupMessage[];
  participants: GroupParticipant[];
  forums: ForumThread[];
  analytics: GroupAnalytics;
}

// ========== MOCK DATA ==========
const MOCK_GROUPS: Group[] = [
  {
    id: "1",
    name: "Cálculo Diferencial 2025-I",
    subject: "Matemáticas",
    membersCount: 32,
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=calc",
    status: "Activo",
    lastActivity: "Hace 5 min",
  },
  {
    id: "2",
    name: "Historia Universal - Grupo A",
    subject: "Humanidades",
    membersCount: 24,
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=hist",
    status: "Activo",
    lastActivity: "Hace 1 hora",
  },
  {
    id: "3",
    name: "Física Cuántica Avanzada",
    subject: "Física",
    membersCount: 18,
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=phys",
    status: "Activo",
    lastActivity: "Hace 3 horas",
  },
];

const MOCK_GROUP_DETAIL: GroupDetail = {
  id: "1",
  name: "Cálculo Diferencial 2025-I",
  subject: "Matemáticas",
  membersCount: 32,
  avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=calc",
  status: "Activo • 28 en línea",
  description: "Comunidad de estudio para la materia de Cálculo Diferencial del semestre 2025-I",
  createdAt: "Enero 2025",
  lastActivity: "Hace 5 min",
  
  messages: [
    {
      id: "1",
      author: "Prof. Carlos Mendoza",
      authorRole: "docente",
      content: "Buenos días a todos. Les recuerdo que mañana tenemos examen parcial. Repasen los temas 1-5.",
      timestamp: "10:30 AM",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos",
    },
    {
      id: "2",
      author: "Ana García",
      authorRole: "estudiante",
      content: "Profesor, ¿el tema de límites infinitos entra en el examen?",
      timestamp: "10:35 AM",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ana",
    },
    {
      id: "3",
      author: "Prof. Carlos Mendoza",
      authorRole: "docente",
      content: "Sí Ana, es parte del tema 3. Revisen los ejercicios de la guía.",
      timestamp: "10:37 AM",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos",
    },
    {
      id: "4",
      author: "Luis Ramírez",
      authorRole: "estudiante",
      content: "¿Alguien tiene las respuestas de los ejercicios 15-20? Me trabé en el 17.",
      timestamp: "11:05 AM",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=luis",
    },
  ],

  participants: [
    {
      id: "p1",
      name: "Prof. Carlos Mendoza",
      role: "docente",
      email: "cmendoza@pae.edu",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos",
      joinedAt: "Enero 2025",
    },
    {
      id: "p2",
      name: "Ana García",
      role: "estudiante",
      email: "agarcia@estudiantes.pae.edu",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ana",
      joinedAt: "Enero 2025",
    },
    {
      id: "p3",
      name: "Luis Ramírez",
      role: "estudiante",
      email: "lramirez@estudiantes.pae.edu",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=luis",
      joinedAt: "Enero 2025",
    },
    {
      id: "p4",
      name: "María Torres",
      role: "estudiante",
      email: "mtorres@estudiantes.pae.edu",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
      joinedAt: "Enero 2025",
    },
  ],

  forums: [
    {
      id: "f1",
      title: "¿Cómo resolver derivadas implícitas?",
      author: "Carlos Pérez",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos2",
      replies: 12,
      lastReply: "Hace 2 horas",
      isResolved: true,
    },
    {
      id: "f2",
      title: "Duda sobre la regla de la cadena",
      author: "Sofia Méndez",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sofia",
      replies: 8,
      lastReply: "Hace 30 min",
      isResolved: false,
    },
    {
      id: "f3",
      title: "Material complementario para límites",
      author: "Prof. Carlos Mendoza",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos",
      replies: 5,
      lastReply: "Hace 1 día",
      isResolved: false,
    },
  ],

  analytics: {
    totalMessages: 287,
    activeMembers: 28,
    avgResponseTime: "15 min",
    participationRate: 87.5,
    topContributors: [
      {
        name: "Ana García",
        messages: 45,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ana",
      },
      {
        name: "Luis Ramírez",
        messages: 38,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=luis",
      },
      {
        name: "María Torres",
        messages: 32,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
      },
    ],
  },
};

// ========== SERVICIOS MOCK ==========
const getGroupsMock = async (): Promise<Group[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_GROUPS), 800));
};

const getGroupDetailMock = async (id: string): Promise<GroupDetail> => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_GROUP_DETAIL), 600));
};

// ========== SERVICIOS API ==========
const getGroupsApi = async (): Promise<Group[]> => {
  const response = await api.get("/teacher/groups");
  return response.data;
};

const getGroupDetailApi = async (id: string): Promise<GroupDetail> => {
  const response = await api.get(`/teacher/groups/${id}`);
  return response.data;
};

// ========== EXPORTACIONES CON FALLBACK ==========
export const getTeacherGroups = async (): Promise<Group[]> => {
  if (import.meta.env.VITE_USE_MOCKS === "true") {
    console.log("🔶 Modo Mock: Groups List");
    return getGroupsMock();
  }

  try {
    return await getGroupsApi();
  } catch (error) {
    console.warn("🔴 API Error (Groups), using mock.", error);
    return getGroupsMock();
  }
};

export const getGroupDetail = async (id: string): Promise<GroupDetail> => {
  if (import.meta.env.VITE_USE_MOCKS === "true") {
    console.log("🔶 Modo Mock: Group Detail");
    return getGroupDetailMock(id);
  }

  try {
    return await getGroupDetailApi(id);
  } catch (error) {
    console.warn("🔴 API Error (Group Detail), using mock.", error);
    return getGroupDetailMock(id);
  }
};

// ========== FUNCIÓN PARA ESTUDIANTES (FALTABA) ==========a
export const getStudentGroups = async (): Promise<Group[]> => {
  if (import.meta.env.VITE_USE_MOCKS === "true") {
    console.log("🔶 Modo Mock: Student Groups");
    return getGroupsMock();
  }

  try {
    const response = await api.get("/student/groups");
    return response.data;
  } catch (error) {
    console.warn("🔴 API Error (Student Groups), using mock.", error);
    return getGroupsMock();
  }
};