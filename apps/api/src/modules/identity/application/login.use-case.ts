import { InvalidCredentialsError } from "../domain/errors";
import { PasswordHasher } from "../domain/password-hasher";
import { TokenService } from "../domain/token-service";
import { UserRepository } from "../domain/user.repository";

export interface LoginInput {
    email: string, 
    password: string
}

export interface LoginOutput {
    accessToken: string, 
    user: { 
        id: string, 
        email: string, 
        name: string 
    }
}

export class LoginUseCase {
    constructor(
        private readonly users: UserRepository,
        private readonly hasher: PasswordHasher,
        private readonly tokens: TokenService,
    ) {}

    async execute(input: LoginInput): Promise<LoginOutput> {
        const normalizedEmail = input.email.trim().toLowerCase();

        const user = await this.users.findByEmail(normalizedEmail)

        if (!user || !(await this.hasher.verify(input.password, user.passwordHash))) {
            throw new InvalidCredentialsError();
        }

        const accessToken = await this.tokens.issue({ sub: user.id });

        return { accessToken, user: { id: user.id, name: user.name, email: user.email }}
    }
}
