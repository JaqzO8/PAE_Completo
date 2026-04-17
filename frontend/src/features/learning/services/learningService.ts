// src/features/learning/services/learningService.ts
import { api } from "../../../services/api";

// ========== INTERFACES ==========
export interface University {
  id: string;
  name: string;
  logo?: string;
  questionCount: number;
}

export interface SimulacroConfig {
  universityId: string;
  difficulty: "facil" | "medio" | "dificil";
}

export interface SimulacroQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  subject: string;
  difficulty: "facil" | "medio" | "dificil";
}

export interface SimulacroResult {
  id: string;
  questions: SimulacroQuestion[];
  timeLimit: number; // en segundos
  config: SimulacroConfig;
}

export interface SimulacroSubmission {
  simulacroId: string;
  answers: number[];
  timeSpent: number;
}

export interface SimulacroScore {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  percentile: number;
  solutions: Array<{
    question: SimulacroQuestion;
    userAnswer: number;
    isCorrect: boolean;
  }>;
}

export interface ChallengeRoom {
  id: string;
  host: string;
  hostAvatar?: string;
  topic: string;
  difficulty: "facil" | "medio" | "dificil";
  currentPlayers: number;
  maxPlayers: number;
  status: "waiting" | "playing" | "finished";
  createdAt: string;
}

export interface CreateRoomData {
  topic: string;
  difficulty: "facil" | "medio" | "dificil";
  maxPlayers: number;
}

export interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  points: number;
}

export interface TriviaRoom {
  id: string;
  host: string;
  hostAvatar?: string;
  topic: string;
  questionsCount: number;
  currentPlayers: number;
  maxPlayers: number;
  status: "waiting" | "playing" | "finished";
  createdAt: string;
}

export interface CreateTriviaRoomData {
  topic: string;
  questionsCount: number;
  maxPlayers: number;
}

// ========== MOCK DATA ==========
const MOCK_UNIVERSITIES: University[] = [
  { id: "unmsm", name: "Universidad Nacional Mayor de San Marcos (UNMSM)", questionCount: 100 },
  { id: "uni", name: "Universidad Nacional de Ingeniería (UNI)", questionCount: 100 },
  { id: "pucp", name: "Pontificia Universidad Católica del Perú (PUCP)", questionCount: 80 },
  { id: "unfv", name: "Universidad Nacional Federico Villarreal (UNFV)", questionCount: 80 },
  { id: "unac", name: "Universidad Nacional del Callao (UNAC)", questionCount: 80 },
  { id: "upn", name: "Universidad Privada del Norte (UPN)", questionCount: 60 },
];

const MOCK_QUESTIONS: SimulacroQuestion[] = [
  {
    id: "q1",
    question: "Si f(x) = 3x² + 2x - 5, ¿cuál es el valor de f(2)?",
    options: ["7", "11", "15", "19"],
    correctAnswer: 1,
    explanation: "Reemplazamos x = 2 en la función: f(2) = 3(2)² + 2(2) - 5 = 3(4) + 4 - 5 = 12 + 4 - 5 = 11. Por lo tanto, la respuesta correcta es 11.",
    subject: "Matemáticas",
    difficulty: "medio",
  },
  {
    id: "q2",
    question: "¿Cuál es la capital de Perú?",
    options: ["Arequipa", "Lima", "Cusco", "Trujillo"],
    correctAnswer: 1,
    explanation: "Lima es la capital y ciudad más poblada del Perú, ubicada en la costa central del país.",
    subject: "Historia",
    difficulty: "facil",
  },
  {
    id: "q3",
    question: "La fórmula química del agua es:",
    options: ["H2O2", "H2O", "H3O", "HO2"],
    correctAnswer: 1,
    explanation: "El agua está compuesta por dos átomos de hidrógeno (H) y uno de oxígeno (O), por lo tanto su fórmula es H2O.",
    subject: "Química",
    difficulty: "facil",
  },
  {
    id: "q4",
    question: "¿Quién escribió 'Cien años de soledad'?",
    options: ["Mario Vargas Llosa", "Gabriel García Márquez", "Pablo Neruda", "Jorge Luis Borges"],
    correctAnswer: 1,
    explanation: "Gabriel García Márquez, escritor colombiano y Premio Nobel de Literatura 1982, es el autor de 'Cien años de soledad', publicada en 1967.",
    subject: "Literatura",
    difficulty: "medio",
  },
  {
    id: "q5",
    question: "El resultado de √144 es:",
    options: ["10", "11", "12", "13"],
    correctAnswer: 2,
    explanation: "La raíz cuadrada de 144 es 12, ya que 12 × 12 = 144.",
    subject: "Matemáticas",
    difficulty: "facil",
  },
];

const MOCK_CHALLENGE_ROOMS: ChallengeRoom[] = [
  {
    id: "room1",
    host: "María García",
    hostAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
    topic: "Matemáticas - Álgebra",
    difficulty: "medio",
    currentPlayers: 2,
    maxPlayers: 4,
    status: "waiting",
    createdAt: "Hace 5 min",
  },
  {
    id: "room2",
    host: "Carlos Pérez",
    hostAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos",
    topic: "Historia Universal",
    difficulty: "dificil",
    currentPlayers: 3,
    maxPlayers: 4,
    status: "playing",
    createdAt: "Hace 10 min",
  },
];

