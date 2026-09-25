import { Global, Module } from '@nestjs/common';
import { BcryptService } from './bcrypt.service.js';
import { JwtService } from './jwt.service.js';

@Global()
@Module({
  providers: [BcryptService, JwtService],
  exports: [BcryptService, JwtService],
})
export class SecurityModule {}
