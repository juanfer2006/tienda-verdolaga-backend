import { Router } from 'express';
import { AuthController } from '../controllers/AuthController.js';
import { AuthService } from '../../application/services/AuthService.js';
import { PrismaUserRepository } from '../../infrastructure/repositories/PrismaUserRepository.js';

export const createAuthRouter = (): Router => {
  const router = Router();
  const userRepository = new PrismaUserRepository();
  const authService = new AuthService(userRepository);
  const authController = new AuthController(authService);

  // Rutas públicas
  router.post('/register', authController.register);
  router.post('/login', authController.login);

  return router;
};
