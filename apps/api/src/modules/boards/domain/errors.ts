import { DomainError } from "../../../shared/domain/domain-error";

export class InvalidBoardError extends DomainError {
    readonly code = "INVALID_BOARD";

    constructor(message = "Invalid board.") {
        super(message);
    }
}

export class BoardNotFoundError extends DomainError {
    readonly code = "BOARD_NOT_FOUND";

    constructor() {
        super("Board not found.");
    }
}

export class BoardArchivedError extends DomainError {
    readonly code = "BOARD_ARCHIVED";

    constructor() {
        super("Board is archived.");
    }
}

export class InsufficientPermissionError extends DomainError {
    readonly code = "INSUFFICIENT_PERMISSION";

    constructor() {
        super("You don't have permission.");
    }
}

export class MemberAlreadyExistsError extends DomainError {
    readonly code = "MEMBER_ALREADY_EXISTS";

    constructor() {
        super("Member already exists.");
    }
}

export class MemberNotFoundError extends DomainError {
    readonly code = "MEMBER_NOT_FOUND";

    constructor() {
        super("Member not found.");
    }
}

export class InvalidRoleAssignmentError extends DomainError {
    readonly code = "INVALID_ROLE_ASSIGNMENT";

    constructor(message = "Invalid role assignment.") {
        super(message);
    }
}

export class OwnerRequiredError extends DomainError {
    readonly code = "OWNER_REQUIRED";

    constructor() {
        super("Owner required.");
    }
}

export class ColumnLimitError extends DomainError {
    readonly code = "COLUMN_LIMIT_VIOLATED";

    constructor(message = "Column limit violated.") {
        super(message);
    }
}

export class ColumnNotFoundError extends DomainError {
    readonly code = "COLUMN_NOT_FOUND";

    constructor() {
        super("Column not found.");
    }
}

export class ColumnNotEmptyError extends DomainError {
    readonly code = "COLUMN_NOT_EMPTY";

    constructor() {
        super("Column not empty.");
    }
}

export class InvalidCardError extends DomainError {
    readonly code = "INVALID_CARD";

    constructor(message = "Invalid card.") {
        super(message);
    }
}

export class CardNotFoundError extends DomainError {
    readonly code = "CARD_NOT_FOUND";

    constructor() {
        super("Card not found.");
    }
}

export class ConcurrencyConflictError extends DomainError {
    readonly code = "CONCURRENCY_CONFLICT";

    constructor() {
        super("The card was modified by someone else. Reload and try again.");
    }
}