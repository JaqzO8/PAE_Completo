const express = require('express');
const router = express.Router();
const ResourceController = require('../controllers/resourceController');
const { verifyToken, isTeacher, isAuthenticated } = require('../middlewares/authMiddleware');
const { uploadSingle } = require('../middlewares/uploadMiddleware');

/**
 * GET /api/content/resources
 * Listar recursos de un repositorio
 */
router.get('/', ResourceController.list);

/**
 * GET /api/content/resources/:id
 * Obtener un recurso por ID
 */
router.get('/:id', ResourceController.getById);

/**
 * POST /api/content/resources
 * Crear un nuevo recurso (solo docentes)
 */
router.post(
    '/',
    verifyToken,
    isTeacher,
    uploadSingle('file'),
    ResourceController.create
);

/**
 * PUT /api/content/resources/:id
 * Actualizar recurso (solo docente dueño)
 */
router.put(
    '/:id',
    verifyToken,
    isTeacher,
    uploadSingle('file'),
    ResourceController.update
);

/**
 * DELETE /api/content/resources/:id
 * Eliminar recurso (solo docente dueño)
 */
router.delete(
    '/:id',
    verifyToken,
    isTeacher,
    ResourceController.delete
);

/**
 * POST /api/content/resources/:id/download
 * Descargar recurso
 */
router.post(
    '/:id/download',
    verifyToken,
    isAuthenticated,
    ResourceController.download
);

module.exports = router;