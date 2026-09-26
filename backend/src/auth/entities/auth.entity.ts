import { User } from '../../users/entities/user.entity.js';

export class Auth {
  accessToken: string;
  tokenType: string;
  expiresIn: string;
  user: User;

  constructor(partial?: Partial<Auth>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
