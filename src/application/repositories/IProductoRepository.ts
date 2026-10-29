import { Producto } from '../../domain/entities/Producto.js';

export interface PaginationResult<T> {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data: T[];
}

export interface IProductoRepository {
  findMany(page: number, limit: number, categoria?: string): Promise<PaginationResult<Producto>>;
  findById(id: string): Promise<Producto | null>;
  create(data: Omit<Producto, 'id' | 'createdAt' | 'updatedAt'>): Promise<Producto>;
  update(id: string, data: Partial<Omit<Producto, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Producto>;
  delete(id: string): Promise<boolean>;
}
