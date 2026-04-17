import { api } from "../../../services/api";
import type { Repository } from "../../repository/services/repositoryService";

// --- MOCK DATA (Recursos agregados de los grupos) ---
const MOCK_GROUP_RESOURCES: Repository[] = [
  {
    id: "res-1",
    title: "Guía de Estudio: Álgebra Vectorial",
    author: "Prof. Carlos (Grupo A)",
    role: "Docente",
    views: 450,
    downloads: 120,
    tags: ["Álgebra", "Guía"],
    isFavorite: false,
    updatedAt: "15/03/2024",
  },
  {
    id: "res-2",
    title: "Solucionario: Examen Parcial 1",
    author: "Dra. Ana (Historia)",
    role: "Docente",
    views: 890,
    downloads: 560,
    tags: ["Historia", "Examen"],
    isFavorite: true,
    updatedAt: "12/03/2024",
  }
];

export const getGroupResources = async (): Promise<Repository[]> => {
  // A. Mock
  if (import.meta.env.VITE_USE_MOCKS === "true") {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_GROUP_RESOURCES), 800));
  }
  
  // B. API Real
  try {
    const response = await api.get("/groups/resources/all");
    return response.data;
  } catch (error) {
    console.warn("API Error (Group Resources), using mock.", error);
    return MOCK_GROUP_RESOURCES;
  }
};