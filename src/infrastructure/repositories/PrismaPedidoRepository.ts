import { prisma } from '../database/prismaClient.js';
import { IPedidoRepository } from '../../application/repositories/IPedidoRepository.js';
import { Pedido, EstadoPedido } from '../../domain/entities/Pedido.js';

export class PrismaPedidoRepository implements IPedidoRepository {
  async create(data: Omit<Pedido, 'id' | 'createdAt' | 'updatedAt' | 'estado'>): Promise<Pedido> {
    const pedido = await prisma.pedido.create({
      data: {
        userId: data.userId,
        productoId: data.productoId,
        cantidad: data.cantidad,
        notas: data.notas?.trim() || null,
      },
      include: {
        producto: true,
        user: {
          select: {
            id: true,
            nombre: true,
            email: true,
            telefono: true,
          },
        },
      },
    });

    return {
      ...pedido,
      estado: pedido.estado as EstadoPedido,
    };
  }

  async findByUserId(userId: string): Promise<Pedido[]> {
    const pedidos = await prisma.pedido.findMany({
      where: { userId },
      include: {
        producto: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return pedidos.map((p) => ({
      ...p,
      estado: p.estado as EstadoPedido,
    }));
  }

  async findAll(): Promise<Pedido[]> {
    const pedidos = await prisma.pedido.findMany({
      include: {
        producto: true,
        user: {
          select: {
            id: true,
            nombre: true,
            email: true,
            telefono: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return pedidos.map((p) => ({
      ...p,
      estado: p.estado as EstadoPedido,
    }));
  }

  async findById(id: string): Promise<Pedido | null> {
    const pedido = await prisma.pedido.findUnique({
      where: { id },
      include: {
        producto: true,
        user: {
          select: {
            id: true,
            nombre: true,
            email: true,
            telefono: true,
          },
        },
      },
    });

    if (!pedido) return null;

    return {
      ...pedido,
      estado: pedido.estado as EstadoPedido,
    };
  }
}
