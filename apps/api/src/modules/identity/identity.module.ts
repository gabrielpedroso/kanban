import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UserRepository } from "./domain/user.repository";
import { PrismaUserRepository } from "./infra/prisma-user.repository";
import { PasswordHasher } from "./domain/password-hasher";
import { ScryptPasswordHasher } from "./infra/scrypt-password-hasher";
import { TokenService } from "./domain/token-service";
import { JwtTokenService } from "./infra/jwt-token.service";
import { IdGenerator } from "../../shared/domain/id-generator";
import { RegisterUserUseCase } from "./application/register-user.use-case";
import { LoginUseCase } from "./application/login.use-case";
import { IdModule } from "../../shared/infra/id/id.module";
import { AuthController } from "./presentation/auth.controller";

@Module({
    imports: [
        JwtModule.registerAsync({ 
            useFactory: () => {
                const secret = process.env.JWT_SECRET;

                if (!secret) {
                    throw new Error("Missing required environment variable: JWT_SECRET.");
                }

                return {
                    secret,
                    signOptions: {
                        expiresIn: '15m'
                    }
                }
            } 
        }), 
        IdModule
    ],
    controllers: [AuthController],
    providers: [
        { provide: UserRepository, useClass: PrismaUserRepository },
        { provide: PasswordHasher, useClass: ScryptPasswordHasher },
        { provide: TokenService, useClass: JwtTokenService },
        {
            provide: RegisterUserUseCase,
            useFactory: (users: UserRepository, hasher: PasswordHasher, ids: IdGenerator) => new RegisterUserUseCase(users, hasher, ids),
            inject: [UserRepository, PasswordHasher, IdGenerator]
        },
        {
            provide: LoginUseCase,
            useFactory: (users: UserRepository, hasher: PasswordHasher, tokens: TokenService) => new LoginUseCase(users, hasher, tokens),
            inject: [UserRepository, PasswordHasher, TokenService]
        }
    ],
    exports: [TokenService]
})
export class IdentityModule {}