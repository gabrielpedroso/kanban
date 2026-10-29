import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthenticatedRequest } from "./authenticated-request";
import { TokenService } from "../domain/token-service";
import { InvalidTokenError } from "../domain/errors";



@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly tokenService: TokenService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
        const [scheme, token, ...rest] = request.headers.authorization?.split(' ') ?? [];

        if (scheme !== 'Bearer' || !token || rest.length > 0) {
            throw new InvalidTokenError();
        }

        const payload = await this.tokenService.verify(token);
        request.userId = payload.sub;

        return true;
     }
}