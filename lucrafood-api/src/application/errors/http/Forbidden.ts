import { ErrorCode } from '../ErrorCode';
import { HttpError } from './HttpError';

export class NotFound extends HttpError {
  public override statusCode = 404;
  public override code = ErrorCode.NOT_FOUND;

  constructor(message = 'Not Found') {
    super(message);
  }
}

export class Forbidden extends HttpError {
  public override statusCode = 403;
  public override code = ErrorCode.FORBIDDEN;

  constructor(message = 'Forbidden') {
    super(message);
  }
}

export class Conflict extends HttpError {
  public override statusCode = 409;
  public override code = ErrorCode.CONFLICT;

  constructor(message = 'Conflict') {
    super(message);
  }
}
