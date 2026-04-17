// backend/services/content-service/src/controllers/statsController.js
const { Repository, Favorite, Resource } = require('../models');

class StatsController {
    /**
     * GET /api/content/stats/student
     * Estadísticas del estudiante
     */
    static async getStudentStats(req, res, next) {
        try {
            const userId = req.user.id;

            // Contar favoritos
            const savedResources = await Favorite.count({
                where: { id_usuario: userId },
                include: [{
                    model: Repository,
                    as: 'repositorio',
                    where: { activo: true },
                }],
            });

            // Contar comunidades activas (pendiente de implementar grupos)
            const activeCommunities = 0; // TODO: Implementar cuando tengas el servicio de grupos

            // Horas de estudio (mockear por ahora, implementar con tracking real después)
            const studyHours = 12;

            // Crecimiento semanal
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

            const weeklyGrowth = await Favorite.count({
                where: {
                    id_usuario: userId,
                    fecha_creacion: {
                        [require('sequelize').Op.gte]: oneWeekAgo,
                    },
                },
            });

            res.status(200).json({
                success: true,
                data: {
                    savedResources,
                    activeCommunities,
                    studyHours,
                    weeklyGrowth,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/content/stats/teacher
     * Estadísticas del docente
     */
    static async getTeacherStats(req, res, next) {
        try {
            const userId = req.user.id;

            // Total de repositorios del docente
            const totalRepositories = await Repository.count({
                where: { id_profesor: userId, activo: true },
            });

            // Estudiantes activos (contar favoritos únicos de sus repositorios)
            const activeStudents = await Favorite.count({
                distinct: true,
                col: 'id_usuario',
                include: [{
                    model: Repository,
                    as: 'repositorio',
                    where: { id_profesor: userId, activo: true },
                    attributes: [],
                }],
            });

            // Evaluaciones pendientes (mockear por ahora)
            const pendingEvaluations = 5;

            // Crecimiento de estudiantes (calcular vs mes anterior)
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

            const studentsLastMonth = await Favorite.count({
                distinct: true,
                col: 'id_usuario',
                include: [{
                    model: Repository,
                    as: 'repositorio',
                    where: { id_profesor: userId, activo: true },
                    attributes: [],
                }],
                where: {
                    fecha_creacion: {
                        [require('sequelize').Op.lt]: oneMonthAgo,
                    },
                },
            });

            const studentGrowth = studentsLastMonth > 0
                ? Math.round(((activeStudents - studentsLastMonth) / studentsLastMonth) * 100)
                : 0;

            res.status(200).json({
                success: true,
                data: {
                    activeStudents,
                    totalRepositories,
                    pendingEvaluations,
                    studentGrowth: Math.max(0, studentGrowth),
                },
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = StatsController;