import { IPedidoRepository } from '../repositories/IPedidoRepository.js';
import { IProductoRepository } from '../repositories/IProductoRepository.js';
import { Pedido } from '../../domain/entities/Pedido.js';
import { AppError } from '../../interface/middlewares/errorHandler.js';

export interface CreatePedidoDTO {
  userId: string;
  productoId: string;
  cantidad?: number;
  notas?: string;
}

export class PedidoService {
  constructor(
    private pedidoRepository: IPedidoRepository,
    private productoRepository: IProductoRepository
  ) {}

  async crear(data: CreatePedidoDTO): Promise<Pedido> {
    if (!data.productoId) {
      throw new AppError(400, 'Debes especificar el productoId para crear el pedido.');
    }

    const producto = await this.productoRepository.findById(data.productoId);
    if (!producto) {
      throw new AppError(404, 'El producto especificado no existe.');
    }

    const cantidad = Number(data.cantidad) || 1;
    if (cantidad < 1) {
      throw new AppError(400, 'La cantidad mínima del pedido es 1.');
    }

    return this.pedidoRepository.create({
      userId: data.userId,
      productoId: data.productoId,
      cantidad,
      notas: data.notas,
    });
  }

  async obtenerMisPedidos(userId: string): Promise<Pedido[]> {
    return this.pedidoRepository.findByUserId(userId);
  }

  async obtenerTodos(): Promise<Pedido[]> {
    return this.pedidoRepository.findAll();
  }
}
