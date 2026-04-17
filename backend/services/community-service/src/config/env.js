require('dotenv').config();

module.exports = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.COMMUNITY_PORT || 3002,
    
    // Database
    DB_HOST: process.env.COMMUNITY_DB_HOST || 'localhost',
    DB_PORT: process.env.COMMUNITY_DB_PORT || 5432,
    DB_NAME: process.env.COMMUNITY_DB_NAME || 'community_db',
    DB_USER: process.env.COMMUNITY_DB_USER || 'community_user',
    DB_PASSWORD: process.env.COMMUNITY_DB_PASSWORD || 'community_secure_pass_2024',
    
    // Redis
    REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
    
    // JWT (mismo secret que auth-service para validar tokens)
    JWT_SECRET: process.env.JWT_SECRET || 'default_jwt_secret',
    
    // Auth Service URL (para validar usuarios)
    AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || 'http://auth-service:3001',
    
    // Uploads
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_FILE_TYPES: ['application/pdf'],
    UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',
};