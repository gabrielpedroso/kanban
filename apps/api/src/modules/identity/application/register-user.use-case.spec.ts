import {
  FakePasswordHasher,
  InMemoryUserRepository,
  SequentialIdGenerator,
} from '../../../testing/identity-fakes';
import { EmailAlreadyInUseError } from '../domain/errors';
import { RegisterUserUseCase } from './register-user.use-case';

describe('RegisterUserUseCase', () => {
  let users: InMemoryUserRepository;
  let useCase: RegisterUserUseCase;

  beforeEach(() => {
    users = new InMemoryUserRepository();
    useCase = new RegisterUserUseCase(users, new FakePasswordHasher(), new SequentialIdGenerator());
  });

  it('cadastra o usuário com e-mail normalizado e senha com hash', async () => {
    await useCase.execute({ email: '  Ana@Mail.COM ', name: 'Ana', password: 'segredo123' });

    expect(users.items).toHaveLength(1);
    expect(users.items[0].email).toBe('ana@mail.com');
    expect(users.items[0].passwordHash).toBe('hashed(segredo123)');
  });

  it('recusa e-mail já cadastrado, mesmo com caixa diferente', async () => {
    await useCase.execute({ email: 'ana@mail.com', name: 'Ana', password: 'segredo123' });

    await expect(
      useCase.execute({ email: 'ANA@mail.com', name: 'Outra', password: 'segredo123' }),
    ).rejects.toBeInstanceOf(EmailAlreadyInUseError);
  });

  it('devolve só id, e-mail e nome (nunca o hash)', async () => {
    const out = await useCase.execute({ email: 'ana@mail.com', name: 'Ana', password: 'segredo123' });

    expect(out).toEqual({ id: 'id-1', email: 'ana@mail.com', name: 'Ana' });
  });
});