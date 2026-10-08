import { JwtService } from '@nestjs/jwt';
import { InvalidTokenError } from '../domain/errors';
import { JwtTokenService } from './jwt-token.service';

describe('JwtTokenService', () => {
  const make = (secret = 'segredo-de-teste', expiresIn = 3600) =>
    new JwtTokenService(new JwtService({ secret, signOptions: { expiresIn } }));

  it('emite um token que, verificado, devolve o mesmo sub', async () => {
    const service = make();
    const token = await service.issue({ sub: 'u1' });

    expect(await service.verify(token)).toEqual({ sub: 'u1' });
  });

  it('emite um JWT com três partes (header.payload.assinatura)', async () => {
    const token = await make().issue({ sub: 'u1' });

    expect(token.split('.')).toHaveLength(3);
  });

  it('o payload é legível por qualquer um: o JWT é assinado, não criptografado', async () => {
    const token = await make().issue({ sub: 'u1' });
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString());

    expect(payload.sub).toBe('u1');
  });

  it('recusa um token assinado com outro segredo', async () => {
    const token = await make('outro-segredo').issue({ sub: 'u1' });

    await expect(make().verify(token)).rejects.toBeInstanceOf(InvalidTokenError);
  });

  it('recusa um token expirado', async () => {
    const expired = await make('segredo-de-teste', -10).issue({ sub: 'u1' });

    await expect(make().verify(expired)).rejects.toBeInstanceOf(InvalidTokenError);
  });

  it('recusa um texto que não é um token', async () => {
    await expect(make().verify('lixo')).rejects.toBeInstanceOf(InvalidTokenError);
  });

  it('recusa um token cujo payload foi adulterado', async () => {
    const service = make();
    const token = await service.issue({ sub: 'u1' });
    const [header, , signature] = token.split('.');
    const forged = Buffer.from(JSON.stringify({ sub: 'admin' })).toString('base64url');

    await expect(service.verify(`${header}.${forged}.${signature}`)).rejects.toBeInstanceOf(
      InvalidTokenError,
    );
  });
});