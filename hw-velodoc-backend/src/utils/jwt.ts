import jwt, { SignOptions, VerifyErrors } from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config';

// Define types for better type safety
interface JWTPayload {
  userId: string;
}

const jwtSecret: string = JWT_SECRET as string;
const jwtExpiresIn: string | number | undefined = JWT_EXPIRES_IN;

// Generate JWT Token
export const generateToken = (payload: JWTPayload): string => {
  const options: SignOptions = {};
  if (jwtExpiresIn) {
    options.expiresIn = jwtExpiresIn as SignOptions["expiresIn"];
  }
  return jwt.sign(payload, jwtSecret, options);
};

// Verify JWT Token
export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, jwtSecret) as JWTPayload;
};

// Decode JWT without verifying signature
export const decode = (
  token: string,
  options?: jwt.DecodeOptions
): null | { [key: string]: any } | string => {
  return jwt.decode(token, options);
};
