import { PrismaService } from '../../../shared/infra/prisma/prisma.service';
import { EmailAlreadyInUseError } from '../domain/errors';
import { User } from '../domain/user.entity';
import { PrismaUserRepository } from './prisma-user.repository';

describe('PrismaUserRepository (banco real)', () => {
  const prisma = new PrismaService();
  const repo = new PrismaUserRepository(prisma);

  const makeUser = (id: string, email: string) =>
    User.create({ id, email, name: 'Ana', passwordHash: 'hash' });

  beforeAll(() => prisma.$connect());
  afterAll(() => prisma.$disconnect());
  beforeEach(() => prisma.user.deleteMany());

  it('salva e recupera por e-mail e por id, devolvendo uma entidade User', async () => {
    await repo.insert(makeUser('u1', 'ana@mail.com'));

    const byEmail = await repo.findByEmail('ana@mail.com');
    const byId = await repo.findById('u1');

    expect(byEmail).toBeInstanceOf(User);
    expect(byEmail?.id).toBe('u1');
    expect(byId?.email).toBe('ana@mail.com');
  });

  it('devolve null quando não encontra', async () => {
    expect(await repo.findByEmail('ninguem@mail.com')).toBeNull();
    expect(await repo.findById('inexistente')).toBeNull();
  });

  it('traduz a violação de unicidade do banco em EmailAlreadyInUseError', async () => {
    await repo.insert(makeUser('u1', 'ana@mail.com'));

    await expect(repo.insert(makeUser('u2', 'ana@mail.com'))).rejects.toBeInstanceOf(
      EmailAlreadyInUseError,
    );
  });
});