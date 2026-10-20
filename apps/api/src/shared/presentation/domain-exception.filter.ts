import { ArgumentsHost, Catch, ExceptionFilter, Logger } from "@nestjs/common";
import type { Response } from "express";
import { DomainError } from "../domain/domain-error";

const STATUS_BY_CODE: Record<string, number> = {
  INVALID_USER: 422,
  EMAIL_ALREADY_IN_USE: 409,
  INVALID_CREDENTIALS: 401,
  INVALID_TOKEN: 401,
};

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter<DomainError> {
  private readonly logger = new Logger(DomainExceptionFilter.name);

  catch(error: DomainError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    const status = STATUS_BY_CODE[error.code];

    if (status === undefined) {
      this.logger.error(`Unmapped domain error: ${error.code} - ${error.message}`, error.stack);
      response.status(500).send({ code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error.' });
      return;
    }

    response.status(status).send({ code: error.code, message: error.message })
  }
}