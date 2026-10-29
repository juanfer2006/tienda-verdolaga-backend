import { Request, Response, NextFunction } from 'express';
import { PedidoService } from '../../application/services/PedidoService.js';
import { AppError } from '../middlewares/errorHandler.js';

export class PedidoController {
  constructor(private pedidoService: PedidoService) {}

  crear = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // El userId se toma siempre del token del usuario autenticado
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(401, 'Usuario no autenticado.');
      }

      const { productoId, cantidad, notas } = req.body;
      const pedido = await this.pedidoService.crear({
        userId,
        productoId,
        cantidad: cantidad ? Number(cantidad) : 1,
        notas,
      });

      res.status(201).json(pedido);
    } catch (error) {
      next(error);
    }
  };

  obtenerMisPedidos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(401, 'Usuario no autenticado.');
      }

      const pedidos = await this.pedidoService.obtenerMisPedidos(userId);
      res.status(200).json(pedidos);
    } catch (error) {
      next(error);
    }
  };

  obtenerTodos = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pedidos = await this.pedidoService.obtenerTodos();
      res.status(200).json(pedidos);
    } catch (error) {
      next(error);
    }
  };
}
