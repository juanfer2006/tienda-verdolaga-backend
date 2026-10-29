import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../application/services/AuthService.js';

export class AuthController {
  constructor(private authService: AuthService) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { nombre, email, password, telefono } = req.body;
      const result = await this.authService.register({ nombre, email, password, telefono });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login({ email, password });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
