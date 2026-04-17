const { MensajeCanal, MiembroComunidad, Comunidad } = require('../models');
const axios = require('axios');
const config = require('../config/env');

class MessageController {
    /**
     * GET /api/community/:id/messages
     * Obtener mensajes de una comunidad
     */
    static async getMessages(req, res, next) {
        try {
            const { id } = req.params;
            const { limit = 50, offset = 0 } = req.query;
            const userId = req.user.id;

            // Verificar que el usuario es miembro
            const member = await MiembroComunidad.findOne({
                where: {
                    comunidad_id: id,
                    usuario_id: userId,
                    activo: true,
                },
            });

            if (!member) {
                return res.status(403).json({
                    success: false,
                    message: 'No eres miembro de esta comunidad',
                });
            }

            const messages = await MensajeCanal.findAll({
                where: { comunidad_id: id },
                order: [['fecha_envio', 'ASC']],
                limit: parseInt(limit),
                offset: parseInt(offset),
            });

            // Obtener info de usuarios
            const userIds = [...new Set(messages.map(m => m.usuario_id))];
            const usersInfo = {};

            for (const uid of userIds) {
                try {
                    const response = await axios.get(
                        `${config.AUTH_SERVICE_URL}/api/auth/user/${uid}`,
                        { headers: { Authorization: `Bearer ${req.token}` } }
                    );
                    usersInfo[uid] = response.data.user;
                } catch (error) {
                    console.error(`Error obteniendo info del usuario ${uid}:`, error.message);
                }
            }

            const messagesData = messages.map(msg => ({
                id: msg.id_mensaje,
                content: msg.contenido,
                author: usersInfo[msg.usuario_id] ? 
                    `${usersInfo[msg.usuario_id].nombres} ${usersInfo[msg.usuario_id].apellidos}` : 
                    'Usuario desconocido',
                avatar: usersInfo[msg.usuario_id]?.avatar || null,
                authorRole: usersInfo[msg.usuario_id]?.rol || 'estudiante',
                userId: msg.usuario_id,
                timestamp: msg.fecha_envio,
                editado: msg.editado,
            }));

            res.status(200).json({
                success: true,
                messages: messagesData,
                total: messages.length,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/community/:id/messages
     * Enviar mensaje en una comunidad
     */
    static async sendMessage(req, res, next) {
        try {
            const { id } = req.params;
            const { contenido } = req.body;
            const userId = req.user.id;

            if (!contenido || contenido.trim().length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'El mensaje no puede estar vacío',
                });
            }
            // Verificar que la comunidad existe y está activa
        const community = await Comunidad.findOne({
            where: { id_comunidad: id, activa: true },
        });

        if (!community) {
            return res.status(404).json({
                success: false,
                message: 'Comunidad no encontrada o eliminada',
            });
        }

        // Verificar que el usuario es miembro activo
        const member = await MiembroComunidad.findOne({
            where: {
                comunidad_id: id,
                usuario_id: userId,
                activo: true,
            },
        });

        if (!member) {
            return res.status(403).json({
                success: false,
                message: 'No puedes enviar mensajes en esta comunidad',
            });
        }

        const message = await MensajeCanal.create({
            comunidad_id: id,
            usuario_id: userId,
            contenido: contenido.trim(),
            fecha_envio: new Date(),
        });

        // Obtener info del usuario
        let userInfo = null;
        try {
            const response = await axios.get(
                `${config.AUTH_SERVICE_URL}/api/auth/user/${userId}`,
                { headers: { Authorization: `Bearer ${req.token}` } }
            );
            userInfo = response.data.user;
        } catch (error) {
            console.error('Error obteniendo info del usuario:', error.message);
        }

        res.status(201).json({
            success: true,
            message: {
                id: message.id_mensaje,
                content: message.contenido,
                author: userInfo ? `${userInfo.nombres} ${userInfo.apellidos}` : 'Usuario',
                avatar: userInfo?.avatar || null,
                authorRole: userInfo?.rol || 'estudiante',
                userId: userId,
                timestamp: message.fecha_envio,
                editado: false,
            },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * DELETE /api/community/:id/messages/:messageId
 * Eliminar mensaje (solo el autor o profesor)
 */
static async deleteMessage(req, res, next) {
    try {
        const { id, messageId } = req.params;
        const userId = req.user.id;

        const message = await MensajeCanal.findOne({
            where: {
                id_mensaje: messageId,
                comunidad_id: id,
            },
        });

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Mensaje no encontrado',
            });
        }

        // Verificar permisos
        const community = await Comunidad.findByPk(id);
        const isAuthor = message.usuario_id === userId;
        const isTeacher = community.profesor_id === userId;

        if (!isAuthor && !isTeacher) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para eliminar este mensaje',
            });
        }

        await message.destroy();

        res.status(200).json({
            success: true,
            message: 'Mensaje eliminado',
        });
    } catch (error) {
        next(error);
    }
}
}
module.exports = MessageController;