import { DomainError } from "../../../shared/domain/domain-error";

export class InvalidUserError extends DomainError {
    readonly code = "INVALID_USER";
}

export class EmailAlreadyInUseError extends DomainError {
    readonly code = "EMAIL_ALREADY_IN_USE";

    constructor() {
        super("Email already in use.")
    }
}

export class InvalidTokenError extends DomainError {
    readonly code = "INVALID_TOKEN";

    constructor() {
        super("Invalid token.");
    }
}

export class InvalidCredentialsError extends DomainError {
    readonly code = "INVALID_CREDENTIALS";

    constructor() {
        super("Invalid credentials.");
    }
}