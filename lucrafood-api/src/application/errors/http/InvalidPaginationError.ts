import { ErrorCode } from '../ErrorCode';
import { HttpError } from './HttpError';

export class InvalidPaginationError extends HttpError {
  public override statusCode = 400;

  public override code: ErrorCode;

  constructor(message?: string, code?: ErrorCode) {
    super(message);

    this.name = 'InvalidPaginationError';
    this.message = message ?? 'Invalid Pagination Error';
    this.code = code ?? ErrorCode.INVALID_PAGINATION_ERROR;
  }
}
