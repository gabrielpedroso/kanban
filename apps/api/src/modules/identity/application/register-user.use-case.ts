import { IdGenerator } from "../../../shared/domain/id-generator";
import { EmailAlreadyInUseError } from "../domain/errors";
import { PasswordHasher } from "../domain/password-hasher";
import { User } from "../domain/user.entity";
import { UserRepository } from "../domain/user.repository";

export interface RegisterInput {
    email: string, 
    name: string, 
    password: string
}

export interface RegisterOutput {
    id: string, 
    email: string, 
    name: string
}

export class RegisterUserUseCase {
    constructor(
        private readonly users: UserRepository, 
        private readonly hasher: PasswordHasher,
        private readonly ids: IdGenerator
    ) {}

    async execute(input: RegisterInput): Promise<RegisterOutput> {
        const normalizedEmail = input.email.trim().toLowerCase();

        const existingUser = await this.users.findByEmail(normalizedEmail)

        if (existingUser) {
            throw new EmailAlreadyInUseError();
        }

        const id = this.ids.next()
        const passwordHash = await this.hasher.hash(input.password);

        const user = User.create({ id, email: normalizedEmail, name: input.name, passwordHash })

        await this.users.insert(user);

        return {
            id: user.id,
            email: user.email,
            name: user.name,
        }
    }
}