const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('./config/env');
const { testConnection, syncDatabase } = require('./config/database');
const { initializeRoles } = require('./models');
const authRoutes = require('./routes/authRoutes');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');

// Inicializar Express
const app = express();

app.set('trust proxy', 1);

// ========================================
// MIDDLEWARES GLOBALES
// ========================================

// Seguridad con Helmet
app.use(helmet());

// CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Máximo 100 requests por ventana
    message: 'Demasiadas peticiones desde esta IP, intenta más tarde',
});
app.use('/api/auth', limiter);

// Rate limiting específico para login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, // Máximo 5 intentos de login por ventana
    skipSuccessfulRequests: true,
});
app.use('/api/auth/login', loginLimiter);

// Request logging (solo en desarrollo)
if (config.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
}

// ========================================
// RUTAS
// ========================================

// Ruta raíz
app.get('/', (req, res) => {
    res.json({
        service: 'PAE Auth Service',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            register: 'POST /api/auth/register',
            login: 'POST /api/auth/login',
            logout: 'POST /api/auth/logout',
            refresh: 'POST /api/auth/refresh',
            verify: 'GET /api/auth/verify',
            health: 'GET /api/auth/health',
        },
    });
});

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Manejo de rutas no encontradas
app.use(notFound);

// Manejo global de errores
app.use(errorHandler);

// ========================================
// INICIALIZACIÓN DEL SERVIDOR
// ========================================

const startServer = async () => {
    try {
        console.log('🚀 Iniciando Auth Service...');

        // 1. Probar conexión a la base de datos
        console.log('📦 Conectando a PostgreSQL...');
        const dbConnected = await testConnection();
        if (!dbConnected) {
            throw new Error('No se pudo conectar a la base de datos');
        }

        // 3. Inicializar roles por defecto
        console.log('👥 Inicializando roles...');
        await initializeRoles();

        // 4. Iniciar servidor
        app.listen(config.PORT, () => {
            console.log('');
            console.log('✅ ========================================');
            console.log(`✅ Auth Service corriendo en puerto ${config.PORT}`);
            console.log(`✅ Ambiente: ${config.NODE_ENV}`);
            console.log(`✅ Database: ${config.DB_NAME}`);
            console.log('✅ ========================================');
            console.log('');
        });

    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err);
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
});

// Iniciar servidor
startServer();