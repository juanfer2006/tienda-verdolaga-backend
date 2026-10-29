export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  nombre: string;
  email: string;
  password?: string;
  telefono?: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithoutPassword {
  id: string;
  nombre: string;
  email: string;
  telefono?: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
