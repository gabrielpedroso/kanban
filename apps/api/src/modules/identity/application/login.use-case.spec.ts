import {
  FakePasswordHasher,
  FakeTokenService,
  InMemoryUserRepository,
  SequentialIdGenerator,
} from '../../../testing/identity-fakes';
import { InvalidCredentialsError } from '../domain/errors';
import { LoginUseCase } from './login.use-case';
import { RegisterUserUseCase } from './register-user.use-case';

describe('LoginUseCase', () => {
  let login: LoginUseCase;

  beforeEach(async () => {
    const users = new InMemoryUserRepository();
    const hasher = new FakePasswordHasher();

    // Reaproveita o caso de uso de cadastro para preparar o cenário.
    const register = new RegisterUserUseCase(users, hasher, new SequentialIdGenerator());
    await register.execute({ email: 'ana@mail.com', name: 'Ana', password: 'segredo123' });

    login = new LoginUseCase(users, hasher, new FakeTokenService());
  });

  it('devolve token e dados públicos, aceitando e-mail com caixa diferente', async () => {
    const out = await login.execute({ email: '  ANA@mail.com ', password: 'segredo123' });

    expect(out).toEqual({
      accessToken: 'token-for-id-1',
      user: { id: 'id-1', email: 'ana@mail.com', name: 'Ana' },
    });
  });

  it('recusa senha errada', async () => {
    await expect(login.execute({ email: 'ana@mail.com', password: 'errada' })).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
  });

  it('recusa e-mail inexistente com o MESMO erro da senha errada', async () => {
    await expect(login.execute({ email: 'x@mail.com', password: 'segredo123' })).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
  });
});