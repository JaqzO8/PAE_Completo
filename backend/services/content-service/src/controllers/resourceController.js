const { Resource, Repository } = require('../models');
const path = require('path');
const fs = require('fs').promises;
const config = require('../config/env');

class ResourceController {
    /**
     * GET /api/content/resources
     * Listar recursos de un repositorio
     */
    static async list(req, res, next) {
        try {
            const { repositorio_id, tipo } = req.query;

            if (!repositorio_id) {
                return res.status(400).json({
                    success: false,
                    message: 'El ID del repositorio es requerido',
                });
            }

            const where = { id_repositorio: repositorio_id, activo: true };
            if (tipo) where.tipo_recurso = tipo;

            const resources = await Resource.findAll({
                where,
                order: [['orden', 'ASC'], ['fecha_subida', 'DESC']],
            });

            res.status(200).json({
                success: true,
                data: resources,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/content/resources/:id
     * Obtener recurso por ID
     */
    static async getById(req, res, next) {
        try {
            const { id } = req.params;

            const resource = await Resource.findOne({
                where: { id_recurso: id, activo: true },
                include: [{ 
                    model: Repository, 
                    as: 'repositorio',
                    attributes: ['id_repositorio', 'titulo', 'id_profesor'],
                }],
            });

            if (!resource) {
                return res.status(404).json({
                    success: false,
                    message: 'Recurso no encontrado',
                });
            }

            res.status(200).json({
                success: true,
                data: resource,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/content/resources
     * Crear recurso (RQ14, RQ38)
     */
    static async create(req, res, next) {
        try {
            const userId = req.user.id;
            const { 
                id_repositorio, 
                titulo, 
                descripcion, 
                tipo_recurso,
                url_externa,
                orden,
            } = req.body;

            // Validaciones
            if (!id_repositorio || !titulo || !tipo_recurso) {
                return res.status(400).json({
                    success: false,
                    message: 'Campos requeridos: id_repositorio, titulo, tipo_recurso',
                });
            }

            // Verificar permisos
            const repository = await Repository.findOne({
                where: { id_repositorio, id_profesor: userId, activo: true },
            });

            if (!repository) {
                return res.status(404).json({
                    success: false,
                    message: 'Repositorio no encontrado o no tienes permisos',
                });
            }

            const resourceData = {
                id_repositorio,
                titulo: titulo.trim(),
                descripcion: descripcion?.trim() || null,
                tipo_recurso,
                orden: orden || 0,
            };

            // URL externa (RQ38: videos, audios, recursos externos)
            if (url_externa) {
                resourceData.url_externa = url_externa;
            }
            
            // Archivo subido (RQ14: PDFs y otros)
            if (req.file) {
                resourceData.url_archivo = `/uploads/resources/${ResourceController._getSubfolder(req.file.mimetype)}/${req.file.filename}`;
                resourceData.tamaño_archivo = req.file.size;
                resourceData.extension = path.extname(req.file.originalname);
            } else if (!url_externa) {
                return res.status(400).json({
                    success: false,
                    message: 'Debes subir un archivo o proporcionar una URL externa',
                });
            }

            const resource = await Resource.create(resourceData);

            res.status(201).json({
                success: true,
                message: 'Recurso creado exitosamente',
                data: resource,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * PUT /api/content/resources/:id
     * Actualizar recurso
     */
    static async update(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const { titulo, descripcion, url_externa, orden } = req.body;

            const resource = await Resource.findOne({
                where: { id_recurso: id, activo: true },
                include: [{ model: Repository, as: 'repositorio' }],
            });

            if (!resource) {
                return res.status(404).json({
                    success: false,
                    message: 'Recurso no encontrado',
                });
            }

            // Verificar permisos
            if (resource.repositorio.id_profesor !== userId) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permisos para editar este recurso',
                });
            }

            const updateData = {};
            if (titulo) updateData.titulo = titulo.trim();
            if (descripcion !== undefined) updateData.descripcion = descripcion?.trim() || null;
            if (url_externa) updateData.url_externa = url_externa;
            if (orden !== undefined) updateData.orden = parseInt(orden);

            // Archivo nuevo
            if (req.file) {
                // Eliminar archivo anterior
                if (resource.url_archivo) {
                    const oldPath = path.join(config.UPLOAD_PATH, resource.url_archivo.replace('/uploads/', ''));
                    try {
                        await fs.unlink(oldPath);
                    } catch (err) {
                        console.error('Error eliminando archivo anterior:', err);
                    }
                }

                updateData.url_archivo = `/uploads/resources/${ResourceController._getSubfolder(req.file.mimetype)}/${req.file.filename}`;
                updateData.tamaño_archivo = req.file.size;
                updateData.extension = path.extname(req.file.originalname);
            }

            await resource.update(updateData);

            res.status(200).json({
                success: true,
                message: 'Recurso actualizado exitosamente',
                data: resource,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * DELETE /api/content/resources/:id
     * Eliminar recurso (soft delete)
     */
    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const resource = await Resource.findOne({
                where: { id_recurso: id, activo: true },
                include: [{ model: Repository, as: 'repositorio' }],
            });

            if (!resource) {
                return res.status(404).json({
                    success: false,
                    message: 'Recurso no encontrado',
                });
            }

            if (resource.repositorio.id_profesor !== userId) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permisos para eliminar este recurso',
                });
            }

            await resource.update({ activo: false });

            res.status(200).json({
                success: true,
                message: 'Recurso eliminado exitosamente',
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/content/resources/:id/download
     * Descargar recurso (RQ43)
     */
    static async download(req, res, next) {
        try {
            const { id } = req.params;

            const resource = await Resource.findOne({
                where: { id_recurso: id, activo: true },
                include: [{ 
                    model: Repository, 
                    as: 'repositorio',
                    where: { activo: true, publico: true },
                }],
            });

            if (!resource) {
                return res.status(404).json({
                    success: false,
                    message: 'Recurso no encontrado',
                });
            }

            // Incrementar contador de descargas
            await resource.increment('descargas');
            await resource.repositorio.increment('cantidad_descargas');

            // Si es enlace externo
            if (resource.url_externa) {
                return res.status(200).json({
                    success: true,
                    type: 'external',
                    url: resource.url_externa,
                });
            }

            // ✅ CORRECCIÓN: Verificar que url_archivo exista
            if (!resource.url_archivo) {
                return res.status(404).json({
                    success: false,
                    message: 'El recurso no tiene archivo asociado',
                });
            }

            // Si es archivo local
            const filePath = path.join(config.UPLOAD_PATH, resource.url_archivo.replace('/uploads/', ''));
            
            console.log('📥 Intentando descargar archivo desde:', filePath);

            try {
                await fs.access(filePath);
            } catch (error) {
                console.error('❌ Archivo no encontrado:', filePath);
                return res.status(404).json({
                    success: false,
                    message: 'Archivo no encontrado en el servidor',
                });
            }

            // ✅ CORRECCIÓN: Usar sendFile en lugar de download para mejor compatibilidad
            res.sendFile(filePath, (err) => {
                if (err) {
                    console.error('❌ Error enviando archivo:', err);
                    next(err);
                }
            });

        } catch (error) {
            console.error('❌ Error en download:', error);
            next(error);
        }
    }

    /**
     * Método auxiliar para determinar subcarpeta según MIME type
     */
    static _getSubfolder(mimetype) {
        if (mimetype.startsWith('application/pdf')) return 'pdfs';
        if (mimetype.startsWith('video/')) return 'videos';
        if (mimetype.startsWith('audio/')) return 'audios';
        if (mimetype.startsWith('image/')) return 'images';
        return 'others';
    }
}

module.exports = ResourceController;