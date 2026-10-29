import { UserRole } from '../../domain/entities/User.js';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
      };
    }
  }
}

export interface JwtPayload {
  id: string;
  role: UserRole;
}
