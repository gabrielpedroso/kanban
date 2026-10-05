import { IdGenerator } from '../shared/domain/id-generator';
import { PasswordHasher } from '../modules/identity/domain/password-hasher';
import { User } from '../modules/identity/domain/user.entity';
import { UserRepository } from '../modules/identity/domain/user.repository';
import { TokenPayload, TokenService } from '../modules/identity/domain/token-service';
import { InvalidTokenError } from '../modules/identity/domain/errors';

export class SequentialIdGenerator extends IdGenerator {
  private n = 0;
  next(): string {
    this.n += 1;
    return `id-${this.n}`;
  }
}

export class FakePasswordHasher extends PasswordHasher {
  async hash(plain: string): Promise<string> {
    return `hashed(${plain})`;
  }
  async verify(plain: string, hash: string): Promise<boolean> {
    return hash === `hashed(${plain})`;
  }
}

export class InMemoryUserRepository extends UserRepository {
  readonly items: User[] = [];

  async findByEmail(email: string): Promise<User | null> {
    return this.items.find((u) => u.email === email) ?? null;
  }
  async findById(id: string): Promise<User | null> {
    return this.items.find((u) => u.id === id) ?? null;
  }
  async insert(user: User): Promise<void> {
    this.items.push(user);
  }
}

export class FakeTokenService extends TokenService {
  async issue(payload: TokenPayload): Promise<string> {
    return `token-for-${payload.sub}`;
  }
  async verify(token: string): Promise<TokenPayload> {
    if (!token.startsWith('token-for-')) throw new InvalidTokenError();
    return { sub: token.replace('token-for-', '') };
  }
}