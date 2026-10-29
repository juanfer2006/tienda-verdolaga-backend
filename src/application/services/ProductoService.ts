import {
  IProductoRepository,
  PaginationResult,
} from '../repositories/IProductoRepository.js';
import { Producto } from '../../domain/entities/Producto.js';
import { AppError } from '../../interface/middlewares/errorHandler.js';

export interface CreateProductoDTO {
  nombre: string;
  categoria: string;
  precio: number;
  imagen: string;
  descripcion: string;
}

export interface UpdateProductoDTO {
  nombre?: string;
  categoria?: string;
  precio?: number;
  imagen?: string;
  descripcion?: string;
}

export class ProductoService {
  constructor(private productoRepository: IProductoRepository) {}

  async obtenerTodos(
    page: number = 1,
    limit: number = 9,
    categoria?: string
  ): Promise<PaginationResult<Producto>> {
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Math.min(50, Number(limit) || 9));
    return this.productoRepository.findMany(pageNum, limitNum, categoria);
  }

  async obtenerPorId(id: string): Promise<Producto> {
    const producto = await this.productoRepository.findById(id);
    if (!producto) {
      throw new AppError(404, 'Producto no encontrado.');
    }
    return producto;
  }

  async crear(data: CreateProductoDTO): Promise<Producto> {
    if (!data.nombre || data.nombre.trim().length < 3) {
      throw new AppError(400, 'El nombre del producto debe tener al menos 3 caracteres.');
    }
    if (!data.categoria || !['camisetas', 'accesorios', 'coleccionables'].includes(data.categoria.toLowerCase())) {
      throw new AppError(400, 'La categoría debe ser: camisetas, accesorios o coleccionables.');
    }
    if (data.precio === undefined || isNaN(data.precio) || data.precio <= 0) {
      throw new AppError(400, 'El precio debe ser un número positivo.');
    }
    if (!data.imagen || !data.imagen.startsWith('http')) {
      throw new AppError(400, 'La imagen debe ser una URL válida.');
    }
    if (!data.descripcion || data.descripcion.trim().length < 5) {
      throw new AppError(400, 'La descripción debe tener al menos 5 caracteres.');
    }

    return this.productoRepository.create(data);
  }

  async actualizar(id: string, data: UpdateProductoDTO): Promise<Producto> {
    await this.obtenerPorId(id);

    if (data.categoria && !['camisetas', 'accesorios', 'coleccionables'].includes(data.categoria.toLowerCase())) {
      throw new AppError(400, 'La categoría debe ser: camisetas, accesorios o coleccionables.');
    }

    if (data.precio !== undefined && (isNaN(data.precio) || data.precio <= 0)) {
      throw new AppError(400, 'El precio debe ser un número positivo.');
    }

    return this.productoRepository.update(id, data);
  }

  async eliminar(id: string): Promise<boolean> {
    await this.obtenerPorId(id);
    return this.productoRepository.delete(id);
  }
}
