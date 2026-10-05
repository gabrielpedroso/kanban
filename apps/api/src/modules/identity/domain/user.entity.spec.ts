import { InvalidUserError } from './errors';
import { User } from './user.entity';

describe('User', () => {
  const base = { id: 'u1', email: 'ana@mail.com', name: 'Ana', passwordHash: 'hash' };

  it('normaliza e-mail (minúsculas, sem espaços) e apara o nome', () => {
    const user = User.create({ ...base, email: '  Ana@Mail.COM ', name: '  Ana  ' });

    expect(user.email).toBe('ana@mail.com');
    expect(user.name).toBe('Ana');
  });

  it('recusa e-mail sem @', () => {
    expect(() => User.create({ ...base, email: 'ana.mail.com' })).toThrow(InvalidUserError);
  });

  it('recusa nome vazio ou só com espaços', () => {
    expect(() => User.create({ ...base, name: '   ' })).toThrow(InvalidUserError);
  });

  it('expõe id, e-mail, nome, hash e data de criação', () => {
    const now = new Date('2026-01-01');
    const user = User.create({ ...base, now });

    expect(user.id).toBe('u1');
    expect(user.passwordHash).toBe('hash');
    expect(user.createdAt).toBe(now);
  });

  it('restore não revalida (dado já aceito no passado)', () => {
    const user = User.restore({ ...base, createdAt: new Date() });

    expect(user.email).toBe('ana@mail.com');
  });
});