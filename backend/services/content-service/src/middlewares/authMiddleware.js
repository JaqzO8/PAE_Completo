const jwt = require('jsonwebtoken');
const config = require('../config/env');

/**
 * Middleware para verificar JWT token
 */
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Token no proporcionado',
            });
        }

        const token = authHeader.substring(7);

        // Verificar el token
        const decoded = jwt.verify(token, config.JWT_SECRET);

        // Adjuntar datos del usuario a la request
        req.user = {
            id: decoded.id,
            identificador_unico: decoded.identificador_unico,
            email: decoded.email,
            rol: decoded.rol,
        };
        req.token = token;
        
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expirado',
            });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token inválido',
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Error al verificar token',
        });
    }
};

/**
 * Middleware para verificar roles
 */
const verifyRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.rol) {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado',
            });
        }

        if (!allowedRoles.includes(req.user.rol)) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para acceder a este recurso',
                requiredRole: allowedRoles,
                yourRole: req.user.rol,
            });
        }

        next();
    };
};

/**
 * Middleware para verificar que sea docente
 */
const isTeacher = verifyRole('docente', 'admin');

/**
 * Middleware para verificar que sea estudiante o docente
 */
const isAuthenticated = verifyRole('estudiante', 'docente', 'admin');

module.exports = {
    verifyToken,
    verifyRole,
    isTeacher,
    isAuthenticated,
};