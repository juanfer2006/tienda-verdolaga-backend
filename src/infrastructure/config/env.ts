import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: process.env.PORT || '4000',
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'secreto_por_defecto_desarrollo_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '8h',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
};
