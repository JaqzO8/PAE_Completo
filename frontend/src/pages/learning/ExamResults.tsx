// src/pages/learning/ExamResults.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { Trophy, Clock, Target, TrendingUp, CheckCircle, XCircle, Home } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Separator,
} from "../../desingSystem/primitives";
import type { SimulacroScore } from "../../features/learning/services/learningService";
import styles from "../../features/learning/components/learning.module.css";

const ExamResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const result = location.state?.result as SimulacroScore | undefined;

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Resultados no encontrados</h2>
          <p className="text-muted-foreground mb-4">
            No hay resultados para mostrar.
          </p>
          <Button onClick={() => navigate("/docente/aprendizaje/simulacros")}>
            Volver a Simulacros
          </Button>
        </Card>
      </div>
    );
  }

  const percentage = (result.correctAnswers / result.totalQuestions) * 100;
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getPerformanceMessage = () => {
    if (percentage >= 90) return "¡Excelente! Dominas estos temas a la perfección.";
    if (percentage >= 75) return "¡Muy bien! Estás en buen camino hacia tu meta.";
    if (percentage >= 60) return "Buen trabajo. Con más práctica mejorarás aún más.";
    return "Sigue practicando. Cada intento te acerca más a tu objetivo.";
  };

  const getPerformanceColor = () => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 75) return "text-blue-600";
    if (percentage >= 60) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header con Puntaje Principal */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-brand-action to-blue-600 p-8 text-white">
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <Trophy className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-center mb-2">
              ¡Simulacro Completado!
            </h1>
            <p className="text-center text-blue-100 text-lg">
              {getPerformanceMessage()}
            </p>
          </div>

          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Puntaje */}
              <div className="text-center">
                <div className="mb-2">
                  <Target className="h-8 w-8 mx-auto text-brand-action" />
                </div>
                <p className={`text-4xl font-bold ${getPerformanceColor()}`}>
                  {result.score}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Puntos</p>
              </div>

              {/* Correctas */}
              <div className="text-center">
                <div className="mb-2">
                  <CheckCircle className="h-8 w-8 mx-auto text-green-600" />
                </div>
                <p className="text-4xl font-bold text-green-600">
                  {result.correctAnswers}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Correctas</p>
              </div>

              {/* Tiempo */}
              <div className="text-center">
                <div className="mb-2">
                  <Clock className="h-8 w-8 mx-auto text-blue-600" />
                </div>
                <p className="text-4xl font-bold text-blue-600">
                  {formatTime(result.timeSpent)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Tiempo</p>
              </div>

              {/* Percentil */}
              <div className="text-center">
                <div className="mb-2">
                  <TrendingUp className="h-8 w-8 mx-auto text-purple-600" />
                </div>
                <p className="text-4xl font-bold text-purple-600">
                  {result.percentile}%
                </p>
                <p className="text-sm text-muted-foreground mt-1">Percentil</p>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Barra de Progreso */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Rendimiento General</span>
                <span className={`font-bold ${getPerformanceColor()}`}>
                  {percentage.toFixed(1)}%
                </span>
              </div>
              <div className="h-4 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${
                    percentage >= 90
                      ? "bg-green-500"
                      : percentage >= 75
                      ? "bg-blue-500"
                      : percentage >= 60
                      ? "bg-orange-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Solucionario Detallado */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-brand-action" />
              Solucionario Detallado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {result.solutions.map((solution, index) => (
              <div key={solution.question.id} className={styles.solutionCard}>
                <div className="flex items-start gap-3 mb-4">
                  <Badge
                    className={
                      solution.isCorrect
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }
                  >
                    {solution.isCorrect ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 mr-1" />
                    )}
                    {solution.isCorrect ? "Correcta" : "Incorrecta"}
                  </Badge>
                  <Badge variant="outline">{solution.question.subject}</Badge>
                </div>

                <h3 className={styles.solutionQuestion}>
                  {index + 1}. {solution.question.question}
                </h3>

                <div className={styles.solutionOptions}>
                  {solution.question.options.map((option, optIndex) => {
                    const isCorrect = optIndex === solution.question.correctAnswer;
                    const isUserAnswer = optIndex === solution.userAnswer;

                    return (
                      <div
                        key={optIndex}
                        className={`${styles.solutionOption} ${
                          isCorrect ? styles.solutionOptionCorrect : ""
                        } ${
                          isUserAnswer && !isCorrect
                            ? styles.solutionOptionIncorrect
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="font-bold">
                            {String.fromCharCode(65 + optIndex)}.
                          </div>
                          <span>{option}</span>
                        </div>
                        {isCorrect && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                        {isUserAnswer && !isCorrect && (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explicación */}
                <div className={styles.solutionExplanation}>
                  <p className="font-semibold mb-2">📚 Explicación:</p>
                  <p>{solution.question.explanation}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Botones de Acción */}
        <div className="flex flex-col md:flex-row gap-4 mt-8 justify-center">
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/docente/aprendizaje/simulacros")}
            className="gap-2"
          >
            <Home className="h-4 w-4" />
            Volver a Simulacros
          </Button>
          <Button
            size="lg"
            className="bg-brand-action hover:bg-brand-action/90 gap-2"
            onClick={() => window.location.reload()}
          >
            <Trophy className="h-4 w-4" />
            Intentar Nuevo Simulacro
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExamResults;