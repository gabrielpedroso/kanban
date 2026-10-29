import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { AuthenticatedRequest } from "./authenticated-request";

export const CurrentUserId = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext) => {
        const userId = ctx.switchToHttp().getRequest<AuthenticatedRequest>().userId;

        if (!userId) {
            throw new Error('CurrentUserId used on a route without JwtAuthGuard.');
        }

        return userId;
    }
)