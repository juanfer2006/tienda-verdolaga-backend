import { prisma } from '../database/prismaClient.js';
import { IUserRepository } from '../../application/repositories/IUserRepository.js';
import { User, UserWithoutPassword, UserRole } from '../../domain/entities/User.js';

export class PrismaUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) return null;

    return {
      ...user,
      role: user.role as UserRole,
    };
  }

  async findById(id: string): Promise<UserWithoutPassword | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        email: true,
        telefono: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) return null;

    return {
      ...user,
      role: user.role as UserRole,
    };
  }

  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserWithoutPassword> {
    const user = await prisma.user.create({
      data: {
        nombre: data.nombre.trim(),
        email: data.email.toLowerCase().trim(),
        password: data.password!,
        telefono: data.telefono?.trim() || null,
        role: data.role || UserRole.USER,
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        telefono: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      ...user,
      role: user.role as UserRole,
    };
  }
}
