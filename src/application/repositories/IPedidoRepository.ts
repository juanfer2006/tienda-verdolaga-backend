import { Pedido } from '../../domain/entities/Pedido.js';

export interface IPedidoRepository {
  create(data: Omit<Pedido, 'id' | 'createdAt' | 'updatedAt' | 'estado'>): Promise<Pedido>;
  findByUserId(userId: string): Promise<Pedido[]>;
  findAll(): Promise<Pedido[]>;
  findById(id: string): Promise<Pedido | null>;
}
