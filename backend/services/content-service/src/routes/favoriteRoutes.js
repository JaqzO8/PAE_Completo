const express = require('express');
const router = express.Router();
const FavoriteController = require('../controllers/favoriteController');

// MOCK USER
const mockUser = (req, res, next) => {
  req.user = { id: 22 };
  next();
};

/**
 * GET /api/content/favorites
 */
router.get('/', mockUser, FavoriteController.list);

/**
 * GET /api/content/favorites/check/:id
 */
router.get('/check/:id', mockUser, FavoriteController.check);

/**
 * POST /api/content/favorites/:id
 */
router.post('/:id', mockUser, FavoriteController.add);

/**
 * DELETE /api/content/favorites/:id
 */
router.delete('/:id', mockUser, FavoriteController.remove);

module.exports = router;