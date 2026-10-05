import { ScryptPasswordHasher } from './scrypt-password-hasher';

describe('ScryptPasswordHasher', () => {
  const hasher = new ScryptPasswordHasher();

  it('verifica a senha correta', async () => {
    const hash = await hasher.hash('segredo123');
    expect(await hasher.verify('segredo123', hash)).toBe(true);
  });

  it('recusa a senha errada', async () => {
    const hash = await hasher.hash('segredo123');
    expect(await hasher.verify('outra-senha', hash)).toBe(false);
  });

  it('gera hashes diferentes para a mesma senha (salt aleatório)', async () => {
    expect(await hasher.hash('segredo123')).not.toBe(await hasher.hash('segredo123'));
  });

  it('não guarda a senha em texto puro', async () => {
    expect(await hasher.hash('segredo123')).not.toContain('segredo123');
  });

  it('devolve false (sem lançar) para um hash malformado', async () => {
    expect(await hasher.verify('segredo123', 'lixo')).toBe(false);
    expect(await hasher.verify('segredo123', '')).toBe(false);
  });
});