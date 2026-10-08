import { Injectable } from "@nestjs/common";
import { JsonWebTokenError, JwtService, NotBeforeError, TokenExpiredError } from "@nestjs/jwt";
import { TokenPayload, TokenService } from "../domain/token-service";
import { InvalidTokenError } from "../domain/errors";

@Injectable()
export class JwtTokenService extends TokenService {
    constructor(private readonly jwt: JwtService) {
        super();
    }

    issue(payload: TokenPayload): Promise<string> {
        return this.jwt.signAsync({ sub: payload.sub })
    }

    async verify(token: string): Promise<TokenPayload> {
        let sub: string | undefined;

        try {
            sub = (await this.jwt.verifyAsync<{ sub?: string }>(token)).sub;
        } catch (error) {
            // error instanceof JsonWebTokenError || error instanceof TokenExpiredError || error instanceof NotBeforeError.
            // TokenExpiredError e NotBeforeError herdam de JsonWebTokenError, por isso não precisa do instanceof dos 3.
            if (error instanceof JsonWebTokenError) {
                throw new InvalidTokenError();
            }
            
            throw error;
        }

        if (!sub) {
            throw new InvalidTokenError();
        }

        return { sub }
    }
}