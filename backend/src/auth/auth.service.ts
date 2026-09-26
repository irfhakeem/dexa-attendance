import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository.js';
import { BcryptService } from '../infrastructure/security/bcrypt.service.js';
import { JwtService } from '../infrastructure/security/jwt.service.js';
import { LoginDto } from './dto/login.dto.js';
import { User } from '../users/entities/user.entity.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findByNip(loginDto.nip);
    if (!user) {
      throw new UnauthorizedException('Invalid NIP or password');
    }

    const isMatch = await this.bcryptService.compare(
      loginDto.password,
      user.password,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Invalid NIP or password');
    }

    const payload = {
      sub: user.id,
      nip: user.nip,
      isHR: user.isHR,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      tokenType: 'Bearer',
      user: User.fromPrisma(user),
    };
  }

  async getMe(userId: string) {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User session not found');
    }
    return User.fromPrisma(user);
  }
}
