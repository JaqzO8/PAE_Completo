require('dotenv').config();

module.exports = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3001,
    
    // Database
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: process.env.DB_PORT || 5432,
    DB_NAME: process.env.DB_NAME || 'auth_db',
    DB_USER: process.env.DB_USER || 'auth_user',
    DB_PASSWORD: process.env.AUTH_DB_PASSWORD || 'auth_secure_pass_2024',
    
    // JWT
    JWT_SECRET: process.env.JWT_SECRET || 'default_jwt_secret',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    
    // Redis
    REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
    
    // Security
    BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '10'),
    MAX_LOGIN_ATTEMPTS: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5'),
    LOCKOUT_TIME: parseInt(process.env.LOCKOUT_TIME || '900000'),
};