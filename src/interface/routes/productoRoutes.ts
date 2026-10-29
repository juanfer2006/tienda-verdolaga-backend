import { Router } from 'express';
import { ProductoController } from '../controllers/ProductoController.js';
import { ProductoService } from '../../application/services/ProductoService.js';
import { PrismaProductoRepository } from '../../infrastructure/repositories/PrismaProductoRepository.js';
import { autenticarToken, soloAdmin } from '../middlewares/authMiddleware.js';

export const createProductoRouter = (): Router => {
  const router = Router();
  const productoRepository = new PrismaProductoRepository();
  const productoService = new ProductoService(productoRepository);
  const productoController = new ProductoController(productoService);

  // Rutas públicas (catálogo y detalle)
  router.get('/', productoController.obtenerTodos);
  router.get('/:id', productoController.obtenerPorId);

  // Rutas protegidas solo para rol ADMIN
  router.post('/', autenticarToken, soloAdmin, productoController.crear);
  router.put('/:id', autenticarToken, soloAdmin, productoController.actualizar);
  router.delete('/:id', autenticarToken, soloAdmin, productoController.eliminar);

  return router;
};
