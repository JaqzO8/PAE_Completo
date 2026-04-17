import api from '../../../../../../Nueva carpeta/Pae/frontend/src/services/api';

export interface Community {
    id: number;
    nombre: string;
    descripcion: string;
    icono_url?: string;
    materia?: string;
    profesor?: {
        id: number;
        nombres: string;
        apellidos: string;
        avatar?: string;
    };
    puntos_prestigio: number;
    proximo_hito: number;
    miembros_count: number;
    desafio_activo?: any;
    fecha_creacion: string;
}

export const communityService = {
    // Crear comunidad
    async create(data: { nombre: string; descripcion?: string; materia?: string; icono_url?: string; es_publica?: boolean }) {
        const response = await api.post('/community/create', data);
        return response.data;
    },

    // Mis comunidades
    async getMyCommunities() {
        const response = await api.get('/community/my-communities');
        return response.data.communities as Community[];
    },

    // Explorar comunidades
    async explore(search?: string, materia?: string) {
        const response = await api.get('/community/explore', { params: { search, materia } });
        return response.data.communities as Community[];
    },

    // Detalle de comunidad
    async getDetail(id: string) {
        const response = await api.get(`/community/${id}`);
        return response.data.community;
    },

    // Unirse
    async join(id: string) {
        const response = await api.post(`/community/${id}/join`);
        return response.data;
    },

    // Salir
    async leave(id: string) {
        const response = await api.post(`/community/${id}/leave`);
        return response.data;
    },

    // Eliminar
    async delete(id: string) {
        const response = await api.delete(`/community/${id}`);
        return response.data;
    },

    // Mensajes
    async getMessages(id: string) {
        const response = await api.get(`/community/${id}/messages`);
        return response.data.messages;
    },

    async sendMessage(id: string, contenido: string) {
        const response = await api.post(`/community/${id}/messages`, { contenido });
        return response.data.message;
    },

    // Recursos
    async uploadResource(id: string, file: File, descripcion?: string) {
        const formData = new FormData();
        formData.append('file', file);
        if (descripcion) formData.append('descripcion', descripcion);

        const response = await api.post(`/community/${id}/resources`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    async getResources(id: string) {
        const response = await api.get(`/community/${id}/resources`);
        return response.data.resources;
    },

    // Invitaciones
    async invite(id: string, estudiante_id: number) {
        const response = await api.post(`/community/${id}/invite`, { estudiante_id });
        return response.data;
    },

    async getMyInvitations() {
        const response = await api.get('/community/invitations');
        return response.data.invitations;
    },

    async acceptInvitation(id: number) {
        const response = await api.post(`/community/invitations/${id}/accept`);
        return response.data;
    },
};