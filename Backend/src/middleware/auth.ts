import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_here';

export interface AuthRequest extends Request {
  user?: {
    userId?: string;
    [key: string]: any;
  };
}

export const authenticateToken: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;
  const authHeader = authReq.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token missing' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      console.error('❌ JWT Verification Error:', err.message);
      return res.status(403).json({ success: false, message: 'Token is invalid or expired' });
    }
    
    // Support both userId and id from token payload
    authReq.user = {
      userId: decoded.userId || decoded.id || decoded._id,
      ...decoded,
    };

    next();
  });
};