import { createApp } from './app.js';
import { env } from './infrastructure/config/env.js';
import { prisma } from './infrastructure/database/prismaClient.js';

const app = createApp();
const PORT = Number(env.PORT) || 4000;

const startServer = async () => {
  try {
    // Verificar conexión a la base de datos si DATABASE_URL está configurada
    if (env.DATABASE_URL) {
      await prisma.$connect();
      console.log('📦 Conexión a PostgreSQL con Prisma establecida exitosamente.');
    } else {
      console.warn('⚠️ DATABASE_URL no definida en .env. Se inicia servidor sin validar conexión a BD.');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`);
      console.log(`📡 Healthcheck disponible en http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
