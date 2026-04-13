/**
 * User Models
 * 
 * User account and authentication data structures
 */

import { UserRole } from '@config/rbac.config';

/**
 * User entity
 */
export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  mfaEnabled: boolean;
  mfaSecret?: string;
}

/**
 * User session
 */
export interface UserSession {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: Date;
  createdAt: Date;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
}

/**
 * User creation data
 */
export interface CreateUserDto {
  email: string;
  username: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}

/**
 * User update data
 */
export interface UpdateUserDto {
  email?: string;
  username?: string;
  role?: UserRole;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  username: string;
  password: string;
  mfaToken?: string;
}

/**
 * JWT payload
 */
export interface JwtPayload {
  userId: string;
  email: string;
  username: string;
  role: UserRole;
  iat: number;
  exp: number;
}

/**
 * Authentication response
 */
export interface AuthResponse {
  user: {
    id: string;
    email: string;
    username: string;
    role: UserRole;
    firstName: string;
    lastName: string;
  };
  token: string;
  refreshToken: string;
  expiresIn: number;
}