const MOCK_TRIVIA: TriviaQuestion[] = [
  {
    id: "t1",
    question: "¿En qué año se descubrió América?",
    options: ["1490", "1492", "1494", "1500"],
    correctAnswer: 1,
    category: "Historia",
    points: 10,
  },
  {
    id: "t2",
    question: "¿Cuál es el resultado de 15 × 8?",
    options: ["110", "120", "130", "140"],
    correctAnswer: 1,
    category: "Matemáticas",
    points: 15,
  },
  {
    id: "t3",
    question: "¿Qué gas es esencial para la respiración humana?",
    options: ["Nitrógeno", "Oxígeno", "Dióxido de carbono", "Helio"],
    correctAnswer: 1,
    category: "Ciencias",
    points: 10,
  },
  {
    id: "t4",
    question: "¿Quién escribió 'Cien años de soledad'?",
    options: ["Mario Vargas Llosa", "Gabriel García Márquez", "Pablo Neruda", "Jorge Luis Borges"],
    correctAnswer: 1,
    category: "Literatura",
    points: 15,
  },
  {
    id: "t5",
    question: "¿Cuál es el río más largo del mundo?",
    options: ["Nilo", "Amazonas", "Yangtsé", "Misisipi"],
    correctAnswer: 1,
    category: "Geografía",
    points: 10,
  },
];

const MOCK_TRIVIA_ROOMS: TriviaRoom[] = [
  {
    id: "trivia1",
    host: "Ana López",
    hostAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ana",
    topic: "Historia del Perú",
    questionsCount: 10,
    currentPlayers: 2,
    maxPlayers: 4,
    status: "waiting",
    createdAt: "Hace 3 min",
  },
  {
    id: "trivia2",
    host: "Pedro Sánchez",
    hostAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pedro",
    topic: "Cultura General",
    questionsCount: 5,
    currentPlayers: 4,
    maxPlayers: 4,
    status: "playing",
    createdAt: "Hace 7 min",
  },
];

// ========== SERVICIOS MOCK ==========
const getUniversitiesMock = async (): Promise<University[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_UNIVERSITIES), 800));
};

const startSimulacroMock = async (config: SimulacroConfig): Promise<SimulacroResult> => {
  const timeLimit = config.difficulty === "facil" ? 9000 : config.difficulty === "medio" ? 7200 : 5760;
  
  // Generar más preguntas para el simulacro (20 total)
  const extendedQuestions = [
    ...MOCK_QUESTIONS,
    ...MOCK_QUESTIONS.map((q, i) => ({
      ...q,
      id: `q${i + 6}`,
      question: `${q.question} (Variante ${i + 1})`,
    })),
  ].slice(0, 20);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `sim-${Date.now()}`,
        questions: extendedQuestions,
        timeLimit,
        config,
      });
    }, 1500);
  });
};

const submitSimulacroMock = async (submission: SimulacroSubmission): Promise<SimulacroScore> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Obtener las preguntas del simulacro (en producción vendrían del servidor)
      const extendedQuestions = [
        ...MOCK_QUESTIONS,
        ...MOCK_QUESTIONS.map((q, i) => ({
          ...q,
          id: `q${i + 6}`,
          question: `${q.question} (Variante ${i + 1})`,
        })),
      ].slice(0, submission.answers.length);

      const correctAnswers = submission.answers.filter((answer, index) => {
        return answer === extendedQuestions[index]?.correctAnswer;
      }).length;

      const solutions = extendedQuestions.map((q, index) => ({
        question: q,
        userAnswer: submission.answers[index],
        isCorrect: submission.answers[index] === q.correctAnswer,
      }));

      resolve({
        score: correctAnswers * 5,
        totalQuestions: submission.answers.length,
        correctAnswers,
        timeSpent: submission.timeSpent,
        percentile: Math.min(Math.floor((correctAnswers / submission.answers.length) * 100) + Math.floor(Math.random() * 10), 99),
        solutions,
      });
    }, 1000);
  });
};

const getChallengeRoomsMock = async (): Promise<ChallengeRoom[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_CHALLENGE_ROOMS), 600));
};

const createChallengeRoomMock = async (data: CreateRoomData): Promise<ChallengeRoom> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `room-${Date.now()}`,
        host: "Tú",
        topic: data.topic,
        difficulty: data.difficulty,
        currentPlayers: 1,
        maxPlayers: data.maxPlayers,
        status: "waiting",
        createdAt: "Ahora",
      });
    }, 1000);
  });
};

const getDailyTriviaMock = async (): Promise<TriviaQuestion[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_TRIVIA), 600));
};

const getTriviaRoomsMock = async (): Promise<TriviaRoom[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_TRIVIA_ROOMS), 600));
};

