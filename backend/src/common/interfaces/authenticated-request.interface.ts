import { Request } from 'express';
import { Role } from '../enums/role.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  rol: Role;
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
