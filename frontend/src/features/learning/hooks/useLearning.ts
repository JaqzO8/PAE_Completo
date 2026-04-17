// src/features/learning/hooks/useLearning.ts
import { useState, useEffect } from "react";
import {
  getUniversities,
  startSimulacro,
  getChallengeRooms,
  createChallengeRoom,
  getTriviaRooms,
  createTriviaRoom,
  type University,
  type SimulacroConfig,
  type SimulacroResult,
  type ChallengeRoom,
  type TriviaRoom,
  type CreateTriviaRoomData,
} from "../services/learningService";
import { useToast } from "../../../hooks/useToast";

// Hook para Simulacros
export const useSimulacros = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [simulacro, setSimulacro] = useState<SimulacroResult | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadUniversities();
  }, []);

  const loadUniversities = async () => {
    setIsLoading(true);
    try {
      const data = await getUniversities();
      setUniversities(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar las universidades.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startExam = async (config: SimulacroConfig) => {
    setIsLoading(true);
    try {
      const result = await startSimulacro(config);
      setSimulacro(result);
      toast({
        title: "Simulacro iniciado",
        description: "¡Buena suerte! Recuerda que el tiempo corre.",
      });
      return result;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo iniciar el simulacro.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { universities, simulacro, isLoading, startExam };
};

// Hook para Desafíos Colaborativos
export const useChallenges = () => {
  const [rooms, setRooms] = useState<ChallengeRoom[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    setIsLoading(true);
    try {
      const data = await getChallengeRooms();
      setRooms(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar las salas.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createRoom = async (roomData: any) => {
    setIsLoading(true);
    try {
      const newRoom = await createChallengeRoom(roomData);
      setRooms((prev) => [newRoom, ...prev]);
      toast({
        title: "Sala creada",
        description: "Tu sala está lista. ¡Espera a que se unan otros jugadores!",
      });
      return newRoom;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear la sala.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const joinRoom = async (roomId: string) => {
    toast({
      title: "Uniéndose a la sala",
      description: "Preparando el desafío...",
    });
    // Lógica de unirse (por implementar con WebSockets)
  };

  return { rooms, isLoading, createRoom, joinRoom, refresh: loadRooms };
};

// Hook para Trivia Colaborativa
export const useTrivia = () => {
  const [rooms, setRooms] = useState<TriviaRoom[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    setIsLoading(true);
    try {
      const data = await getTriviaRooms();
      setRooms(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar las salas de trivia.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createRoom = async (roomData: CreateTriviaRoomData) => {
    setIsLoading(true);
    try {
      const newRoom = await createTriviaRoom(roomData);
      setRooms((prev) => [newRoom, ...prev]);
      toast({
        title: "Sala creada",
        description: "Tu sala de trivia está lista. ¡Espera a que se unan otros jugadores!",
      });
      return newRoom;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear la sala de trivia.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const joinRoom = async (roomId: string) => {
    toast({
      title: "Uniéndose a la trivia",
      description: "Preparando la sala...",
    });
    // Lógica de unirse (por implementar con WebSockets)
  };

  return { rooms, isLoading, createRoom, joinRoom, refresh: loadRooms };
};