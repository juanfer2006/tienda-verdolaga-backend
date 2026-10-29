import bcrypt from 'bcrypt';
import { IUserRepository } from '../repositories/IUserRepository.js';
import { UserRole, UserWithoutPassword } from '../../domain/entities/User.js';
import { TokenService } from '../../infrastructure/security/tokenService.js';
import { AppError } from '../../interface/middlewares/errorHandler.js';

export interface RegisterDTO {
  nombre: string;
  email: string;
  password: string;
  telefono?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserWithoutPassword;
  token: string;
}

export class AuthService {
  constructor(private userRepository: IUserRepository) {}

  async register(data: RegisterDTO): Promise<AuthResponse> {
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new AppError(400, 'El formato del correo electrónico es inválido.');
    }

    if (!data.nombre || data.nombre.trim().length < 3) {
      throw new AppError(400, 'El nombre debe tener al menos 3 caracteres.');
    }

    if (!data.password || data.password.length < 6) {
      throw new AppError(400, 'La contraseña debe tener al menos 6 caracteres.');
    }

    // Verificar si el correo ya existe (409 Conflict)
    const usuarioExistente = await this.userRepository.findByEmail(data.email);
    if (usuarioExistente) {
      throw new AppError(409, 'El correo electrónico ya se encuentra registrado.');
    }

    // Hash de contraseña con bcrypt
    const passwordHash = await bcrypt.hash(data.password, 10);

    const nuevoUsuario = await this.userRepository.create({
      nombre: data.nombre,
      email: data.email,
      password: passwordHash,
      telefono: data.telefono,
      role: UserRole.USER,
    });

    const token = TokenService.generarToken({
      id: nuevoUsuario.id,
      role: nuevoUsuario.role,
    });

    return {
      user: nuevoUsuario,
      token,
    };
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    if (!data.email || !data.password) {
      throw new AppError(400, 'Debes ingresar correo electrónico y contraseña.');
    }

    const usuario = await this.userRepository.findByEmail(data.email);
    // Mensaje genérico de 401 que no revela si falló el email o la contraseña
    if (!usuario || !usuario.password) {
      throw new AppError(401, 'Credenciales inválidas. Verifica tu correo y contraseña.');
    }

    const passwordValida = await bcrypt.compare(data.password, usuario.password);
    if (!passwordValida) {
      throw new AppError(401, 'Credenciales inválidas. Verifica tu correo y contraseña.');
    }

    const token = TokenService.generarToken({
      id: usuario.id,
      role: usuario.role,
    });

    const userSinPassword: UserWithoutPassword = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      telefono: usuario.telefono,
      role: usuario.role,
      createdAt: usuario.createdAt,
      updatedAt: usuario.updatedAt,
    };

    return {
      user: userSinPassword,
      token,
    };
  }
}
