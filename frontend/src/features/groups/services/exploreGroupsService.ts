// src/features/groups/services/exploreGroupsService.ts
import { api } from "../../../services/api";
import type { Group } from "./groupsService";

// Interface para solicitud de unión
export interface JoinRequest {
  groupId: string;
  message?: string;
}

export interface JoinResponse {
  status: "pending" | "approved" | "rejected";
  message: string;
}

// --- MOCK DATA ---
const MOCK_PUBLIC_GROUPS: Group[] = [
  {
    id: "pub-1",
    name: "Club de Lectura Digital",
    subject: "Literatura",
    membersCount: 156,
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=books",
    status: "Público",
    lastActivity: "Hace 10 min",
  },
  {
    id: "pub-2",
    name: "Matemáticas Avanzadas 2025",
    subject: "Matemáticas",
    membersCount: 89,
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=math2",
    status: "Público",
    lastActivity: "Hace 1 hora",
  },
  {
    id: "pub-3",
    name: "Ciencias de la Computación",
    subject: "Tecnología",
    membersCount: 203,
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=cs",
    status: "Público",
    lastActivity: "Hace 30 min",
  },
  {
    id: "pub-4",
    name: "Historia del Arte Moderno",
    subject: "Arte",
    membersCount: 67,
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=art",
    status: "Público",
    lastActivity: "Hace 2 horas",
  },
  {
    id: "pub-5",
    name: "Biología Molecular",
    subject: "Ciencias",
    membersCount: 124,
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=bio",
    status: "Público",
    lastActivity: "Hace 45 min",
  },
];

// --- SERVICIOS MOCK ---
const getPublicGroupsMock = async (): Promise<Group[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_PUBLIC_GROUPS), 800));
};

const joinGroupMock = async (request: JoinRequest): Promise<JoinResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: "pending",
        message: "Tu solicitud ha sido enviada. El administrador la revisará pronto.",
      });
    }, 1000);
  });
};

// --- SERVICIOS API ---
const getPublicGroupsApi = async (): Promise<Group[]> => {
  const response = await api.get("/groups/public");
  return response.data;
};

const joinGroupApi = async (request: JoinRequest): Promise<JoinResponse> => {
  const response = await api.post("/groups/join", request);
  return response.data;
};

// --- EXPORTACIONES CON FALLBACK ---
export const getPublicGroups = async (): Promise<Group[]> => {
  if (import.meta.env.VITE_USE_MOCKS === "true") {
    console.log("🔶 Modo Mock: Public Groups");
    return getPublicGroupsMock();
  }

  try {
    return await getPublicGroupsApi();
  } catch (error) {
    console.warn("🔴 API Error (Public Groups), using mock.", error);
    return getPublicGroupsMock();
  }
};

export const joinGroup = async (request: JoinRequest): Promise<JoinResponse> => {
  if (import.meta.env.VITE_USE_MOCKS === "true") {
    console.log("🔶 Modo Mock: Join Group");
    return joinGroupMock(request);
  }

  try {
    return await joinGroupApi(request);
  } catch (error) {
    console.warn("🔴 API Error (Join Group), using mock.", error);
    return joinGroupMock(request);
  }
};