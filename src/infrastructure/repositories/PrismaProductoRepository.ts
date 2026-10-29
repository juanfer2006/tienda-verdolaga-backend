import { prisma } from '../database/prismaClient.js';
import {
  IProductoRepository,
  PaginationResult,
} from '../../application/repositories/IProductoRepository.js';
import { Producto } from '../../domain/entities/Producto.js';

export class PrismaProductoRepository implements IProductoRepository {
  async findMany(
    page: number = 1,
    limit: number = 9,
    categoria?: string
  ): Promise<PaginationResult<Producto>> {
    const skip = (page - 1) * limit;

    const where = categoria && categoria !== 'todos' ? { categoria: categoria.toLowerCase() } : {};

    const [total, data] = await Promise.all([
      prisma.producto.count({ where }),
      prisma.producto.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
      data,
    };
  }

  async findById(id: string): Promise<Producto | null> {
    return prisma.producto.findUnique({
      where: { id },
    });
  }

  async create(data: Omit<Producto, 'id' | 'createdAt' | 'updatedAt'>): Promise<Producto> {
    return prisma.producto.create({
      data: {
        nombre: data.nombre.trim(),
        categoria: data.categoria.toLowerCase().trim(),
        precio: data.precio,
        imagen: data.imagen.trim(),
        descripcion: data.descripcion.trim(),
      },
    });
  }

  async update(
    id: string,
    data: Partial<Omit<Producto, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Producto> {
    return prisma.producto.update({
      where: { id },
      data: {
        ...(data.nombre && { nombre: data.nombre.trim() }),
        ...(data.categoria && { categoria: data.categoria.toLowerCase().trim() }),
        ...(data.precio !== undefined && { precio: data.precio }),
        ...(data.imagen && { imagen: data.imagen.trim() }),
        ...(data.descripcion && { descripcion: data.descripcion.trim() }),
      },
    });
  }

  async delete(id: string): Promise<boolean> {
    await prisma.producto.delete({
      where: { id },
    });
    return true;
  }
}
