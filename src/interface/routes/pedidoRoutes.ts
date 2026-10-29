import { Router } from 'express';
import { PedidoController } from '../controllers/PedidoController.js';
import { PedidoService } from '../../application/services/PedidoService.js';
import { PrismaPedidoRepository } from '../../infrastructure/repositories/PrismaPedidoRepository.js';
import { PrismaProductoRepository } from '../../infrastructure/repositories/PrismaProductoRepository.js';
import { autenticarToken, soloAdmin } from '../middlewares/authMiddleware.js';

export const createPedidoRouter = (): Router => {
  const router = Router();
  const pedidoRepository = new PrismaPedidoRepository();
  const productoRepository = new PrismaProductoRepository();
  const pedidoService = new PedidoService(pedidoRepository, productoRepository);
  const pedidoController = new PedidoController(pedidoService);

  // Todas las rutas de pedidos requieren autenticación
  router.use(autenticarToken);

  // Crear pedido: cualquier usuario autenticado (se asocia con su token)
  router.post('/', pedidoController.crear);

  // Ver sus propios pedidos: usuario autenticado
  router.get('/mias', pedidoController.obtenerMisPedidos);

  // Ver todos los pedidos: solo ADMIN
  router.get('/', soloAdmin, pedidoController.obtenerTodos);

  return router;
};
