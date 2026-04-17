const { body, validationResult } = require('express-validator');

// Validaciones para registro
const validateRegister = [
    body('nombres')
        .trim()
        .notEmpty().withMessage('Los nombres son requeridos')
        .isLength({ min: 2, max: 100 }).withMessage('Los nombres deben tener entre 2 y 100 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ'\s]+$/).withMessage('Los nombres solo pueden contener letras'),

    body('apellidos')
        .trim()
        .notEmpty().withMessage('Los apellidos son requeridos')
        .isLength({ min: 2, max: 100 }).withMessage('Los apellidos deben tener entre 2 y 100 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ'\s]+$/).withMessage('Los apellidos solo pueden contener letras'),

    body('email')
        .trim()
        .notEmpty().withMessage('El email es requerido')
        .isEmail().withMessage('Debe ser un email válido')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('La contraseña es requerida')
        .isLength({ min: 6, max: 100 }).withMessage('La contraseña debe tener entre 6 y 100 caracteres')
        .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])/).withMessage('Debe contener al menos una letra y un número'),

    body('isTeacher')
        .isBoolean().withMessage('isTeacher debe ser un valor booleano'),
];

// Validaciones para login
const validateLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('El email es requerido')
        .isEmail().withMessage('Debe ser un email válido')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('La contraseña es requerida'),
];

// Validaciones para actualización de perfil
const validateUpdateProfile = [
    body('nombres')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage('Los nombres deben tener entre 2 y 100 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ'\s]+$/).withMessage('Los nombres solo pueden contener letras'),

    body('apellidos')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage('Los apellidos deben tener entre 2 y 100 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ'\s]+$/).withMessage('Los apellidos solo pueden contener letras'),

    body('institucion')
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage('La institución no puede exceder 200 caracteres'),

    body('bio')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('La biografía no puede exceder 500 caracteres'),
];

// Validaciones para cambio de contraseña
const validateUpdatePassword = [
    body('newPassword')
        .notEmpty().withMessage('La nueva contraseña es requerida')
        .isLength({ min: 6, max: 100 }).withMessage('La contraseña debe tener entre 6 y 100 caracteres')
        .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])/).withMessage('Debe contener al menos una letra y un número'),
];

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg,
            })),
        });
    }
    next();
};

module.exports = {
    validateRegister,
    validateLogin,
    validateUpdateProfile,
    validateUpdatePassword,
    handleValidationErrors,
};