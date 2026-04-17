const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');
const {
    validateRegister,
    validateLogin,
    handleValidationErrors,
} = require('../utils/validators');

/**
 * POST /api/auth/register
 * Registro de nuevos usuarios
 */
router.post(
    '/register',
    validateRegister,
    handleValidationErrors,
    AuthController.register
);

/**
 * POST /api/auth/login
 * Inicio de sesión
 */
router.post(
    '/login',
    validateLogin,
    handleValidationErrors,
    AuthController.login
);

/**
 * POST /api/auth/logout
 * Cierre de sesión (requiere autenticación)
 */
router.post(
    '/logout',
    verifyToken,
    AuthController.logout
);

/**
 * POST /api/auth/refresh
 * Refrescar token (requiere autenticación)
 */
router.post(
    '/refresh',
    verifyToken,
    AuthController.refreshToken
);

/**
 * GET /api/auth/verify
 * Verificar validez del token (requiere autenticación)
 */
router.get(
    '/verify',
    verifyToken,
    AuthController.verify
);

/**
 * GET /api/auth/health
 * Health check del servicio
 */
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        service: 'auth-service',
        status: 'healthy',
        timestamp: new Date().toISOString(),
    });
});

module.exports = router;