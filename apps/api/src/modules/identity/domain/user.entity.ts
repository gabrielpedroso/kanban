import { InvalidUserError } from "./errors";

interface UserProps {
    id: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt: Date;
}

export class User {
    // private constructor	Só a própria classe pode chamar new User(). Fora dela, só existem User.create() e User.restore()
    // private readonly props no construtor	Atalho do TypeScript: declara e atribui a propriedade this.props de uma vez
    private constructor(private readonly props: UserProps) {}

    // static create()	Método da classe, não da instância. Chama-se User.create(...)
    static create(input: {
        id: string;
        email: string;
        name: string;
        passwordHash: string;
        now?: Date;
    }): User {
        const normalizedEmail = input.email.toLowerCase().trim();
        const normalizedName = input.name.trim()

        if (input.id.length === 0) {
            throw new InvalidUserError('User must have an id.');
        }

        if (!normalizedEmail.includes('@')) {
            throw new InvalidUserError('Email invalid.');

        }
        if (normalizedName.length === 0) {
            throw new InvalidUserError('User must have a name.');
        }

        if (input.passwordHash.length === 0) {
            throw new InvalidUserError('User must have a passwordHash.');
        }

        return new User({ 
            id: input.id, 
            email: normalizedEmail, 
            name: normalizedName, 
            passwordHash: input.passwordHash, 
            createdAt: input.now ?? new Date() 
        });
    }

    static restore(props: UserProps): User {
        return new User({...props})
    }

    // get id()	Getter: user.id funciona como uma propriedade, mas é só leitura
    get id(): string {
        return this.props.id;
    }

    get email(): string {
        return this.props.email;
    }

    get name(): string {
        return this.props.name;
    }

    get passwordHash(): string {
        return this.props.passwordHash;
    }

    get createdAt(): Date {
        return this.props.createdAt
    }
}