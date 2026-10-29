import { Request, Response, NextFunction } from 'express';
import { ProductoService } from '../../application/services/ProductoService.js';

export class ProductoController {
  constructor(private productoService: ProductoService) {}

  obtenerTodos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 9;
      const categoria = req.query.categoria as string | undefined;

      const resultado = await this.productoService.obtenerTodos(page, limit, categoria);
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  };

  obtenerPorId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const producto = await this.productoService.obtenerPorId(id);
      res.status(200).json(producto);
    } catch (error) {
      next(error);
    }
  };

  crear = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { nombre, categoria, precio, imagen, descripcion } = req.body;
      const producto = await this.productoService.crear({
        nombre,
        categoria,
        precio: Number(precio),
        imagen,
        descripcion,
      });
      res.status(201).json(producto);
    } catch (error) {
      next(error);
    }
  };

  actualizar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { nombre, categoria, precio, imagen, descripcion } = req.body;
      const producto = await this.productoService.actualizar(id, {
        nombre,
        categoria,
        precio: precio !== undefined ? Number(precio) : undefined,
        imagen,
        descripcion,
      });
      res.status(200).json(producto);
    } catch (error) {
      next(error);
    }
  };

  eliminar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.productoService.eliminar(id);
      res.status(200).json({ message: 'Producto eliminado correctamente.' });
    } catch (error) {
      next(error);
    }
  };
}
