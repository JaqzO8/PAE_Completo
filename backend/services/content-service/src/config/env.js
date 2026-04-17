require('dotenv').config();

module.exports = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3003,
    
    // Database
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: process.env.DB_PORT || 5434,
    DB_NAME: process.env.DB_NAME || 'content_db',
    DB_USER: process.env.DB_USER || 'content_user',
    DB_PASSWORD: process.env.CONTENT_DB_PASSWORD || 'content_secure_pass_2024',
    
    // Auth Service (para validar tokens)
    AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || 'http://auth-service:3001',
    JWT_SECRET: process.env.JWT_SECRET || 'default_jwt_secret',
    
    // File Upload
    UPLOAD_PATH: process.env.UPLOAD_PATH || '/app/uploads',
    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '52428800'), // 50MB por defecto
    ALLOWED_FILE_TYPES: {
        pdf: ['application/pdf'],
        video: ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'],
        audio: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
        image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    },
    
    // Frontend
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
};