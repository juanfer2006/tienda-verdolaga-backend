import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { JwtPayload } from '../../interface/types/express.d.js';
import { UserRole } from '../../domain/entities/User.js';

export class TokenService {
  static generarToken(payload: { id: string; role: UserRole }): string {
    return jwt.sign(
      { id: payload.id, role: payload.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
    );
  }

  static verificarToken(token: string): JwtPayload {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  }
}