const createTriviaRoomMock = async (data: CreateTriviaRoomData): Promise<TriviaRoom> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `trivia-${Date.now()}`,
        host: "Tú",
        topic: data.topic,
        questionsCount: data.questionsCount,
        currentPlayers: 1,
        maxPlayers: data.maxPlayers,
        status: "waiting",
        createdAt: "Ahora",
      });
    }, 1000);
  });
};

// ========== SERVICIOS API ==========
const getUniversitiesApi = async (): Promise<University[]> => {
  const response = await api.get("/learning/universities");
  return response.data;
};

const startSimulacroApi = async (config: SimulacroConfig): Promise<SimulacroResult> => {
  const response = await api.post("/learning/simulacro/start", config);
  return response.data;
};

const submitSimulacroApi = async (submission: SimulacroSubmission): Promise<SimulacroScore> => {
  const response = await api.post("/learning/simulacro/submit", submission);
  return response.data;
};

const getChallengeRoomsApi = async (): Promise<ChallengeRoom[]> => {
  const response = await api.get("/learning/challenges/rooms");
  return response.data;
};

const createChallengeRoomApi = async (data: CreateRoomData): Promise<ChallengeRoom> => {
  const response = await api.post("/learning/challenges/rooms", data);
  return response.data;
};

const getDailyTriviaApi = async (): Promise<TriviaQuestion[]> => {
  const response = await api.get("/learning/trivia/daily");
  return response.data;
};

const getTriviaRoomsApi = async (): Promise<TriviaRoom[]> => {
  const response = await api.get("/learning/trivia/rooms");
  return response.data;
};

const createTriviaRoomApi = async (data: CreateTriviaRoomData): Promise<TriviaRoom> => {
  const response = await api.post("/learning/trivia/rooms", data);
  return response.data;
};

// ========== EXPORTACIONES CON FALLBACK ==========
export const getUniversities = async (): Promise<University[]> => {
  if (import.meta.env.VITE_USE_MOCKS === "true") {
    return getUniversitiesMock();
  }

  try {
    return await getUniversitiesApi();
  } catch (error) {
    console.warn("🔴 API Error (Universities), using mock.", error);
    return getUniversitiesMock();
  }
};

export const startSimulacro = async (config: SimulacroConfig): Promise<SimulacroResult> => {
  if (import.meta.env.VITE_USE_MOCKS === "true") {
    return startSimulacroMock(config);
  }

  try {
    return await startSimulacroApi(config);
  } catch (error) {
    console.warn("🔴 API Error (Start Simulacro), using mock.", error);
    return startSimulacroMock(config);
  }
};

export const submitSimulacro = async (submission: SimulacroSubmission): Promise<SimulacroScore> => {
  if (import.meta.env.VITE_USE_MOCKS === "true") {
    return submitSimulacroMock(submission);
  }

  try {
    return await submitSimulacroApi(submission);
  } catch (error) {
    console.warn("🔴 API Error (Submit Simulacro), using mock.", error);
    return submitSimulacroMock(submission);
  }
};

export const getChallengeRooms = async (): Promise<ChallengeRoom[]> => {
  if (import.meta.env.VITE_USE_MOCKS === "true") {
    return getChallengeRoomsMock();
  }

  try {
    return await getChallengeRoomsApi();
  } catch (error) {
    console.warn("🔴 API Error (Challenge Rooms), using mock.", error);
    return getChallengeRoomsMock();
  }
};

export const createChallengeRoom = async (data: CreateRoomData): Promise<ChallengeRoom> => {
  if (import.meta.env.VITE_USE_MOCKS === "true") {
    return createChallengeRoomMock(data);
  }

  try {
    return await createChallengeRoomApi(data);
  } catch (error) {
    console.warn("🔴 API Error (Create Challenge Room), using mock.", error);
    return createChallengeRoomMock(data);
  }
};

export const getDailyTrivia = async (): Promise<TriviaQuestion[]> => {
  if (import.meta.env.VITE_USE_MOCKS === "true") {
    return getDailyTriviaMock();
  }

  try {
    return await getDailyTriviaApi();
  } catch (error) {
    console.warn("🔴 API Error (Daily Trivia), using mock.", error);
    return getDailyTriviaMock();
  }
};

export const getTriviaRooms = async (): Promise<TriviaRoom[]> => {
  if (import.meta.env.VITE_USE_MOCKS === "true") {
    return getTriviaRoomsMock();
  }

  try {
    return await getTriviaRoomsApi();
  } catch (error) {
    console.warn("🔴 API Error (Trivia Rooms), using mock.", error);
    return getTriviaRoomsMock();
  }
};

export const createTriviaRoom = async (data: CreateTriviaRoomData): Promise<TriviaRoom> => {
  if (import.meta.env.VITE_USE_MOCKS === "true") {
    return createTriviaRoomMock(data);
  }

  try {
    return await createTriviaRoomApi(data);
  } catch (error) {
    console.warn("🔴 API Error (Create Trivia Room), using mock.", error);
    return createTriviaRoomMock(data);
  }
};