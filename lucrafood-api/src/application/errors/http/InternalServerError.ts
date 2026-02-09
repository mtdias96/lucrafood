import { ErrorCode } from '../ErrorCode';
import { HttpError } from './HttpError';

export class InternalServerError extends HttpError {
  public override statusCode = 500;

  public override code: ErrorCode;

  constructor(message?: string, code?: ErrorCode) {
    super(message);

    this.name = 'InternalServerError';
    this.message = message ?? 'Internal Server Error';
    this.code = code ?? ErrorCode.INTERNAL_SERVER_ERROR;
  }
}
