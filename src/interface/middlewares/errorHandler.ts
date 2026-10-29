import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
    });
    return;
  }

  // Errores conocidos de Prisma
  if (err.name === 'PrismaClientKnownRequestError') {
    res.status(400).json({
      error: 'Error en la operación de base de datos.',
    });
    return;
  }

  // Error genérico sin exponer stack trace
  console.error('❌ Error no controlado:', err);
  res.status(500).json({
    error: 'Error interno del servidor.',
  });
};
