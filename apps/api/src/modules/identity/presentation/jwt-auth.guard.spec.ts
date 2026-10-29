import type { ExecutionContext } from '@nestjs/common';
import type { AuthenticatedRequest } from './authenticated-request';
import { JwtAuthGuard } from './jwt-auth.guard';
import { InvalidTokenError } from '../domain/errors';
import { FakeTokenService } from '../../../testing/identity-fakes';

describe('JwtAuthGuard', () => {
    const guard = new JwtAuthGuard(new FakeTokenService());

    function contextWith(headers: Record<string, string>) {
        const request = { headers } as unknown as AuthenticatedRequest;

        const context = {
            switchToHttp: () => ({ getRequest: () => request }),
        } as unknown as ExecutionContext;

        return { request, context };
    }

    it('rejeita quando não há header Authorization', async () => {
        const { context } = contextWith({});

        await expect(guard.canActivate(context)).rejects.toBeInstanceOf(InvalidTokenError);
    });

    it.each([
        ['esquema errado', 'Basic abc'], 
        ['Bearer sem token', 'Bearer'],
        ['partes sobrando', 'Bearer a b'], 
        ['token rejeitado pelo fake', 'Bearer lixo'],
    ])('rejeita: %s', async (_nome, authorization) => {
        const { request, context } = contextWith({ authorization });

        await expect(guard.canActivate(context)).rejects.toBeInstanceOf(InvalidTokenError);
        expect(request.userId).toBeUndefined();
    });

    it('libera a requisição e grava o userId', async () => {
        const { request, context } = contextWith({ authorization: "Bearer token-for-id-1" });

        const result = await guard.canActivate(context);

        expect(result).toBe(true);
        expect(request.userId).toBe("id-1");
    });
});