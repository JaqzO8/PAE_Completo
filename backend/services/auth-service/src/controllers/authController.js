const { Usuario, Rol } = require('../models');
const TokenService = require('../services/tokenService');
const SessionService = require('../services/sessionService');
const {
    setLoginAttempts,
    getLoginAttempts,
    clearLoginAttempts,
} = require('../config/redis');
const config = require('../config/env');

class AuthController {
    /**
     * POST /api/auth/register
     * Registra un nuevo usuario
     */
    static async register(req, res, next) {
        try {
            const { nombres, apellidos, email, password, isTeacher } = req.body;

            // Validar que todos los campos requeridos estén presentes
            if (!nombres || !apellidos || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Todos los campos son requeridos',
                    missing: {
                        nombres: !nombres,
                        apellidos: !apellidos,
                        email: !email,
                        password: !password,
                    },
                });
            }

            // Verificar si el email ya existe
            const existingUser = await Usuario.findOne({ where: { email } });
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: 'Este correo ya está registrado',
                });
            }

            // Obtener el rol según isTeacher
            const roleName = isTeacher ? 'docente' : 'estudiante';
            const rol = await Rol.findOne({ where: { nombre_rol: roleName } });

            if (!rol) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al asignar rol',
                });
            }

            // Crear el usuario
            const usuario = await Usuario.create({
                nombres: String(nombres).trim(),
                apellidos: String(apellidos).trim(),
                email: String(email).toLowerCase().trim(),
                password_hash: password,
                rol_id: rol.id_rol,
                carrera_interes: null,
                primer_ingreso: true,
                activo: true,
            });

            // Cargar la relación del rol
            await usuario.reload({ include: [{ model: Rol, as: 'rol' }] });

            // Generar token
            const token = TokenService.generateToken({
                id: usuario.id_usuario,
                identificador_unico: usuario.identificador_unico,
                email: usuario.email,
                rol: usuario.rol.nombre_rol,
            });

            // Crear sesión
            const deviceInfo = {
                device: req.headers['user-agent']?.match(/\(([^)]+)\)/)?.[1] || 'Desconocido',
                ip: req.ip || req.connection.remoteAddress,
                userAgent: req.headers['user-agent'],
            };

            await SessionService.createSession(usuario.id_usuario, deviceInfo, token);

            // Respuesta
            res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente',
                user: {
                    id: usuario.id_usuario.toString(),
                    identificador_unico: usuario.identificador_unico,
                    email: usuario.email,
                    nombres: usuario.nombres,
                    apellidos: usuario.apellidos,
                    rol: usuario.rol.nombre_rol,
                    carrera_interes: usuario.carrera_interes,
                    institucion: usuario.institucion,
                    bio: usuario.bio,
                    avatar: usuario.avatar,
                    fecha_registro: usuario.fecha_registro,
                    primer_ingreso: usuario.primer_ingreso,
                    activo: usuario.activo,
                },
                token,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/auth/login
     * Inicia sesión de un usuario
     */
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const normalizedEmail = email.toLowerCase().trim();

            // Verificar intentos de login
            const attempts = await getLoginAttempts(normalizedEmail);
            if (attempts >= config.MAX_LOGIN_ATTEMPTS) {
                return res.status(429).json({
                    success: false,
                    message: 'Demasiados intentos fallidos. Intenta más tarde.',
                });
            }

            // Buscar usuario con rol
            const usuario = await Usuario.findOne({
                where: { email: normalizedEmail },
                include: [{ model: Rol, as: 'rol' }],
            });

            if (!usuario) {
                await setLoginAttempts(normalizedEmail, attempts + 1);
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado',
                });
            }

            // Verificar si está activo
            if (!usuario.activo) {
                return res.status(403).json({
                    success: false,
                    message: 'Cuenta desactivada. Contacta al administrador.',
                });
            }

            // Validar contraseña
            const isValidPassword = await usuario.validarPassword(password);
            if (!isValidPassword) {
                await setLoginAttempts(normalizedEmail, attempts + 1);

                // Registrar intento fallido
                await SessionService.logSessionHistory(
                    usuario.id_usuario,
                    {
                        device: req.headers['user-agent']?.match(/\(([^)]+)\)/)?.[1],
                        ip: req.ip || req.connection.remoteAddress,
                    },
                    'login',
                    false
                );

                return res.status(401).json({
                    success: false,
                    message: 'Credenciales incorrectas',
                });
            }

            // Limpiar intentos fallidos
            await clearLoginAttempts(normalizedEmail);

            // Generar token
            const token = TokenService.generateToken({
                id: usuario.id_usuario,
                identificador_unico: usuario.identificador_unico,
                email: usuario.email,
                rol: usuario.rol.nombre_rol,
            });

            // Crear sesión
            const deviceInfo = {
                device: req.headers['user-agent']?.match(/\(([^)]+)\)/)?.[1] || 'Desconocido',
                ip: req.ip || req.connection.remoteAddress,
                userAgent: req.headers['user-agent'],
            };

            await SessionService.createSession(usuario.id_usuario, deviceInfo, token);

            // Respuesta
            res.status(200).json({
                success: true,
                message: 'Login exitoso',
                user: {
                    id: usuario.id_usuario.toString(),
                    identificador_unico: usuario.identificador_unico,
                    email: usuario.email,
                    nombres: usuario.nombres,
                    apellidos: usuario.apellidos,
                    rol: usuario.rol.nombre_rol,
                    carrera_interes: usuario.carrera_interes,
                    institucion: usuario.institucion,
                    bio: usuario.bio,
                    avatar: usuario.avatar,
                    fecha_registro: usuario.fecha_registro,
                    primer_ingreso: usuario.primer_ingreso,
                    activo: usuario.activo,
                },
                token,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/auth/logout
     * Cierra la sesión actual
     */
    static async logout(req, res, next) {
        try {
            const token = req.token;

            // Revocar token
            await TokenService.revokeToken(token);

            // Desactivar sesión
            const deviceInfo = {
                device: req.headers['user-agent']?.match(/\(([^)]+)\)/)?.[1],
                ip: req.ip || req.connection.remoteAddress,
            };
            await SessionService.deactivateSession(token, deviceInfo);

            res.status(200).json({
                success: true,
                message: 'Sesión cerrada exitosamente',
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/auth/refresh
     * Refresca el token JWT
     */
    static async refreshToken(req, res, next) {
        try {
            const { id, identificador_unico, email, rol } = req.user;

            // Generar nuevo token
            const newToken = TokenService.generateToken({
                id,
                identificador_unico,
                email,
                rol,
            });

            // Revocar el token antiguo
            await TokenService.revokeToken(req.token);

            res.status(200).json({
                success: true,
                token: newToken,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/auth/verify
     * Verifica si el token es válido
     */
    static async verify(req, res, next) {
        try {
            const usuario = await Usuario.findOne({
                where: { id_usuario: req.user.id },
                include: [{ model: Rol, as: 'rol' }],
            });

            if (!usuario) {
                return res.status(404).json({
                    success: false,
                    valid: false,
                    message: 'Usuario no encontrado',
                });
            }

            res.status(200).json({
                success: true,
                valid: true,
                user: {
                    id: usuario.id_usuario.toString(),
                    identificador_unico: usuario.identificador_unico,
                    email: usuario.email,
                    nombres: usuario.nombres,
                    apellidos: usuario.apellidos,
                    rol: usuario.rol.nombre_rol,
                    carrera_interes: usuario.carrera_interes,
                    institucion: usuario.institucion,
                    bio: usuario.bio,
                    avatar: usuario.avatar,
                    fecha_registro: usuario.fecha_registro,
                    primer_ingreso: usuario.primer_ingreso,
                    activo: usuario.activo,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * PUT /api/auth/profile
     * Actualiza el perfil del usuario
     */
    static async updateProfile(req, res, next) {
        try {
            const { nombres, apellidos, institucion, bio } = req.body;
            const userId = req.user.id;

            const usuario = await Usuario.findByPk(userId, {
                include: [{ model: Rol, as: 'rol' }],
            });

            if (!usuario) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado',
                });
            }

            // Actualizar campos
            await usuario.update({
                nombres: nombres?.trim() || usuario.nombres,
                apellidos: apellidos?.trim() || usuario.apellidos,
                institucion: institucion?.trim() || usuario.institucion,
                bio: bio?.trim() || usuario.bio,
            });

            res.status(200).json({
                success: true,
                message: 'Perfil actualizado exitosamente',
                user: {
                    id: usuario.id_usuario.toString(),
                    identificador_unico: usuario.identificador_unico,
                    email: usuario.email,
                    nombres: usuario.nombres,
                    apellidos: usuario.apellidos,
                    rol: usuario.rol.nombre_rol,
                    carrera_interes: usuario.carrera_interes,
                    institucion: usuario.institucion,
                    bio: usuario.bio,
                    avatar: usuario.avatar,
                    fecha_registro: usuario.fecha_registro,
                    primer_ingreso: usuario.primer_ingreso,
                    activo: usuario.activo,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * PUT /api/auth/password
     * Cambia la contraseña del usuario (sin autenticación de contraseña actual)
     */
    static async updatePassword(req, res, next) {
        try {
            const { newPassword } = req.body;
            const userId = req.user.id;
            const token = req.token;

            if (!newPassword || newPassword.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'La nueva contraseña debe tener al menos 6 caracteres',
                });
            }

            const usuario = await Usuario.findByPk(userId);

            if (!usuario) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado',
                });
            }

            // Actualizar contraseña
            await usuario.update({
                password_hash: newPassword,
            });

            // Registrar en historial
            await SessionService.logSessionHistory(
                userId,
                {
                    device: req.headers['user-agent']?.match(/\(([^)]+)\)/)?.[1],
                    ip: req.ip || req.connection.remoteAddress,
                },
                'cambio_password',
                true
            );

            // Revocar token actual y cerrar todas las sesiones
            await TokenService.revokeToken(token);
            await SessionService.deactivateAllUserSessions(
                userId,
                {
                    device: req.headers['user-agent']?.match(/\(([^)]+)\)/)?.[1],
                    ip: req.ip || req.connection.remoteAddress,
                }
            );

            res.status(200).json({
                success: true,
                message: 'Contraseña actualizada. Todas las sesiones han sido cerradas.',
                shouldLogout: true,
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AuthController;