import { Injectable } from '@nestjs/common';
import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';

@Injectable()
export class JwtService {
  private readonly secret: string;
  private readonly defaultExpiresIn: string;
  private readonly issuer: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || 'dexa-default-secret-key';
    this.defaultExpiresIn = process.env.JWT_ACCESS_EXPIRED || '1d';
    this.issuer = process.env.JWT_ISSUER || 'dexa-api';
  }

  sign(payload: string | Buffer | object, options?: SignOptions): string {
    const finalOptions: SignOptions = {
      expiresIn: (options?.expiresIn ?? this.defaultExpiresIn) as any,
      issuer: options?.issuer ?? this.issuer,
      ...options,
    };
    return jwt.sign(payload, this.secret, finalOptions);
  }

  verify<T = any>(token: string, options?: VerifyOptions): T {
    const finalOptions: VerifyOptions = {
      issuer: options?.issuer ?? this.issuer,
      ...options,
    };
    return jwt.verify(token, this.secret, finalOptions) as T;
  }

  decode<T = any>(token: string): T | null {
    return jwt.decode(token) as T | null;
  }
}
