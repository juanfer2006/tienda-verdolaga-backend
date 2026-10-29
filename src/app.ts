import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { env } from './infrastructure/config/env.js';
import { createAuthRouter } from './interface/routes/authRoutes.js';
import { createProductoRouter } from './interface/routes/productoRoutes.js';
import { createPedidoRouter } from './interface/routes/pedidoRoutes.js';
import { errorHandler } from './interface/middlewares/errorHandler.js';

export const createApp = (): Application => {
  const app = express();

  // Configuración de CORS segura
  const allowedOrigins = [env.FRONTEND_URL, 'http://localhost:3000'].filter(Boolean);
  app.use(
    cors({
      origin: (origin, callback) => {
        // Permitir solicitudes sin origin (como mobile apps, Postman o curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
          return callback(null, true);
        }
        return callback(new Error('No permitido por CORS.'));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  app.use(express.json());

  // Healthcheck de la API
  app.get('/api/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      service: 'Tienda Verdolaga API',
      timestamp: new Date().toISOString(),
    });
  });

  // Rutas de la API REST
  app.use('/api/auth', createAuthRouter());
  app.use('/api/productos', createProductoRouter());
  app.use('/api/pedidos', createPedidoRouter());

  // Manejador de rutas no encontradas (404)
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      error: 'Ruta no encontrada.',
    });
  });

  // Manejador centralizado de errores (sin stack trace)
  app.use(errorHandler);

  return app;
};
