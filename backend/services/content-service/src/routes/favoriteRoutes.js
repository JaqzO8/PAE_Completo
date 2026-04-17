const express = require('express');
const router = express.Router();
const FavoriteController = require('../controllers/favoriteController');
const { verifyToken, isAuthenticated } = require('../middlewares/authMiddleware');

/**
 * GET /api/content/favorites
 * Listar favoritos del usuario
 */
router.get('/', verifyToken, isAuthenticated, FavoriteController.list);

/**
 * GET /api/content/favorites/check/:id
 * Verificar si un repositorio está en favoritos
 */
router.get('/check/:id', verifyToken, isAuthenticated, FavoriteController.check);

/**
 * POST /api/content/favorites/:id
 * Agregar repositorio a favoritos
 */
router.post('/:id', verifyToken, isAuthenticated, FavoriteController.add);

/**
 * DELETE /api/content/favorites/:id
 * Quitar repositorio de favoritos
 */
router.delete('/:id', verifyToken, isAuthenticated, FavoriteController.remove);

module.exports = router;