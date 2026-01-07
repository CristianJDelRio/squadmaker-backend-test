import { Request } from 'express';
import { TokenPayload } from '../../../domain/services/TokenService';

export interface AuthenticatedRequest extends Request {
  user: TokenPayload;
}
