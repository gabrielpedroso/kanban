import { Body, Controller, Get, HttpCode, Post, UseGuards } from "@nestjs/common";
import { RegisterUserUseCase } from "../application/register-user.use-case";
import { LoginUseCase } from "../application/login.use-case";
import { ZodValidationPipe } from "../../../shared/presentation/zod-validation.pipe";
import { type LoginBody, loginSchema, type RegisterBody, registerSchema } from "./auth.schemas";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { CurrentUserId } from "./current-user-id.decorator";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly loginUseCase: LoginUseCase,
        private readonly registerUserUseCase: RegisterUserUseCase,
    ) {}

    @Post('register')
    register(@Body(new ZodValidationPipe(registerSchema)) body: RegisterBody) {
        return this.registerUserUseCase.execute(body);
    }

    @Post('login')
    @HttpCode(200)
    login(@Body(new ZodValidationPipe(loginSchema)) body: LoginBody) {
        return this.loginUseCase.execute(body);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    me(@CurrentUserId() userId: string) {
        return { userId };
    }
}