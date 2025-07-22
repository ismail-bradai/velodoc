import dotenv from 'dotenv';

dotenv.config();

export const JWT_SECRET: string = process.env.JWT_SECRET || 'your-default-secret';
export const JWT_EXPIRES_IN: string = '1h';