import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { RegisterUserUseCase } from "../application/register-user.use-case";
import { LoginUseCase } from "../application/login.use-case";
import { ZodValidationPipe } from "../../../shared/presentation/zod-validation.pipe";
import { type LoginBody, loginSchema, type RegisterBody, registerSchema } from "./auth.schemas";

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
}