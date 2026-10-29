import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../../infrastructure/security/tokenService.js';
import { UserRole } from '../../domain/entities/User.js';

export const autenticarToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'No autorizado',
      message: 'Token de autenticación no proporcionado o formato inválido.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = TokenService.verificarToken(token);
    req.user = {
      id: payload.id,
      role: payload.role,
    };
    next();
  } catch (error) {
    res.status(401).json({
      error: 'No autorizado',
      message: 'Token inválido o expirado.',
    });
  }
};

export const requiereRol = (...rolesPermitidos: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'No autorizado',
        message: 'Sesión no identificada.',
      });
      return;
    }

    if (!rolesPermitidos.includes(req.user.role)) {
      res.status(403).json({
        error: 'Prohibido',
        message: 'No tienes los permisos necesarios para realizar esta acción.',
      });
      return;
    }

    next();
  };
};

export const soloAdmin = requiereRol(UserRole.ADMIN);
