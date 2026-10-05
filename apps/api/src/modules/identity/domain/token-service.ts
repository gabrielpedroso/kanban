export interface TokenPayload {
    sub: string;
}

export abstract class TokenService {
    abstract issue(payload: TokenPayload): Promise<string>;

    abstract verify(token: string): Promise<TokenPayload>;
}