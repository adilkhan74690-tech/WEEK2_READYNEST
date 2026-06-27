/**
 * Authentication and Role-Based Access Control (RBAC) Database Models
 */

export enum Role {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT'
}

/**
 * Main User database record containing credentials and role assignments
 */
export interface User {
  id: string;
  email: string;
  passwordHash: string; // Securely salted password hash
  name: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

/**
 * Authentication token session model used for tracking JWT and managing revocation
 */
export interface Session {
  id: string;
  userId: string;
  token: string; // The active JWT token
  expiresAt: string; // ISO datetime string
  createdAt: string; // ISO datetime string
}

/**
 * Extra details for ADMIN users
 */
export interface AdminProfile {
  id: string;
  userId: string;
  phone: string;
  office: string;
  imageUrl: string;
}

/**
 * Extra details for TEACHER users
 */
export interface TeacherProfile {
  id: string;
  userId: string;
  department: string;
  office: string;
}

/**
 * Extra details for STUDENT users
 */
export interface StudentProfile {
  id: string;
  userId: string;
  department: string;
  studentId: string; // Academic code identifier
}

/**
 * JWT token payload schema
 */
export interface JWTPayload {
  sub: string; // User ID
  email: string;
  name: string;
  role: Role;
  iat: number; // Issued at timestamp
  exp: number; // Expiration timestamp
}

/**
 * Request payload for login operations
 */
export interface LoginCredentials {
  email: string;
  passwordHash: string; // Client-side hashed or raw password
}

/**
 * Request payload for registration/sign-up operations
 */
export interface RegisterCredentials {
  email: string;
  passwordHash: string;
  name: string;
  role: Role;
  // Dynamic fields mapped based on role
  department?: string;
  studentId?: string; // required if role is STUDENT
  office?: string;    // required if role is TEACHER or ADMIN
  phone?: string;     // optional
}

/**
 * Response payload upon successful login or verification
 */
export interface AuthResponse {
  user: Omit<User, 'passwordHash'>;
  token: string;
  expiresIn: number; // seconds
}
